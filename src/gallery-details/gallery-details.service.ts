import { Injectable } from '@nestjs/common';
import { CreateGalleryDetailDto, DeleteGalleryDetailDto, UpdateGalleryDetailDto } from 'common/dtos/gallery-detail.dto';
import GalleryDetailQuery from 'common/querys/gallery-detail.query';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class GalleryDetailsService {
    constructor(private prisma: PrismaService) { }
    async findAll(museum_id_query?: number, query?: GalleryDetailQuery) {
        return this.prisma.galleryDetail.findMany({
            where: {
                title: {
                    contains: query?.filter?.title,
                },
                gallery_id: query?.filter?.gallery_id ? parseInt(query?.filter?.gallery_id) : undefined,
                ...(museum_id_query && {
                    gallery: {
                        museum_id: museum_id_query,
                    }
                })
            },
            orderBy: {
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
                gallery: true
            }
        });
    }

    async findById(id: number) {
        return this.prisma.galleryDetail.findFirstOrThrow({
            where: {
                id
            },
            include: {
                gallery: true
            }
        })
    }

    async create({ gallery_id, ...createDto }: CreateGalleryDetailDto) {
        return this.prisma.galleryDetail.create({
            data: {
                ...createDto,
                gallery: {
                    connect: {
                        id: gallery_id,
                    }
                },

            },
            include: {
                gallery: true
            }
        })
    }



    async update({ id, ...updateDto }: UpdateGalleryDetailDto) {
        return this.prisma.galleryDetail.update({
            where: {
                id,
            },
            data: updateDto,
        })
    }

    async delete({ id }: DeleteGalleryDetailDto) {
        return this.prisma.galleryDetail.delete({
            where: {
                id,
            },
        });
    }
}
