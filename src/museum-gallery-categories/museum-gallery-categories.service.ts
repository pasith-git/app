import { Injectable } from '@nestjs/common';
import { CreateMuseumGalleryCategoryDto, DeleteMuseumGalleryCategoryDto, UpdateMuseumGalleryCategoryDto } from 'common/dtos/museum-gallery-category.dto';
import MuseumGalleryCategoryQuery from 'common/querys/museum-gallery-category.query';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MuseumGalleryCategoriesService {

    constructor(private prisma: PrismaService) { }


    async findAll(museum_id_query?: number, query?: MuseumGalleryCategoryQuery) {
        return this.prisma.museumGalleryCategory.findMany({
            where: {
                museum_id: {
                    equals: museum_id_query,
                },
                name: {
                    contains: query?.filter?.name,
                },
            },

            include: {
                museum_galleries: true,
            },

            orderBy: {
                ...(query?.sort?.name && {
                    name: query.sort.name
                })
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
        return this.prisma.museumGalleryCategory.findFirstOrThrow({
            where: {
                id
            },
        })
    }

    async create({ museum_id, ...createDto }: CreateMuseumGalleryCategoryDto) {
        return this.prisma.museumGalleryCategory.create({
            data: {
                ...createDto,
                museum: {
                    connect: {
                        id: museum_id,
                    }
                }
            }
        })
    }

    async update({ id, ...updateDto }: UpdateMuseumGalleryCategoryDto) {
        return this.prisma.museumGalleryCategory.update({
            where: {
                id
            },
            data: {
                ...updateDto,
            }
        })
    }

    async delete({ id }: DeleteMuseumGalleryCategoryDto) {
        return this.prisma.museumGalleryCategory.delete({
            where: {
                id
            }
        })
    }

    async findAllForSuperadmin(museum_id_query?: string, query?: MuseumGalleryCategoryQuery) {
        return this.prisma.museumGalleryCategory.findMany({
            where: {
                museum_id: {
                    equals: museum_id_query !== undefined ? Number(museum_id_query) : undefined,
                },
                name: {
                    contains: query?.filter?.name,
                },
            },

            include: {
                museum_galleries: true,
            },

            orderBy: {
                ...(query?.sort?.name && {
                    name: query.sort.name
                })
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
        return this.prisma.museumSchedule.findFirstOrThrow({
            where: {
                id
            },
        })
    }

    async createForSuperadmin({ museum_id, ...createDto }: CreateMuseumGalleryCategoryDto) {
        return this.prisma.museumGalleryCategory.create({
            data: {
                ...createDto,
                museum: {
                    connect: {
                        id: museum_id,
                    }
                }
            }
        })
    }

    async updateForSuperadmin({ id, ...updateDto }: UpdateMuseumGalleryCategoryDto) {
        return this.prisma.museumGalleryCategory.update({
            where: {
                id
            },
            data: {
                ...updateDto,
            }
        })
    }

    async deleteForSuperadmin({ id }: DeleteMuseumGalleryCategoryDto) {
        return this.prisma.museumGalleryCategory.delete({
            where: {
                id
            }
        })
    }

}
