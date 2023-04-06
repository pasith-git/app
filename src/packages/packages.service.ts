import { Injectable } from '@nestjs/common';
import { CreatePackageDto, DeletePackageDto, UpdatePackageDto } from 'common/dtos/package.dto';
import PackageQuery from 'common/querys/package.query';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PackagesService {
    constructor(private prisma: PrismaService) { }


    async findAll(query?: PackageQuery) {
        return this.prisma.package.findMany({
            where: {
                name: {
                    contains: query?.filter?.name
                },
                description: {
                    contains: query?.filter?.description
                },
                duration: {
                    equals: query?.filter?.duration ? Number(query?.filter?.duration) : undefined,
                },
                user_limit: {
                    equals: query?.filter?.user_limit ? Number(query?.filter?.user_limit) : undefined,
                },
                price: {
                    equals: query?.filter?.price,
                },
                discount: {
                    equals: query?.filter?.discount,
                }
            },
            orderBy: {
                ...(query?.sort?.name && {
                    name: query.sort.name
                }),
                ...(query?.sort?.description && {
                    description: query.sort.description
                }),


                ...(query?.sort?.duration && {
                    duration: query.sort.duration
                }),
                ...(query?.sort?.user_limit && {
                    user_limit: query.sort.user_limit
                }),
                ...(query?.sort?.price && {
                    price: query.sort.price
                }),
                ...(query?.sort?.discount && {
                    discount: query.sort.discount
                }),
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
        return this.prisma.package.findFirstOrThrow({
            where: {
                id
            }
        });
    }

    /* superadmin */

    async findAllForSuperadmin(query?: PackageQuery) {
        return this.prisma.package.findMany({
            where: {
                name: {
                    contains: query?.filter?.name
                },
                description: {
                    contains: query?.filter?.description
                },
                duration: {
                    equals: query?.filter?.duration ? Number(query?.filter?.duration) : undefined,
                },
                user_limit: {
                    equals: query?.filter?.user_limit ? Number(query?.filter?.user_limit) : undefined,
                },
                price: {
                    equals: query?.filter.price,
                },
                discount: {
                    equals: query?.filter.discount,
                }
            },
            orderBy: {
                ...(query?.sort?.name && {
                    name: query.sort.name
                }),
                ...(query?.sort?.description && {
                    description: query.sort.description
                }),


                ...(query?.sort?.duration && {
                    duration: query.sort.duration
                }),
                ...(query?.sort?.user_limit && {
                    user_limit: query.sort.user_limit
                }),
                ...(query?.sort?.price && {
                    price: query.sort.price
                }),
                ...(query?.sort?.discount && {
                    discount: query.sort.discount
                }),
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
        return this.prisma.package.findFirstOrThrow({
            where: {
                id
            }
        });
    }

    async createForSuperadmin(createDto: CreatePackageDto) {

        return this.prisma.package.create({
            data: {
                ...createDto,
            }
        })
    }

    async updateForSuperadmin({ id, ...updateDto }: UpdatePackageDto) {

        return this.prisma.package.update({
            where: {
                id,
            },
            data: {
                ...updateDto,
            }
        })
    }

    async deleteForSuperadmin({ id }: DeletePackageDto) {
        return this.prisma.package.delete({
            where: {
                id,
            }
        })
    }
}
