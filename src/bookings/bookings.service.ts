import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import { CreateBookingDto, DeleteBookingDto, UpdateBookingDto } from 'common/dtos/booking.dto';
import { CustomException } from 'common/exceptions/custom.exception';
import BookingQuery from 'common/querys/booking.query';
import dayjsUtil from 'common/utils/dayjs.util';
import { ErrorCode } from 'common/utils/error-code.util';
import MESSAGE from 'common/utils/message.util';
import _ from 'lodash';
import { PricesService } from 'prices/prices.service';
import { PrismaService } from 'prisma/prisma.service';
import { ScheduleTimesService } from 'schedule-times/schedule-times.service';
import { UsersService } from 'users/users.service';

@Injectable()
export class BookingsService {
    constructor(private prisma: PrismaService, private scheduleTimesService: ScheduleTimesService,
        private usersService: UsersService, private pricesService: PricesService) { }

    async findAll(museum_id_query?: number, query?: BookingQuery) {
        const data = await this.prisma.booking.findMany({
            where: {
                schedule_time_str: {
                    equals: query?.filter?.schedule_time_str,
                },
                schedule_date: {
                    equals: query?.filter?.schedule_date && dayjsUtil(query?.filter?.schedule_date, "DD/MM/YYYY").utc(true).toDate(),
                },
                status: {
                    equals: query?.filter?.status as Status,
                },
                discount_amount: {
                    equals: query?.filter?.discount_amount,
                },
                created_at: {
                    gte: query?.filter?.created_at?.start_date && dayjsUtil(query?.filter?.created_at?.start_date, "DD/MM/YYYY HH:mm:ss").toDate(),
                    lt: query?.filter?.created_at?.end_date && dayjsUtil(query?.filter?.created_at?.end_date, "DD/MM/YYYY HH:mm:ss").toDate(),
                },
                updated_at: {
                    gte: query?.filter?.updated_at?.start_date && dayjsUtil(query?.filter?.updated_at?.start_date, "DD/MM/YYYY HH:mm:ss").toDate(),
                    lt: query?.filter?.updated_at?.end_date && dayjsUtil(query?.filter?.updated_at?.end_date, "DD/MM/YYYY HH:mm:ss").toDate(),
                },
                museum_id: museum_id_query,
            },
            orderBy: {
                ...(query?.sort?.schedule_time_str && {
                    schedule_time_str: query.sort.schedule_time_str
                }),
                ...(query?.sort?.schedule_date && {
                    schedule_date: query.sort.schedule_date
                }),
                ...(query?.sort?.user_active && {
                    user_active: query.sort.user_active
                }),
                ...(query?.sort?.discount_amount && {
                    discount_amount: query.sort.discount_amount
                }),
                ...(query?.sort?.created_at && {
                    created_at: query.sort.created_at
                }),
                ...(query?.sort?.updated_at && {
                    updated_at: query.sort.updated_at
                }),
            },
            ...(query?.limit && {
                take: parseInt(query.limit),
            }),
            ...(query?.offset && {
                skip: parseInt(query.offset),
            }),
            include: {
                museum: true,
                tickets: true,
            }
        });
        return data.map(data => {
            return {
                ...data,
                schedule_date: dayjsUtil(data.schedule_date).format("DD/MM/YYYY"),
                child_price: (Number(data.child_total) / data.number_of_child) || 0,
                adult_price: (Number(data.adult_total) / data.number_of_adult) || 0,
            }
        })
    }

    async findById(id: number) {
        const data = await this.prisma.booking.findFirstOrThrow({
            where: {
                id
            },
            include: {
                museum: true,
                tickets: true,
            }
        })
        return {
            ...data,
            schedule_date: dayjsUtil(data.schedule_date).format("DD/MM/YYYY"),
            child_price: (Number(data.child_total) / data.number_of_child) || 0,
            adult_price: (Number(data.adult_total) / data.number_of_adult) || 0,
        }
    }

    async create({ museum_id, schedule_time_id, user_amount, people, user_id, ...createDto }: CreateBookingDto) {
        const schedule = await this.scheduleTimesService.findById(schedule_time_id);
        const schedule_time_str = `${dayjsUtil(schedule.start_time).utc().format("HH:mm")} - ${dayjsUtil(schedule.end_time).utc().format("HH:mm")}`;
        const bookings = await this.findAll(undefined, {
            filter: {
                schedule_time_str,
                schedule_date: createDto.schedule_date,
            }
        });

        const all_of_booking_amount = bookings.reduce((prev, current) => prev + current.people_amount, 0);

        const start_time_by_hour = dayjsUtil(schedule.start_time).utc().hour();
        const start_time_by_minute = dayjsUtil(schedule.start_time).utc().minute();
        const end_time_by_hour = dayjsUtil(schedule.end_time).utc().hour();
        const end_time_by_minute = dayjsUtil(schedule.end_time).utc().minute();
        const current_date = dayjsUtil();
        const start_date = dayjsUtil(createDto.schedule_date, "DD/MM/YYYY").set("h", start_time_by_hour).set("m", start_time_by_minute);
        const end_date = dayjsUtil(createDto.schedule_date, "DD/MM/YYYY").set("h", end_time_by_hour).set("m", end_time_by_minute);

        if (!(end_date.isSameOrAfter(current_date))) {
            throw new CustomException({ error: MESSAGE.datetime.expired, code: ErrorCode.bookingEx });
        }
        const user = await this.usersService.findById(user_id);
        const is_foreigner = user ? user.country.name.toLowerCase() !== "laos" ? true : false : createDto.is_foreigner;

        const people_booking = (await Promise.all(_.uniqBy(people, "age_group").map(async (data) => {
            const price = await this.pricesService.findPriceForBooking(createDto.is_foreigner);
            if (price) {
                return {
                    amount: data.amount,
                    age_group: data.age_group,
                    price: data.age_group === "adult" ? price.adult_price : price.child_price,
                }
            }
        }))).filter(data => data !== undefined);

        if (people.length !== people_booking.length) {
            throw new CustomException({ error: `Please create the price data before proceeding` });
        }

        const total = people_booking.reduce((prev, current) => prev + (current.amount * Number(current.price)), 0);
        const adult_total = people_booking.filter(data => data.age_group === "adult").reduce((prev, current) => prev + (current.amount * Number(current.price)), 0);
        const number_of_adult = people_booking.filter(data => data.age_group === "adult").reduce((prev, current) => prev + current.amount, 0);
        const child_total = people_booking.filter(data => data.age_group === "child").reduce((prev, current) => prev + (current.amount * Number(current.price)), 0);
        const number_of_child = people_booking.filter(data => data.age_group === "child").reduce((prev, current) => prev + current.amount, 0);
        let discount_total = createDto.discount_type === "money" ? createDto.discount_amount : total * Number(createDto.discount_amount) / 100;
        let total_with_discount = total - (Number(discount_total) || 0);

        if (createDto.total_pay && createDto.total_pay < total_with_discount) {
            throw new CustomException({ error: `The amount paid is not enough for ${total_with_discount}` });
        }

        if ((all_of_booking_amount + number_of_adult + number_of_child) > schedule.capacity_limit) {
            throw new CustomException({ error: `The museum schedule is full` });
        }

        return this.prisma.booking.create({
            data: {
                ...createDto,
                schedule_time: {
                    connect: {
                        id: schedule_time_id,
                    }
                },
                total,
                total_with_discount,
                child_total,
                adult_total,
                number_of_adult,
                number_of_child,
                people_amount: number_of_adult + number_of_child,
                ...(createDto.status === "success" && {
                    paid_at: dayjsUtil().toDate(),
                }),
                booked_at: dayjsUtil().toDate(),
                ...(createDto.discount_type && {
                    discount_type: createDto.discount_type,
                    discount_amount: createDto.discount_amount,
                }),
                ...(createDto.total_pay && {
                    total_pay: createDto.total_pay,
                    total_charge: createDto.total_pay - Number(total_with_discount),
                }),
                schedule_time_str: schedule && schedule_time_str,
                schedule_date: dayjsUtil(createDto.schedule_date, "DD/MM/YYYY").utc(true).toDate(),
                museum: {
                    connect: {
                        id: museum_id,
                    }
                },
                ...(user_id && {
                    user: {
                        connect: {
                            id: user_id,
                        }
                    },
                })

            },
            include: {
                museum: true,
                tickets: true,
            }
        })
    }

    async update({ id, schedule_time_id, user_amount, museum_id, user_id, ...updateDto }: UpdateBookingDto) {
        /* const schedule = await this.scheduleTimesService.findById(schedule_time_id);
        if (updateDto.schedule_date && schedule_time_id) {
            const start_time_by_hour = dayjsUtil(schedule.start_time).utc().hour();
            const start_time_by_minute = dayjsUtil(schedule.start_time).utc().minute();
            const end_time_by_hour = dayjsUtil(schedule.end_time).utc().hour();
            const end_time_by_minute = dayjsUtil(schedule.end_time).utc().minute();
            const current_date = dayjsUtil();
            const start_date = dayjsUtil(updateDto.schedule_date, "DD/MM/YYYY").set("h", start_time_by_hour).set("m", start_time_by_minute);
            const end_date = dayjsUtil(updateDto.schedule_date, "DD/MM/YYYY").set("h", end_time_by_hour).set("m", end_time_by_minute);
            if (!(start_date.isSameOrAfter(current_date) && start_date.isBefore(end_date))) {
                throw new CustomException({ error: MESSAGE.datetime.error, code: ErrorCode.invalidDate });
            }
        } else if (updateDto.schedule_date) {
            const [start_time, end_time] = booking.schedule_time_str.split("-");
            const start_time_by_hour = dayjsUtil(start_time, "HH:mm").utc().hour();
            const start_time_by_minute = dayjsUtil(start_time, "HH:mm").utc().minute();
            const end_time_by_hour = dayjsUtil(end_time, "HH:mm").utc().hour();
            const end_time_by_minute = dayjsUtil(end_time, "HH:mm").utc().minute();
            const current_date = dayjsUtil();
            const start_date = dayjsUtil(updateDto.schedule_date, "DD/MM/YYYY").set("h", start_time_by_hour).set("m", start_time_by_minute);
            const end_date = dayjsUtil(updateDto.schedule_date, "DD/MM/YYYY").set("h", end_time_by_hour).set("m", end_time_by_minute);
            if (!(start_date.isSameOrAfter(current_date) && start_date.isBefore(end_date))) {
                throw new CustomException({ error: MESSAGE.datetime.error, code: ErrorCode.invalidDate });
            }
        } */
        return this.prisma.booking.update({
            where: {
                id,
            },
            data: {
                /* ...(user_amount && {
                    user_active: {
                        increment: user_amount,
                    },
                }), */
                ...updateDto,
                ...(updateDto.status === "success" && {
                    paid_at: dayjsUtil().toDate(),
                }),
                /* ...(schedule_time_id && {
                    schedule_time: {
                        connect: {
                            id: schedule_time_id,
                        }
                    },
                }),
                ...(museum_id && {
                    museum: {
                        connect: {
                            id: museum_id,
                        }
                    },
                }), */
                /* schedule_time_str: schedule && `${dayjsUtil(schedule.start_time).utc().format("HH:mm")} - ${dayjsUtil(schedule.end_time).utc().format("HH:mm")}`,
                schedule_date: updateDto.schedule_date && dayjsUtil(updateDto.schedule_date, "DD/MM/YYYY").utc(true).toDate(), */
                ...(user_id && {
                    user: {
                        connect: {
                            id: user_id,
                        }
                    },
                }),
            },
            include: {
                museum: true,
                tickets: true,
            }
        })

    }

    async delete({ id }: DeleteBookingDto) {
        return this.prisma.booking.delete({
            where: {
                id,
            },
            include: {
                museum: true,
                tickets: true,
            }
        });
    }

}
