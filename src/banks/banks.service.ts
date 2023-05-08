import { Injectable } from '@nestjs/common';
import { CreateBankDto, DeleteBankDto, UpdateBankDto } from 'common/dtos/bank.dto';
import BankQuery from 'common/querys/bank.query';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class BanksService {

    constructor(private prisma: PrismaService) { }

    async findAll(museum_id_query?: number, query?: BankQuery) {
        return this.prisma.bank.findMany({
            where: {
                name: {
                    contains: query?.filter?.name,
                },

                museum_id: museum_id_query,
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
            include: {
                museum: true,
            }
        });
    }

    async findById(id: number) {
        return this.prisma.bank.findFirstOrThrow({
            where: {
                id
            },
            include: {
                museum: true,
            }
        })
    }

    async create({ museum_id, ...createDto }: CreateBankDto) {
        return this.prisma.bank.create({
            data: {
                ...createDto,
                museum: {
                    connect: {
                        id: museum_id,
                    }
                },
            },
            include: {
                museum: true,
            }
        })
    }



    async update({ id, museum_id, ...updateDto }: UpdateBankDto) {
        return this.prisma.bank.update({
            where: {
                id,

            },
            data: {
                ...updateDto,
                ...(museum_id && {
                    museum: {
                        connect: {
                            id: museum_id,
                        }
                    },
                })
            },
            include: {
                museum: true,
            }
        })
    }

    async delete({ id }: DeleteBankDto) {
        return this.prisma.bank.delete({
            where: {
                id,
            },
            include: {
                museum: true,
            }
        });
    }
}
