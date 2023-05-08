import { Get, Req, Res, Controller, HttpStatus, Post, Body, UseInterceptors, UploadedFiles, Put, UploadedFile, Query, Param, UseGuards, Delete } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AuthService } from 'auth/auth.service';
import { Roles } from 'common/decorators/role.decorator';
import { CreateCountryDto, DeleteCountryDto, UpdateCountryDto } from 'common/dtos/country.dto';
import { CreatePaymentDetailDto, DeletePaymentDetailDto, UpdatePaymentDetailDto } from 'common/dtos/payment-detail.dto';
import Role from 'common/enums/role.enum';
import { AuthGuard } from 'common/guards/auth.guard';
import { MuseumIdGuard } from 'common/guards/museumId.guard';
import { FilesValidationPipe, FileValidationPipe } from 'common/pipes/file-validation.pipe';
import { JoiValidationPipe } from 'common/pipes/joi-validation.pipe';
import PaymentDetailQuery from 'common/querys/payment-detail.query';
import { createPaymentDetailSchema, deletePaymentDetailSchema, deletePaymentDetailSchemaForSuperadmin, updatePaymentDetailSchema, createPaymentDetailSchemaForSuperadmin, updatePaymentDetailSchemaForSuperadmin } from 'common/schemas/payment-detail.schema';
import { createfileGenerator, deleteFileGenerator, updatefileGenerator } from 'common/utils/image-processor.util';
import MESSAGE from 'common/utils/message.util';
import responseUtil from 'common/utils/response.util';
import { Request, Response, Express } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from 'users/users.service';

import { PaymentDetailsService } from './payment-details.service';

const PREFIX = 'payment-details';

@Controller('')
export class PaymentDetailsController {
    constructor(private prisma: PrismaService, private paymentDetailsService: PaymentDetailsService, private authService: AuthService, private usersService: UsersService) { }


    @Get("payment-details")
    async findAll(@Req() req: Request, @Res() res: Response, @Query() { filter: { ...filter } = {}, ...query }: PaymentDetailQuery) {
        /* const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = await this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]); */
        const data_fixed = await this.paymentDetailsService.findAll();
        const data_temp = await this.paymentDetailsService.findAll(undefined, {
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

    @Get("payment-details/:id")
    async findById(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const data = await this.paymentDetailsService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.AGENT, Role.GOD, Role.OWNER)
    @Get("admin/payment-details")
    async findAllByMuseumId(@Req() req: Request, @Res() res: Response, @Query() { filter: { ...filter } = {}, ...query }: PaymentDetailQuery) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = this.authService.jwtVerify(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const data_fixed = await this.paymentDetailsService.findAll();
        const data_temp = await this.paymentDetailsService.findAll(undefined, {
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
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.AGENT, Role.GOD, Role.OWNER)
    @Get("admin/payment-details/:id")
    async findByIdForAdmin(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = this.authService.jwtVerify(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const data = await this.paymentDetailsService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }


    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Post("admin/payment-details")
    async create(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(createPaymentDetailSchema)) createDto: CreatePaymentDetailDto) {
        try {
            const [_, access_token] = req.headers.authorization?.split(' ');
            const jwtPayload = this.authService.jwtVerify(access_token);
            const user = await this.usersService.findById(jwtPayload["id"]);
            /* const dataTransactions = await this.prisma.$transaction(async (tx) => {
                return await Promise.all(createDto.payment-detail_details.map(async (createNestedtDto, i) => {
                    const createFile = createfileGenerator(payment-detail_image_paths?.[i], PREFIX, PREFIX);
                    return {
                        data: createNestedtDto,
                        createFile: createFile?.generate(),
                    }
                }))
            }); */

            const data = await this.paymentDetailsService.create({
                ...createDto,
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Put("admin/payment-details")
    async update(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(updatePaymentDetailSchema)) updateDto: UpdatePaymentDetailDto,) {
        try {
            const data = await this.paymentDetailsService.update({
                ...updateDto,
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data }));

        } catch (e) {
            throw e;
        }

    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Delete("admin/payment-details/:id")
    async delete(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const dataById = await this.paymentDetailsService.findById(parseInt(id));
            const data = await this.paymentDetailsService.delete({
                id: dataById.id,
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Get("superadmin/payment-details/:id")
    async findByIdForSuperadmin(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        const data = await this.paymentDetailsService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Get("superadmin/payment-details")
    async findAllForSuperadmin(@Req() req: Request, @Res() res: Response, @Query() { filter: { ...filter } = {}, ...query }: PaymentDetailQuery) {
        const data_fixed = await this.paymentDetailsService.findAll();
        const data_temp = await this.paymentDetailsService.findAll(undefined, {
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
    @Roles(Role.ADMIN, Role.GOD)
    @Post("superadmin/payment-details")
    async createManyForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(createPaymentDetailSchemaForSuperadmin)) createDto: CreatePaymentDetailDto,) {
        try {
            const data = await this.paymentDetailsService.create({
                ...createDto,
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Put("superadmin/payment-details")
    async updateManyForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(updatePaymentDetailSchemaForSuperadmin)) updateDto: UpdatePaymentDetailDto) {
        try {
            const data = await this.paymentDetailsService.update({
                ...updateDto,
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data }));

        } catch (e) {
            throw e;
        }

    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Delete("superadmin/payment-details/:id")
    async deleteForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const dataById = await this.paymentDetailsService.findById(parseInt(id));
            const data = await this.paymentDetailsService.delete({
                id: dataById.id,
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }

}
