import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from 'auth/auth.service';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from 'users/users.service';
import { MuseumsService } from './museums.service';
import responseUtil from 'common/utils/response.util';
import { Roles } from 'common/decorators/role.decorator';
import Role from 'common/enums/role.enum';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { connectStripeToMuseumSchema, createFirstTimeMuseumSchema, createMuseumSchemaForSuperadmin, deleteMuseumSchemaForSuperadmin, updateMuseumSchema } from 'common/schemas/museum.schema';
import { ConnectStripeToMuseumDto, CreateMuseumDto, DeleteMuseumDto, UpdateMuseumDto } from 'common/dtos/museum.dto';
import { FormDataValidationPipe } from 'common/pipes/form-data-validation.pipe';
import { FilesValidationPipe, FileValidationPipe } from 'common/pipes/file-validation.pipe';
import { createfileGenerator, deleteFileGenerator, updatefileGenerator } from 'common/utils/image-processor.util';
import dayjsUtil from 'common/utils/dayjs.util';
import MESSAGE from 'common/utils/message.util';
import MuseumQuery from 'common/querys/museum.query';
import { AuthGuard } from 'common/guards/auth.guard';
import { MuseumIdGuard } from 'common/guards/museumId.guard';
import { JoiValidationPipe } from 'common/pipes/joi-validation.pipe';
import stripe from 'common/instances/stripe.instance';
import { CountriesService } from 'countries/countries.service';
import { CustomException } from 'common/exceptions/custom.exception';
import { PaymentWalletsService } from 'payment-wallets/payment-wallets.service';

const PREFIX = 'museums';

@Controller('')
export class MuseumsController {
    constructor(private prisma: PrismaService, private museumsService: MuseumsService,
        private usersService: UsersService, private authService: AuthService,
        private countriesService: CountriesService, private paymentWalletsService: PaymentWalletsService) { }

    @Get("museums")
    async findAll(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: MuseumQuery) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = await this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const q_museum_id = museum_id ? Number(museum_id) : undefined;
        const data_fixed = await this.museumsService.findAll(q_museum_id);
        const data_temp = await this.museumsService.findAll(q_museum_id, {
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

    @Get("museums/:id")
    async findById(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const data = await this.museumsService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.GUIDE, Role.SUPERADMIN, Role.OWNER)
    @Get("admin/museums/:id")
    async findByIdForAdmin(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const [_, access_token] = req.headers.authorization.split(' ');
        const jwtPayload = this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const data = await this.museumsService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: data.id === user.museum_id ? data : {},
        }))
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.GUIDE, Role.SUPERADMIN, Role.OWNER)
    @Get("admin/museums")
    async findAllByMuseumIdForAdmin(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: MuseumQuery) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = await this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const data_fixed = await this.museumsService.findAll(user.museum_id);
        const data_temp = await this.museumsService.findAll(user.museum_id, {
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
    @Roles(Role.ADMIN, Role.MANAGER, Role.SUPERADMIN, Role.OWNER)
    @Put("admin/museums")
    @UseInterceptors(FileInterceptor('file'))
    async updateForAdmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(updateMuseumSchema)) updateDto: UpdateMuseumDto,
        @UploadedFile(new FileValidationPipe()) file: Express.Multer.File) {
        try {
            const museum = await this.museumsService.findById(updateDto.id);
            const updateFile = updatefileGenerator(file, PREFIX, museum.name, updateDto.name || museum.name, museum.logo, updateDto.delete_image);

            const data = await this.museumsService.update({
                ...updateDto,
                ...(updateDto.phone && { phone: `+${updateDto.phone}` }),
                logo: updateFile?.filePath,
            });
            await updateFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data }));

        } catch (e) {
            throw e;
        }

    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.SUPERADMIN, Role.OWNER)
    @Post("admin/museums/first-time")
    @UseInterceptors(FileInterceptor("file"))
    async createForFirstTimeUse(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(createFirstTimeMuseumSchema)) createMuseumDto: CreateMuseumDto,
        @UploadedFile(new FileValidationPipe()) file: Express.Multer.File) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);

        const createFile = createfileGenerator(file, PREFIX, createMuseumDto.name);
        const museum = await this.museumsService.create({
            ...createMuseumDto,
            ...(createMuseumDto.phone && { phone: `+${createMuseumDto.phone}` }),
            logo: createFile?.filePath,
        });

        await this.usersService.update({
            id: user.id,
            museum_id: museum.id,
        });

        /* const stripeAccount = await stripe.accounts.create({
            type: "standard",
            country: country.locale,
            default_currency: "lak",
        })

        const stripePaymentMethod = await stripe.paymentMethods.create({
            type: "card",
            card: {
                number: createMuseumDto.card_number,
                exp_month: createMuseumDto.exp_month,
                exp_year: createMuseumDto.exp_year,
                cvc: createMuseumDto.cvc,
            },
        }, {
            stripeAccount: stripeAccount.id,
        }) */

        await createFile?.generate();


        return res.status(HttpStatus.OK).json(responseUtil({
            req, message: "The museum information is created. Enjoy :)", body: museum
        }));

    }

    @Post("admin/museums/connect-to-stripe")
    async connectStripePaymentToMuseum(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(connectStripeToMuseumSchema)) createDto: ConnectStripeToMuseumDto,) {
        try {
            const museum = await this.museumsService.findById(createDto.museum_id);

            const [stripeAccount, stripePaymentMethod] = await Promise.all([
                stripe.accounts.create({
                    type: "standard",
                    country: museum.country.locale,
                    default_currency: "lak",
                }),
                stripe.paymentMethods.create({
                    type: "card",
                    card: {
                        number: createDto.card_number,
                        exp_month: createDto.exp_month,
                        exp_year: createDto.exp_year,
                        cvc: createDto.cvc,
                    },
                })
            ]);

            await stripe.paymentMethods.update(stripePaymentMethod.id, {
            }, {
                stripeAccount: stripeAccount.id,
            })

            /* const createPaymentWallet = await this.paymentWalletsService.create() */

            await this.museumsService.update({
                id: createDto.museum_id,

            })

        } catch (e) {
            throw new CustomException({ message: "Stripe errors", error: e });
        }

    }

    /* superadmin */

    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN)
    @Get("superadmin/museums/:id")
    async findByIdForSuperadmin(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const data = await this.museumsService.findByIdForSuperadmin(Number(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }

    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN)
    @Get("superadmin/museums")
    async findAllForSuperadmin(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: MuseumQuery) {
        const q_museum_id = museum_id ? Number(museum_id) : undefined;
        const data_fixed = await this.museumsService.findAllForSuperadmin(q_museum_id);
        const data_temp = await this.museumsService.findAllForSuperadmin(q_museum_id, {
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

    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN)
    @Post("superadmin/museums")
    @UseInterceptors(FileInterceptor("file"))
    async createForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(createMuseumSchemaForSuperadmin)) createDto: CreateMuseumDto,
        @UploadedFile(new FileValidationPipe()) file: Express.Multer.File) {
        try {
            const createFile = createfileGenerator(file, PREFIX, createDto.name);
            const data = await this.museumsService.createForSuperadmin({
                ...createDto,
                ...(createDto.phone && { phone: `+${createDto.phone}` }),
                logo: createFile?.filePath,
            });
            await createFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN)
    @Put("superadmin/museums")
    @UseInterceptors(FileInterceptor('file'))
    async updateForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(updateMuseumSchema)) updateDto: UpdateMuseumDto,
        @UploadedFile(new FileValidationPipe()) file: Express.Multer.File) {
        try {
            const museum = await this.museumsService.findByIdForSuperadmin(updateDto.id);
            const updateFile = updatefileGenerator(file, PREFIX, museum.name, updateDto.name || museum.name, museum.logo, updateDto.delete_image);
            const data = await this.museumsService.updateForSuperadmin({
                ...updateDto,
                ...(updateDto.phone && { phone: `+${updateDto.phone}` }),
                logo: updateFile?.filePath,
            });
            await updateFile.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data }));

        } catch (e) {
            throw e;
        }

    }


    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN)
    @Delete("superadmin/museums/delete/:id")
    async deleteForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const museum = await this.museumsService.findByIdForSuperadmin(parseInt(id));
            const deleteFile = deleteFileGenerator(museum.logo);
            const data = await this.museumsService.deleteForSuperadmin({
                id: museum.id,
            });
            await deleteFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }
}
