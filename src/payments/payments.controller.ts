import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'common/decorators/role.decorator';
import Role from 'common/enums/role.enum';
import { AuthGuard } from 'common/guards/auth.guard';
import { MuseumIdGuard } from 'common/guards/museumId.guard';
import { FileValidationPipe } from 'common/pipes/file-validation.pipe';
import { FormDataValidationPipe } from 'common/pipes/form-data-validation.pipe';
import { createPaymentSchema, createPaymentSchemaForSuperadmin, updatePaymentSchema, updatePaymentSchemaForSuperadmin } from 'common/schemas/payment.schema';
import { createfileGenerator, deleteFileGenerator, updatefileGenerator } from 'common/utils/image-processor.util';
import responseUtil from 'common/utils/response.util';
import { PaymentsService } from 'payments/payments.service';
import { PrismaService } from 'prisma/prisma.service';
import { Request, Response, Express } from 'express';
import MESSAGE from 'common/utils/message.util';
import { CreatePaymentDto, UpdatePaymentDto } from 'common/dtos/payment.dto';
import { BookingsService } from 'bookings/bookings.service';
import dayjsUtil from 'common/utils/dayjs.util';
import PaymentQuery from 'common/querys/payment.query';
import { PaymentDetailsService } from 'payment-details/payment-details.service';

const PREFIX = "paymment";

@Controller('')
export class PaymentsController {

    constructor(private prisma: PrismaService, private paymentsService: PaymentsService,
        private bookingsService: BookingsService, private paymentDetailsService: PaymentDetailsService) { }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.AGENT, Role.GOD, Role.OWNER)
    @Get("payments")
    async findAllByMuseumId(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: PaymentQuery) {
        const q_museum_id = museum_id ? Number(museum_id) : undefined;
        const data_fixed = await this.paymentsService.findAll(q_museum_id);
        const data_temp = await this.paymentsService.findAll(q_museum_id, {
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


    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Post("admin/payments")
    @UseInterceptors(FileInterceptor("confirmed_image_path"))
    async createForAdmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(createPaymentSchema)) createDto: CreatePaymentDto,
        @UploadedFile(new FileValidationPipe()) confirmed_image_path: Express.Multer.File) {
        try {
            const createFile = createfileGenerator(confirmed_image_path, PREFIX, PREFIX);
            const createData = await this.paymentsService.create({
                ...createDto,
                confirmed_image_path: createFile?.filePath,
            });
            await createFile?.generate();

            await this.bookingsService.update({
                id: createData.booking_id,
                user_amount: createData.number_of_adult + createData.number_of_child,
            })

            await Promise.all([...Array(createData.number_of_adult + createData.number_of_child).keys()].map(async () => {
                await this.paymentDetailsService.create({
                    payment_id: createData.id,
                });
            }));

            const data = await this.paymentsService.findById(createData.id);

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Put("admin/payments")
    @UseInterceptors(FileInterceptor('confirmed_image_path'))
    async updateForAdmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(updatePaymentSchema)) updateDto: UpdatePaymentDto,
        @UploadedFile(new FileValidationPipe()) confirmed_image_path: Express.Multer.File) {
        try {
            const dataById = await this.paymentsService.findById(updateDto.id);
            const updateFile = updatefileGenerator(confirmed_image_path, PREFIX, PREFIX, PREFIX, dataById.confirmed_image_path, false);
            const data = await this.paymentsService.update({
                ...updateDto,
                confirmed_image_path: updateFile?.filePath,
            });
            await updateFile.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data }));

        } catch (e) {
            throw e;
        }

    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Delete("admin/payments/:id")
    async deleteForAdmin(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const dataById = await this.paymentsService.findById(parseInt(id));
            const deleteFile = deleteFileGenerator(dataById.confirmed_image_path);
            const data = await this.paymentsService.delete({
                id: dataById.id,
            });
            await deleteFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }



    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Post("superadmin/payments")
    @UseInterceptors(FileInterceptor("confirmed_image_path"))
    async createForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(createPaymentSchemaForSuperadmin)) createDto: CreatePaymentDto,
        @UploadedFile(new FileValidationPipe()) confirmed_image_path: Express.Multer.File) {
        try {
            const createFile = createfileGenerator(confirmed_image_path, PREFIX, PREFIX);
            const data = await this.paymentsService.create({
                ...createDto,
                confirmed_image_path: createFile?.filePath,
            });
            await createFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Put("superadmin/payments")
    @UseInterceptors(FileInterceptor('confirmed_image_path'))
    async updateForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(updatePaymentSchemaForSuperadmin)) updateDto: UpdatePaymentDto,
        @UploadedFile(new FileValidationPipe()) confirmed_image_path: Express.Multer.File) {
        try {
            const dataById = await this.paymentsService.findById(updateDto.id);
            const updateFile = updatefileGenerator(confirmed_image_path, PREFIX, PREFIX, PREFIX, dataById.confirmed_image_path, false);
            const data = await this.paymentsService.update({
                ...updateDto,
                confirmed_image_path: updateFile?.filePath,
            });
            await updateFile.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data }));

        } catch (e) {
            throw e;
        }

    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Delete("superadmin/payments/:id")
    async deleteForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const dataById = await this.paymentsService.findById(parseInt(id));
            const deleteFile = deleteFileGenerator(dataById.confirmed_image_path);
            const data = await this.paymentsService.delete({
                id: dataById.id,
            });
            await deleteFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }

}
