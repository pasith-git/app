import { Injectable } from '@nestjs/common';
import { CreatePaymentPackageDto, DeletePaymentPackageDto, UpdatePaymentPackageDto } from 'common/dtos/payment-package.dto';
import PaymentPackageQuery from 'common/querys/payment-package.query';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PaymentPackagesService {
    constructor(private prisma: PrismaService) {

    }

    async findAll(museum_id_query?: string,query?: PaymentPackageQuery) {
        return this.prisma.paymentPackage.findMany({
            where: {
                museum_id: museum_id_query ? Number(museum_id_query) : undefined,
            },
            orderBy: {

            },
            ...(query?.limit && {
                take: parseInt(query.limit),
            }),
            ...(query?.offset && {
                skip: parseInt(query.offset),
            }),
        })
    }

    async create({ ...createDto }: CreatePaymentPackageDto) {
        return this.prisma.paymentPackage.create({
            data: {
                ...createDto,
            }
        })
    }

    async update({ delete_image, id, ...updateDto }: UpdatePaymentPackageDto) {
        return this.prisma.paymentPackage.update({
            where: {
                id,
            },
            data: updateDto,
        })
    }

    async delete({ id }: DeletePaymentPackageDto) {
        return this.prisma.paymentPackage.delete({
            where: {
                id,
            },
        });
    }

    async findAllForSuperadmin() {
        return this.prisma.paymentPackage.findMany();
    }

    async findByIdForSuperadmin(id: number) {
        return this.prisma.paymentPackage.findFirstOrThrow({
            where: {
                id,
            }
        });
    }

    async createForSuperadmin(createDto: CreatePaymentPackageDto) {
        return this.prisma.paymentPackage.create({
            data: {
                ...createDto
            },
        })
    }



    async updateForSuperadmin({ delete_image, id, ...updateDto }: UpdatePaymentPackageDto) {
        return this.prisma.paymentPackage.update({
            where: {
                id,
            },
            data: updateDto,
        })
    }

    async deleteForSuperadmin({ id }: DeletePaymentPackageDto) {
        return this.prisma.paymentPackage.delete({
            where: {
                id,
            },
        });
    }
}
