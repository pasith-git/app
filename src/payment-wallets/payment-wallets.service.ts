import { Injectable } from '@nestjs/common';
import { CreatePaymentMethodDto } from 'common/dtos/payment-method.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PaymentWalletsService {
    constructor(private prisma: PrismaService) { }
    async create({ user_id, ...createDto }: CreatePaymentMethodDto) {
        return this.prisma.paymentWallets.create({
            data: {
                ...createDto,
                user: {
                    connect: {
                        id: user_id
                    }
                },
            
            },
            include: {
                user: true
            }
        })
    }
}
