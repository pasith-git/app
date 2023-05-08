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
import { createBookingSchema, deleteBookingSchema, deleteBookingSchemaForSuperadmin, updateBookingSchema, createBookingSchemaForSuperadmin, updateBookingSchemaForSuperadmin } from 'common/schemas/booking.schema';
import { createfileGenerator, deleteFileGenerator, updatefileGenerator } from 'common/utils/image-processor.util';
import MESSAGE from 'common/utils/message.util';
import responseUtil from 'common/utils/response.util';
import { Request, Response, Express } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from 'users/users.service';

import { Cron, CronExpression } from '@nestjs/schedule';
import dayjsUtil from 'common/utils/dayjs.util';
import { PricesService } from 'prices/prices.service';
import { TicketsService } from 'tickets/tickets.service';
import ReportBookingQuery from 'common/querys/report.query';
import { ReportsService } from './reports.service';


@Controller('')
export class ReportsController {
    constructor(private prisma: PrismaService, private reportsService: ReportsService,
        private authService: AuthService, private usersService: UsersService) { }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.AGENT, Role.GOD, Role.OWNER, Role.CASHIER)
    @Get("admin/reports/bookings")
    async findAll(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: ReportBookingQuery) {
        const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = await this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        /* const data_fixed = await this.reportsService.findAllBookings(user.museum_id); */
        const data_temp = await this.reportsService.findAllBookings(user.museum_id, {
            filter: {
                ...filter,
            },
            ...query,
        });
        /* res.append('X-Total-Count-Fixed', data_fixed.length.toString());
        res.append('X-Total-Count-Temp', data_temp.length.toString()); */
        return res.json(responseUtil({
            req,
            body: data_temp,
        }))
    }

}
