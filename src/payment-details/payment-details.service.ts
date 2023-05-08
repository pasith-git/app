import { Injectable } from '@nestjs/common';
import { CreatePaymentDetailDto, DeletePaymentDetailDto, UpdatePaymentDetailDto } from 'common/dtos/payment-detail.dto';
import PaymentDetailQuery from 'common/querys/payment-detail.query';
import { generateBookingCode } from 'common/utils/generators.util';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PaymentDetailsService {
    constructor(private prisma: PrismaService) { }

    async findAll(museum_id_query?: number, query?: PaymentDetailQuery) {
        return this.prisma.paymentDetail.findMany({
            where: {

            },
            orderBy: {

            },
            ...(query?.limit && {
                take: parseInt(query.limit),
            }),
            ...(query?.offset && {
                skip: parseInt(query.offset),
            }),
            include: {
                payment: true
            }
        });
    }

    async findById(id: number) {
        return this.prisma.paymentDetail.findFirstOrThrow({
            where: {
                id
            },
            include: {
                payment: true,
            }
        })
    }

    async create({ payment_id, ...createDto }: CreatePaymentDetailDto) {
        return this.prisma.paymentDetail.create({
            data: {
                ...createDto,
                booking_code: generateBookingCode(),
                is_checked_in: false,
                is_printed: false,
                payment: {
                    connect: {
                        id: payment_id,
                    }
                },
            },
            include: {
                payment: true,
            }
        })
    }



    async update({ id, ...updateDto }: UpdatePaymentDetailDto) {
        return this.prisma.paymentDetail.update({
            where: {
                id,
            },
            data: updateDto,
        })
    }

    async delete({ id }: DeletePaymentDetailDto) {
        return this.prisma.paymentDetail.delete({
            where: {
                id,
            },
        });
    }

}
