import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { BanksService } from './banks.service';
import { AuthService } from 'auth/auth.service';
import { UsersService } from 'users/users.service';
import BankQuery from 'common/querys/bank.query';
import { Request, Response, Express } from 'express';
import responseUtil from 'common/utils/response.util';
import { AuthGuard } from 'common/guards/auth.guard';
import { MuseumIdGuard } from 'common/guards/museumId.guard';
import Role from 'common/enums/role.enum';
import { Roles } from 'common/decorators/role.decorator';
import { FormDataValidationPipe } from 'common/pipes/form-data-validation.pipe';
import { createBankSchema, createBankSchemaForSuperadmin, updateBankSchema } from 'common/schemas/bank.schema';
import { CreateBankDto, UpdateBankDto } from 'common/dtos/bank.dto';
import MESSAGE from 'common/utils/message.util';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileRequiredValidationPipe, FileValidationPipe } from 'common/pipes/file-validation.pipe';
import { createfileGenerator, deleteFileGenerator, updatefileGenerator } from 'common/utils/image-processor.util';

const PREFIX = "banks";

@Controller('')
export class BanksController {
    constructor(private prisma: PrismaService, private banksService: BanksService, private authService: AuthService, private usersService: UsersService) { }


    @Get("banks")
    async findAll(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: BankQuery) {
        /* const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = await this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]); */
        const q_museum_id = museum_id ? Number(museum_id) : undefined;
        const data_fixed = await this.banksService.findAll(q_museum_id);
        const data_temp = await this.banksService.findAll(q_museum_id, {
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

    @Get("banks/:id")
    async findById(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const data = await this.banksService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.AGENT, Role.GOD, Role.OWNER, Role.CASHIER)
    @Get("admin/banks")
    async findAllByMuseumId(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: BankQuery) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = this.authService.jwtVerify(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const data_fixed = await this.banksService.findAll(user.museum_id);
        const data_temp = await this.banksService.findAll(user.museum_id, {
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
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.AGENT, Role.GOD, Role.OWNER, Role.CASHIER)
    @Get("admin/banks/:id")
    async findByIdForAdmin(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = this.authService.jwtVerify(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const data = await this.banksService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: user.museum_id === data.museum_id ? data : {},
        }))
    }


    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Post("admin/banks")
    @UseInterceptors(FileInterceptor("qrcode_image_path"))
    async create(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(createBankSchema)) createDto: CreateBankDto,
        @UploadedFile(new FileRequiredValidationPipe()) qrcode_image_path: Express.Multer.File) {
        try {
            const [_, access_token] = req.headers.authorization?.split(' ');
            const jwtPayload = this.authService.jwtVerify(access_token);
            const user = await this.usersService.findById(jwtPayload["id"]);
            const createFile = createfileGenerator(qrcode_image_path, PREFIX, createDto.name);
            /* const dataTransactions = await this.prisma.$transaction(async (tx) => {
                return await Promise.all(createDto.gallery_details.map(async (createNestedtDto, i) => {
                    const createFile = createfileGenerator(gallery_image_paths?.[i], PREFIX, PREFIX);
                    return {
                        data: createNestedtDto,
                        createFile: createFile?.generate(),
                    }
                }))
            }); */

            const data = await this.banksService.create({
                ...createDto,
                museum_id: user.museum_id,
                qrcode_image_path: createFile?.filePath,
            });

            await createFile?.generate();


            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Put("admin/banks")
    @UseInterceptors(FileInterceptor("qrcode_image_path"))
    async update(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(updateBankSchema)) updateDto: UpdateBankDto,
        @UploadedFile(new FileValidationPipe()) qrcode_image_path: Express.Multer.File) {
        try {
            const dataById = await this.banksService.findById(updateDto.id);
            const updateFile = updatefileGenerator(qrcode_image_path, PREFIX, dataById.name, updateDto.name || dataById.name, dataById.qrcode_image_path, updateDto.delete_image);
            const data = await this.banksService.update({
                ...updateDto,
                qrcode_image_path: updateFile?.filePath,
            });
            await updateFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data }));

        } catch (e) {
            throw e;
        }

    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Delete("admin/banks/:id")
    async delete(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const dataById = await this.banksService.findById(parseInt(id));
            const deleteFile = deleteFileGenerator(dataById.qrcode_image_path);
            const data = await this.banksService.delete({
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
    @Get("superadmin/banks/:id")
    async findByIdForSuperadmin(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        const data = await this.banksService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Get("superadmin/banks")
    async findAllForSuperadmin(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: BankQuery) {
        const q_museum_id = museum_id ? Number(museum_id) : undefined;
        const data_fixed = await this.banksService.findAll();
        const data_temp = await this.banksService.findAll(q_museum_id, {
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
    @Post("superadmin/banks")
    @UseInterceptors(FileInterceptor("qrcode_image_path"))
    async createManyForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(createBankSchemaForSuperadmin)) createDto: CreateBankDto,
        @UploadedFile(new FileRequiredValidationPipe()) qrcode_image_path: Express.Multer.File) {
        try {
            const createFile = createfileGenerator(qrcode_image_path, PREFIX, createDto.name);
            const data = await this.banksService.create({
                ...createDto,
                qrcode_image_path: createFile?.filePath,
            });

            await createFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Put("superadmin/banks")
    @UseInterceptors(FileInterceptor("qrcode_image_path"))
    async updateManyForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(createBankSchemaForSuperadmin)) updateDto: UpdateBankDto,
        @UploadedFile(new FileValidationPipe()) qrcode_image_path: Express.Multer.File) {
        try {
            const dataById = await this.banksService.findById(updateDto.id);
            const updateFile = updatefileGenerator(qrcode_image_path, PREFIX, dataById.name, updateDto.name || dataById.name, dataById.qrcode_image_path, updateDto.delete_image);
            const data = await this.banksService.update({
                ...updateDto,
                qrcode_image_path: updateFile?.filePath,
            });

            await updateFile?.generate()

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data }));

        } catch (e) {
            throw e;
        }

    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Delete("superadmin/banks/:id")
    async deleteForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const dataById = await this.banksService.findById(parseInt(id));
            const deleteFile = deleteFileGenerator(dataById.qrcode_image_path);
            const data = await this.banksService.delete({
                id: dataById.id,
            });
            await deleteFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }
}
