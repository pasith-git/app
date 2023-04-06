import { Post, Req, Res, HttpStatus, Get, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Request, Response, Express } from 'express';
import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Body } from '@nestjs/common';
import { JoiValidationPipe } from 'common/pipes/joi-validation.pipe';
import { loginSchema, refreshTokenSchema, registerSchema, registerSchemaConfirm } from 'common/schemas/auth.schema';
import { LoginDto, RegisterConfirmDto, RegisterDto } from 'common/dtos/auth.dto';
import { UsersService } from 'users/users.service';
import { CustomException } from 'common/exceptions/custom.exception';
import responseUtil from 'common/utils/response.util';
import exclude from 'common/utils/exclude.util';
import dayjsUtil from 'common/utils/dayjs.util';
import { MuseumsService } from 'museums/museums.service';
import { TwilioService } from 'twilio/twilio.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventsGateway } from 'gateway/events.gateway';
import { AuthGuard } from 'common/guards/auth.guard';
import { FormDataValidationPipe } from 'common/pipes/form-data-validation.pipe';
import { FileValidationPipe } from 'common/pipes/file-validation.pipe';
import { createfileGenerator } from 'common/utils/image-processor.util';
import stripe from 'common/instances/stripe.instance';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private usersService: UsersService,
        private twilioService: TwilioService, private eventsGateway: EventsGateway) { }

    @UseGuards(AuthGuard)
    @Get("check-logged-in")
    async checkLoggedIn(@Req() req: Request, @Res() res: Response,) {
        try {
            const [_, access_token] = req.headers.authorization.split(' ');
            const jwtPayload = this.authService.jwtDecode(access_token);
            return res.status(HttpStatus.OK).json(responseUtil({
                req, body: {
                    isAuth: true,
                },
            }));
        } catch (e) {
            throw new CustomException({ error: "Token is invalid" }, HttpStatus.UNAUTHORIZED);
        }

    }

    @Post('login')
    async login(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(loginSchema)) loginDto: LoginDto) {
        try {
            const user = await this.usersService.findByUsernameOrEmail({ email: loginDto.email, username: loginDto.username });
            if (user) {
                const isPassword = this.authService.comparePassword(loginDto.password, user.password);
                if (isPassword) {
                    if (!user.is_active && !user.is_staff) {
                        throw new CustomException({ error: "Access to the system should be granted by an administrator first" });
                    }

                    await this.usersService.update({
                        id: user.id,
                        last_login: dayjsUtil().toDate(),
                    })

                    const tokenPayload = {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        roles: user.roles.map(data => data.role.name.toUpperCase()),
                        is_staff: user.is_staff,
                    }
                    const accessToken = this.authService.jwtSign({
                        ...tokenPayload,
                        name: "auth_token",
                        exp: Math.floor(dayjsUtil().add(1, 'days').valueOf() / 1000),
                    });

                    const refreshToken = this.authService.jwtSign({
                        ...tokenPayload,
                        name: "refresh_token",
                        exp: Math.floor(dayjsUtil().add(7, 'days').valueOf() / 1000),
                    });

                    return res.status(HttpStatus.OK).cookie("refresh_token", refreshToken, {
                        expires: dayjsUtil().add(7, 'days').toDate(),
                    }).json(responseUtil({
                        req, message: "Login successfully", body: {
                            access_token: accessToken,
                        },
                    }));
                }
                throw new CustomException({ error: "Your login information is incorrect" });
            }
            throw new CustomException({ error: "Your login information is incorrect" });
        } catch (e) {
            throw e;
        }
    }


    @Post("refresh")
    async refresh(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(refreshTokenSchema)) refreshDto: { refresh_token: string }) {
        try {
            const jwtPayload = this.authService.jwtVerify(refreshDto.refresh_token || req.cookies['refresh_token']);
            const accessToken = this.authService.jwtSign({
                name: "auth_token",
                id: jwtPayload["id"],
                username: jwtPayload["username"],
                email: jwtPayload["email"],
                roles: jwtPayload["roles"],
                is_staff: jwtPayload["is_staff"],
                exp: Math.floor(dayjsUtil().add(1, 'days').valueOf() / 1000),
            });
            return res.status(HttpStatus.OK).json(responseUtil({
                req,
                body: {
                    access_token: accessToken,
                },
            }))
        } catch (e) {
            throw new CustomException({ error: "Token is invalid" }, HttpStatus.UNAUTHORIZED);
        }
    }

    @Post("logout")
    async logout(@Req() req: Request, @Res() res: Response,) {
        return res.status(HttpStatus.OK).clearCookie("refresh_token").json(responseUtil({
            req, message: "Logout successfully",
        }));
    }


    @Post("register")
    async register(@Req() req: Request, @Res() res: Response, @Body(new JoiValidationPipe(registerSchema)) registerDto: RegisterDto) {
        try {
            const email = await this.usersService.findByEmail(registerDto.phone);
            const username = await this.usersService.findByUsername(registerDto.phone);
            const phone = await this.usersService.findByPhone(registerDto.phone);
            if (email) {
                throw new CustomException({ error: "Email is exist" });
            }
            if (username) {
                throw new CustomException({ error: "Username is exist" });
            }
            if (phone) {
                throw new CustomException({ error: "Phone is exist" });
            }
            await this.twilioService.sendSms(registerDto.phone);
            return res.status(HttpStatus.OK).json(responseUtil({ req, message: `A verification code has been sent to the phone number +${registerDto.phone}` }));
        } catch (e) {
            if (e.code === "P2002") {
                throw e;
            }
            throw new CustomException({ error: "The phone number is incorrect" });
        }
    }

    @Post("register/confirm")
    @UseInterceptors(FileInterceptor("file"))
    async registerConfirm(@Req() req: Request, @Res() res: Response, @Body(new FormDataValidationPipe(registerSchemaConfirm)) registerDto: RegisterConfirmDto,
        @UploadedFile(new FileValidationPipe()) file: Express.Multer.File) {
        try {
            const createFile = createfileGenerator(file, "users", registerDto.username);
            /* await this.twilioService.verifySmsCode(registerDto.phone, registerDto.code); */
            const data = await this.usersService.register({
                ...registerDto,
                image_path: createFile?.filePath
            });

            const stripeCustomer = await stripe.customers.create({
                email: data.email,
                name: `${data.first_name} ${data.last_name}`,
                phone: data.phone,
            });

            await createFile?.generate();
            const updatedData = await this.usersService.update({
                id: data.id,
                stripe_customer_id: stripeCustomer.id,
            })
            return res.status(HttpStatus.OK).json(responseUtil({ req, message: "Registered successfully ", body: exclude(updatedData, ["password"]) }));
        } catch (e) {
            if (e.code === "P2002") {
                throw e;
            } else {
                throw new CustomException({ error: "Something went wrong with the sms verification" });
            }
        }
    }


}
