import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateScheduleTimeDto, DeleteScheduleTimeDto, UpdateScheduleTimeDto } from 'common/dtos/schedule-time.dto';
import ScheduleTimeQuery from 'common/querys/schedule-time.query';
import dayjsUtil from 'common/utils/dayjs.util';
import { checkTimeStartAndEnd, checkTimeStartOrEnd } from 'common/utils/datetime.util';
import { BookingsService } from 'bookings/bookings.service';

@Injectable()
export class ScheduleTimesService {
    constructor(private prisma: PrismaService) { }
    async findAll(museum_id_query?: number, query?: ScheduleTimeQuery) {
        return this.prisma.scheduleTime.findMany({
            where: {
                title: {
                    contains: query?.filter.title,
                },
                start_time: {
                    equals: query?.filter?.start_time && dayjsUtil(new Date(0))
                        .hour(dayjsUtil(query?.filter?.start_time, "HH:mm").hour())
                        .minute(dayjsUtil(query?.filter?.start_time, "HH:mm").minute()).utc(true).second(0).millisecond(0).toDate(),
                },
                end_time: {
                    equals: query?.filter?.end_time && dayjsUtil(new Date(0))
                        .hour(dayjsUtil(query?.filter?.end_time, "HH:mm").hour())
                        .minute(dayjsUtil(query?.filter?.end_time, "HH:mm").minute()).utc(true).second(0).millisecond(0).toDate(),
                },
                museum_id: {
                    equals: museum_id_query,
                },
                capacity_limit: {
                    equals: query?.filter?.capacity_limit && parseInt(query?.filter?.capacity_limit)
                }


            },
            orderBy: {
                ...(query?.sort?.title && {
                    title: query?.sort?.title
                }),
                ...(query?.sort?.capacity_limit && {
                    capacity_limit: query?.sort?.capacity_limit
                }),
                ...(query?.sort?.start_time && {
                    price: query?.sort?.start_time
                }),
                ...(query?.sort?.end_time && {
                    discount: query?.sort?.end_time
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
                museum_schedules: true,
            }
        })
    }

    async findById(id: number, booking_date?: string) {


        const schedule_time = await this.prisma.scheduleTime.findFirst({
            where: {
                id
            },
            include: {
                museum: true,
                museum_schedules: true,
            }
        })
        const bookings = await this.prisma.booking.findMany({
            where: {
                schedule_time_str: `${dayjsUtil(schedule_time.start_time).utc().format("HH:mm")} - ${dayjsUtil(schedule_time.end_time).utc().format("HH:mm")}`,
                schedule_date: booking_date && dayjsUtil(booking_date, "DD/MM/YYYY").utc(true).toDate()
            }
        });

        const booked_count = bookings.reduce((prev, current) => prev + current.people_amount, 0);

        return {
            ...schedule_time,
            ...(booking_date && {
                total_capacity: schedule_time.capacity_limit,
                booked_capacity: booked_count,
                left_capacity: schedule_time.capacity_limit - booked_count,
            })
        }
    }

    async findByIds(ids: number[]) {
        return this.prisma.scheduleTime.findMany({
            where: {
                OR: ids.map(id => {
                    return {
                        id,
                    }
                })
            },
            include: {
                museum: true,
                museum_schedules: true,
            }
        })
    }

    async create({ museum_id, ...createDto }: CreateScheduleTimeDto) {
        let startEndTime;

        if (createDto.start_time && createDto.end_time) {
            startEndTime = checkTimeStartAndEnd(createDto.start_time, createDto.end_time);
        }

        return this.prisma.scheduleTime.create({
            data: {
                ...createDto,
                start_time: startEndTime.start_time,
                end_time: startEndTime.end_time,
                museum: {
                    connect: {
                        id: museum_id
                    }
                }
            },
            include: {
                museum: true,
                museum_schedules: true,
            }
        })
    }

    async update({ id, museum_id, ...updateDto }: UpdateScheduleTimeDto) {
        const schedule_time = await this.findById(id);
        let startEndTime;

        startEndTime = checkTimeStartOrEnd({
            input: updateDto.start_time,
            value: schedule_time.start_time,
        },
            {
                input: updateDto.end_time,
                value: schedule_time.end_time,
            }
        )
        return this.prisma.scheduleTime.update({
            where: {
                id,
            },
            data: {
                ...updateDto,
                start_time: startEndTime?.start_time,
                end_time: startEndTime?.end_time,
                ...(museum_id && {
                    museum: {
                        connect: {
                            id: museum_id,
                        }
                    }
                })

            },
            include: {
                museum: true,
                museum_schedules: true,
            }
        })
    }


    async delete({ id }: DeleteScheduleTimeDto) {
        return this.prisma.scheduleTime.delete({
            where: {
                id
            },
            include: {
                museum: true,
                museum_schedules: true,
            }
        })
    }
}
