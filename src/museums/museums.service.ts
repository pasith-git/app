import { Injectable } from '@nestjs/common';
import { CreateMuseumDto, DeleteMuseumDto, UpdateMuseumDto } from 'common/dtos/museum.dto';
import MuseumQuery from 'common/querys/museum.query';
import dayjsUtil from 'common/utils/dayjs.util';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MuseumsService {
    constructor(private prisma: PrismaService) { }

    async findAll(museum_id_query?: number, query?: MuseumQuery) {
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
                info: {
                    contains: query?.filter?.info,
                },
                description: {
                    contains: query?.filter?.description,
                },
                created_at: {
                    gte: query?.filter?.created_at?.start_date,
                    lt: query?.filter?.created_at?.end_date,
                },
                updated_at: {
                    gte: query?.filter?.updated_at?.start_date,
                    lt: query?.filter?.updated_at?.end_date
                }
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
                ...(query?.sort?.info && {
                    info: query.sort.info
                }),
                ...(query?.sort?.description && {
                    description: query.sort.description
                }),
                ...(query?.sort?.created_at && {
                    created_at: query.sort.created_at
                }),
                ...(query?.sort?.updated_at && {
                    updated_at: query.sort.updated_at
                }),
            },
            include: {
                country: true,
                district: {
                    include: {
                        province: true,
                    }
                },
            },
            ...(query?.limit && {
                take: parseInt(query.limit),
            }),
            ...(query?.offset && {
                skip: parseInt(query.offset),
            }),
        });
    }

    async findById(id: number) {
        return this.prisma.museum.findFirstOrThrow({
            where: {
                id
            },
            include: {
                country: true,
            }
        })
    }

    async findAllById(id: number) {
        return this.prisma.museum.findMany({
            where: {
                id
            },
        })
    }

    async findByIdIncludePackages(id: number) {
        return this.prisma.museum.findFirstOrThrow({
            where: {
                id
            },
            include: {
                payment_packages: true,
            }
        })
    }

    async create(createDto: CreateMuseumDto) {
        return this.prisma.museum.create({
            data: createDto,
        })
    }



    async update({ delete_image, id, ...updateMuseumDto }: UpdateMuseumDto) {
        return this.prisma.museum.update({
            where: {
                id,
            },
            data: {
                ...updateMuseumDto,
            },
        })
    }

    async delete(deleteMuseumDto: DeleteMuseumDto) {
        return this.prisma.museum.delete({
            where: {
                id: deleteMuseumDto.id,
            },
        });
    }


    /* superadmin */
    async findAllForSuperadmin(museum_id_query?: number, query?: MuseumQuery) {
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
                info: {
                    contains: query?.filter?.info,
                },
                description: {
                    contains: query?.filter?.description,
                },
                created_at: {
                    gte: query?.filter?.created_at?.start_date,
                    lt: query?.filter?.created_at?.end_date,
                },
                updated_at: {
                    gte: query?.filter?.updated_at?.start_date,
                    lt: query?.filter?.updated_at?.end_date
                }
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
                ...(query?.sort?.info && {
                    info: query.sort.info
                }),
                ...(query?.sort?.description && {
                    description: query.sort.description
                }),
                ...(query?.sort?.created_at && {
                    created_at: query.sort.created_at
                }),
                ...(query?.sort?.updated_at && {
                    updated_at: query.sort.updated_at
                }),
            },
            include: {
                country: true,
                district: {
                    include: {
                        province: true,
                    }
                },
            },
            ...(query?.limit && {
                take: parseInt(query.limit),
            }),
            ...(query?.offset && {
                skip: parseInt(query.offset),
            }),
        });
    }

    async findByIdForSuperadmin(id: number) {
        return this.prisma.museum.findFirstOrThrow({
            where: {
                id
            },
        })
    }

    async findByIdIncludePackagesForSuperadmin(id: number) {
        return this.prisma.museum.findFirstOrThrow({
            where: {
                id
            },
            include: {
                payment_packages: true,
            }
        })
    }

    async createForSuperadmin(createDto: CreateMuseumDto) {
        return this.prisma.museum.create({
            data: createDto,
        })
    }



    async updateForSuperadmin({ delete_image, id, ...updateDto }: UpdateMuseumDto) {
        return this.prisma.museum.update({
            where: {
                id,
            },
            data: updateDto,
        })
    }

    async deleteForSuperadmin({ id }: DeleteMuseumDto) {
        return this.prisma.museum.delete({
            where: {
                id,
            },
        });
    }
}
