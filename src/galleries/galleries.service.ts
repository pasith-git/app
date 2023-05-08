import { Injectable } from '@nestjs/common';
import { CreateGalleryDto, DeleteGalleryDto, UpdateGalleryDto } from 'common/dtos/gallery.dto';
import GalleryQuery from 'common/querys/gallery.query';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class GalleriesService {
    constructor(private prisma: PrismaService) { }


    async findAll(museum_id_query?: number, query?: GalleryQuery) {
        const data = await this.prisma.gallery.findMany({
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
                gallery_details: true,
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
        const { author: { password, ...author }, ...data } = await this.prisma.gallery.findFirstOrThrow({
            where: {
                id
            },
            include: {
                gallery_details: true,
                museum: true,
                author: true,
            }
        })

        return {
            ...data,
            author,
        }
    }


    async create({ museum_id, author_id, ...createDto }: CreateGalleryDto) {
        const { author: { password, ...author }, ...data } = await this.prisma.gallery.create({
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
                gallery_details: true,
                museum: true,
                author: true,
            }
        })


        return {
            ...data,
            author,
        }
    }



    async update({ id, museum_id, author_id, ...updateDto }: UpdateGalleryDto) {
        const { author: { password, ...author }, ...data } = await this.prisma.gallery.update({
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
                gallery_details: true,
                museum: true,
                author: true,
            }
        })

        return {
            ...data,
            author,
        }
    }

    async delete({ id }: DeleteGalleryDto) {
        const { author: { password, ...author }, ...data } = await this.prisma.gallery.delete({
            where: {
                id,
            },
            include: {
                gallery_details: true,
                museum: true,
                author: true,
            }
        });
        return {
            ...data,
            author,
        }
    }

}
