import { Get, Req, Res, Controller, HttpStatus, Post, Body, UseInterceptors, UploadedFiles, Put, UploadedFile, Query, Param, UseGuards, Delete } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor, MulterModule } from '@nestjs/platform-express';
import { AuthService } from 'auth/auth.service';
import { Roles } from 'common/decorators/role.decorator';
import { CreateCountryDto, DeleteCountryDto, UpdateCountryDto } from 'common/dtos/country.dto';
import { CreateGalleryDto, DeleteGalleryDto, UpdateGalleryDto } from 'common/dtos/gallery.dto';
import Role from 'common/enums/role.enum';
import { AuthGuard } from 'common/guards/auth.guard';
import { MuseumIdGuard } from 'common/guards/museumId.guard';
import { FilesValidationPipe, FileValidationPipe } from 'common/pipes/file-validation.pipe';
import { JoiValidationPipe } from 'common/pipes/joi-validation.pipe';
import GalleryQuery from 'common/querys/gallery.query';
import { createGallerySchema, deleteGallerySchema, deleteGallerySchemaForSuperadmin, updateGallerySchema, createGallerySchemaForSuperadmin, updateGallerySchemaForSuperadmin } from 'common/schemas/gallery.schema';
import { createfileGenerator, deleteFileGenerator, updatefileGenerator } from 'common/utils/image-processor.util';
import MESSAGE from 'common/utils/message.util';
import responseUtil from 'common/utils/response.util';
import { Request, Response, Express } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from 'users/users.service';

import { GalleriesService } from './galleries.service';
import { CustomException } from 'common/exceptions/custom.exception';

const PREFIX = 'galleries';

interface QUERY_TAKE {
    museum?: string
    author?: string
    gallery_detail?: string
}

@Controller('')
export class GalleriesController {
    constructor(private prisma: PrismaService, private galleriesService: GalleriesService, private authService: AuthService, private usersService: UsersService) { }


    @Get("galleries")
    async findAll(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: GalleryQuery) {
        /* const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = await this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]); */
        const q_museum_id = museum_id ? Number(museum_id) : undefined;
        const data_fixed = await this.galleriesService.findAllNormal(q_museum_id);
        const data_temp = await this.galleriesService.findAllNormal(q_museum_id, {
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

    @Get("galleries/:id")
    async findById(@Req() req: Request, @Res() res: Response, @Param("id") id: string, @Query() { take }: {
        take?: QUERY_TAKE
    }) {
        const data = await this.galleriesService.findAllNormal(Number(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.AGENT, Role.GOD, Role.OWNER, Role.CASHIER)
    @Get("admin/galleries")
    async findAllByMuseumId(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: GalleryQuery) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = this.authService.jwtVerify(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const data_fixed = await this.galleriesService.findAll(user.museum_id);
        const data_temp = await this.galleriesService.findAll(user.museum_id, {
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
    @Get("admin/galleries/:id")
    async findByIdForAdmin(@Req() req: Request, @Res() res: Response, @Param("id") id: string, @Query() { take }: {
        take?: QUERY_TAKE
    }) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = this.authService.jwtVerify(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const data = await this.galleriesService.findById(Number(id), take);

        if (data.museum_id !== user.museum_id) {
            throw new CustomException({ error: MESSAGE.PermissionAccessingFailed, }, HttpStatus.FORBIDDEN);
        }


        return res.json(responseUtil({
            req,
            body: user.museum_id === data.museum_id ? data : {},
        }))
    }


    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Post("admin/galleries")
    async create(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(createGallerySchema)) createDto: CreateGalleryDto, @Query() { take }: {
            take?: QUERY_TAKE
        }) {
        try {
            const [_, access_token] = req.headers.authorization?.split(' ');
            const jwtPayload = this.authService.jwtVerify(access_token);
            const user = await this.usersService.findById(jwtPayload["id"]);
            /* const dataTransactions = await this.prisma.$transaction(async (tx) => {
                return await Promise.all(createDto.gallery_details.map(async (createNestedtDto, i) => {
                    const createFile = createfileGenerator(gallery_image_paths?.[i], PREFIX, PREFIX);
                    return {
                        data: createNestedtDto,
                        createFile: createFile?.generate(),
                    }
                }))
            }); */

            const data = await this.galleriesService.create({
                ...createDto,
                museum_id: user.museum_id,
                author_id: user.id,
            }, take);

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Put("admin/galleries")
    async update(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(updateGallerySchema)) updateDto: UpdateGalleryDto, @Query() { take }: {
            take?: QUERY_TAKE
        }) {
        try {
            const [_, access_token] = req.headers.authorization?.split(' ');
            const jwtPayload = await this.authService.jwtDecode(access_token);
            const user = await this.usersService.findById(jwtPayload["id"]);
            const dataById = await this.galleriesService.findById(updateDto.id);

            if (dataById.museum_id !== user.museum_id) {
                throw new CustomException({ error: MESSAGE.PermissionAccessingFailed, }, HttpStatus.FORBIDDEN);
            }

            const data = await this.galleriesService.update({
                ...updateDto,
            }, take);

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data }));

        } catch (e) {
            throw e;
        }

    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Delete("admin/galleries/:id")
    async delete(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string, @Query() { take }: {
            take?: QUERY_TAKE
        }) {
        try {
            const [_, access_token] = req.headers.authorization?.split(' ');
            const jwtPayload = await this.authService.jwtDecode(access_token);
            const user = await this.usersService.findById(jwtPayload["id"]);
            const dataById = await this.galleriesService.findById(parseInt(id));

            if (dataById.museum_id !== user.museum_id) {
                throw new CustomException({ error: MESSAGE.PermissionAccessingFailed, }, HttpStatus.FORBIDDEN);
            }

            const multiDeleteFile = dataById.gallery_details.map(async (data) => {
                const deleteFile = await deleteFileGenerator(data.gallery_image_path)?.generate();
                return deleteFile
            })
            const data = await this.galleriesService.delete({
                id: dataById.id,
            }, take);

            await Promise.all(multiDeleteFile)

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Get("superadmin/galleries/:id")
    async findByIdForSuperadmin(@Req() req: Request, @Res() res: Response, @Param('id') id: string, @Query() { take }: {
        take?: QUERY_TAKE
    }) {
        const data = await this.galleriesService.findById(Number(id), take);
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Get("superadmin/galleries")
    async findAllForSuperadmin(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: GalleryQuery) {
        const q_museum_id = museum_id ? Number(museum_id) : undefined;
        const data_fixed = await this.galleriesService.findAll();
        const data_temp = await this.galleriesService.findAll(q_museum_id, {
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
    @Post("superadmin/galleries")
    async createManyForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(createGallerySchemaForSuperadmin)) createDto: CreateGalleryDto, @Query() { take }: {
            take?: QUERY_TAKE
        }) {
        try {
            const data = await this.galleriesService.create({
                ...createDto,
            }, take);

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Put("superadmin/galleries")
    async updateManyForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(updateGallerySchemaForSuperadmin)) updateDto: UpdateGalleryDto, @Query() { take }: {
            take?: QUERY_TAKE
        }) {
        try {
            const data = await this.galleriesService.update({
                ...updateDto,
            }, take);

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data }));

        } catch (e) {
            throw e;
        }

    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Delete("superadmin/galleries/:id")
    async deleteForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string, @Query() { take }: {
            take?: QUERY_TAKE
        }) {
        try {

            const dataById = await this.galleriesService.findById(parseInt(id));
            const multiDeleteFile = dataById.gallery_details.map(async (data) => {
                const deleteFile = await deleteFileGenerator(data.gallery_image_path)?.generate();
                return deleteFile
            })
            const data = await this.galleriesService.delete({
                id: dataById.id,
            }, take);

            await Promise.all(multiDeleteFile)

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }

}
