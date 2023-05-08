import { Injectable } from '@nestjs/common';
import { CreatePhotoDto, DeletePhotoDto, UpdatePhotoDto } from 'common/dtos/photo.dto';
import PhotoQuery from 'common/querys/photo.query';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PhotosService {
    constructor(private prisma: PrismaService) { }
    async findAll(museum_id_query?: number, query?: PhotoQuery) {
        return this.prisma.photo.findMany({
            where: {
                title: {
                    contains: query?.filter?.title,
                },
                content_id: query?.filter?.content_id ? parseInt(query?.filter?.content_id) : undefined,
                ...(museum_id_query && {
                    content: {
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
                content: true
            }
        });
    }

    async findById(id: number) {
        return this.prisma.photo.findFirstOrThrow({
            where: {
                id
            },
            include: {
                content: true
            }
        })
    }

    async create({ content_id, ...createDto }: CreatePhotoDto) {
        return this.prisma.photo.create({
            data: {
                ...createDto,
                content: {
                    connect: {
                        id: content_id,
                    }
                },

            },
            include: {
                content: true
            }
        })
    }



    async update({ id, ...updateDto }: UpdatePhotoDto) {
        return this.prisma.photo.update({
            where: {
                id,
            },
            data: updateDto,
        })
    }

    async delete({ id }: DeletePhotoDto) {
        return this.prisma.photo.delete({
            where: {
                id,
            },
        });
    }
}
