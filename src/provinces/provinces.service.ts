import { Injectable } from '@nestjs/common';
import { CreateProvinceDto, DeleteProvinceDto, UpdateProvinceDto } from 'common/dtos/province.dto';
import ProvinceQuery from 'common/querys/province.query';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ProvincesService {
    constructor(private prisma: PrismaService) { }


    async findAll(query?: ProvinceQuery) {
        return this.prisma.province.findMany({
            where: {
                name: {
                    contains: query?.filter?.name,
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

    async findById(id: number){
        return this.prisma.province.findFirstOrThrow({
            where: {
                id
            }
        })
    }


    /* superadmin */
    async findByIdForSuperadmin(id: number) {
        return this.prisma.country.findFirstOrThrow({
            where: {
                id
            }
        })
    }

    async findAllForSuperadmin(query?: ProvinceQuery) {
        return this.prisma.province.findMany({
            where: {
                name: {
                    contains: query?.filter?.name,
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

    async createForSuperadmin(createDto: CreateProvinceDto) {
        return this.prisma.province.create({
            data: {
                ...createDto,
            }
        })
    }

    async updateForSuperadmin({ id, ...updateDto }: UpdateProvinceDto) {

        return this.prisma.province.update({
            where: {
                id,
            },
            data: {
                ...updateDto,
            }
        })
    }

    async deleteForSuperadmin({ id }: DeleteProvinceDto) {
        return this.prisma.province.delete({
            where: {
                id,
            }
        })
    }
}