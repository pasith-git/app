import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Request, Response, Express } from 'express';
import { GalleryDetailsService } from './gallery-details.service';
import responseUtil from 'common/utils/response.util';
import { AuthGuard } from 'common/guards/auth.guard';
import { Roles } from 'common/decorators/role.decorator';
import Role from 'common/enums/role.enum';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FormDataValidationPipe } from 'common/pipes/form-data-validation.pipe';
import { FileValidationPipe } from 'common/pipes/file-validation.pipe';
import { createGalleryDetailSchema, createGalleryDetailSchemaForSuperadmin, updateGalleryDetailSchema, updateGalleryDetailSchemaForSuperadmin } from 'common/schemas/gallery-detail.schema';
import { CreateGalleryDetailDto, UpdateGalleryDetailDto } from 'common/dtos/gallery-detail.dto';
import { createfileGenerator, deleteFileGenerator, updatefileGenerator } from 'common/utils/image-processor.util';
import GalleryDetailQuery from 'common/querys/gallery-detail.query';
import MESSAGE from 'common/utils/message.util';
import { MuseumIdGuard } from 'common/guards/museumId.guard';
import { AuthService } from 'auth/auth.service';
import { UsersService } from 'users/users.service';
import { FileRequiredValidationPipe } from 'common/pipes/file-validation.pipe';

const PREFIX = "gallery-details";

@Controller('')
export class GalleryDetailsController {
    constructor(private prisma: PrismaService, private galleryDetailsService: GalleryDetailsService, private authService: AuthService, private usersService: UsersService) { }

    @Get("gallery-details")
    async findAll(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: GalleryDetailQuery) {
        /* const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = await this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]); */
        const q_museum_id = museum_id ? Number(museum_id) : undefined;
        const data_fixed = await this.galleryDetailsService.findAll(q_museum_id);
        const data_temp = await this.galleryDetailsService.findAll(q_museum_id, {
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
    @Get("admin/gallery-details")
    async findAllByMuseumId(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: GalleryDetailQuery) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = await this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const data_fixed = await this.galleryDetailsService.findAll(user.museum_id);
        const data_temp = await this.galleryDetailsService.findAll(user.museum_id, {
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

    @Get("gallery-details/:id")
    async findById(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const data = await this.galleryDetailsService.findById(Number(id));
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
        const data = await this.galleryDetailsService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: user.museum_id === data.gallery.museum_id ? data : {},
        }))
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Get("superadmin/gallery-details")
    async findAllForSuperadmin(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: GalleryDetailQuery) {
        const data_fixed = await this.galleryDetailsService.findAll();
        const data_temp = await this.galleryDetailsService.findAll(parseInt(museum_id), {
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

    @Get("superadmin/gallery-details/:id")
    async findByIdForSuperadmin(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const data = await this.galleryDetailsService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Post("admin/gallery-details")
    @UseInterceptors(FileInterceptor("gallery_image_path"))
    async createForAdmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(createGalleryDetailSchema)) createDto: CreateGalleryDetailDto,
        @UploadedFile(new FileRequiredValidationPipe()) gallery_image_path: Express.Multer.File) {
        try {
            const createFile = createfileGenerator(gallery_image_path, PREFIX, PREFIX);
            const data = await this.galleryDetailsService.create({
                ...createDto,
                gallery_image_path: createFile?.filePath,
            });
            await createFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Put("admin/gallery-details")
    @UseInterceptors(FileInterceptor('gallery_image_path'))
    async updateForAdmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(updateGalleryDetailSchema)) updateDto: UpdateGalleryDetailDto,
        @UploadedFile(new FileValidationPipe()) gallery_image_path: Express.Multer.File) {
        try {
            const dataById = await this.galleryDetailsService.findById(updateDto.id);
            const updateFile = updatefileGenerator(gallery_image_path, PREFIX, PREFIX, PREFIX, dataById.gallery_image_path, updateDto.delete_image);
            const data = await this.galleryDetailsService.update({
                ...updateDto,
                gallery_image_path: updateFile?.filePath,
            });
            await updateFile.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data }));

        } catch (e) {
            throw e;
        }

    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Delete("admin/gallery-details/:id")
    async deleteForAdmin(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const dataById = await this.galleryDetailsService.findById(parseInt(id));
            const deleteFile = deleteFileGenerator(dataById.gallery_image_path);
            const data = await this.galleryDetailsService.delete({
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
    @Post("superadmin/gallery-details")
    @UseInterceptors(FileInterceptor("gallery_image_path"))
    async createForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(createGalleryDetailSchemaForSuperadmin)) createDto: CreateGalleryDetailDto,
        @UploadedFile(new FileRequiredValidationPipe()) gallery_image_path: Express.Multer.File) {
        try {
            const createFile = createfileGenerator(gallery_image_path, PREFIX, PREFIX);
            const data = await this.galleryDetailsService.create({
                ...createDto,
                gallery_image_path: createFile?.filePath,
            });
            await createFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Put("superadmin/gallery-details")
    @UseInterceptors(FileInterceptor('gallery_image_path'))
    async updateForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(updateGalleryDetailSchemaForSuperadmin)) updateDto: UpdateGalleryDetailDto,
        @UploadedFile(new FileValidationPipe()) gallery_image_path: Express.Multer.File) {
        try {
            const dataById = await this.galleryDetailsService.findById(updateDto.id);
            const updateFile = updatefileGenerator(gallery_image_path, PREFIX, PREFIX, PREFIX, dataById.gallery_image_path, updateDto.delete_image);
            const data = await this.galleryDetailsService.update({
                ...updateDto,
                gallery_image_path: updateFile?.filePath,
            });
            await updateFile.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data }));

        } catch (e) {
            throw e;
        }

    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Delete("superadmin/gallery-details/:id")
    async deleteForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const dataById = await this.galleryDetailsService.findById(parseInt(id));
            const deleteFile = deleteFileGenerator(dataById.gallery_image_path);
            const data = await this.galleryDetailsService.delete({
                id: dataById.id,
            });
            await deleteFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }

}
