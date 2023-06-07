import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'common/decorators/role.decorator';
import Role from 'common/enums/role.enum';
import { AuthGuard } from 'common/guards/auth.guard';
import { MuseumIdGuard } from 'common/guards/museumId.guard';
import { FileValidationPipe } from 'common/pipes/file-validation.pipe';
import { FormDataValidationPipe } from 'common/pipes/form-data-validation.pipe';
import { createPaymentSchema, createPaymentSchemaForSuperadmin, updatePaymentSchema, updatePaymentSchemaForSuperadmin } from 'common/schemas/payment.schema';
import { createfileGenerator, deleteFileGenerator, updatefileGenerator } from 'common/utils/image-processor.util';
import responseUtil from 'common/utils/response.util';
import { PaymentsService } from 'payments/payments.service';
import { PrismaService } from 'prisma/prisma.service';
import { Request, Response, Express } from 'express';
import MESSAGE from 'common/utils/message.util';
import { CreatePaymentDto, UpdatePaymentDto } from 'common/dtos/payment.dto';
import { BookingsService } from 'bookings/bookings.service';
import dayjsUtil from 'common/utils/dayjs.util';
import PaymentQuery from 'common/querys/payment.query';
import { PaymentDetailsService } from 'payment-details/payment-details.service';
import { AuthService } from 'auth/auth.service';
import { UsersService } from 'users/users.service';
import { CustomException } from 'common/exceptions/custom.exception';
import generateTransactionId from 'common/utils/transaction-generator.util';
import generateInvoiceId from 'common/utils/inv-generator.util';
import { Bcel } from 'bcel/bcel';

const PREFIX = "paymment";

@Controller('')
export class PaymentsController {

    constructor(private prisma: PrismaService, private paymentsService: PaymentsService,
        private bookingsService: BookingsService, private paymentDetailsService: PaymentDetailsService,
        private authService: AuthService, private usersService: UsersService) { }

    

}
