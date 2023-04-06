import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateScheduleTimeDto, DeleteScheduleTimeDto, UpdateScheduleTimeDto } from 'common/dtos/schedule-time.dto';
import ScheduleTimeQuery from 'common/querys/schedule-time.query';
import dayjsUtil from 'common/utils/dayjs.util';

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
                    equals: query?.filter?.start_time ? dayjsUtil(new Date(0))
                        .hour(dayjsUtil(query?.filter?.start_time).hour())
                        .minute(dayjsUtil(query?.filter?.start_time).minute()).second(0).millisecond(0).toDate() : undefined,
                },
                end_time: {
                    equals: query?.filter?.end_time ? dayjsUtil(new Date(0))
                        .hour(dayjsUtil(query?.filter?.end_time).hour())
                        .minute(dayjsUtil(query?.filter?.end_time).minute()).second(0).millisecond(0).toDate() : undefined,
                },
                museum_id: {
                    equals: museum_id_query,
                },


            },
            orderBy: {
                ...(query?.sort?.title && {
                    title: query?.sort?.title
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

    async findById(id: number) {
        return this.prisma.scheduleTime.findFirstOrThrow({
            where: {
                id
            },
            include: {
                museum: true,
                museum_schedules: true,
            }
        })
    }

    async findByManyIds(ids: number[]) {
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

    async create(createDto: CreateScheduleTimeDto) {
        return this.prisma.scheduleTime.create({
            data: createDto,
            include: {
                museum: true,
                museum_schedules: true,
            }
        })
    }

    async update({ id, ...updateDto }: UpdateScheduleTimeDto) {
        return this.prisma.scheduleTime.update({
            where: {
                id,
            },
            data: {
                ...updateDto,
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
            }
        })
    }

    async findAllForSuperadmin(museum_id_query?: number, query?: ScheduleTimeQuery) {
        return this.prisma.scheduleTime.findMany({
            where: {
                title: {
                    contains: query?.filter.title,
                },
                start_time: {
                    equals: query?.filter?.start_time ? dayjsUtil(new Date(0))
                        .hour(dayjsUtil(query?.filter?.start_time).hour())
                        .minute(dayjsUtil(query?.filter?.start_time).minute()).second(0).millisecond(0).toDate() : undefined,
                },
                end_time: {
                    equals: query?.filter?.end_time ? dayjsUtil(new Date(0))
                        .hour(dayjsUtil(query?.filter?.end_time).hour())
                        .minute(dayjsUtil(query?.filter?.end_time).minute()).second(0).millisecond(0).toDate() : undefined,
                },
                museum_id: {
                    equals: museum_id_query,
                },


            },
            orderBy: {
                ...(query?.sort?.title && {
                    title: query?.sort?.title
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

    async findByIdForSuperadmin(id: number) {
        return this.prisma.scheduleTime.findFirstOrThrow({
            where: {
                id
            },
            include: {
                museum: true,
                museum_schedules: true,
            }
        })
    }

    async findByManyIdsForSuperadmin(ids: number[]) {
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

    async createForSuperadmin(createDto: CreateScheduleTimeDto) {
        return this.prisma.scheduleTime.create({
            data: createDto,
            include: {
                museum: true,
                museum_schedules: true,
            }
        })
    }

    async updateForSuperadmin({ id, ...updateDto }: UpdateScheduleTimeDto) {
        return this.prisma.scheduleTime.update({
            where: {
                id
            },
            data: {
                ...updateDto,
            }
        })
    }


    async deleteForSuperadmin({ id }: DeleteScheduleTimeDto) {
        return this.prisma.scheduleTime.delete({
            where: {
                id
            }
        })
    }
}
