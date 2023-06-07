import { Injectable } from '@nestjs/common';
import { CreateGalleryDto, DeleteGalleryDto, UpdateGalleryDto } from 'common/dtos/gallery.dto';
import GalleryQuery from 'common/querys/gallery.query';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class GalleriesService {
    constructor(private prisma: PrismaService) { }


    async findAllNormal(museum_id_query?: number, query?: GalleryQuery) {
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

        return data.map(({ author: { password, ...author }, gallery_details, ...data }) => {
            const gd = gallery_details.slice(0, 5);
            return {
                ...data,
                author: author,
                gallery_details: gd,
            }
        })
    }

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

        return data.map(({ author: { password, ...author }, museum, gallery_details, ...data }) => ({
            ...data,
            ...(Boolean(query?.take?.author) && {
                author,
            }),
            ...(Boolean(query?.take?.museum) && { museum }),
            ...(Boolean(query?.take?.gallery_detail) && { gallery_details }),
        }))
    }



    async findByIdNormal(id: number) {
        const data = await this.prisma.gallery.findFirstOrThrow({
            where: {
                id
            },
            include: {
                gallery_details: true,
                museum: true,
                author: true,
            }
        })

        return data
    }



    async findById(id: number, take?: {
        museum?: string
        author?: string
        gallery_detail?: string
    }) {
        const { author: { password, ...author }, museum, gallery_details, ...data } = await this.prisma.gallery.findFirstOrThrow({
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
            ...(Boolean(take?.museum) && { museum }),
            ...(Boolean(take?.author) && { author }),
            ...(Boolean(take?.gallery_detail) && { gallery_details }),
        }
    }


    async create({ museum_id, author_id, ...createDto }: CreateGalleryDto, take?: {
        museum?: string
        author?: string
        gallery_detail?: string
    }) {
        const { author: { password, ...author }, museum, gallery_details, ...data } = await this.prisma.gallery.create({
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
            ...(Boolean(take?.museum) && { museum }),
            ...(Boolean(take?.author) && { author }),
            ...(Boolean(take?.gallery_detail) && { gallery_details }),
        }
    }



    async update({ id, museum_id, author_id, ...updateDto }: UpdateGalleryDto, take?: {
        museum?: string
        author?: string
        gallery_detail?: string
    }) {
        const { author: { password, ...author }, museum, gallery_details, ...data } = await this.prisma.gallery.update({
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
            ...(Boolean(take?.museum) && { museum }),
            ...(Boolean(take?.author) && { author }),
            ...(Boolean(take?.gallery_detail) && { gallery_details }),
        }
    }

    async delete({ id }: DeleteGalleryDto, take?: {
        museum?: string
        author?: string
        gallery_detail?: string
    }) {
        const { author: { password, ...author }, museum, gallery_details, ...data } = await this.prisma.gallery.delete({
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
            ...(Boolean(take?.museum) && { museum }),
            ...(Boolean(take?.author) && { author }),
            ...(Boolean(take?.gallery_detail) && { gallery_details }),
        }
    }

}
