import { Injectable } from '@nestjs/common';
import { PaymentType } from '@prisma/client';
import { CreateMuseumSchedulePaymentDto, DeleteMuseumSchedulePaymentDto, UpdateMuseumSchedulePaymentDto } from 'common/dtos/museum-schedule-payment.dto';
import PaymentMuseumScheduleQuery from 'common/querys/museum-schedule-payment.query';
import dayjsUtil from 'common/utils/dayjs.util';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MuseumSchedulePaymentsService {
    constructor(private prisma: PrismaService) { }

    async findAll(museum_id_query?: string, query?: PaymentMuseumScheduleQuery) {
        return this.prisma.museumSchedulePayment.findMany({
            where: {
                bank_name: {
                    contains: query?.filter?.bank_name,
                },
                total: {
                    equals: query?.filter?.total,
                },
                info: {
                    contains: query?.filter?.info,
                },
                description: {
                    contains: query?.filter?.description,
                },
                payment_type: {
                    equals: query?.filter?.payment_type as PaymentType
                },
                payment_date: {
                    gte: query?.filter?.payment_date?.start_date,
                    lt: query?.filter?.payment_date?.end_date
                },
                ...(query?.filter?.user_username && {
                    user: {
                        username: {
                            contains: query?.filter?.user_username
                        }
                    }
                }),
                ...(query?.filter?.employee_username && {
                    employee: {
                        username: {
                            contains: query?.filter?.employee_username
                        }
                    }
                }),
                museum_id: {
                    equals: museum_id_query !== undefined ? Number(museum_id_query) : undefined,
                },
            },
            orderBy: {
                ...(query?.sort?.bank_name && {
                    first_name: query.sort.bank_name
                }),
                ...(query?.sort?.total && {
                    last_name: query.sort.total
                }),
                ...(query?.sort?.info && {
                    username: query.sort.info
                }),
                ...(query?.sort?.description && {
                    username: query.sort.description
                }),
                ...(query?.sort?.payment_date && {
                    created_at: query.sort.payment_date
                }),
                ...(query?.sort?.payment_type && {
                    updated_at: query.sort.payment_type
                }),
                ...(query?.sort?.user_username && {
                    user: {
                        username: query.sort.user_username,
                    }
                }),
                ...(query?.sort?.employee_username && {
                    user: {
                        username: query.sort.employee_username,
                    }
                }),
            },
            include: {
                museum_schedules: {
                    include: {
                        museum_schedule: true,
                    }
                },
                user: true,
                employee: true,
            }
        });
    }

    async findById(id: number) {
        return this.prisma.museumSchedulePayment.findFirst({
            where: {
                id,
            }
        })
    }

    async create({ museum_schedules, ...createDto }: CreateMuseumSchedulePaymentDto) {
        return this.prisma.museumSchedulePayment.create({
            data: {
                ...createDto,
                museum_schedules: {
                    createMany: {
                        data: museum_schedules.map(museum_schedule => {
                            return {
                                museum_schedule_id: museum_schedule.id,
                                user_limit: museum_schedule.user_limit,
                                total: museum_schedule.total,
                            }
                        })
                    }
                },
            },
        })
    }

    async update({ museum_schedules, id, delete_image, ...updateDto }: UpdateMuseumSchedulePaymentDto) {
        return this.prisma.museumSchedulePayment.update({
            where: {
                id,
            },
            data: {
                ...updateDto,
                ...(museum_schedules?.length > 0 && {
                    museum_schedules: {
                        deleteMany: {
                            museum_schedule_id: id,
                        },
                        createMany: {
                            data: museum_schedules.map(museum_schedule => {
                                return {
                                    museum_schedule_id: museum_schedule.id,
                                    user_limit: museum_schedule.user_limit,
                                    total: museum_schedule.total,
                                }
                            })
                        }
                    },
                })
            },
        })
    }

    async delete({ id }: DeleteMuseumSchedulePaymentDto) {
        return this.prisma.museumSchedulePayment.delete({
            where: {
                id,
            },
        });
    }

    async createForSuperadmin({ museum_schedules, ...createDto }: CreateMuseumSchedulePaymentDto) {
        return this.prisma.museumSchedulePayment.create({
            data: {
                ...createDto,
                museum_schedules: {
                    createMany: {
                        data: museum_schedules.map(museum_schedule => {
                            return {
                                museum_schedule_id: museum_schedule.id,
                                user_limit: museum_schedule.user_limit,
                                total: museum_schedule.total,
                            }
                        })
                    }
                }
            },
        })
    }

    async updateForSuperadmin({ museum_schedules, id, delete_image, ...updateDto }: UpdateMuseumSchedulePaymentDto) {
        return this.prisma.museumSchedulePayment.update({
            where: {
                id,
            },
            data: {
                ...updateDto,
                ...(museum_schedules?.length > 0 && {
                    museum_schedules: {
                        deleteMany: {
                            museum_schedule_id: id,
                        },
                        createMany: {
                            data: museum_schedules.map(museum_schedule => {
                                return {
                                    museum_schedule_id: museum_schedule.id,
                                    user_limit: museum_schedule.user_limit,
                                    total: museum_schedule.total,
                                }
                            })
                        }
                    },
                })
            },
        })
    }

    async deleteForSuperadmin({ id }: DeleteMuseumSchedulePaymentDto) {
        return this.prisma.museumSchedulePayment.delete({
            where: {
                id,
            },
        });
    }
}
