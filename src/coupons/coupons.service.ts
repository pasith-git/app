import { Injectable } from '@nestjs/common';
import { CouponStatus, DiscountType } from '@prisma/client';
import { CreateCouponDto, DeleteCouponDto, UpdateCouponDto } from 'common/dtos/coupon.dto';
import CouponQuery from 'common/querys/coupon.query';
import generateCouponCode from 'common/utils/coupon-generator.util';
import dayjsUtil from 'common/utils/dayjs.util';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CouponsService {
    constructor(private prisma: PrismaService) { }

    async findAll(museum_id_query?: number, query?: CouponQuery) {
        return this.prisma.coupon.findMany({
            where: {
                code: {
                    contains: query?.filter?.code,
                },
                coupon_status: {
                    equals: query?.filter?.coupon_status as CouponStatus,
                },
                museum_id: museum_id_query,
                expired_date: {
                    gte: query?.filter?.expired_date?.start_date && dayjsUtil(query?.filter?.expired_date?.start_date, "DD/MM/YYYY").toDate(),
                    lt: query?.filter?.expired_date?.end_date && dayjsUtil(query?.filter?.expired_date?.end_date, "DD/MM/YYYY").toDate(),
                },
                discount_amount: {
                    equals: query?.filter?.discount_amount,
                },
                discount_type: {
                    equals: query?.filter?.discount_type as DiscountType,
                }
            },
            orderBy: {
                ...(query?.sort?.code && {
                    code: query.sort.code
                }),
                ...(query?.sort?.expired_date && {
                    expired_date: query.sort.expired_date
                }),
            },
            ...(query?.limit && {
                take: parseInt(query.limit),
            }),
            ...(query?.offset && {
                skip: parseInt(query.offset),
            }),
            include: {
                museum: true,
            }
        });
    }

    async findById(id: number) {
        return this.prisma.coupon.findFirstOrThrow({
            where: {
                id
            },
            include: {
                museum: true,
            }
        })
    }

    async create({ museum_id, ...createDto }: CreateCouponDto) {
        return this.prisma.coupon.create({
            data: {
                ...createDto,
                expired_date: dayjsUtil(createDto.expired_date, "DD/MM/YYYY").toDate(),
                coupon_status: "active",
                code: createDto.code || generateCouponCode(),
                museum: {
                    connect: {
                        id: museum_id,
                    }
                },
            },
            include: {
                museum: true,
            }
        })
    }



    async update({ id, generate_code, ...updateDto }: UpdateCouponDto) {
        return this.prisma.coupon.update({
            where: {
                id,
            },
            data: {
                ...updateDto,
                code: generate_code && generateCouponCode(),
                expired_date: updateDto.expired_date && dayjsUtil(updateDto.expired_date, "DD/MM/YYYY").toDate(),
            },
        })
    }

    async delete({ id }: DeleteCouponDto) {
        return this.prisma.coupon.delete({
            where: {
                id,
            },
        });
    }

}
