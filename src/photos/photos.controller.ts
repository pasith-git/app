import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'common/decorators/role.decorator';
import Role from 'common/enums/role.enum';
import { AuthGuard } from 'common/guards/auth.guard';
import { MuseumIdGuard } from 'common/guards/museumId.guard';
import { FileRequiredValidationPipe, FileValidationPipe } from 'common/pipes/file-validation.pipe';
import { FormDataValidationPipe } from 'common/pipes/form-data-validation.pipe';
import { createPhotoSchema, createPhotoSchemaForSuperadmin, updatePhotoSchema, updatePhotoSchemaForSuperadmin } from 'common/schemas/photo.schema';
import { createfileGenerator, deleteFileGenerator, updatefileGenerator } from 'common/utils/image-processor.util';
import responseUtil from 'common/utils/response.util';
import { PhotosService } from 'photos/photos.service';
import { PrismaService } from 'prisma/prisma.service';
import { Request, Response, Express } from 'express';
import MESSAGE from 'common/utils/message.util';
import { CreatePhotoDto, UpdatePhotoDto } from 'common/dtos/photo.dto';
import { AuthService } from 'auth/auth.service';
import { UsersService } from 'users/users.service';
import PhotoQuery from 'common/querys/photo.query';

const PREFIX = "photos";

@Controller('')
export class PhotosController {

    constructor(private prisma: PrismaService, private photosService: PhotosService, private authService: AuthService, private usersService: UsersService) { }

    @Get("photos")
    async findAll(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: PhotoQuery) {
        /* const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = await this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]); */
        const q_museum_id = museum_id ? Number(museum_id) : undefined;
        const data_fixed = await this.photosService.findAll(q_museum_id);
        const data_temp = await this.photosService.findAll(q_museum_id, {
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
    @Get("admin/photos")
    async findAllByMuseumId(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: PhotoQuery) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = await this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const data_fixed = await this.photosService.findAll(user.museum_id);
        const data_temp = await this.photosService.findAll(user.museum_id, {
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

    @Get("photos/:id")
    async findById(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const data = await this.photosService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.AGENT, Role.GOD, Role.OWNER, Role.CASHIER)
    @Get("admin/photos/:id")
    async findByIdForAdmin(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = this.authService.jwtVerify(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const data = await this.photosService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: user.museum_id === data.content.museum_id ? data : {},
        }))
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Post("admin/photos")
    @UseInterceptors(FileInterceptor("path"))
    async createForAdmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(createPhotoSchema)) createDto: CreatePhotoDto,
        @UploadedFile(new FileRequiredValidationPipe()) path: Express.Multer.File) {
        try {
            const createFile = createfileGenerator(path, PREFIX, PREFIX);
            console.log(createFile);
            const data = await this.photosService.create({
                ...createDto,
                path: createFile?.filePath,
            });
            await createFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Put("admin/photos")
    @UseInterceptors(FileInterceptor('path'))
    async updateForAdmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(updatePhotoSchema)) updateDto: UpdatePhotoDto,
        @UploadedFile(new FileValidationPipe()) path: Express.Multer.File) {
        try {
            const dataById = await this.photosService.findById(updateDto.id);
            const updateFile = updatefileGenerator(path, PREFIX, PREFIX, PREFIX, dataById.path, false);
            const data = await this.photosService.update({
                ...updateDto,
                path: updateFile?.filePath,
            });
            await updateFile.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data }));

        } catch (e) {
            throw e;
        }

    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Delete("admin/photos/:id")
    async deleteForAdmin(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const dataById = await this.photosService.findById(parseInt(id));
            const deleteFile = deleteFileGenerator(dataById.path);
            const data = await this.photosService.delete({
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
    @Get("admin/photos")
    async findAllForSuperadmin(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: PhotoQuery) {
        const data_fixed = await this.photosService.findAll();
        const data_temp = await this.photosService.findAll(parseInt(museum_id), {
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
    @Post("superadmin/photos")
    @UseInterceptors(FileInterceptor("path"))
    async createForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(createPhotoSchemaForSuperadmin)) createDto: CreatePhotoDto,
        @UploadedFile(new FileRequiredValidationPipe()) path: Express.Multer.File) {
        try {
            const createFile = createfileGenerator(path, PREFIX, PREFIX);
            const data = await this.photosService.create({
                ...createDto,
                path: createFile?.filePath,
            });
            await createFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Put("superadmin/photos")
    @UseInterceptors(FileInterceptor('path'))
    async updateForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(updatePhotoSchemaForSuperadmin)) updateDto: UpdatePhotoDto,
        @UploadedFile(new FileValidationPipe()) path: Express.Multer.File) {
        try {
            const dataById = await this.photosService.findById(updateDto.id);
            const updateFile = updatefileGenerator(path, PREFIX, PREFIX, PREFIX, dataById.path, false);
            const data = await this.photosService.update({
                ...updateDto,
                path: updateFile?.filePath,
            });
            await updateFile.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data }));

        } catch (e) {
            throw e;
        }

    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Delete("superadmin/photos/:id")
    async deleteForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const dataById = await this.photosService.findById(parseInt(id));
            const deleteFile = deleteFileGenerator(dataById.path);
            const data = await this.photosService.delete({
                id: dataById.id,
            });
            await deleteFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }

}
