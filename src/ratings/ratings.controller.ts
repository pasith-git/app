import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Roles } from 'common/decorators/role.decorator';
import { CreateRatingDto, DeleteRatingDto, UpdateRatingDto } from 'common/dtos/rating.dto';
import Rating from 'common/enums/role.enum';
import { AuthGuard } from 'common/guards/auth.guard';
import { JoiValidationPipe } from 'common/pipes/joi-validation.pipe';
import RatingQuery from 'common/querys/rating.query';
import { createRatingSchema, createRatingSchemaForSuperadmin, deleteRatingSchemaForSuperadmin, updateRatingSchema, updateRatingSchemaForSuperadmin } from 'common/schemas/rating.schema';
import MESSAGE from 'common/utils/message.util';
import responseUtil from 'common/utils/response.util';
import { Request, Response } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import { RatingsService } from './ratings.service';
import { MuseumIdGuard } from 'common/guards/museumId.guard';
import { AuthService } from 'auth/auth.service';
import { UsersService } from 'users/users.service';
import { CustomException } from 'common/exceptions/custom.exception';

const PREFIX = "ratings";

@Controller('')
export class RatingsController {
    constructor(private prisma: PrismaService, private ratingsService: RatingsService, private authService: AuthService,
        private usersService: UsersService) { }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Rating.ADMIN, Rating.MANAGER, Rating.GOD, Rating.OWNER)
    @Get("admin/ratings/:id")
    async findByIdForAdmin(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const [_, access_token] = req.headers.authorization.split(' ');
        const jwtPayload = this.authService.jwtDecode(access_token);
        const rating = await this.usersService.findById(jwtPayload["id"]);
        const data = await this.ratingsService.findById(Number(id));

        if (data.museum_id !== rating.museum_id) {
            throw new CustomException({ error: MESSAGE.PermissionAccessingFailed, }, HttpStatus.FORBIDDEN);
        }
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Rating.ADMIN, Rating.MANAGER, Rating.GOD, Rating.OWNER)
    @Get("admin/ratings")
    async findAllForAdmin(@Req() req: Request, @Res() res: Response, @Query() { filter, ...query }: RatingQuery) {
        const [_, access_token] = req.headers.authorization.split(' ');
        const jwtPayload = this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const data_fixed = await this.ratingsService.findAll();
        const data_temp = await this.ratingsService.findAll(user.museum_id, {
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
    @Post("ratings")
    async create(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(createRatingSchema)) createDto: CreateRatingDto) {
        const [_, access_token] = req.headers.authorization.split(' ');
        const jwtPayload = this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        try {
            const data = await this.ratingsService.create({
                ...createDto,
                user_id: user.id,
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }


    @UseGuards(AuthGuard)
    @Put("ratings")
    async update(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(updateRatingSchema)) updateDto: UpdateRatingDto) {
        try {
            const [_, access_token] = req.headers.authorization.split(' ');
            const jwtPayload = this.authService.jwtDecode(access_token);
            const user = await this.usersService.findById(jwtPayload["id"]);
            const rating = await this.ratingsService.findById(updateDto.id);
            if (rating.user_id !== user.id) {
                throw new CustomException({ error: MESSAGE.PermissionAccessingFailed, }, HttpStatus.FORBIDDEN);
            }
            const data = await this.ratingsService.update({
                ...updateDto,
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Delete("ratings/:id")
    async delete(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const [_, access_token] = req.headers.authorization.split(' ');
            const jwtPayload = this.authService.jwtDecode(access_token);
            const user = await this.usersService.findById(jwtPayload["id"]);
            const rating = await this.ratingsService.findById(Number(id));
            if (rating.user_id !== user.id) {
                throw new CustomException({ error: MESSAGE.PermissionAccessingFailed, }, HttpStatus.FORBIDDEN);
            }
            const data = await this.ratingsService.delete({
                id: parseInt(id),
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }

    /* superadmin */
    @UseGuards(AuthGuard)
    @Roles(Rating.ADMIN, Rating.GOD)
    @Get("superadmin/ratings/:id")
    async findByIdForSuperadmin(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const data = await this.ratingsService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }

    @UseGuards(AuthGuard)
    @Roles(Rating.ADMIN, Rating.GOD)
    @Get("superadmin/ratings")
    async findAllForSuperadmin(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: RatingQuery) {
        const q_museum_id = museum_id ? Number(museum_id) : undefined;
        const data_fixed = await this.ratingsService.findAll();
        const data_temp = await this.ratingsService.findAll(q_museum_id, {
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
    @Roles(Rating.ADMIN, Rating.GOD)
    @Post("superadmin/ratings")
    async createForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(createRatingSchemaForSuperadmin)) createDto: CreateRatingDto) {
        try {
            const data = await this.ratingsService.create({
                ...createDto,
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Rating.ADMIN, Rating.GOD)
    @Put("superadmin/ratings")
    async updateForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(updateRatingSchemaForSuperadmin)) updateDto: UpdateRatingDto) {
        try {
            const data = await this.ratingsService.update({
                ...updateDto,
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data, }));

        } catch (e) {
            throw e;
        }
    }
    @UseGuards(AuthGuard)
    @Roles(Rating.ADMIN, Rating.GOD)
    @Delete("superadmin/ratings/:id")
    async deleteManyForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const data = await this.ratingsService.delete({
                id: parseInt(id),
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }

}
