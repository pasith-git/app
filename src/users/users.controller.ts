import { Get, Req, Res, Controller, HttpStatus, Post, Body, UseInterceptors, UploadedFiles, Put, UseGuards, Query, Param, UploadedFile, Delete } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'common/decorators/role.decorator';
import Role from 'common/enums/role.enum';
import { CreateUserDto, DeleteUserDto, UpdateUserDto } from 'common/dtos/user.dto';
import { AuthGuard } from 'common/guards/auth.guard';
import { FilesValidationPipe, FileValidationPipe } from 'common/pipes/file-validation.pipe';
import { FormDataValidationPipe } from 'common/pipes/form-data-validation.pipe';
import { JoiValidationPipe } from 'common/pipes/joi-validation.pipe';
import { createUserSchema, createUserSchemaForSuperadmin, deleteUserSchema, deleteUserSchemaForSuperadmin, updateUserSchema, updateUserSchemaForSuperadmin, updateProfile } from 'common/schemas/user.schema';
import exclude from 'common/utils/exclude.util';
import { createfileGenerator, deleteFileGenerator, updatefileGenerator } from 'common/utils/image-processor.util';
import MESSAGE from 'common/utils/message.util';
import responseUtil from 'common/utils/response.util';
import { Request, Response, Express } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from './users.service';
import { AuthService } from 'auth/auth.service';
import { CustomException } from 'common/exceptions/custom.exception';
import { MuseumIdGuard } from 'common/guards/museumId.guard';
import dayjsUtil from 'common/utils/dayjs.util';
import UserQuery from 'common/querys/user.query';
import { RolesService } from 'roles/roles.service';
const PREFIX = 'users';

@Controller('')
export class UsersController {
    constructor(private prisma: PrismaService, private authService: AuthService, private usersService: UsersService,
        private rolesService: RolesService) { }

    @UseGuards(AuthGuard)
    @Get("users/info")
    async info(@Req() req: Request, @Res() res: Response,) {
        try {
            const [_, access_token] = req.headers.authorization.split(' ');
            const jwtPayload = this.authService.jwtDecode(access_token);
            const data = await this.usersService.findById(jwtPayload["id"]);
            return res.status(HttpStatus.OK).json(responseUtil({
                req,
                body: {
                    ...exclude(data, ["password"]),
                    isPaid: data.payment_packages.some(payment_package => dayjsUtil().isSameOrBefore(payment_package.package_end_date) && payment_package.status === "success"),
                },
            }))
        } catch (e) {
            throw new CustomException({ error: "Token is invalid" }, HttpStatus.UNAUTHORIZED);
        }

    }

    /* admin */

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.GUIDE, Role.SUPERADMIN, Role.OWNER)
    @Get("admin/users/:id")
    async findByIdForAdmin(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const [_, access_token] = req.headers.authorization.split(' ');
        const jwtPayload = this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const data = await this.usersService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: data.museum_id === user.museum_id ? exclude(data, ['password']) : {},
        }))
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.GUIDE, Role.SUPERADMIN, Role.OWNER)
    @Get("admin/users")
    async findAllForAdmin(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: UserQuery) {
        const [_, access_token] = req.headers.authorization.split(' ');
        const jwtPayload = this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const data_fixed = await this.usersService.findAll(user.museum_id);
        const data_temp = await this.usersService.findAll(user.museum_id, {
            filter,
            ...query,
        });
        res.append('X-Total-Count-Fixed', data_fixed.length.toString());
        res.append('X-Total-Count-Temp', data_temp.length.toString());
        return res.json(responseUtil({
            req,
            body: data_temp.map(data => exclude(data, ['password'])),
        }))
    }


    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.SUPERADMIN, Role.OWNER)
    @Post("admin/users")
    @UseInterceptors(FileInterceptor('file'))
    async createForAdmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(createUserSchema)) createDto: CreateUserDto,
        @UploadedFile(new FileValidationPipe()) file: Express.Multer.File) {
        try {
            const [_, access_token] = req.headers.authorization.split(' ');
            const jwtPayload = this.authService.jwtDecode(access_token);
            const user = await this.usersService.findById(jwtPayload["id"]);
            const users = await this.usersService.findAll(user.museum_id);
            const [payment_package] = user.payment_packages.filter(payment_package => dayjsUtil().isSameOrBefore(payment_package.package_end_date) && payment_package.status === "success");

            if ((users.length + 1) > payment_package.package.user_limit) {
                throw new CustomException({ error: `Our paid package has a limit of ${payment_package.package.user_limit} users` }, HttpStatus.UNAUTHORIZED);
            }

            /* const dataTransactions = await this.prisma.$transaction(async () => {
                return await Promise.all(createManyDto.map(async (createDto, i) => { */
            const roleIds = await this.rolesService.findByIdsWithoutSuperAdmin(createDto.role_ids);
            const createFile = createfileGenerator(file, PREFIX, createDto.username);
            const data = await this.usersService.create({
                ...createDto,
                phone: `+${createDto.phone}`,
                password: this.authService.generatePassword(createDto.password),
                /* birth_date: dayjsUtil(createDto.birth_date).toDate(), */
                museum_id: user.museum_id,
                role_ids: roleIds.map(data => data.id),
                is_staff: true,
                is_active: true,
                image_path: createFile?.filePath,
            });

            await createFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: exclude(data, ['password']), }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.SUPERADMIN, Role.OWNER)
    @Put("admin/users")
    @UseInterceptors(FileInterceptor('file'))
    async updateForAdmin(@Req() req: Request, @Res() res: Response, @Body(new FormDataValidationPipe(updateUserSchema)) updateDto: UpdateUserDto,
        @UploadedFile(new FileValidationPipe()) file: Express.Multer.File) {
        try {
            const user = await this.usersService.findById(updateDto.id);
            const roleIds = await this.rolesService.findByIdsWithoutSuperAdmin(updateDto.role_ids);
            const updateFile = updatefileGenerator(file, PREFIX, user.username, updateDto.username || user.username, user.image_path, updateDto.delete_image);
            const data = await this.usersService.update({
                ...updateDto,
                role_ids: roleIds.map(data => data.id),
                ...(updateDto.phone && { phone: `+${updateDto.phone}` }),
                ...(updateDto.password && { password: this.authService.generatePassword(updateDto.password) }),
                /* ...(updateDto.birth_date && { birth_date: dayjsUtil(updateDto.birth_date).toDate() }), */
                image_path: updateFile?.filePath,
            });
            await updateFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: exclude(data, ['password']), }));

        } catch (e) {
            throw e;
        }

    }


    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.GUIDE, Role.SUPERADMIN, Role.OWNER, Role.USER)
    @Put("admin/users/update-profile")
    @UseInterceptors(FileInterceptor('file'))
    async updateProfileForAdmin(@Req() req: Request, @Res() res: Response, @Body(new FormDataValidationPipe(updateProfile))
    updateDto: UpdateUserDto, @UploadedFile(new FileValidationPipe()) file: Express.Multer.File) {
        try {
            const user = await this.usersService.findById(updateDto.id);
            const updateFile = updatefileGenerator(file, PREFIX, user.username, updateDto.username || user.username, user.image_path, updateDto.delete_image);

            const data = await this.usersService.update({
                ...updateDto,
                ...(updateDto.phone && { phone: `+${updateDto.phone}` }),
                ...(updateDto.password && { password: this.authService.generatePassword(updateDto.password) }),
                /* ...(updateDto.birth_date && { birth_date: dayjsUtil(updateDto.birth_date).toDate() }), */
                image_path: updateFile?.filePath,
            })

            await updateFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: exclude(data, ['password']) }));

        } catch (e) {
            throw e;
        }

    }


    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.SUPERADMIN, Role.OWNER)
    @Delete("admin/users/delete/:id")
    async deleteForAdmin(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        try {

            const user = await this.usersService.findById(parseInt(id));
            const deleteFile = deleteFileGenerator(user.image_path);
            const data = await this.usersService.delete({
                id: user.id,
            });
            await deleteFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: exclude(data, ['password']), }));

        } catch (e) {
            throw e;
        }
    }

    /* super-admin */

    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN)
    @Get("superadmin/users/:id")
    async findByIdForSuperadmin(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const data = await this.usersService.findByIdForSuperadmin(Number(id));
        return res.json(responseUtil({
            req,
            body: exclude(data, ['password']),
        }))
    }

    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN)
    @Get("superadmin/users")
    async findAllForSuperadmin(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: UserQuery) {
        const q_museum_id = museum_id ? Number(museum_id) : undefined;
        const data_fixed = await this.usersService.findAllForSuperadmin(q_museum_id);
        const data_temp = await this.usersService.findAllForSuperadmin(q_museum_id, {
            filter,
            ...query,
        });
        res.append('X-Total-Count-Fixed', data_fixed.length.toString());
        res.append('X-Total-Count-Temp', data_temp.length.toString());
        return res.json(responseUtil({
            req,
            body: data_temp.map(data => exclude(data, ['password'])),
        }))
    }

    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN)
    @Post("superadmin/users/create-superadmin")
    @UseInterceptors(FileInterceptor('file'))
    async createSuperAdmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(createUserSchemaForSuperadmin)) createDto: CreateUserDto,
        @UploadedFile(new FileValidationPipe()) file: Express.Multer.File) {
        try {
            const superadmin = await this.rolesService.findByName("superadmin");
            const createFile = createfileGenerator(file, PREFIX, createDto.username);
            const data = await this.usersService.createForSuperadmin({
                ...createDto,
                role_ids: [superadmin.id],
                image_path: createFile?.filePath,
            });
            await createFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: exclude(data, ['password']), }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN)
    @Post("superadmin/users")
    @UseInterceptors(FileInterceptor('file'))
    async create(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(createUserSchemaForSuperadmin)) createDto: CreateUserDto,
        @UploadedFile(new FileValidationPipe()) files: Express.Multer.File) {
        try {
            const createFile = createfileGenerator(files, PREFIX, createDto.username);
            const data = await this.usersService.createForSuperadmin({
                ...createDto,
                image_path: createFile?.filePath,
            });
            await createFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: exclude(data, ['password']), }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN)
    @Put("superadmin/users")
    @UseInterceptors(FileInterceptor('file'))
    async update(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(updateUserSchemaForSuperadmin)) updateDto: UpdateUserDto,
        @UploadedFile(new FileValidationPipe()) file: Express.Multer.File) {
        try {
            const user = await this.usersService.findByIdForSuperadmin(updateDto.id);
            const updateFile = updatefileGenerator(file, PREFIX, user.username, updateDto.username || user.username, user.image_path, updateDto.delete_image);
            const data = await this.usersService.updateForSuperadmin({
                ...updateDto,
                image_path: updateFile?.filePath,
            });
            await updateFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: exclude(data, ['password']), }));

        } catch (e) {
            throw e;
        }

    }

    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN)
    @Delete("superadmin/users/delete/:id")
    async delete(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const user = await this.usersService.findByIdForSuperadmin(parseInt(id));
            const deleteFile = deleteFileGenerator(user.image_path);
            const data = await this.usersService.deleteForSuperadmin({
                id: user.id,
            });
            await deleteFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: exclude(data, ['password']), }));

        } catch (e) {
            throw e;
        }
    }
}
