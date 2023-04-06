import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'common/guards/auth.guard';
import { UsersService } from 'users/users.service';
import { PaymentWalletsService } from './payment-wallets.service';
import { Request, Response, Express } from 'express';
import { JoiValidationPipe } from 'common/pipes/joi-validation.pipe';
import { CreatePaymentMethodDto } from 'common/dtos/payment-method.dto';
import { createPaymentMethodSchema } from 'common/schemas/payment-method.schema';
import { AuthService } from 'auth/auth.service';
import responseUtil from 'common/utils/response.util';
import MESSAGE from 'common/utils/message.util';
import stripe from 'common/instances/stripe.instance';

@Controller('')
export class PaymentWalletsController {
    constructor(private usersService: UsersService, private paymentMethodsService: PaymentWalletsService, private authService: AuthService) { }

    @UseGuards(AuthGuard)
    @Post("payment-methods")
    async create(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(createPaymentMethodSchema)) createDto: CreatePaymentMethodDto,) {
        try {
            const [_, access_token] = req.headers.authorization.split(' ');
            const jwtPayload = this.authService.jwtDecode(access_token);
            const user = await this.usersService.findById(jwtPayload["id"]);
            const data = await this.paymentMethodsService.create({
                ...createDto,
                user_id: user.id,
            });
            await stripe.paymentMethods.create({
                customer: user.stripe_customer_id,
            })
            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data }));
        } catch (e) {
            throw e;
        }
    }
}
