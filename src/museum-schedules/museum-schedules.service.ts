import { Injectable } from '@nestjs/common';
import { ScheduleStatus, ScheduleUserLimitStatus } from '@prisma/client';
import { CreateMuseumScheduleDto, DeleteMuseumScheduleDto, UpdateMuseumScheduleDto } from 'common/dtos/museum-schedule.dto';
import MuseumScheduleQuery from 'common/querys/museum-schedule.query';
import dayjsUtil from 'common/utils/dayjs.util';
import { PrismaService } from 'prisma/prisma.service';
import { ScheduleTimesService } from 'schedule-times/schedule-times.service';

@Injectable()
export class MuseumSchedulesService {
    constructor(private prisma: PrismaService, private scheduleTimesService: ScheduleTimesService) { }


    async findAll(museum_id_query?: number, query?: MuseumScheduleQuery) {
        return this.prisma.museumSchedule.findMany({
            where: {
                museum_id: {
                    equals: museum_id_query,
                },
                current_users: {
                    equals: query?.filter?.current_users !== undefined ? Number(query?.filter?.current_users) : undefined,
                },
                price: {
                    equals: query?.filter?.price,
                },
                user_limit: {
                    equals: Number(query?.filter?.user_limit) || undefined,
                },
                user_limit_status: {
                    equals: query?.filter?.user_limit_status as ScheduleUserLimitStatus,
                },
                discount: {
                    equals: query?.filter?.discount,
                },
                status: {
                    equals: query?.filter?.schedule_status as ScheduleStatus,
                },
                start_date: {
                    gte: query?.filter?.start_date?.start_date ? dayjsUtil(query?.filter?.start_date?.start_date).utc(true).hour(0).minute(0).second(0).millisecond(0).toDate() : undefined,
                    lte: query?.filter?.start_date?.end_date ? dayjsUtil(query?.filter?.start_date?.end_date).utc(true).hour(0).minute(0).second(0).millisecond(0).toDate() : undefined,
                },
                schedule_time: {
                    start_time: {
                        equals: query?.filter?.start_time ? dayjsUtil(new Date(0))
                            .hour(dayjsUtil(query?.filter?.start_time).hour())
                            .minute(dayjsUtil(query?.filter?.start_time).minute()).second(0).millisecond(0).toDate() : undefined

                    },
                    end_time: {
                        equals: query?.filter?.end_time ? dayjsUtil(new Date(0))
                            .hour(dayjsUtil(query?.filter?.end_time).hour())
                            .minute(dayjsUtil(query?.filter?.end_time).minute()).second(0).millisecond(0).toDate() : undefined
                    },


                }

            },
            orderBy: {
                ...(query?.sort?.title && {
                    title: query?.sort?.title
                }),
                ...(query?.sort?.price && {
                    price: query?.sort?.price
                }),
                ...(query?.sort?.discount && {
                    discount: query?.sort?.discount
                }),
                ...(query?.sort?.current_users && {
                    user_limit: query?.sort?.current_users
                }),
                ...(query?.sort?.user_limit && {
                    user_limit: query?.sort?.user_limit
                }),
                ...(query?.sort?.schedule_status && {
                    status: query?.sort?.schedule_status
                }),
            },
            ...(query?.limit && {
                take: parseInt(query.limit),
            }),
            ...(query?.offset && {
                skip: parseInt(query.offset),
            }),
            include: {
                schedule_time: true,
                museum: true,
            }
        })
    }

    async findById(id: number) {
        return this.prisma.museumSchedule.findFirstOrThrow({
            where: {
                id
            },
            include: {
                schedule_time: true,
                museum: true,
            }
        })
    }

    async findByManyIds(ids: number[]) {
        return this.prisma.museumSchedule.findMany({
            where: {
                OR: ids.map(id => {
                    return {
                        id,
                    }
                })
            },
            include: {
                schedule_time: true,
                museum: true,
            }
        })
    }

    async create(createDto: CreateMuseumScheduleDto) {
        return this.prisma.museumSchedule.create({
            data: createDto,
            include: {
                schedule_time: true,
                museum: true,
            }
        })
    }

    async update({ id, ...updateDto }: UpdateMuseumScheduleDto) {
        return this.prisma.museumSchedule.update({
            where: {
                id
            },
            data: {
                ...updateDto,
            },
            include: {
                schedule_time: true,
                museum: true,
            }
        })
    }


    async delete({ id }: DeleteMuseumScheduleDto) {
        return this.prisma.museumSchedule.delete({
            where: {
                id
            },
            include: {
                schedule_time: true,
                museum: true,
            }
        })
    }
}
