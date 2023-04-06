import { Injectable } from '@nestjs/common';
import { CreateDistrictDto, DeleteDistrictDto, UpdateDistrictDto } from 'common/dtos/district.dto';
import DistrictQuery from 'common/querys/district.query';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DistrictsService {
    constructor(private prisma: PrismaService) { }


    async findAll(query?: DistrictQuery) {
        return this.prisma.district.findMany({
            where: {
                name: {
                    contains: query?.filter?.name,
                },
                province_id: {
                    equals: query?.filter?.province_id ? Number(query?.filter?.province_id) : undefined,
                }
            },
            orderBy: {
                ...(query?.sort?.name && {
                    name: query.sort.name
                }),
            },
            ...(query?.limit && {
                take: parseInt(query.limit),
            }),
            ...(query?.offset && {
                skip: parseInt(query.offset),
            }),
        })
    }

    async findById(id: number) {
        return this.prisma.district.findFirstOrThrow({
            where: {
                id,
            }
        });
    }

    async findByProvinceId(province_id: number) {
        return this.prisma.district.findMany({
            where: {
                province_id,
            }
        });
    }

    async create(createDto: CreateDistrictDto) {
        return this.prisma.district.create({
            data: {
                ...createDto,
            }
        })
    }

    async update({ id, ...updateDto }: UpdateDistrictDto) {

        return this.prisma.district.update({
            where: {
                id,
            },
            data: {
                ...updateDto,
            }
        })
    }

    async delete({id}: DeleteDistrictDto) {
        return this.prisma.district.delete({
            where: {
                id,
            }
        })
    }

    async findAllForSuperadmin(query?: DistrictQuery) {
        return this.prisma.district.findMany({
            where: {
                name: {
                    contains: query?.filter?.name,
                },
                province_id: {
                    equals: query?.filter?.province_id ? Number(query?.filter?.province_id) : undefined,
                }
            },
            orderBy: {
                ...(query?.sort?.name && {
                    name: query.sort.name
                }),
            },
            ...(query?.limit && {
                take: parseInt(query.limit),
            }),
            ...(query?.offset && {
                skip: parseInt(query.offset),
            }),
        })
    }

    async findByIdForSuperadmin(id: number) {
        return this.prisma.district.findFirstOrThrow({
            where: {
                id,
            }
        });
    }

    async findByProvinceIdForSuperadmin(province_id: number) {
        return this.prisma.district.findMany({
            where: {
                province_id,
            }
        });
    }

    async createForSuperadmin(createDto: CreateDistrictDto) {
        return this.prisma.district.create({
            data: {
                ...createDto,
            }
        })
    }

    async updateForSuperadmin({ id, ...updateDto }: UpdateDistrictDto) {

        return this.prisma.district.update({
            where: {
                id,
            },
            data: {
                ...updateDto,
            }
        })
    }

    async deleteForSuperadmin({ id }: DeleteDistrictDto) {
        return this.prisma.district.delete({
            where: {
                id,
            }
        })
    }
}
