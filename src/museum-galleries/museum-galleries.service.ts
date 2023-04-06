import { Injectable } from '@nestjs/common';
import { CreateMuseumGalleryDto, DeleteMuseumGalleryDto, UpdateMuseumGalleryDto } from 'common/dtos/museum-gallery.dto';
import MuseumGalleryQuery from 'common/querys/museum-gallery.query';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MuseumGalleriesService {
    constructor(private prisma: PrismaService) { }

    async findAll(museum_id_query?: number, query?: MuseumGalleryQuery) {
        return this.prisma.museumGallery.findMany({
            where: {
                museum_gallery_category: {
                    museum_id: {
                        equals: museum_id_query,
                    },
                    name: {
                        contains: query?.filter?.category_name,
                    },
                },
                description: {
                    contains: query?.filter?.description,
                }
            },
            orderBy: {
                ...(query?.sort?.category_name && {
                    museum_gallery_category: {
                        name: query.sort.category_name
                    }
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
                museum_gallery_category: true,
            }
        });
    }

    async findById(id: number) {
        return this.prisma.museumGallery.findFirstOrThrow({
            where: {
                id
            },
            include: {
                museum_gallery_category: {
                    include: {
                        museum: true
                    }
                }
            }
        })
    }

    async create(createDto: CreateMuseumGalleryDto) {
        return this.prisma.museumGallery.create({
            data: createDto,
        })
    }



    async update({ delete_image, id, ...updateDto }: UpdateMuseumGalleryDto) {
        return this.prisma.museumGallery.update({
            where: {
                id,
            },
            data: updateDto,
        })
    }

    async delete({ id }: DeleteMuseumGalleryDto) {
        return this.prisma.museumGallery.delete({
            where: {
                id,
            },
        });
    }

    async findAllForSuperadmin(museum_id_query?: string, query?: MuseumGalleryQuery) {
        return this.prisma.museumGallery.findMany({
            where: {
                museum_gallery_category: {
                    museum_id: {
                        equals: museum_id_query !== undefined ? Number(museum_id_query) : undefined,
                    },
                    name: {
                        contains: query?.filter?.category_name,
                    },
                },
                description: {
                    contains: query?.filter?.description,
                }
            },
            orderBy: {
                ...(query?.sort?.category_name && {
                    museum_gallery_category: {
                        name: query.sort.category_name
                    }
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
                museum_gallery_category: true,
            }
        });
    }

    async findByIdForSuperadmin(id: number) {
        return this.prisma.museumGallery.findFirstOrThrow({
            where: {
                id
            }
        })
    }

    async createForSuperadmin(createDto: CreateMuseumGalleryDto) {
        return this.prisma.museumGallery.create({
            data: createDto,
        })
    }



    async updateForSuperadmin({ delete_image, id, ...updateDto }: UpdateMuseumGalleryDto) {
        return this.prisma.museumGallery.update({
            where: {
                id,
            },
            data: updateDto,
        })
    }

    async deleteForSuperadmin({ id }: DeleteMuseumGalleryDto) {
        return this.prisma.museumGallery.delete({
            where: {
                id,
            },
        });
    }


}
