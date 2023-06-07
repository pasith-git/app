import { Injectable } from '@nestjs/common';
import { Status, PaymentWay } from '@prisma/client';
import { BookingsService } from 'bookings/bookings.service';
import { CreateBookingDto, DeleteBookingDto, UpdateBookingDto } from 'common/dtos/booking.dto';
import { CustomException } from 'common/exceptions/custom.exception';
import BookingQuery from 'common/querys/booking.query';
import ReportBookingQuery from 'common/querys/report.query';
import dayjsUtil from 'common/utils/dayjs.util';
import { ErrorCode } from 'common/utils/error-code.util';
import MESSAGE from 'common/utils/message.util';
import _ from 'lodash';
import { PricesService } from 'prices/prices.service';
import { PrismaService } from 'prisma/prisma.service';
import { ScheduleTimesService } from 'schedule-times/schedule-times.service';
import { UsersService } from 'users/users.service';

@Injectable()
export class ReportsService {
    constructor(private prisma: PrismaService) { }

    async findAllBookings(museum_id_query?: number, query?: ReportBookingQuery) {
        const schedule_time_str = query?.filter?.reserved_time?.split("-");
        const schedule_time = schedule_time_str?.length === 2 ? await this.prisma.scheduleTime.findFirst({
            where: {
                AND: [
                    {
                        start_time: {
                            equals: schedule_time_str && dayjsUtil(schedule_time_str?.[0], "HH:mm").utc(true).toDate(),
                        },
                        end_time: {
                            equals: schedule_time_str && dayjsUtil(schedule_time_str?.[1], "HH:mm").utc(true).toDate(),
                        },
                    }

                ]

            }
        }) : undefined;
        const data = await this.prisma.booking.findMany({
            where: {
                schedule_time_str: {
                    equals: schedule_time_str?.length === 2 ?
                        `${dayjsUtil(schedule_time?.start_time).utc().format("HH:mm")} - ${dayjsUtil(schedule_time?.end_time).utc().format("HH:mm")}`
                        : undefined,
                },
                /*  schedule_date: {
                     equals: query?.filter?.reserved_date && dayjsUtil(query?.filter?.reserved_date, "DD/MM/YYYY").utc(true).toDate(),
                 }, */

                way: {
                    equals: query?.filter?.way as PaymentWay,
                },

                museum_id: museum_id_query,
            },
            orderBy: {

            },
            include: {
                tickets: true,
            }
        });

        const result = data.filter(data => {
            const day = dayjsUtil(query?.filter?.reserved_date, "DD/MM/YYYY").date();
            const month = dayjsUtil(query?.filter?.reserved_date, "DD/MM/YYYY").month() + 1;
            const year = dayjsUtil(query?.filter?.reserved_date, "DD/MM/YYYY").year();
            const reserved_date_day = dayjsUtil(data.schedule_date).date();
            const reserved_date_month = dayjsUtil(data.schedule_date).month() + 1;
            const reserved_date_year = dayjsUtil(data.schedule_date).year();
            switch (query?.status) {
                case "month":
                    return month === reserved_date_month && year == reserved_date_year;
                case "year":
                    return year == reserved_date_year;
                case "day":
                    return day === reserved_date_day && month === reserved_date_month && year == reserved_date_year;
                default:
                    return true;
            }
        })
        const reserved_total = result.length;
        const total_people_reserved = result.reduce((prev, current) => prev + current.people_amount, 0);
        const received_total_without_discount = result.reduce((prev, current) => prev + Number(current.total), 0);
        const received_total_with_discount = result.reduce((prev, current) => prev + Number(current.total_with_discount), 0);
        const discount_amount = result.reduce((prev, current) => prev + Number(current.discount_amount), 0);
        const walkin_reserved_total = result.filter(data => data.way === "walkin").length;
        const booking_reserved_total = result.filter(data => data.way === "booking").length;
        const visited_total = result.reduce((prev, current) => {
            return prev + current.tickets.filter(ticket => ticket.is_checked_in).length;
        }, 0)
        return {
            reserved_date: {
                date: query?.filter?.reserved_date && dayjsUtil(query?.filter?.reserved_date, "DD/MM/YYYY").format("DD/MM/YYYY"),
                status: query?.status
            },
            reserved_total,
            ticket_total: total_people_reserved,
            received_total_without_discount,
            received_total_with_discount,
            discount_amount,
            walkin_reserved_total,
            booking_reserved_total,
            visited_total,
            unvisited_total: total_people_reserved - visited_total,
        };
    }
}
