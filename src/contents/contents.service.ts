import { Injectable } from '@nestjs/common';
import { CreateContentDto, DeleteContentDto, UpdateContentDto } from 'common/dtos/content.dto';
import ContentQuery from 'common/querys/content.query';
import exclude from 'common/utils/exclude.util';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ContentsService {
    constructor(private prisma: PrismaService) { }

    async findAll(museum_id_query?: number, query?: ContentQuery) {
        const data = await this.prisma.content.findMany({
            where: {
                title: {
                    contains: query?.filter?.title,
                },
                description: {
                    contains: query?.filter?.description,
                },
                museum_id: museum_id_query,
                author_id: query?.filter?.author_id ? parseInt(query?.filter?.author_id) : undefined,
            },
            orderBy: {
                ...(query?.sort?.title && {
                    description: query.sort.title
                }),
                ...(query?.sort?.description && {
                    description: query.sort.description
                }),
            },
            ...(query?.limit && {
                take: parseInt(query.limit),
            }),
            ...(query?.offset && {
                skip: parseInt(query.offset),
            }),
            include: {
                photos: true,
                museum: true,
                author: true,
            }
        });
        return data.map(({ author: { password, ...author }, ...data }) => ({
            ...data,
            author,
        }))
    }


    async findById(id: number) {
        const { author: { password, ...author }, ...data } = await this.prisma.content.findFirstOrThrow({
            where: {
                id
            },
            include: {
                museum: true,
                author: true,
                photos: true
            }
        })

        return {
            ...data,
            author,
        }
    }

    async create({ museum_id, author_id, ...createDto }: CreateContentDto) {
        const { author: { password, ...author }, ...data } = await this.prisma.content.create({
            data: {
                ...createDto,
                museum: {
                    connect: {
                        id: museum_id,
                    }
                },
                author: {
                    connect: {
                        id: author_id,
                    }
                },
            },
            include: {
                museum: true,
                author: true,
                photos: true
            }
        })

        return {
            ...data,
            author,
        }
    }



    async update({ id, museum_id, author_id, ...updateDto }: UpdateContentDto) {
        const { author: { password, ...author }, ...data } = await this.prisma.content.update({
            where: {
                id,

            },
            data: {
                ...updateDto,
                ...(author_id && {
                    author: {
                        connect: {
                            id: author_id,
                        }
                    },
                }),
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
                author: true,
                photos: true
            }
        })

        return {
            ...data,
            author,
        }
    }

    async delete({ id }: DeleteContentDto) {
        const { author: { password, ...author }, ...data } = await this.prisma.content.delete({
            where: {
                id,
            },
            include: {
                museum: true,
                author: true,
                photos: true
            }
        });

        return {
            ...data,
            author,
        }
    }
}
