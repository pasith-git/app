import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Roles } from 'common/decorators/role.decorator';
import Role from 'common/enums/role.enum';
import { AuthGuard } from 'common/guards/auth.guard';
import { MuseumIdGuard } from 'common/guards/museumId.guard';
import ScheduleTimeQuery from 'common/querys/schedule-time.query';
import { PrismaService } from 'prisma/prisma.service';
import { ScheduleTimesService } from './schedule-times.service';
import { Request, Response, Express } from 'express';
import responseUtil from 'common/utils/response.util';
import { JoiValidationPipe } from 'common/pipes/joi-validation.pipe';
import { createScheduleTimeschema, createScheduleTimeschemaForSuperadmin, deleteScheduleTimeSchema, deleteScheduleTimeSchemaForSuperadmin, updateScheduleTimeschema, updateScheduleTimeschemaForSuperadmin } from 'common/schemas/schedule-time.schema';
import { CreateScheduleTimeDto, DeleteScheduleTimeDto, UpdateScheduleTimeDto } from 'common/dtos/schedule-time.dto';
import { AuthService } from 'auth/auth.service';
import { UsersService } from 'users/users.service';
import MESSAGE from 'common/utils/message.util';
import dayjsUtil from 'common/utils/dayjs.util';
import { ErrorCode } from 'common/utils/error-code.util';
import { CustomException } from 'common/exceptions/custom.exception';
import { checkTimeStartAndEnd, checkTimeStartOrEnd } from 'common/utils/datetime.util';

const PREFIX = "schedule-times";

@Controller('')
export class ScheduleTimesController {
    constructor(private prisma: PrismaService, private scheduleTimesService: ScheduleTimesService,
        private authService: AuthService, private usersService: UsersService) { }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.AGENT, Role.GOD, Role.OWNER, Role.CASHIER)
    @Get("admin/schedule-times/:id")
    async findById(@Req() req: Request, @Res() res: Response, @Param("id") id: string, @Query() {filter}: {filter: {booking_date?: string}}) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = this.authService.jwtVerify(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const data = await this.scheduleTimesService.findById(Number(id), filter?.booking_date);
        return res.json(responseUtil({
            req,
            body: user.museum_id === data.museum_id ? data : {},
        }))
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.AGENT, Role.GOD, Role.OWNER, Role.CASHIER)
    @Get("admin/schedule-times")
    async findAllByMuseumId(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: ScheduleTimeQuery) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = this.authService.jwtVerify(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const data_fixed = await this.scheduleTimesService.findAll(user.museum_id);
        const data_temp = await this.scheduleTimesService.findAll(user.museum_id, {
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
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Post("admin/schedule-times")
    async create(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(createScheduleTimeschema)) createDto: CreateScheduleTimeDto) {
        try {
            const [_, access_token] = req.headers.authorization?.split(' ');
            const jwtPayload = this.authService.jwtVerify(access_token);
            const user = await this.usersService.findById(jwtPayload["id"]);

            const data = await this.scheduleTimesService.create({
                ...createDto,
                museum_id: user.museum_id,
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Put("admin/schedule-times")
    async update(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(updateScheduleTimeschema)) updateDto: UpdateScheduleTimeDto) {
        try {

            const data = await this.scheduleTimesService.update({
                ...updateDto,
            })

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Delete("admin/schedule-times/:id")
    async delete(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const data = await this.scheduleTimesService.delete({
                id: parseInt(id),
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }


    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Get("superadmin/schedule-times/:id")
    async findByIdForSuperadmin(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const data = await this.scheduleTimesService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Get("superadmin/schedule-times")
    async findAllForSuperadmin(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: ScheduleTimeQuery) {
        /* const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = this.authService.jwtVerify(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]); */
        const q_museum_id = museum_id ? Number(museum_id) : undefined;
        const data_fixed = await this.scheduleTimesService.findAll();
        const data_temp = await this.scheduleTimesService.findAll(q_museum_id, {
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
    @Post("superadmin/schedule-times")
    async createForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(createScheduleTimeschemaForSuperadmin)) createDto: CreateScheduleTimeDto) {
        try {
            /* const [_, access_token] = req.headers.authorization?.split(' ');
            const jwtPayload = this.authService.jwtVerify(access_token);
            const user = await this.usersService.findById(jwtPayload["id"]); */
            const data = await this.scheduleTimesService.create({
                ...createDto,
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Put("superadmin/schedule-times")
    async updateForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(updateScheduleTimeschemaForSuperadmin)) updateDto: UpdateScheduleTimeDto) {
        try {


            const data = await this.scheduleTimesService.update({
                ...updateDto,
            })

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Delete("superadmin/schedule-times/:id")
    async deleteForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const data = await this.scheduleTimesService.delete({
                id: parseInt(id),
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }
}
