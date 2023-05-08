import { Injectable } from '@nestjs/common';
import { AuthService } from 'auth/auth.service';
import { CreateMuseumDto, CreateMuseumWithOwnerDto, DeleteMuseumDto, UpdateMuseumDto } from 'common/dtos/museum.dto';
import MuseumQuery from 'common/querys/museum.query';
import { checkTimeStartAndEnd } from 'common/utils/datetime.util';
import dayjsUtil from 'common/utils/dayjs.util';
import exclude from 'common/utils/exclude.util';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MuseumsService {
    constructor(private prisma: PrismaService, private authService: AuthService) { }

    async findAllForNormal(museum_id_query?: number, query?: MuseumQuery) {
        return this.prisma.museum.findMany({
            where: {
                id: {
                    equals: museum_id_query,
                },
                name: {
                    contains: query?.filter?.name,
                },
                email: {
                    contains: query?.filter?.email,
                },
                phone: {
                    contains: query?.filter?.phone,
                },
                address: {
                    contains: query?.filter?.address,
                },
                created_at: {
                    gte: query?.filter?.created_at?.start_date && dayjsUtil(query?.filter?.created_at?.start_date, "DD/MM/YYYY HH:mm").toDate(),
                    lt: query?.filter?.created_at?.end_date && dayjsUtil(query?.filter?.created_at?.end_date, "DD/MM/YYYY HH:mm").toDate(),
                },
                updated_at: {
                    gte: query?.filter?.updated_at?.start_date && dayjsUtil(query?.filter?.updated_at?.start_date, "DD/MM/YYYY HH:mm").toDate(),
                    lt: query?.filter?.updated_at?.end_date && dayjsUtil(query?.filter?.updated_at?.end_date, "DD/MM/YYYY HH:mm").toDate(),
                },
            },
            orderBy: {
                ...(query?.sort?.name && {
                    name: query.sort.name
                }),
                ...(query?.sort?.email && {
                    email: query.sort.email
                }),
                ...(query?.sort?.phone && {
                    phone: query.sort.phone
                }),
                ...(query?.sort?.address && {
                    description: query.sort.address
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
                galleries: true,
            }
        });

    }

    async findAll(museum_id_query?: number, query?: MuseumQuery) {
        const data = await this.prisma.museum.findMany({
            where: {
                id: {
                    equals: museum_id_query,
                },
                name: {
                    contains: query?.filter?.name,
                },
                email: {
                    contains: query?.filter?.email,
                },
                phone: {
                    contains: query?.filter?.phone,
                },
                address: {
                    contains: query?.filter?.address,
                },
                created_at: {
                    gte: query?.filter?.created_at?.start_date && dayjsUtil(query?.filter?.created_at?.start_date, "DD/MM/YYYY HH:mm").toDate(),
                    lt: query?.filter?.created_at?.end_date && dayjsUtil(query?.filter?.created_at?.end_date, "DD/MM/YYYY HH:mm").toDate(),
                },
                updated_at: {
                    gte: query?.filter?.updated_at?.start_date && dayjsUtil(query?.filter?.updated_at?.start_date, "DD/MM/YYYY HH:mm").toDate(),
                    lt: query?.filter?.updated_at?.end_date && dayjsUtil(query?.filter?.updated_at?.end_date, "DD/MM/YYYY HH:mm").toDate(),
                },
            },
            orderBy: {
                ...(query?.sort?.name && {
                    name: query.sort.name
                }),
                ...(query?.sort?.email && {
                    email: query.sort.email
                }),
                ...(query?.sort?.phone && {
                    phone: query.sort.phone
                }),
                ...(query?.sort?.address && {
                    description: query.sort.address
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
                banks: true,
                users: true,
                galleries: true,
            }
        });

        return data.map(({ users, ...data }) => ({
            ...data,
            users: users.map(({ password, ...data }) => ({
                ...data,
            }))
            ,
        }))
    }

    async findById(id: number) {
        const data = await this.prisma.museum.findFirstOrThrow({
            where: {
                id
            },
            include: {
                banks: true,
                users: true,
                galleries: true,
            }
        })
        return {
            ...data,
            users: data.users.map(({ password, ...data }) => ({
                ...data,
            }))
        }
    }

    async create(createDto: CreateMuseumDto) {
        const data = await this.prisma.museum.create({
            data: {
                ...createDto,
                ...(createDto.phone && { phone: `+${createDto.phone}` }),
                ...(createDto.close_day_of_week?.length > 0 && {
                    close_day_of_week: (createDto.close_day_of_week as string[]).join(",")
                }),
                vat_auth_date: createDto.vat_auth_date && dayjsUtil(createDto.vat_auth_date, "DD/MM/YYYY").utc(true).toDate(),

            },
            include: {
                banks: true,
                users: true,
                galleries: true,
            }
        })

        return {
            ...data,
            users: data.users.map(({ password, ...data }) => ({
                ...data,
            }))
        }
    }

    async createMuseumAndOwner({ museum: { ...museum_dto }, owner: { museum_id, country_id, ...owner_dto } }: CreateMuseumWithOwnerDto) {

        let openCloseTime;

        if (museum_dto.open_time && museum_dto.close_time) {
            openCloseTime = checkTimeStartAndEnd(museum_dto.open_time, museum_dto.close_time);
        }

        return await this.prisma.$transaction(async (tx) => {
            const museum = await tx.museum.create({
                data: {
                    ...museum_dto,
                    open_time: openCloseTime?.start_time,
                    close_time: openCloseTime?.end_time,
                    is_deleted: false,
                    ...(museum_dto.phone && { phone: `+${museum_dto.phone}` }),
                    ...(museum_dto.close_day_of_week?.length > 0 && {
                        close_day_of_week: (museum_dto.close_day_of_week as string[]).join(",")
                    }),
                    vat_auth_date: museum_dto.vat_auth_date && dayjsUtil(museum_dto.vat_auth_date, "DD/MM/YYYY").utc(true).toDate(),
                },

            });

            const owner = await tx.role.findFirstOrThrow({
                where: {
                    name: "owner"
                }
            });

            const { password, ...user } = await tx.user.create({
                data: {
                    ...owner_dto,
                    password: this.authService.generatePassword(owner_dto.password),
                    museum: {
                        connect: {
                            id: museum.id,
                        }
                    },
                    country: {
                        connect: {
                            id: country_id,
                        }
                    },
                    is_active: true,
                    is_deleted: false,
                    roles: {
                        create: {
                            role: {
                                connect: {
                                    id: owner.id,
                                }
                            }
                        }
                    }
                },
                include: {
                    roles: {
                        include: {
                            role: true
                        }
                    }
                }
            })

            return {
                user,
                museum,
            }
        });

    }


    async update({ delete_image, id, ...updateDto }: UpdateMuseumDto) {
        const data = await this.prisma.museum.update({
            where: {
                id,
            },
            data: {
                ...updateDto,
                ...(updateDto.phone && { phone: `+${updateDto.phone}` }),
                ...(updateDto.close_day_of_week?.length > 0 && {
                    close_day_of_week: (updateDto.close_day_of_week as string[]).join(",")
                }),
                ...(updateDto.vat_auth_date && {
                    vat_auth_date: updateDto.vat_auth_date && dayjsUtil(updateDto.vat_auth_date, "DD/MM/YYYY").utc(true).toDate(),
                })
            },
            include: {
                banks: true,
                users: true,
                galleries: true,
            }
        })

        return {
            ...data,
            users: data.users.map(({ password, ...data }) => ({
                ...data,
            }))
        }
    }

    async delete(deleteMuseumDto: DeleteMuseumDto) {
        const data = await this.prisma.museum.delete({
            where: {
                id: deleteMuseumDto.id,
            },
            include: {
                banks: true,
                users: true,
                galleries: true,
            }
        });
        return {
            ...data,
            users: data.users.map(({ password, ...data }) => ({
                ...data,
            }))
        }
    }



}
