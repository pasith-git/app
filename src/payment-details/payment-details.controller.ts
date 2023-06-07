import { Get, Req, Res, Controller, HttpStatus, Post, Body, UseInterceptors, UploadedFiles, Put, UploadedFile, Query, Param, UseGuards, Delete } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AuthService } from 'auth/auth.service';
import { Roles } from 'common/decorators/role.decorator';
import { CreateCountryDto, DeleteCountryDto, UpdateCountryDto } from 'common/dtos/country.dto';
import { CreatePaymentDetailDto, DeletePaymentDetailDto, UpdatePaymentDetailDto } from 'common/dtos/payment-detail.dto';
import Role from 'common/enums/role.enum';
import { AuthGuard } from 'common/guards/auth.guard';
import { MuseumIdGuard } from 'common/guards/museumId.guard';
import { FilesValidationPipe, FileValidationPipe } from 'common/pipes/file-validation.pipe';
import { JoiValidationPipe } from 'common/pipes/joi-validation.pipe';
import PaymentDetailQuery from 'common/querys/payment-detail.query';
import { createPaymentDetailSchema, deletePaymentDetailSchema, deletePaymentDetailSchemaForSuperadmin, updatePaymentDetailSchema, createPaymentDetailSchemaForSuperadmin, updatePaymentDetailSchemaForSuperadmin } from 'common/schemas/payment-detail.schema';
import { createfileGenerator, deleteFileGenerator, updatefileGenerator } from 'common/utils/image-processor.util';
import MESSAGE from 'common/utils/message.util';
import responseUtil from 'common/utils/response.util';
import { Request, Response, Express } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from 'users/users.service';

import { PaymentDetailsService } from './payment-details.service';

const PREFIX = 'payment-details';

@Controller('')
export class PaymentDetailsController {
    constructor(private prisma: PrismaService, private paymentDetailsService: PaymentDetailsService, private authService: AuthService, private usersService: UsersService) { }



}
