import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ContentsService } from './contents.service';
import { AuthService } from 'auth/auth.service';
import { UsersService } from 'users/users.service';
import ContentQuery from 'common/querys/content.query';
import { Request, Response, Express } from 'express';
import responseUtil from 'common/utils/response.util';
import { AuthGuard } from 'common/guards/auth.guard';
import { MuseumIdGuard } from 'common/guards/museumId.guard';
import Role from 'common/enums/role.enum';
import { Roles } from 'common/decorators/role.decorator';
import { FormDataValidationPipe } from 'common/pipes/form-data-validation.pipe';
import { createContentSchema, createContentSchemaForSuperadmin, updateContentSchema } from 'common/schemas/content.schema';
import { CreateContentDto, UpdateContentDto } from 'common/dtos/content.dto';
import MESSAGE from 'common/utils/message.util';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'common/pipes/file-validation.pipe';
import { createfileGenerator, deleteFileGenerator, updatefileGenerator } from 'common/utils/image-processor.util';
import { CustomException } from 'common/exceptions/custom.exception';

const PREFIX = "contents";

@Controller('')
export class ContentsController {
    constructor(private prisma: PrismaService, private contentsService: ContentsService, private authService: AuthService, private usersService: UsersService) { }


    @Get("contents")
    async findAll(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: ContentQuery) {
        /* const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = await this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]); */
        const q_museum_id = museum_id ? Number(museum_id) : undefined;
        const data_fixed = await this.contentsService.findAll(q_museum_id);
        const data_temp = await this.contentsService.findAll(q_museum_id, {
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

    @Get("contents/:id")
    async findById(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const data = await this.contentsService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.AGENT, Role.GOD, Role.OWNER, Role.CASHIER)
    @Get("admin/contents")
    async findAllByMuseumId(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: ContentQuery) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = this.authService.jwtVerify(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const data_fixed = await this.contentsService.findAll(user.museum_id);
        const data_temp = await this.contentsService.findAll(user.museum_id, {
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
    @Get("admin/contents/:id")
    async findByIdForAdmin(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = this.authService.jwtVerify(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const data = await this.contentsService.findById(Number(id));

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
    @Post("admin/contents")
    @UseInterceptors(FileInterceptor("main_content_image_path"))
    async create(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(createContentSchema)) createDto: CreateContentDto,
        @UploadedFile(new FileValidationPipe()) main_content_image_path: Express.Multer.File) {
        try {
            const [_, access_token] = req.headers.authorization?.split(' ');
            const jwtPayload = this.authService.jwtVerify(access_token);
            const user = await this.usersService.findById(jwtPayload["id"]);
            const createFile = createfileGenerator(main_content_image_path, PREFIX, PREFIX);
            /* const dataTransactions = await this.prisma.$transaction(async (tx) => {
                return await Promise.all(createDto.gallery_details.map(async (createNestedtDto, i) => {
                    const createFile = createfileGenerator(gallery_image_paths?.[i], PREFIX, PREFIX);
                    return {
                        data: createNestedtDto,
                        createFile: createFile?.generate(),
                    }
                }))
            }); */

            const data = await this.contentsService.create({
                ...createDto,
                museum_id: user.museum_id,
                author_id: user.id,
                main_content_image_path: createFile?.filePath,
            });

            await createFile?.generate();


            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Put("admin/contents")
    @UseInterceptors(FileInterceptor("main_content_image_path"))
    async update(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(updateContentSchema)) updateDto: UpdateContentDto,
        @UploadedFile(new FileValidationPipe()) main_content_image_path: Express.Multer.File) {
        try {
            const [_, access_token] = req.headers.authorization?.split(' ');
            const jwtPayload = await this.authService.jwtDecode(access_token);
            const user = await this.usersService.findById(jwtPayload["id"]);

            const dataById = await this.contentsService.findById(updateDto.id);
            const updateFile = updatefileGenerator(main_content_image_path, PREFIX, PREFIX, PREFIX, dataById.main_content_image_path, updateDto.delete_image);

            if (dataById.museum_id !== user.museum_id) {
                throw new CustomException({ error: MESSAGE.PermissionAccessingFailed, }, HttpStatus.FORBIDDEN);
            }

            const data = await this.contentsService.update({
                ...updateDto,
                main_content_image_path: updateFile?.filePath,
            });
            await updateFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data }));

        } catch (e) {
            throw e;
        }

    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Delete("admin/contents/:id")
    async delete(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const [_, access_token] = req.headers.authorization?.split(' ');
            const jwtPayload = await this.authService.jwtDecode(access_token);
            const user = await this.usersService.findById(jwtPayload["id"]);
            const dataById = await this.contentsService.findById(parseInt(id));

            if (dataById.museum_id !== user.museum_id) {
                throw new CustomException({ error: MESSAGE.PermissionAccessingFailed, }, HttpStatus.FORBIDDEN);
            }

            const multiDeleteFile = dataById.photos.map(async (data) => {
                const deleteFile = await deleteFileGenerator(data.path)?.generate();
                return deleteFile
            })
            const deleteFile = deleteFileGenerator(dataById.main_content_image_path);
            const data = await this.contentsService.delete({
                id: dataById.id,
            });

            await deleteFile?.generate()
            await Promise.all(multiDeleteFile)

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Get("superadmin/contents/:id")
    async findByIdForSuperadmin(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        const data = await this.contentsService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Get("superadmin/contents")
    async findAllForSuperadmin(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: ContentQuery) {
        const q_museum_id = museum_id ? Number(museum_id) : undefined;
        const data_fixed = await this.contentsService.findAll();
        const data_temp = await this.contentsService.findAll(q_museum_id, {
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
    @Post("superadmin/contents")
    @UseInterceptors(FileInterceptor("main_content_image_path"))
    async createManyForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(createContentSchemaForSuperadmin)) createDto: CreateContentDto,
        @UploadedFile(new FileValidationPipe()) main_content_image_path: Express.Multer.File) {
        try {
            const createFile = createfileGenerator(main_content_image_path, PREFIX, PREFIX);
            const data = await this.contentsService.create({
                ...createDto,
                main_content_image_path: createFile?.filePath,
            });

            await createFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Put("superadmin/contents")
    @UseInterceptors(FileInterceptor("main_content_image_path"))
    async updateManyForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(createContentSchemaForSuperadmin)) updateDto: UpdateContentDto,
        @UploadedFile(new FileValidationPipe()) main_content_image_path: Express.Multer.File) {
        try {
            const dataById = await this.contentsService.findById(updateDto.id);
            const updateFile = updatefileGenerator(main_content_image_path, PREFIX, PREFIX, PREFIX, dataById.main_content_image_path, updateDto.delete_image);
            const data = await this.contentsService.update({
                ...updateDto,
                main_content_image_path: updateFile?.filePath,
            });

            await updateFile?.generate()

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data }));

        } catch (e) {
            throw e;
        }

    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Delete("superadmin/contents/:id")
    async deleteForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const dataById = await this.contentsService.findById(parseInt(id));
            const multiDeleteFile = dataById.photos.map(async (data) => {
                const deleteFile = await deleteFileGenerator(data.path)?.generate();
                return deleteFile
            })
            const deleteFile = deleteFileGenerator(dataById.main_content_image_path);
            const data = await this.contentsService.delete({
                id: dataById.id,
            });

            await deleteFile?.generate()
            await Promise.all(multiDeleteFile)

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }
}
