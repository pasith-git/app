import { Injectable } from '@nestjs/common';
import { CreatePriceDto, DeletePriceDto, UpdatePriceDto } from 'common/dtos/price.dto';
import PriceQuery from 'common/querys/price.query';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PricesService {
    constructor(private prisma: PrismaService) { }

    async findAll(museum_id_query?: number, query?: PriceQuery) {
        return this.prisma.price.findMany({
            where: {
                adult_price: {
                    equals: query?.filter?.adult_price
                },
                child_price: {
                    equals: query?.filter?.child_price
                },
                title: {
                    contains: query?.filter?.title
                },
                is_foreigner: {
                    equals: query?.filter?.is_foreigner && Boolean(query.filter.is_foreigner)
                },
                museum_id: museum_id_query,
            },
            orderBy: {
                ...(query?.sort?.adult_price && {
                    adult_price: query.sort.adult_price
                }),
                ...(query?.sort?.child_price && {
                    child_price: query.sort.child_price
                }),
                ...(query?.sort?.title && {
                    title: query.sort.title
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

    async findPriceForBooking(is_foreigner: boolean){
        return this.prisma.price.findFirst({
            where: {
                is_foreigner,
            },
        })
    }

    async findById(id: number) {
        return this.prisma.price.findFirstOrThrow({
            where: {
                id
            },
            include: {
                museum: true,
            }
        })
    }

    async create({ museum_id, ...createDto }: CreatePriceDto) {
        return this.prisma.price.create({
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



    async update({ id, museum_id, ...updateDto }: UpdatePriceDto) {
        return this.prisma.price.update({
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

    async delete({ id }: DeletePriceDto) {
        return this.prisma.price.delete({
            where: {
                id,
            },
            include: {
                museum: true,
            }
        });
    }
}
