import { Get, Req, Res, Controller, HttpStatus, Post, Body, UseInterceptors, UploadedFiles, Put, UploadedFile, Query, Param, UseGuards, Delete } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AuthService } from 'auth/auth.service';
import { Roles } from 'common/decorators/role.decorator';
import { CreateCountryDto, DeleteCountryDto, UpdateCountryDto } from 'common/dtos/country.dto';
import { CreateMuseumGalleryDto, DeleteMuseumGalleryDto, UpdateMuseumGalleryDto } from 'common/dtos/museum-gallery.dto';
import Role from 'common/enums/role.enum';
import { AuthGuard } from 'common/guards/auth.guard';
import { MuseumIdGuard } from 'common/guards/museumId.guard';
import { FilesValidationPipe, FileValidationPipe } from 'common/pipes/file-validation.pipe';
import { FormDataValidationPipe } from 'common/pipes/form-data-validation.pipe';
import { JoiValidationPipe } from 'common/pipes/joi-validation.pipe';
import MuseumGalleryQuery from 'common/querys/museum-gallery.query';
import { createMuseumGallerySchema, deleteMuseumGallerySchema, deleteMuseumGallerySchemaForSuperadmin, updateMuseumGallerySchema, createMuseumGallerySchemaForSuperadmin, updateMuseumGallerySchemaForSuperadmin } from 'common/schemas/museum-galley.schema';
import { createfileGenerator, deleteFileGenerator, updatefileGenerator } from 'common/utils/image-processor.util';
import MESSAGE from 'common/utils/message.util';
import responseUtil from 'common/utils/response.util';
import { Request, Response, Express } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from 'users/users.service';

import { MuseumGalleriesService } from './museum-galleries.service';

const PREFIX = 'museum-galleries';

@Controller('')
export class MuseumGalleriesController {
    constructor(private prisma: PrismaService, private museumGalleriesService: MuseumGalleriesService, private authService: AuthService, private usersService: UsersService) { }


    @Get("museum-galleries")
    async findAll(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: MuseumGalleryQuery) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = await this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const q_museum_id = museum_id ? Number(museum_id) : undefined;
        const data_fixed = await this.museumGalleriesService.findAll(q_museum_id);
        const data_temp = await this.museumGalleriesService.findAll(q_museum_id, {
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

    @Get("museum-galleries/:id")
    async findByIdUU(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const data = await this.museumGalleriesService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.GUIDE, Role.SUPERADMIN, Role.OWNER)
    @Get("admin/museum-galleries")
    async findAllByMuseumId(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: MuseumGalleryQuery) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = this.authService.jwtVerify(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const data_fixed = await this.museumGalleriesService.findAll(user.museum_id);
        const data_temp = await this.museumGalleriesService.findAll(user.museum_id, {
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
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.GUIDE, Role.SUPERADMIN, Role.OWNER)
    @Get("admin/museum-galleries/:id")
    async findById(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = this.authService.jwtVerify(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const data = await this.museumGalleriesService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: user.museum_id === data.museum_gallery_category.museum_id ? data : {},
        }))
    }


    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.SUPERADMIN, Role.OWNER)
    @Post("admin/museum-galleries")
    @UseInterceptors(FileInterceptor("file"))
    async create(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(createMuseumGallerySchema)) createDto: CreateMuseumGalleryDto,
        @UploadedFile(new FileValidationPipe()) file: Express.Multer.File) {
        try {

            const createFile = createfileGenerator(file, PREFIX, PREFIX);
            const data = await this.museumGalleriesService.create({
                ...createDto,
                image_path: createFile?.filePath,
            });
            await createFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.SUPERADMIN, Role.OWNER)
    @Put("admin/museum-galleries")
    @UseInterceptors(FileInterceptor('file'))
    async update(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(updateMuseumGallerySchema)) updateDto: UpdateMuseumGalleryDto,
        @UploadedFile(new FileValidationPipe()) file: Express.Multer.File) {
        try {
            const museum_gallery = await this.museumGalleriesService.findById(updateDto.id);
            const updateFile = updatefileGenerator(file, PREFIX, PREFIX, PREFIX, museum_gallery.image_path, updateDto.delete_image);
            const data = await this.museumGalleriesService.update({
                ...updateDto,
                image_path: updateFile?.filePath,
            });
            await updateFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data }));

        } catch (e) {
            throw e;
        }

    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.SUPERADMIN, Role.OWNER)
    @Delete("admin/museum-galleries/delete/:id")
    async delete(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const dataById = await this.museumGalleriesService.findById(parseInt(id));
            const deleteFile = deleteFileGenerator(dataById.image_path);
            const data = await this.museumGalleriesService.delete({
                id: dataById.id,
            });
            await deleteFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN)
    @Get("superadmin/museum-galleries/:id")
    async findByIdForSuperadmin(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        const data = await this.museumGalleriesService.findByIdForSuperadmin(Number(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }

    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN)
    @Get("superadmin/museum-galleries")
    async findAllForSuperadmin(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: MuseumGalleryQuery) {
        const data_fixed = await this.museumGalleriesService.findAllForSuperadmin();
        const data_temp = await this.museumGalleriesService.findAllForSuperadmin(undefined, {
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
    @Post("superadmin/museum-galleries")
    @UseInterceptors(FileInterceptor("file"))
    async createManyForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(createMuseumGallerySchemaForSuperadmin)) createDto: CreateMuseumGalleryDto,
        @UploadedFile(new FileValidationPipe()) file: Express.Multer.File) {
        try {
            const createFile = createfileGenerator(file, PREFIX, PREFIX);
            const data = await this.museumGalleriesService.createForSuperadmin({
                ...createDto,
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
    @Put("superadmin/museum-galleries")
    @UseInterceptors(FileInterceptor('file'))
    async updateManyForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(createMuseumGallerySchemaForSuperadmin)) updateDto: UpdateMuseumGalleryDto,
        @UploadedFile(new FileValidationPipe()) file: Express.Multer.File) {
        try {
            const museum_gallery = await this.museumGalleriesService.findByIdForSuperadmin(updateDto.id);
            const updateFile = updatefileGenerator(file, PREFIX, PREFIX, PREFIX, museum_gallery.image_path, updateDto.delete_image);
            const data = await this.museumGalleriesService.updateForSuperadmin({
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
    @Delete("superadmin/museum-galleries/delete/:id")
    async deleteForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const dataById = await this.museumGalleriesService.findByIdForSuperadmin(parseInt(id));
            const deleteFile = deleteFileGenerator(dataById.image_path);
            const data = await this.museumGalleriesService.deleteForSuperadmin({
                id: dataById.id,
            });
            await deleteFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }


}
