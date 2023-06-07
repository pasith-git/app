import { HttpStatus, Injectable } from '@nestjs/common';
import { PaymentType, PaymentWay, Status } from '@prisma/client';
import { BookingsService } from 'bookings/bookings.service';
import { CreatePaymentDto, DeletePaymentDto, UpdatePaymentDto } from 'common/dtos/payment.dto';
import { CustomException } from 'common/exceptions/custom.exception';
import PaymentQuery from 'common/querys/payment.query';
import dayjsUtil from 'common/utils/dayjs.util';
import generateInvoiceId from 'common/utils/inv-generator.util';
import generateTransactionId from 'common/utils/transaction-generator.util';
import { PaymentDetailsService } from 'payment-details/payment-details.service';
import { PricesService } from 'prices/prices.service';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from 'users/users.service';

@Injectable()
export class PaymentsService {
    constructor(private prisma: PrismaService, private bookingsService: BookingsService,
        private usersService: UsersService, private pricesService: PricesService) { }
    async create(createDto: CreatePaymentDto) {
        return await this.prisma.payment.create({
            data: {
                ...createDto,
            }
        })
    }
}
