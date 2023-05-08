import { HttpStatus, Injectable } from '@nestjs/common';
import { PaymentType, PaymentWay, Status } from '@prisma/client';
import { BookingsService } from 'bookings/bookings.service';
import { CreatePaymentDto, DeletePaymentDto, UpdatePaymentDto } from 'common/dtos/payment.dto';
import { CustomException } from 'common/exceptions/custom.exception';
import PaymentQuery from 'common/querys/payment.query';
import dayjsUtil from 'common/utils/dayjs.util';
import generateTransactionId from 'common/utils/transaction-generator.util';
import { PaymentDetailsService } from 'payment-details/payment-details.service';
import { PricesService } from 'prices/prices.service';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from 'users/users.service';

@Injectable()
export class PaymentsService {
    constructor(private prisma: PrismaService, private bookingsService: BookingsService,
        private usersService: UsersService, private pricesService: PricesService) { }
    async findAll(museum_id_query?: number, query?: PaymentQuery) {
        const data = await this.prisma.payment.findMany({
            where: {
                user_id: {
                    equals: query?.filter?.user_id && parseInt(query?.filter?.user_id),
                },
                booking_id: {
                    equals: query?.filter?.booking_id && parseInt(query?.filter?.booking_id),
                },
                booking: {
                    museum_id: {
                        equals: query?.filter?.museum_id && parseInt(query?.filter?.museum_id),
                    }
                },
                way: {
                    equals: query?.filter?.way as PaymentWay
                },
                type: {
                    equals: query?.filter?.way as PaymentType
                },
                is_foreigner: {
                    equals: query?.filter?.is_foreigner && Boolean(query?.filter?.is_foreigner)
                },
                status: {
                    equals: query?.filter?.status as Status
                },
                paid_at: {
                    gte: query?.filter?.paid_at?.start_date && dayjsUtil(query?.filter?.paid_at?.start_date, "DD/MM/YYYY HH:mm").toDate(),
                    lt: query?.filter?.paid_at?.end_date && dayjsUtil(query?.filter?.paid_at?.end_date, "DD/MM/YYYY HH:mm").toDate(),
                },
                booked_at: {
                    gte: query?.filter?.booked_at?.start_date && dayjsUtil(query?.filter?.booked_at?.start_date, "DD/MM/YYYY HH:mm").toDate(),
                    lt: query?.filter?.booked_at?.end_date && dayjsUtil(query?.filter?.booked_at?.end_date, "DD/MM/YYYY HH:mm").toDate(),
                },
                created_at: {
                    gte: query?.filter?.created_at?.start_date && dayjsUtil(query?.filter?.created_at?.start_date, "DD/MM/YYYY HH:mm").toDate(),
                    lt: query?.filter?.created_at?.end_date && dayjsUtil(query?.filter?.created_at?.end_date, "DD/MM/YYYY HH:mm").toDate(),
                },
                updated_at: {
                    gte: query?.filter?.updated_at?.start_date && dayjsUtil(query?.filter?.updated_at?.start_date, "DD/MM/YYYY HH:mm").toDate(),
                    lt: query?.filter?.updated_at?.end_date && dayjsUtil(query?.filter?.updated_at?.end_date, "DD/MM/YYYY HH:mm").toDate(),
                },


            },
            orderBy: {
                ...(query?.sort?.paid_at && {
                    paid_at: query.sort.paid_at
                }),
                ...(query?.sort?.booked_at && {
                    booked_at: query.sort.booked_at
                }),
                ...(query?.sort?.created_at && {
                    created_at: query.sort.created_at
                }),
                ...(query?.sort?.updated_at && {
                    updated_at: query.sort.updated_at
                }),
                ...(query?.sort?.total && {
                    total: query.sort.total
                }),
                ...(query?.sort?.total_with_discount && {
                    total_with_discount: query.sort.total_with_discount
                }),
            },
            ...(query?.limit && {
                take: parseInt(query.limit),
            }),
            ...(query?.offset && {
                skip: parseInt(query.offset),
            }),
            include: {
                user: true,
                payment_details: true,
            }
        });

        return data.map(({ user: { password, ...user }, ...data }) => ({
            ...data,
            user,
        }))
    }

    async findById(id: number) {
        const { user: { password, ...user }, ...data } = await this.prisma.payment.findFirstOrThrow({
            where: {
                id
            },
            include: {
                user: true,
                payment_details: true,
            }
        })

        return {
            ...data,
            user,
        }
    }

    async create({ booking_id, user_id, people, ...createDto }: CreatePaymentDto) {
        const booking = await this.bookingsService.findById(booking_id);
        const userById = await this.usersService.findById(user_id);
        const is_foreigner = userById ? userById.country.name.toLowerCase() !== "laos" ? true : false : createDto.is_foreigner;

        const people_booking = await Promise.all(people.map(async (data) => {
            const price = await this.pricesService.findById(data.price_id);
            return {
                amount: data.amount,
                age_group: "adult",
                price: 0,
            }
        }));
        const total = people_booking.reduce((prev, current) => prev + (current.amount * Number(current.price)), 0);
        const adult_total = people_booking.filter(data => data.age_group === "adult").reduce((prev, current) => prev + (current.amount * Number(current.price)), 0);
        const number_of_adult = people_booking.filter(data => data.age_group === "adult").reduce((prev, current) => prev + current.amount, 0);
        const child_total = people_booking.filter(data => data.age_group === "child").reduce((prev, current) => prev + (current.amount * Number(current.price)), 0);
        const number_of_child = people_booking.filter(data => data.age_group === "child").reduce((prev, current) => prev + current.amount, 0);
        let discount_total = booking.discount_type === "money" ? booking.discount_amount : total * Number(booking.discount_amount) / 100;
        let total_with_discount = total - Number(discount_total);

        if (createDto.total_pay && createDto.total_pay < total_with_discount) {
            throw new CustomException({ error: `The amount paid is not enough for ${total_with_discount}` });
        }
        /* if (((number_of_child + number_of_adult) + booking.user_active) > booking.booking_amount_limit) {
            throw new CustomException({ error: "The museum schedule is full" });
        } */
        const [start_time, end_time] = booking.schedule_time_str.split("-");
        const start_time_by_hour = dayjsUtil(start_time, "HH:mm").utc().hour();
        const start_time_by_minute = dayjsUtil(start_time, "HH:mm").utc().minute();
        const end_time_by_hour = dayjsUtil(end_time, "HH:mm").utc().hour();
        const end_time_by_minute = dayjsUtil(end_time, "HH:mm").utc().minute();
        const current_date = dayjsUtil();
        const start_date = dayjsUtil(booking.schedule_date).utc(true).set("h", start_time_by_hour).set("m", start_time_by_minute);
        const end_date = dayjsUtil(booking.schedule_date).utc(true).set("h", end_time_by_hour).set("m", end_time_by_minute);
        if (!(start_date.isSameOrAfter(current_date) && start_date.isBefore(end_date))) {
            throw new CustomException({ error: "The museum schedule is already on active or completed" });
        }

        const { user: { password, ...user }, ...data } = await this.prisma.payment.create({
            data: {
                booking: {
                    connect: {
                        id: booking_id,
                    }
                },
                ...(user_id && {
                    user: {
                        connect: {
                            id: user_id,
                        }
                    },
                }),
                ...createDto,
                total,
                child_total,
                adult_total,
                number_of_adult,
                number_of_child,
                transaction_id: generateTransactionId(),
                paid_at: createDto.status === "success" && dayjsUtil().toDate(),
                booked_at: dayjsUtil().toDate(),
                ...(booking.discount_type && {
                    discount_type: booking.discount_type,
                    discount_amount: booking.discount_amount,
                    total_with_discount,
                    discount_total,
                }),
                ...(createDto.total_pay && {
                    total_pay: createDto.total_pay,
                    total_charge: createDto.total_pay - Number(total_with_discount),
                })
            },
            include: {
                user: true,
                payment_details: true,
            }

        })

        return {
            ...data,
            user,
        }
    }



    async update({ id, ...updateDto }: UpdatePaymentDto) {
        const payment = await this.findById(id);

        if (updateDto.total_pay && updateDto.total_pay < Number(payment.total_with_discount)) {
            throw new CustomException({ error: `The amount paid is not enough for ${payment.total_with_discount}` });
        }
        const { user: { password, ...user }, ...data } = await this.prisma.payment.update({
            where: {
                id,
            },
            data: {
                ...updateDto,
                ...(updateDto.status === "success" && {
                    paid_at: dayjsUtil().toDate(),
                }),
                ...((updateDto.status === "pending" || updateDto.status === "failure") && {
                    paid_at: null,
                }),
                ...(updateDto.total_pay && {
                    total_pay: updateDto.total_pay,
                    total_charge: updateDto.total_pay - Number(payment.total_with_discount),
                }),
                ...(updateDto.total_pay === null && {
                    total_pay: null,
                    total_charge: null,
                }),

            },
            include: {
                user: true,
                payment_details: true,
            }
        })
        return {
            ...data,
            user,
        }
    }

    async delete({ id }: DeletePaymentDto) {
        const { user: { password, ...user }, ...data } = await this.prisma.payment.delete({
            where: {
                id,
            },
            include: {
                user: true,
                payment_details: true,
            }
        });
        return {
            ...data,
            user,
        }
    }
}
