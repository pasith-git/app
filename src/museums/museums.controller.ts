import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from 'auth/auth.service';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from 'users/users.service';
import { MuseumsService } from './museums.service';
import responseUtil from 'common/utils/response.util';
import { Roles } from 'common/decorators/role.decorator';
import Role from 'common/enums/role.enum';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { createFirstTimeMuseumSchema, createMuseumSchemaForSuperadmin, createMuseumWithOwnerSchemaForSuperadmin, deleteMuseumSchemaForSuperadmin, updateMuseumSchema, updateMuseumSchemaForSuperadmin } from 'common/schemas/museum.schema';
import { ConnectStripeToMuseumDto, CreateMuseumDto, CreateMuseumWithOwnerDto, DeleteMuseumDto, UpdateMuseumDto } from 'common/dtos/museum.dto';
import { FormDataValidationPipe } from 'common/pipes/form-data-validation.pipe';
import { FileFieldValidationPipe, FilesValidationPipe, FileValidationPipe } from 'common/pipes/file-validation.pipe';
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
import { checkTimeStartAndEnd, checkTimeStartOrEnd } from 'common/utils/datetime.util';

const PREFIX = 'museums';

@Controller('')
export class MuseumsController {
    constructor(private prisma: PrismaService, private museumsService: MuseumsService,
        private usersService: UsersService, private authService: AuthService,
        private countriesService: CountriesService, private paymentWalletsService: PaymentWalletsService) { }

    @Get("museums")
    async findAll(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: MuseumQuery) {
        /* const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = await this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]); */
        const q_museum_id = museum_id ? Number(museum_id) : undefined;
        const data_fixed = await this.museumsService.findAllForNormal(q_museum_id);
        const data_temp = await this.museumsService.findAllForNormal(q_museum_id, {
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
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.AGENT, Role.GOD, Role.OWNER, Role.CASHIER)
    @Get("admin/museums/:id")
    async findByIdForAdmin(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const [_, access_token] = req.headers.authorization.split(' ');
        const jwtPayload = this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const data = await this.museumsService.findById(Number(id));

        if (data.id !== user.museum_id) {
            throw new CustomException({ error: MESSAGE.PermissionAccessingFailed, }, HttpStatus.FORBIDDEN);
        }

        return res.json(responseUtil({
            req,
            body: data.id === user.museum_id ? data : {},
        }))
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.AGENT, Role.GOD, Role.OWNER, Role.CASHIER)
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
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Put("admin/museums")
    @UseInterceptors(FileInterceptor('logo_image_file'))
    async updateForAdmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(updateMuseumSchema)) updateDto: UpdateMuseumDto,
        @UploadedFile(new FileValidationPipe()) logo_image_file: Express.Multer.File) {
        try {
            const [_, access_token] = req.headers.authorization?.split(' ');
            const jwtPayload = await this.authService.jwtDecode(access_token);
            const user = await this.usersService.findById(jwtPayload["id"]);
            const museum = await this.museumsService.findById(updateDto.id);

            if (museum.id !== user.museum_id) {
                throw new CustomException({ error: MESSAGE.PermissionAccessingFailed, }, HttpStatus.FORBIDDEN);
            }
            
            let openCloseTime;

            openCloseTime = checkTimeStartOrEnd({
                input: updateDto.open_time,
                value: museum.open_time,
            },
                {
                    input: updateDto.close_time,
                    value: museum.close_time,
                }
            )

            const updateFile = updatefileGenerator(logo_image_file, PREFIX, museum.name, updateDto.name || museum.name, museum.logo_image_path, updateDto.delete_image);

            const data = await this.museumsService.update({
                ...updateDto,
                logo_image_path: updateFile?.filePath,
                open_time: openCloseTime?.start_time,
                close_time: openCloseTime?.end_time,
            });
            await updateFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data }));

        } catch (e) {
            throw e;
        }

    }

    /* @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Post("admin/museums/first-time")
    @UseInterceptors(FileInterceptor("logo_image_file"))
    async createForFirstTimeUse(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(createFirstTimeMuseumSchema)) createDto: CreateMuseumDto,
        @UploadedFile(new FileValidationPipe()) logo_image_file: Express.Multer.File) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);

        let openCloseTime;

        if (createDto.open_time && createDto.close_time) {
            openCloseTime = checkTimeStartAndEnd(createDto.open_time, createDto.close_time)
        }

        const createFile = createfileGenerator(logo_image_file, PREFIX, createDto.name);
        const data = await this.museumsService.create({
            ...createDto,
            logo_image_path: createFile?.filePath,
            open_time: openCloseTime?.start_time,
            close_time: openCloseTime?.end_time,
            is_deleted: false,
        });

        await this.usersService.update({
            id: user.id,
            museum_id: data.id,
        });

        await createFile?.generate();
        return res.status(HttpStatus.OK).json(responseUtil({
            req, message: "The museum information is created. Enjoy :)", body: data
        }));
    } */

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Get("superadmin/museums/:id")
    async findByIdForSuperadmin(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const data = await this.museumsService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Get("superadmin/museums")
    async findAllForSuperadmin(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: MuseumQuery) {
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

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Post("superadmin/museums")
    @UseInterceptors(FileInterceptor("logo_image_file"))
    async createForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(createMuseumSchemaForSuperadmin)) createDto: CreateMuseumDto,
        @UploadedFile(new FileValidationPipe()) file: Express.Multer.File) {
        try {

            let openCloseTime;

            if (createDto.open_time && createDto.close_time) {
                openCloseTime = checkTimeStartAndEnd(createDto.open_time, createDto.close_time)
            }
            const createFile = createfileGenerator(file, PREFIX, createDto.name);
            const data = await this.museumsService.create({
                ...createDto,
                logo_image_path: createFile?.filePath,
                open_time: openCloseTime?.start_time,
                close_time: openCloseTime?.end_time,
            });

            await createFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Post("superadmin/museums/owner")
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'logo_image_file', maxCount: 1 },
        { name: 'profile_image_file', maxCount: 1 },
    ]))
    async createForSuperadminToTheOwnerOfMuseum(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(createMuseumWithOwnerSchemaForSuperadmin)) createDto: CreateMuseumWithOwnerDto,
        @UploadedFiles(new FileFieldValidationPipe()) file: { logo_image_file?: Express.Multer.File[], profile_image_file?: Express.Multer.File[] }) {
        try {
            /* let openCloseTime;

            if (createDto.open_time && createDto.close_time) {
                openCloseTime = checkTimeStartAndEnd(createDto.open_time, createDto.close_time)
            }
            const createFile = createfileGenerator(logo_image_file, PREFIX, createDto.name);
            const data = await this.museumsService.create({
                ...createDto,
                logo_image_path: createFile?.filePath,
                open_time: openCloseTime?.start_time,
                close_time: openCloseTime?.end_time,
            });
            await createFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, })); */

            const createFileOwner = createfileGenerator(file.profile_image_file?.[0], "users", createDto.owner.username);
            const createFileMuseum = createfileGenerator(file.logo_image_file?.[0], PREFIX, createDto.museum.name);

            const data = await this.museumsService.createMuseumAndOwner({
                museum: {
                    ...createDto.museum,
                    logo_image_path: createFileMuseum?.filePath,
                },
                owner: {
                    ...createDto.owner,
                    profile_image_path: createFileOwner?.filePath,
                }
            });

            await createFileOwner?.generate();
            await createFileMuseum?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Put("superadmin/museums")
    @UseInterceptors(FileInterceptor('logo_image_file'))
    async updateForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(updateMuseumSchemaForSuperadmin)) updateDto: UpdateMuseumDto,
        @UploadedFile(new FileValidationPipe()) file: Express.Multer.File) {
        try {
            const museum = await this.museumsService.findById(updateDto.id);

            let openCloseTime;

            openCloseTime = checkTimeStartOrEnd({
                input: updateDto.open_time,
                value: museum.open_time,
            },
                {
                    input: updateDto.close_time,
                    value: museum.close_time,
                }
            )

            const updateFile = updatefileGenerator(file, PREFIX, museum.name, updateDto.name || museum.name, museum.logo_image_path, updateDto.delete_image);
            const data = await this.museumsService.update({
                ...updateDto,
                logo_image_path: updateFile?.filePath,
                open_time: openCloseTime?.start_time,
                close_time: openCloseTime?.end_time,
            });
            await updateFile.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data }));

        } catch (e) {
            throw e;
        }
    }


    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Delete("superadmin/museums/:id")
    async deleteForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const museum = await this.museumsService.findById(parseInt(id));
            const deleteFile = deleteFileGenerator(museum.logo_image_path);
            const data = await this.museumsService.delete({
                id: museum.id,
            });
            await deleteFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }
}
