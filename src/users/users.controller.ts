import { Get, Req, Res, Controller, HttpStatus, Post, Body, UseInterceptors, UploadedFiles, Put, UseGuards, Query, Param, UploadedFile, Delete } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'common/decorators/role.decorator';
import Role from 'common/enums/role.enum';
import { CreateUserDto, DeleteUserDto, ResetPasswordDto, UpdateUserDto } from 'common/dtos/user.dto';
import { AuthGuard } from 'common/guards/auth.guard';
import { FilesValidationPipe, FileValidationPipe } from 'common/pipes/file-validation.pipe';
import { FormDataValidationPipe } from 'common/pipes/form-data-validation.pipe';
import { JoiValidationPipe } from 'common/pipes/joi-validation.pipe';
import { createUserSchema, createUserSchemaForSuperadmin, deleteUserSchema, deleteUserSchemaForSuperadmin, updateUserSchema, updateUserSchemaForSuperadmin, updateProfile, resetPasswordVerifyConfirmSchema, resetPasswordVerifySchema } from 'common/schemas/user.schema';
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
import { TwilioService } from 'twilio/twilio.service';
const PREFIX = 'users';

@Controller('')
export class UsersController {
    constructor(private prisma: PrismaService, private authService: AuthService, private usersService: UsersService,
        private twilioService: TwilioService,
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
                    /* isPaid: data.payment_packages.some(payment_package => dayjsUtil().isSameOrBefore(payment_package.package_end_date) && payment_package.status === "success"), */
                },
            }))
        } catch (e) {
            throw new CustomException({ error: "Token is invalid" }, HttpStatus.UNAUTHORIZED);
        }

    }

    /* admin */

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.AGENT, Role.GOD, Role.OWNER, Role.CASHIER)
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
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.AGENT, Role.GOD, Role.OWNER, Role.CASHIER)
    @Get("admin/users")
    async findAllForAdmin(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, role_name, role_names, ...filter } = {}, ...query }: UserQuery) {
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
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Post("admin/users")
    @UseInterceptors(FileInterceptor('profile_image_file'))
    async createForAdmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(createUserSchema)) createDto: CreateUserDto,
        @UploadedFile(new FileValidationPipe()) profile_image_file: Express.Multer.File) {
        try {
            const [_, access_token] = req.headers.authorization.split(' ');
            const jwtPayload = this.authService.jwtDecode(access_token);
            const user = await this.usersService.findById(jwtPayload["id"]);
            /* const users = await this.usersService.findAll(user.museum_id); */
            /* const [payment_package] = user.payment_packages.filter(payment_package => dayjsUtil().isSameOrBefore(payment_package.package_end_date) && payment_package.status === "success");

            if ((users.length + 1) > payment_package.package.user_limit) {
                throw new CustomException({ error: `Our paid package has a limit of ${payment_package.package.user_limit} users` }, HttpStatus.UNAUTHORIZED);
            } */

            /* const datas = await this.prisma.$transaction(async () => {
                return await Promise.all(createManyDto.map(async (createDto, i) => { */
            const roleIds = await this.rolesService.findByIds(createDto.role_ids, true);
            const createFile = createfileGenerator(profile_image_file, PREFIX, createDto.username);
            const data = await this.usersService.create({
                ...createDto,
                password: this.authService.generatePassword(createDto.password),
                /* birth_date: dayjsUtil(createDto.birth_date).toDate(), */
                is_deleted: false,
                museum_id: user.museum_id,
                role_ids: roleIds.map(data => data.id),
                is_active: true,
                profile_image_path: createFile?.filePath,
            });

            await createFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: exclude(data, ['password']), }));

        } catch (e) {
            throw e;
        }
    }

    @Post("reset-password/verify")
    async resetPasswordVerify(@Req() req: Request, @Res() res: Response, @Body(new JoiValidationPipe(resetPasswordVerifySchema)) resetpasswordDto: ResetPasswordDto) {
        try {
            const data = await this.usersService.findByPhone(resetpasswordDto.phone);
            if (!data) {
                throw new CustomException({ error: "Phone isn't exist" });
            }
            await this.twilioService.sendSms(`${data.country.num_code}${resetpasswordDto.phone}`);
            return res.status(HttpStatus.OK).json(responseUtil({ req, message: `A verification code has been sent to the phone number +${resetpasswordDto.phone}` }));
        } catch (e) {
            if (e.code === "P2002") {
                throw e;
            }
            else if (e instanceof CustomException) {
                throw e
            } else {
                throw new CustomException({ error: e });
            }
        }
    }

    @Post("reset-password/confirm")
    async resetPasswordConfirm(@Req() req: Request, @Res() res: Response, @Body(new JoiValidationPipe(resetPasswordVerifyConfirmSchema)) resetpasswordDto: ResetPasswordDto) {
        try {

            const data = await this.usersService.findByPhone(resetpasswordDto.phone);

            await this.twilioService.verifySmsCode(`${data.country.num_code}${resetpasswordDto.phone}`, resetpasswordDto.code);

            await this.usersService.update({
                id: data.id,
                password: resetpasswordDto.new_password,
            })

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: "Your password has been successfully updated" }));
        } catch (e) {
            if (e.code === "P2002") {
                throw e;
            }
            else if (e instanceof CustomException) {
                throw e
            } else {
                throw new CustomException({ error: e });
            }
        }
    }


    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Put("admin/users")
    @UseInterceptors(FileInterceptor('profile_image_file'))
    async updateForAdmin(@Req() req: Request, @Res() res: Response, @Body(new FormDataValidationPipe(updateUserSchema)) updateDto: UpdateUserDto,
        @UploadedFile(new FileValidationPipe()) profile_image_file: Express.Multer.File) {
        try {
            const user = await this.usersService.findById(updateDto.id);
            const roleIds = await this.rolesService.findByIds(updateDto.role_ids, true);
            const updateFile = updatefileGenerator(profile_image_file, PREFIX, user.username, updateDto.username || user.username, user.profile_image_path, updateDto.delete_image);
            const data = await this.usersService.update({
                ...updateDto,
                role_ids: roleIds.map(data => data.id),
                ...(updateDto.password && { password: this.authService.generatePassword(updateDto.password) }),
                /* ...(updateDto.birth_date && { birth_date: dayjsUtil(updateDto.birth_date).toDate() }), */
                profile_image_path: updateFile?.filePath,
            });
            await updateFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: exclude(data, ['password']), }));

        } catch (e) {
            throw e;
        }

    }


    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.AGENT, Role.GOD, Role.OWNER)
    @Put("admin/users/update-profile")
    @UseInterceptors(FileInterceptor('profile_image_file'))
    async updateProfileForAdmin(@Req() req: Request, @Res() res: Response, @Body(new FormDataValidationPipe(updateProfile))
    updateDto: UpdateUserDto, @UploadedFile(new FileValidationPipe()) profile_image_file: Express.Multer.File) {
        try {
            const user = await this.usersService.findById(updateDto.id);
            const updateFile = updatefileGenerator(profile_image_file, PREFIX, user.username, updateDto.username || user.username, user.profile_image_path, updateDto.delete_image);

            const data = await this.usersService.update({
                ...updateDto,
                ...(updateDto.password && { password: this.authService.generatePassword(updateDto.password) }),
                /* ...(updateDto.birth_date && { birth_date: dayjsUtil(updateDto.birth_date).toDate() }), */
                profile_image_path: updateFile?.filePath,
            })

            await updateFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: exclude(data, ['password']) }));

        } catch (e) {
            throw e;
        }

    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Delete("admin/users/:id")
    async deleteForAdmin(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        try {
            const [_, access_token] = req.headers.authorization.split(' ');
            const jwtPayload = this.authService.jwtDecode(access_token);
            const userPayload = await this.usersService.findById(jwtPayload["id"]);
            const user = await this.usersService.findById(parseInt(id));

            if (userPayload.museum_id !== user.museum_id) {
                throw new CustomException({ error: MESSAGE.deleteFailed });
            }

            const deleteFile = deleteFileGenerator(user.profile_image_path);
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
    @Roles(Role.ADMIN, Role.GOD)
    @Get("superadmin/users/:id")
    async findByIdForSuperadmin(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const data = await this.usersService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: exclude(data, ['password']),
        }))
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Get("superadmin/users")
    async findAllForSuperadmin(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: UserQuery) {
        const q_museum_id = museum_id ? Number(museum_id) : undefined;
        const data_fixed = await this.usersService.findAll(q_museum_id);
        const data_temp = await this.usersService.findAll(q_museum_id, {
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
    @Roles(Role.ADMIN, Role.GOD)
    @Post("superadmin/users")
    @UseInterceptors(FileInterceptor('profile_image_file'))
    async createForSuperAdmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(createUserSchemaForSuperadmin)) createDto: CreateUserDto,
        @UploadedFile(new FileValidationPipe()) profile_image_file: Express.Multer.File) {
        try {
            const createFile = createfileGenerator(profile_image_file, PREFIX, createDto.username);
            const data = await this.usersService.create({
                ...createDto,
                profile_image_path: createFile?.filePath,
            });
            await createFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: exclude(data, ['password']), }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Put("superadmin/users")
    @UseInterceptors(FileInterceptor('profile_image_file'))
    async updateForSuperAdmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(updateUserSchemaForSuperadmin)) updateDto: UpdateUserDto,
        @UploadedFile(new FileValidationPipe()) profile_image_file: Express.Multer.File) {
        try {
            const user = await this.usersService.findById(updateDto.id);
            const updateFile = updatefileGenerator(profile_image_file, PREFIX, user.username, updateDto.username || user.username, user.profile_image_path, updateDto.delete_image);
            const data = await this.usersService.update({
                ...updateDto,
                profile_image_path: updateFile?.filePath,
            });
            await updateFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: exclude(data, ['password']), }));

        } catch (e) {
            throw e;
        }

    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Delete("superadmin/users/:id")
    async deleteForSuperAdmin(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const user = await this.usersService.findById(parseInt(id));
            const deleteFile = deleteFileGenerator(user.profile_image_path);
            const data = await this.usersService.delete({
                id: user.id,
            });
            await deleteFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: exclude(data, ['password']), }));

        } catch (e) {
            throw e;
        }
    }
}
