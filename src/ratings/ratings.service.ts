import { Injectable } from '@nestjs/common';
import { CreateRatingDto, DeleteRatingDto, UpdateRatingDto } from 'common/dtos/rating.dto';
import RatingQuery from 'common/querys/rating.query';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class RatingsService {
    constructor(private prisma: PrismaService) { }

    async findAll(museum_id_query?: number, query?: RatingQuery) {
        return this.prisma.rating.findMany({
            where: {
                rating: {
                    equals: query?.filter?.rating,
                },
                museum_id: {
                    equals: museum_id_query,
                }
            },
            orderBy: {
                ...(query?.sort?.rating && {
                    rating: query.sort.rating
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
        return this.prisma.rating.findFirstOrThrow({
            where: {
                id
            }
        })
    }

    async create({ user_id, museum_id, ...createDto }: CreateRatingDto) {
        return this.prisma.rating.create({
            data: {
                ...createDto,
                user: {
                    connect: {
                        id: user_id,
                    }
                },
                museum: {
                    connect: {
                        id: museum_id,
                    }
                },
            },
        },)
    }



    async update({ id, user_id, museum_id, ...updateDto }: UpdateRatingDto) {
        return this.prisma.rating.update({
            where: {
                id,
            },
            data: {
                ...updateDto,
                ...(user_id && {
                    user: {
                        connect: {
                            id: user_id,
                        }
                    },
                }),
                ...(museum_id && {
                    museum: {
                        connect: {
                            id: museum_id,
                        }
                    },
                }),
            },
        })
    }

    async delete({ id }: DeleteRatingDto) {
        return this.prisma.rating.delete({
            where: {
                id,
            },
        });
    }

}
