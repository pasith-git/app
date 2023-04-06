import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AuthService } from 'auth/auth.service';
import { Bcel } from 'bcel/bcel';
import { BcelService } from 'bcel/bcel.service';
import { Roles } from 'common/decorators/role.decorator';
import { CreatePaymentPackageDto, DeletePaymentPackageDto, UpdatePaymentPackageDto } from 'common/dtos/payment-package.dto';
import Role from 'common/enums/role.enum';
import { CustomException } from 'common/exceptions/custom.exception';
import { AuthGuard } from 'common/guards/auth.guard';
import { MuseumIdGuard } from 'common/guards/museumId.guard';
import { FilesValidationPipe, FileValidationPipe } from 'common/pipes/file-validation.pipe';
import { FormDataValidationPipe } from 'common/pipes/form-data-validation.pipe';
import { JoiValidationPipe } from 'common/pipes/joi-validation.pipe';
import PaymentPackageQuery from 'common/querys/payment-package.query';
import { createPaymentPackageSchemaForSuperadmin, generatePaymentPackageWithBankSchema, deletePaymentPackageSchemaForSuperadmin, updatePaymentPackageSchemaForSuperadmin, CreatePaymentPackageWithBankSchema } from 'common/schemas/payment-package.schema';
import dayjsUtil from 'common/utils/dayjs.util';
import { createfileGenerator, deleteFileGenerator, updatefileGenerator } from 'common/utils/image-processor.util';
import generateInvoiceId from 'common/utils/inv-generator.util';
import generateInvoice from 'common/utils/inv-generator.util';
import MESSAGE from 'common/utils/message.util';
import responseUtil from 'common/utils/response.util';
import generateTransactionId from 'common/utils/transaction-generator.util';
import { Request, Response } from 'express';
import { PackagesService } from 'packages/packages.service';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from 'users/users.service';
import { PaymentPackagesService } from './payment-packages.service';

const PREFIX = "payment-packages";

@Controller('')
export class PaymentPackagesController {
    constructor(private paymentPackagesService: PaymentPackagesService,
        private packagesService: PackagesService, private usersService: UsersService, private authService: AuthService, private prisma: PrismaService) { }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.GUIDE, Role.SUPERADMIN, Role.OWNER)
    @Get("payment-packages")
    async findAll(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: PaymentPackageQuery) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = await this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const data_fixed = await this.paymentPackagesService.findAll(museum_id);
        const data_temp = await this.paymentPackagesService.findAll(museum_id, {
            filter,
            ...query,
        });
        res.append('X-Total-Count-Fixed', data_fixed.length.toString());
        res.append('X-Total-Count-Temp', data_temp.length.toString());
        return res.json(responseUtil({
            req,
            body: data_temp,
        }))
    }

    @Post("payment-packages/generate")
    async generateQrCode(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(generatePaymentPackageWithBankSchema)) createDto: CreatePaymentPackageDto) {
        try {
            const [_, access_token] = req.headers.authorization?.split(' ');
            const jwtPayload = this.authService.jwtVerify(access_token);
            const _package = await this.packagesService.findById(createDto.package_id);
            const user = await this.usersService.findById(jwtPayload["id"]);

            let qrCode = null;
            let oneClickPay = null;
            let transactionId = generateTransactionId();
            let invoiceId = generateInvoiceId();
            let description = `INV:${invoiceId}|PCK_ID:${_package.id}|USER_NAME:${user.username}`;
            let onePay = new Bcel(transactionId, "mch62baa8923023e", "7372");

            const price = Number(_package.price) - (Number(_package.price) * Number(_package.discount || 0));

            onePay.getCode({
                transactionId,
                invoiceId,
                terminalId: `TIDPCK`,
                amount: price,
                description,
                expireTime: 2
            }, (code) => {
                qrCode = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${code}&choe=UTF-8`;
                oneClickPay = `onepay://qr/${code}`;
            })

            onePay.pubnubSubscribe();

            return res.status(HttpStatus.OK).json(responseUtil({
                req, message: MESSAGE.created, body: {
                    ..._package,
                    bcel_details: {
                        transaction_id: transactionId,
                        qr_code: qrCode,
                        one_click_pay: oneClickPay,
                        description,
                    }

                },
            }));

        } catch (e) {
            throw e;
        }
    }

    @Post("payment-packages/pay")
    @UseInterceptors(FileInterceptor("file"))
    async createAndPayQrCode(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(CreatePaymentPackageWithBankSchema)) createDto: CreatePaymentPackageDto,
        @UploadedFiles(new FileValidationPipe()) file: Express.Multer.File) {
        try {
            const [_, access_token] = req.headers.authorization?.split(' ');
            const jwtPayload = this.authService.jwtVerify(access_token);
            const _package = await this.packagesService.findById(createDto.package_id);
            const user = await this.usersService.findById(jwtPayload["id"]);
            const total = Number(_package.price) - (Number(_package.price) * Number(_package.discount || 0));
            const createFile = createfileGenerator(file, PREFIX, PREFIX);
            const isPaid = user.payment_packages.some(payment_package => dayjsUtil().isSameOrBefore(payment_package.package_end_date));

            if (isPaid) {
                throw new CustomException({ error: "The User is already paid packages" })
            }

            const data = await this.paymentPackagesService.create({
                ...createDto,
                user_id: user.id,
                bank_percentage: 1,
                bank_percent_amount: total * 0.01,
                bank_name: "BCEL",
                payment_type: "bank",
                museum_id: user.museum_id,
                package_start_date: dayjsUtil().toDate(),
                package_end_date: dayjsUtil().add(_package.duration, 'months').toDate(),
                status: "success",
                payment_date: dayjsUtil().toDate(),
                total,
                ...(_package.discount && {
                    discount: Number(_package.discount),
                }),
                image_path: createFile?.filePath,
            })

            await createFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN)
    @Get("superadmin/payment-packages")
    async findAllForSuperadmin(@Req() req: Request, @Res() res: Response) {
        const paymentPackages = await this.paymentPackagesService.findAllForSuperadmin();
        return res.json(responseUtil({
            req,
            body: paymentPackages,
        }))
    }

    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN)
    @Post("superadmin/payment-packages")
    @UseInterceptors(FileInterceptor("file"))
    async createForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(createPaymentPackageSchemaForSuperadmin)) createDto: CreatePaymentPackageDto,

        @UploadedFile(new FileValidationPipe()) file: Express.Multer.File) {
        try {
            const user = await this.usersService.findById(createDto.user_id);
            const isPaid = user.payment_packages.some(payment_package => dayjsUtil().isSameOrBefore(payment_package.package_end_date) && payment_package.status === "success");

            if (isPaid) {
                throw new CustomException({ error: "The User is already paid packages" })
            }

            const _package = await this.packagesService.findById(createDto.package_id);
            const createFile = createfileGenerator(file, PREFIX, PREFIX);
            const data = await this.paymentPackagesService.createForSuperadmin({
                ...createDto,
                museum_id: user.museum_id,
                transaction_id: generateTransactionId(),
                payment_date: dayjsUtil().toDate(),
                package_start_date: dayjsUtil().toDate(),
                package_end_date: dayjsUtil().add(_package.duration, 'months').toDate(),
                total: Number(_package.price) - Number(_package.discount || 0),
                image_path: createFile?.filePath,
            });
            await createFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN)
    @Put("superadmin/payment-packages")
    @UseInterceptors(FileInterceptor('file'))
    async updateForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(updatePaymentPackageSchemaForSuperadmin)) updateDto: UpdatePaymentPackageDto,
        @UploadedFile(new FileValidationPipe()) file: Express.Multer.File) {
        try {
            const paymentPackage = await this.paymentPackagesService.findByIdForSuperadmin(updateDto.id);
            const updateFile = updatefileGenerator(file, PREFIX, PREFIX, PREFIX, paymentPackage.image_path, updateDto.delete_image);
            const data = await this.paymentPackagesService.updateForSuperadmin({
                ...updateDto,
                image_path: updateFile?.filePath,
            });
            await updateFile.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data }));

        } catch (e) {
            throw e;
        }

    }

    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN)
    @Delete("superadmin/payment-packages/delete/:id")
    async deleteForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const dataById = await this.paymentPackagesService.findByIdForSuperadmin(parseInt(id));
            const deleteFile = deleteFileGenerator(dataById.image_path);
            const data = await this.paymentPackagesService.deleteForSuperadmin({
                id: dataById.id,
            });
            await deleteFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }

}
