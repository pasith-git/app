import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from 'auth/auth.service';
import { AuthGuard } from 'common/guards/auth.guard';
import { MuseumIdGuard } from 'common/guards/museumId.guard';
import MuseumGalleryCategoryQuery from 'common/querys/museum-gallery-category.query';
import MuseumScheduleQuery from 'common/querys/museum-schedule.query';
import { PrismaService } from 'prisma/prisma.service';
import { Request, Response, Express } from 'express';
import { MuseumGalleryCategoriesService } from './museum-gallery-categories.service';
import responseUtil from 'common/utils/response.util';
import { JoiValidationPipe } from 'common/pipes/joi-validation.pipe';
import { createMuseumGalleryCategorySchema, deleteMuseumGalleryCategorySchema, updateMuseumGalleryCategorySchema } from 'common/schemas/museum-gallery-category.schema';
import { CreateMuseumGalleryCategoryDto, DeleteMuseumGalleryCategoryDto, UpdateMuseumGalleryCategoryDto } from 'common/dtos/museum-gallery-category.dto';
import MESSAGE from 'common/utils/message.util';
import { UsersService } from 'users/users.service';
import { Roles } from 'common/decorators/role.decorator';
import Role from 'common/enums/role.enum';

const PREFIX = "museum-gallery-categories";

@Controller('')
export class MuseumGalleryCategoriesController {
    constructor(private prisma: PrismaService, private museumGalleryCategoriesService: MuseumGalleryCategoriesService, private authService: AuthService, private usersService: UsersService) { }

    @Get("museum-gallery-categories")
    async findAll(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: MuseumGalleryCategoryQuery) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = await this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const q_museum_id = museum_id ? Number(museum_id) : undefined;
        const data_fixed = await this.museumGalleryCategoriesService.findAll(q_museum_id);
        const data_temp = await this.museumGalleryCategoriesService.findAll(q_museum_id, {
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

    @Get("museum-gallery-categories/:id")
    async findByIdUU(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const data = await this.museumGalleryCategoriesService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.GUIDE, Role.SUPERADMIN, Role.OWNER)
    @Get("admin/museum-gallery-categories/:id")
    async findById(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = this.authService.jwtVerify(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const data = await this.museumGalleryCategoriesService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: user.museum_id === data.museum_id ? data : {},
        }))
    }


    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.GUIDE, Role.SUPERADMIN, Role.OWNER)
    @Get("admin/museum-gallery-categories")
    async findAllByMuseumId(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: MuseumGalleryCategoryQuery) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = this.authService.jwtVerify(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const data_fixed = await this.museumGalleryCategoriesService.findAll(user.museum_id);
        const data_temp = await this.museumGalleryCategoriesService.findAll(user.museum_id, {
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
    @Roles(Role.ADMIN, Role.MANAGER, Role.SUPERADMIN, Role.OWNER)
    @Post("admin/museum-gallery-categories")
    async create(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(createMuseumGalleryCategorySchema)) createDto: CreateMuseumGalleryCategoryDto) {
        try {
            const [_, access_token] = req.headers.authorization?.split(' ');
            const jwtPayload = this.authService.jwtVerify(access_token);
            const user = await this.usersService.findById(jwtPayload["id"]);
            const data = await this.museumGalleryCategoriesService.create({
                ...createDto,
                museum_id: user.museum_id,
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.SUPERADMIN, Role.OWNER)
    @Put("admin/museum-gallery-categories")
    async update(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(updateMuseumGalleryCategorySchema)) updateDto: UpdateMuseumGalleryCategoryDto) {
        try {
            const data = await this.museumGalleryCategoriesService.update({
                ...updateDto,
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.SUPERADMIN, Role.OWNER)
    @Delete("admin/museum-gallery-categories/delete/:id")
    async delete(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const data = await this.museumGalleryCategoriesService.delete({
                id: parseInt(id),
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN)
    @Get("superadmin/museum-gallery-categories/:id")
    async findByIdForSuperadmin(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const data = await this.museumGalleryCategoriesService.findByIdForSuperadmin(Number(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }

    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN)
    @Get("superadmin/museum-gallery-categories")
    async findAllByMuseumIdForSuperadmin(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: MuseumGalleryCategoryQuery) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = this.authService.jwtVerify(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const data_fixed = await this.museumGalleryCategoriesService.findAllForSuperadmin(museum_id);
        const data_temp = await this.museumGalleryCategoriesService.findAllForSuperadmin(museum_id, {
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
    @Post("superadmin/museum-gallery-categories")
    async createForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(createMuseumGalleryCategorySchema)) createDto: CreateMuseumGalleryCategoryDto) {
        try {
            /* const [_, access_token] = req.headers.authorization?.split(' ');
            const jwtPayload = this.authService.jwtVerify(access_token);
            const user = await this.usersService.findById(jwtPayload["id"]); */
            const data = await this.museumGalleryCategoriesService.createForSuperadmin({
                ...createDto,
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN)
    @Put("superadmin/museum-gallery-categories")
    async updateForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(updateMuseumGalleryCategorySchema)) updateDto: UpdateMuseumGalleryCategoryDto) {
        try {
            const data = await this.museumGalleryCategoriesService.updateForSuperadmin({
                ...updateDto,
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN)
    @Delete("superadmin/museum-gallery-categories/delete/:id")
    async deleteForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const data = await this.museumGalleryCategoriesService.deleteForSuperadmin({
                id: parseInt(id),
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }

}
