import { Get, Req, Res, Controller, HttpStatus, Post, Body, UseInterceptors, UploadedFiles, Put, UploadedFile, Query, Param, UseGuards, Delete } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AuthService } from 'auth/auth.service';
import { Roles } from 'common/decorators/role.decorator';
import { CreateCountryDto, DeleteCountryDto, UpdateCountryDto } from 'common/dtos/country.dto';
import { CreateBookingDto, DeleteBookingDto, UpdateBookingDto } from 'common/dtos/booking.dto';
import Role from 'common/enums/role.enum';
import { AuthGuard } from 'common/guards/auth.guard';
import { MuseumIdGuard } from 'common/guards/museumId.guard';
import { FilesValidationPipe, FileValidationPipe } from 'common/pipes/file-validation.pipe';
import { JoiValidationPipe } from 'common/pipes/joi-validation.pipe';
import BookingQuery from 'common/querys/booking.query';
import { createBookingSchema, deleteBookingSchema, deleteBookingSchemaForSuperadmin, updateBookingSchema, createBookingSchemaForSuperadmin, updateBookingSchemaForSuperadmin } from 'common/schemas/booking.schema';
import { createfileGenerator, deleteFileGenerator, updatefileGenerator } from 'common/utils/image-processor.util';
import MESSAGE from 'common/utils/message.util';
import responseUtil from 'common/utils/response.util';
import { Request, Response, Express } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from 'users/users.service';

import { BookingsService } from './bookings.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import dayjsUtil from 'common/utils/dayjs.util';
import { PricesService } from 'prices/prices.service';
import { TicketsService } from 'tickets/tickets.service';

const PREFIX = 'bookings';

@Controller('')
export class BookingsController {
    constructor(private prisma: PrismaService, private bookingsService: BookingsService,
        private authService: AuthService, private usersService: UsersService, private pricesService: PricesService, private ticketsService: TicketsService) { }

    @Get("my-bookings")
    async findAll(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: BookingQuery) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = await this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const q_museum_id = museum_id ? Number(museum_id) : undefined;
        const data_fixed = await this.bookingsService.findAll(q_museum_id);
        const data_temp = await this.bookingsService.findAll(q_museum_id, {
            filter: {
                ...filter,
                user_id: user.id.toString(),
            },
            ...query,
        });
        res.append('X-Total-Count-Fixed', data_fixed.length.toString());
        res.append('X-Total-Count-Temp', data_temp.length.toString());
        return res.json(responseUtil({
            req,
            body: data_temp,
        }))
    }

    /*  @Get("bookings")
     async findAll(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: BookingQuery) {
         const [_, access_token] = req.headers.authorization?.split(' ');
         const jwtPayload = await this.authService.jwtDecode(access_token);
         const user = await this.usersService.findById(jwtPayload["id"]);
         const q_museum_id = museum_id ? Number(museum_id) : undefined;
         const data_fixed = await this.bookingsService.findAll(q_museum_id);
         const data_temp = await this.bookingsService.findAll(q_museum_id, {
             filter,
             ...query,
         });
         res.append('X-Total-Count-Fixed', data_fixed.length.toString());
         res.append('X-Total-Count-Temp', data_temp.length.toString());
         return res.json(responseUtil({
             req,
             body: data_temp,
         }))
     } */

    @Get("bookings/:id")
    async findById(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const data = await this.bookingsService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.AGENT, Role.GOD, Role.OWNER, Role.CASHIER)
    @Get("admin/bookings")
    async findAllByMuseumId(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: BookingQuery) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = this.authService.jwtVerify(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const data_fixed = await this.bookingsService.findAll(user.museum_id);
        const data_temp = await this.bookingsService.findAll(user.museum_id, {
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
    @Get("admin/bookings/:id")
    async findByIdForAdmin(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = this.authService.jwtVerify(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const data = await this.bookingsService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: user.museum_id === data.museum_id ? data : {},
        }))
    }


    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER, Role.CASHIER)
    @Post("admin/bookings")
    async create(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(createBookingSchema)) createDto: CreateBookingDto) {
        try {
            const [_, access_token] = req.headers.authorization?.split(' ');
            const jwtPayload = this.authService.jwtVerify(access_token);
            const user = await this.usersService.findById(jwtPayload["id"]);
            /* const dataTransactions = await this.prisma.$transaction(async (tx) => {
                return await Promise.all(createDto.booking_details.map(async (createNestedtDto, i) => {
                    const createFile = createfileGenerator(booking_image_paths?.[i], PREFIX, PREFIX);
                    return {
                        data: createNestedtDto,
                        createFile: createFile?.generate(),
                    }
                }))
            }); */

            const createData = await this.bookingsService.create({
                ...createDto,
                museum_id: user.museum_id,
                user_id: user.id,
            });
            
            await Promise.all([...Array(createData.number_of_adult + createData.number_of_child).keys()].map(async () => {
                await this.ticketsService.create({
                    booking_id: createData.id,
                });
            }));

            const data = await this.bookingsService.findById(createData.id);

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER, Role.CASHIER)
    @Put("admin/bookings")
    async update(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(updateBookingSchema)) updateDto: UpdateBookingDto,) {
        try {
            const data = await this.bookingsService.update({
                ...updateDto,
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data }));

        } catch (e) {
            throw e;
        }

    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Delete("admin/bookings/:id")
    async delete(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const dataById = await this.bookingsService.findById(parseInt(id));
            const data = await this.bookingsService.delete({
                id: dataById.id,
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER, Role.CASHIER)
    @Delete("admin/bookings/:id")
    async deleteForAdmin(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const dataById = await this.bookingsService.findById(parseInt(id));
            const data = await this.bookingsService.delete({
                id: dataById.id,
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Get("superadmin/bookings/:id")
    async findByIdForSuperadmin(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        const data = await this.bookingsService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }


    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Get("superadmin/bookings")
    async findAllForSuperadmin(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: BookingQuery) {
        const q_museum_id = museum_id ? Number(museum_id) : undefined;
        const data_fixed = await this.bookingsService.findAll();
        const data_temp = await this.bookingsService.findAll(q_museum_id, {
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
    @Post("superadmin/bookings")
    async createManyForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(createBookingSchemaForSuperadmin)) createDto: CreateBookingDto,) {
        try {
            const createData = await this.bookingsService.create({
                ...createDto,
            });
            
            await Promise.all([...Array(createData.number_of_adult + createData.number_of_child).keys()].map(async () => {
                await this.ticketsService.create({
                    booking_id: createData.id,
                });
            }));

            const data = await this.bookingsService.findById(createData.id);

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Put("superadmin/bookings")
    async updateManyForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(updateBookingSchemaForSuperadmin)) updateDto: UpdateBookingDto) {
        try {
            const data = await this.bookingsService.update({
                ...updateDto,
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data }));

        } catch (e) {
            throw e;
        }

    }



    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Delete("superadmin/bookings/:id")
    async deleteForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const dataById = await this.bookingsService.findById(parseInt(id));
            const data = await this.bookingsService.delete({
                id: dataById.id,
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }


    /* @Cron(CronExpression.EVERY_MINUTE)
    async autoUpdate() {
        const bookings = await this.bookingsService.findAll();
        const current_date = dayjsUtil();
        if (bookings.length > 0) {
            for (let i = 0; i < bookings.length; i++) {
                if (bookings[i]?.status != "completed") {
                    const [start_time, end_time] = bookings[i].schedule_time.split("-");
                    const start_time_by_hour = dayjsUtil(start_time).utc().hour();
                    const start_time_by_minute = dayjsUtil(start_time).utc().minute();
                    const end_time_by_hour = dayjsUtil(end_time).utc().hour();
                    const end_time_by_minute = dayjsUtil(end_time).utc().minute();
                    const start_date = dayjsUtil(dayjsUtil(bookings[i]?.schedule_date).utc(true).hour(0).minute(0).second(0).millisecond(0)).set("h", start_time_by_hour).set("m", start_time_by_minute);
                    const end_date = dayjsUtil(dayjsUtil(bookings[i]?.schedule_date).utc(true).hour(0).minute(0).second(0).millisecond(0)).set("h", end_time_by_hour).set("m", end_time_by_minute);
                    if (current_date.isSameOrBefore(start_date)) {
                        await this.bookingsService.update({
                            id: bookings[i]?.id,
                            status: "active"
                        });
                    }
                    if (current_date.isSameOrBefore(end_date)) {
                        await this.bookingsService.update({
                            id: bookings[i]?.id,
                            status: "completed",
                        });
                    }
                }

            }
        }


    } */

}
