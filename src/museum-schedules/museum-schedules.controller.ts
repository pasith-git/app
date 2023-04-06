import { Get, Req, Res, Controller, HttpStatus, Post, Body, Put, UseGuards, Query, Param, Delete } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CronExpression } from '@nestjs/schedule/dist';
import { ConnectedSocket } from '@nestjs/websockets';
import { AuthService } from 'auth/auth.service';
import { CreateMuseumScheduleDto, DeleteMuseumScheduleDto, UpdateMuseumScheduleDto } from 'common/dtos/museum-schedule.dto';
import { CustomException } from 'common/exceptions/custom.exception';
import { AuthGuard } from 'common/guards/auth.guard';
import { MuseumIdGuard } from 'common/guards/museumId.guard';
import { JoiValidationPipe } from 'common/pipes/joi-validation.pipe';
import MuseumScheduleQuery from 'common/querys/museum-schedule.query';
import { createMuseumScheduleschema, deleteMuseumScheduleSchema, updateMuseumScheduleschema } from 'common/schemas/museum-schedule.schema';
import dayjsUtil from 'common/utils/dayjs.util';
import MESSAGE from 'common/utils/message.util';
import responseUtil from 'common/utils/response.util';
import { Request, Response, Express } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from 'users/users.service';
import { MuseumSchedulesService } from './museum-schedules.service';
import { Socket, Server } from 'socket.io';
import { EventsGateway } from 'gateway/events.gateway';
import { Roles } from 'common/decorators/role.decorator';
import Role from 'common/enums/role.enum';
import { ScheduleTimesService } from 'schedule-times/schedule-times.service';
import { ErrorCode } from 'common/utils/error-code.util';

const PREFIX = "museum-schedules";

@Controller('')
export class MuseumSchedulesController {
    constructor(private prisma: PrismaService, private museumSchedulesService: MuseumSchedulesService, private authService: AuthService,
        private usersService: UsersService, private eventsGateway: EventsGateway, private scheduleTimesService: ScheduleTimesService) { }


    @Get("museum-schedules")
    async findAll(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: MuseumScheduleQuery) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = await this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const q_museum_id = museum_id ? Number(museum_id) : undefined;
        const data_fixed = await this.museumSchedulesService.findAll(q_museum_id);
        const data_temp = await this.museumSchedulesService.findAll(q_museum_id, {
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

    @Get("museum-schedules/:id")
    async findByIdUU(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const data = await this.museumSchedulesService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.GUIDE, Role.SUPERADMIN, Role.OWNER)
    @Get("admin/museum-schedules/:id")
    async findById(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = this.authService.jwtVerify(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const data = await this.scheduleTimesService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: user.museum_id === data.museum_id ? data : {},
        }))
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.GUIDE, Role.SUPERADMIN, Role.OWNER)
    @Get("admin/museum-schedules")
    async findAllByMuseumId(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: MuseumScheduleQuery) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = this.authService.jwtVerify(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const data_fixed = await this.museumSchedulesService.findAll(user.museum_id);
        const data_temp = await this.museumSchedulesService.findAll(user.museum_id, {
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
    @Post("admin/museum-schedules")
    async create(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(createMuseumScheduleschema)) createDto: CreateMuseumScheduleDto) {
        try {
            const [_, access_token] = req.headers.authorization?.split(' ');
            const jwtPayload = this.authService.jwtVerify(access_token);
            const user = await this.usersService.findById(jwtPayload["id"]);
            const schedule_time = await this.scheduleTimesService.findById(createDto.schedule_time_id);
            const start_time_by_hour = dayjsUtil(schedule_time.start_time).hour();
            const start_time_by_minute = dayjsUtil(schedule_time.start_time).minute();
            const end_time_by_hour = dayjsUtil(schedule_time.end_time).hour();
            const end_time_by_minute = dayjsUtil(schedule_time.end_time).minute();
            const current_date = dayjsUtil();
            const start_date = dayjsUtil(createDto.start_date).set("h", start_time_by_hour).set("m", start_time_by_minute);
            const end_date = dayjsUtil(createDto.start_date).set("h", end_time_by_hour).set("m", end_time_by_minute);
            if (!(start_date.isSameOrAfter(current_date) && start_date.isBefore(end_date))) {
                throw new CustomException({ error: "The start_date must be after today", code: ErrorCode.invalidDate });
            }
            const data = await this.museumSchedulesService.create({
                ...createDto,
                ...(createDto.discount && {
                    discount: createDto.discount > 100 ? 100 : createDto.discount,
                }),
                user_limit_status: "available",
                current_users: 0,
                museum_id: user.museum_id,
                start_date: dayjsUtil(createDto.start_date).toDate(),
            });


            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.SUPERADMIN, Role.OWNER)
    @Put("admin/museum-schedules")
    async update(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(updateMuseumScheduleschema)) updateDto: UpdateMuseumScheduleDto) {
        try {
            const museum_schedule = await this.museumSchedulesService.findById(updateDto.id);

            if (museum_schedule.current_users !== 0) {
                throw new CustomException({ error: "It's in action, can't update", code: ErrorCode.raUpdate });
            }

            if (updateDto.start_date && updateDto.schedule_time_id) {
                const schedule_time = await this.scheduleTimesService.findById(updateDto.schedule_time_id);
                const start_time_by_hour = dayjsUtil(schedule_time.start_time).hour();
                const start_time_by_minute = dayjsUtil(schedule_time.start_time).minute();
                const end_time_by_hour = dayjsUtil(schedule_time.end_time).hour();
                const end_time_by_minute = dayjsUtil(schedule_time.end_time).minute();
                const current_date = dayjsUtil();
                const start_date = dayjsUtil(updateDto.start_date).set("h", start_time_by_hour).set("m", start_time_by_minute);
                const end_date = dayjsUtil(updateDto.start_date).set("h", end_time_by_hour).set("m", end_time_by_minute);
                if (!(start_date.isSameOrAfter(current_date) && start_date.isBefore(end_date))) {
                    throw new CustomException({ error: MESSAGE.datetime.error, code: ErrorCode.invalidDate });
                }
            } else if (updateDto.start_date) {
                const schedule_time = await this.scheduleTimesService.findById(museum_schedule.schedule_time_id);
                const start_time_by_hour = dayjsUtil(schedule_time.start_time).hour();
                const start_time_by_minute = dayjsUtil(schedule_time.start_time).minute();
                const end_time_by_hour = dayjsUtil(schedule_time.end_time).hour();
                const end_time_by_minute = dayjsUtil(schedule_time.end_time).minute();
                const current_date = dayjsUtil();
                const start_date = dayjsUtil(updateDto.start_date).set("h", start_time_by_hour).set("m", start_time_by_minute);
                const end_date = dayjsUtil(updateDto.start_date).set("h", end_time_by_hour).set("m", end_time_by_minute);
                if (!(start_date.isSameOrAfter(current_date) && start_date.isBefore(end_date))) {
                    throw new CustomException({ error: MESSAGE.datetime.error, code: ErrorCode.invalidDate });
                }
            }

            const data = await this.museumSchedulesService.update({
                ...updateDto,
                ...(updateDto.start_date && {
                    start_date: dayjsUtil(updateDto.start_date).toDate()
                }),
                ...(updateDto.discount && {
                    discount: updateDto.discount > 100 ? 100 : updateDto.discount,
                }),
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.SUPERADMIN, Role.OWNER)
    @Delete("admin/museum-schedules/delete/:id")
    async delete(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const data = await this.museumSchedulesService.delete({
                id: parseInt(id),
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }


    @Cron(CronExpression.EVERY_MINUTE)
    async autoUpdate() {
        const museum_schedules = await this.museumSchedulesService.findAll();
        const current_date = dayjsUtil();
        if (museum_schedules.length > 0) {
            for (let i = 0; i < museum_schedules.length; i++) {
                if (museum_schedules[i]?.status !== "ended") {
                    const schedule_time = await this.scheduleTimesService.findById(museum_schedules[i]?.schedule_time_id);
                    const start_time_by_hour = dayjsUtil(schedule_time.start_time).hour();
                    const start_time_by_minute = dayjsUtil(schedule_time.start_time).minute();
                    const end_time_by_hour = dayjsUtil(schedule_time.end_time).hour();
                    const end_time_by_minute = dayjsUtil(schedule_time.end_time).minute();
                    const start_date = dayjsUtil(dayjsUtil(museum_schedules[i]?.start_date).utc(true).hour(0).minute(0).second(0).millisecond(0)).set("h", start_time_by_hour).set("m", start_time_by_minute);
                    const end_date = dayjsUtil(dayjsUtil(museum_schedules[i]?.start_date).utc(true).hour(0).minute(0).second(0).millisecond(0)).set("h", end_time_by_hour).set("m", end_time_by_minute);
                    if (current_date.isSameOrBefore(start_date)) {
                        await this.museumSchedulesService.update({
                            id: museum_schedules[i]?.id,
                            status: "active"
                        });
                        this.eventsGateway.server.emit("auto-update-museum-schedules");
                    }
                    if (current_date.isSameOrBefore(end_date)) {
                        await this.museumSchedulesService.update({
                            id: museum_schedules[i]?.id,
                            status: "ended",
                        });
                        this.eventsGateway.server.emit("auto-update-museum-schedules");
                    }
                }

            }
        }


    }

}
