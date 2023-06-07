import { Injectable } from '@nestjs/common';
import { CreatePaymentDetailDto, DeletePaymentDetailDto, UpdatePaymentDetailDto } from 'common/dtos/payment-detail.dto';
import PaymentDetailQuery from 'common/querys/payment-detail.query';
import { generateBookingCode } from 'common/utils/generators.util';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PaymentDetailsService {
    constructor(private prisma: PrismaService) { }

    

}
