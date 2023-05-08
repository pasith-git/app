import { Body, Controller, Delete, Get, HttpStatus, Post, Put, Query, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { BcelService } from 'bcel/bcel.service';
import { Request, Response } from 'express';
import PaymentMuseumScheduleQuery from 'common/querys/museum-schedule-payment.query';
import responseUtil from 'common/utils/response.util';
import generateTransactionId from 'common/utils/transaction-generator.util';
import { MuseumSchedulePaymentsService } from './museum-schedule-payments.service';
import { AuthService } from 'auth/auth.service';
import { UsersService } from 'users/users.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FormDataValidationPipe } from 'common/pipes/form-data-validation.pipe';
import { createManyMuseumSchedulePaymentSchema, deleteManyMuseumSchedulePaymentSchema, generateQrMuseumSchedulePaymentSchema, payMuseumSchedulePaymentSchema, updateManyMuseumSchedulePaymentSchema } from 'common/schemas/museum-schedule-payment.schema';
import { CreateMuseumSchedulePaymentDto, DeleteMuseumSchedulePaymentDto, GenerateQrMuseumSchedulePaymentDto, PayMuseumSchedulePaymentDto, UpdateMuseumSchedulePaymentDto } from 'common/dtos/museum-schedule-payment.dto';
import { FilesValidationPipe } from 'common/pipes/file-validation.pipe';
import { PrismaService } from 'prisma/prisma.service';
import dayjsUtil from 'common/utils/dayjs.util';
import { CustomException } from 'common/exceptions/custom.exception';
import { createfileGenerator, deleteFileGenerator, updatefileGenerator } from 'common/utils/image-processor.util';
import MESSAGE from 'common/utils/message.util';
import { MuseumSchedulesService } from 'museum-schedules/museum-schedules.service';
import { JoiValidationPipe } from 'common/pipes/joi-validation.pipe';
import { AuthGuard } from 'common/guards/auth.guard';
import { MuseumIdGuard } from 'common/guards/museumId.guard';
import MuseumSchedulePaymentQuery from 'common/querys/museum-schedule-payment.query';
import { Roles } from 'common/decorators/role.decorator';
import Role from 'common/enums/role.enum';
import { ErrorCode } from 'common/utils/error-code.util';
import stripe from 'common/instances/stripe.instance';
import _ from "lodash";
import { RequiredWalletGuard } from 'common/guards/required-wallet.guard';

const PREFIX = "museum-schedule-payments"

@Controller('')
export class MuseumSchedulePaymentsController {
    constructor(private bcelService: BcelService, private museumSchedulePaymentsService: MuseumSchedulePaymentsService,
        private authService: AuthService, private usersService: UsersService, private prisma: PrismaService,
        private museumSchedulesService: MuseumSchedulesService) { }

    @Post("museum-schedule-payments/test")
    async generateQrCode(@Req() req: Request, @Res() res: Response) {
        const arr = [{ id: 1, value: 1000 }, { id: 1, value: 1000 }, { id: 1, value: 1000 }, { id: 3, value: 2000 }];

        const result = _(arr)
            .groupBy('id')
            .map((objs, key) => ({
                'id': key,
                'value': _.sumBy(objs, 'value')
            }))
            .value();
        console.log(result);
        await stripe.paymentMethods.create({

        })
    }

    @UseGuards(AuthGuard, RequiredWalletGuard)
    @Post("museum-schedule-payments/pay")
    async payByStripe(@Req() req: Request, @Res() res: Response, @Body(new JoiValidationPipe(payMuseumSchedulePaymentSchema)) createDto: PayMuseumSchedulePaymentDto) {
        const [header, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = await this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]);
        const isDomesticCountry = user.country.name.toLowerCase() !== "laos" ? true : false;
        /* const user = await this.usersService.findById(createDto.user_id); */
        const modifyMuseumSchedules = _(createDto.museum_schedules)
            .groupBy('id')
            .map((objs, key) => ({
                'id': parseInt(key),
                'user_limit': _.sumBy(objs, 'user_limit')
            }))
            .value();
        const museum_schedules = await this.museumSchedulesService.findByManyIds(modifyMuseumSchedules.map(data => data.id));

        const museum_schedules_total = museum_schedules.map((museum_schedule, i) => {
            const changedPrice = isDomesticCountry ? Number(museum_schedule.domestic_price) : Number(museum_schedule.price);
            const discount = museum_schedule.discount ? Number(museum_schedule.discount) / 100 : 0;
            const museum_schedule_price = (changedPrice - (changedPrice * discount)) * createDto.museum_schedules[i].user_limit;
            const current_date = dayjsUtil().second(0).millisecond(0);

            if (museum_schedule.status !== "pending" || museum_schedule.user_limit_status !== "available") {
                throw new CustomException({ error: "It's in action, can't create", code: ErrorCode.raCreate });
            }

            const start_time_by_hour = dayjsUtil(museum_schedule.schedule_time.start_time).hour();
            const start_time_by_minute = dayjsUtil(museum_schedule.schedule_time.start_time).minute();

            if (dayjsUtil(museum_schedule.start_date)
                .set("h", start_time_by_hour)
                .set("m", start_time_by_minute)
                .isSameOrBefore(current_date)) {
                throw new CustomException({ error: "Some of the museum_schedules's times have expired" });
            }

            if ((createDto.museum_schedules[i].user_limit + museum_schedule.current_users) > museum_schedule.user_limit) {
                throw new CustomException({ error: "Some of the museum schedules have reached its user limit" });
            }

            return museum_schedule_price
        });
        const total = museum_schedules_total.reduce((prev, current) => prev + current, 0)

        const stripePaymentIntents = await stripe.paymentIntents.create({
            amount: total,
            currency: "lak",
            payment_method_types: ["card"]
        })



        return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: stripePaymentIntents.client_secret, }));
    }

    @Get("museum-schedule-payments/pay/confirm")
    async confirmPayByStripe(@Req() req: Request, @Res() res: Response) {
        res.send("success")
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.AGENT, Role.GOD, Role.OWNER)
    @Get("")
    async findAll(@Req() req: Request, @Res() res: Response, @Query() { filter: { museum_id, ...filter } = {}, ...query }: MuseumSchedulePaymentQuery) {
        /* const [_, access_token] = req.headers.authorization?.split(' ');
        const jwtPayload = await this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]); */
        const data_fixed = await this.museumSchedulePaymentsService.findAll(museum_id);
        const data_temp = await this.museumSchedulePaymentsService.findAll(museum_id, {
            filter,
            ...query,
        });
        res.append('X-Total-Count-Fixed', data_fixed.length.toString());
        res.append('X-Total-Count-Temp', data_temp.length.toString());
        return res.json(responseUtil({
            req,
            body: data_temp,
        }))
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Post("")
    @UseInterceptors(FilesInterceptor("files"))
    async createMany(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(createManyMuseumSchedulePaymentSchema)) createManyDto: CreateMuseumSchedulePaymentDto[],

        @UploadedFiles(new FilesValidationPipe()) files: Array<Express.Multer.File>) {
        try {
            const [_, access_token] = req.headers.authorization?.split(' ');
            const jwtPayload = this.authService.jwtVerify(access_token);
            const user = await this.usersService.findById(jwtPayload["id"]);
            const dataTransactions = await this.prisma.$transaction(async (tx) => {
                return await Promise.all(createManyDto.map(async (createDto, i) => {
                    /* const user = await this.usersService.findById(createDto.user_id); */
                    const museum_schedules = await this.museumSchedulesService.findByManyIds(createDto.museum_schedules.map(data => data.id));

                    let total = 0;
                    const museum_schedules_update = museum_schedules.map((museum_schedule, i) => {
                        const discount = museum_schedule.discount ? Number(museum_schedule.discount) / 100 : 0
                        const museum_schedule_total = (Number(museum_schedule.price) - (Number(museum_schedule.price) * discount)) * createDto.museum_schedules[i].user_limit;
                        total += museum_schedule_total;
                        const current_date = dayjsUtil().second(0).millisecond(0);
                        if (museum_schedule.status !== "pending" || museum_schedule.user_limit_status !== "available") {
                            throw new CustomException({ error: "It's in action, can't create", code: ErrorCode.raCreate });
                        }

                        if (dayjsUtil(museum_schedule.start_date).isSameOrBefore(current_date)) {
                            throw new CustomException({ error: "Some of the museum_schedules's times have expired" });
                        }

                        if ((createDto.museum_schedules[i].user_limit + museum_schedule.current_users) > museum_schedule.user_limit) {
                            throw new CustomException({ error: "Some of the museum schedules have reached its user limit" });
                        }


                        return {
                            data: {
                                ...createDto.museum_schedules[i],
                                total: museum_schedule_total,
                            },
                            generate: this.prisma.museumSchedule.update({
                                where: {
                                    id: createDto.museum_schedules[i].id,
                                },
                                data: {
                                    ...((createDto.museum_schedules[i].user_limit + museum_schedule.current_users) === museum_schedule.user_limit && {
                                        user_limit_status: "full",
                                    }),
                                    current_users: {
                                        increment: createDto.museum_schedules[i].user_limit,
                                    },
                                    user_limit: {
                                        decrement: createDto.museum_schedules[i].user_limit,
                                    }
                                }
                            })
                        }
                    });
                    const createFile = createfileGenerator(files?.[i], PREFIX, PREFIX);
                    return {
                        data: await this.museumSchedulePaymentsService.create({
                            ...createDto,
                            museum_id: user.museum_id,
                            museum_schedules: museum_schedules_update.map(({ data }) => data),
                            employee_id: user.id,
                            transaction_id: generateTransactionId(),
                            payment_date: dayjsUtil().toDate(),
                            total,
                            status: "success",
                            ...(createDto.payment_type === "bank" && {
                                bank_percent_amount: total * 0.01,
                                bank_percentage: 1,
                            }),
                            image_path: createFile?.filePath,
                        }),
                        update: await Promise.all(museum_schedules_update.map(({ generate }) => generate)),
                        createFile: createFile?.generate(),
                    }
                }))
            })

            await Promise.all(dataTransactions.map(async ({ createFile }, i) => {
                createFile;
            }))

            const data = dataTransactions.map(dataTransaction => dataTransaction.data);

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Put("")
    @UseInterceptors(FilesInterceptor('files'))
    async updateMany(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(updateManyMuseumSchedulePaymentSchema)) updateManyDto: UpdateMuseumSchedulePaymentDto[],
        @UploadedFiles(new FilesValidationPipe()) files: Array<Express.Multer.File>) {
        try {
            const dataTransactions = await this.prisma.$transaction(async () => {
                return await Promise.all(updateManyDto.map(async (updateDto, i) => {
                    /* const museum_schedules = await this.museumSchedulesService.findByManyIds(updateDto.museum_schedules.map(data => data.id)); */
                    /* const paymentMuseumSchedule = await this.paymentMuseumSchedulesService.findById(updateDto.id); */
                    /* let total = 0;
                    museum_schedules.map(museum_schedule => {
                        total += Number(museum_schedule.price) - (Number(museum_schedule.price) * Number(museum_schedule.discount || 0));
                    }); */
                    const museum_schedule_payment = await this.museumSchedulePaymentsService.findById(updateDto.id);
                    const updateFile = updatefileGenerator(files?.[i], PREFIX, PREFIX, PREFIX, museum_schedule_payment.image_path, updateDto.delete_image);
                    return {
                        data: await this.museumSchedulePaymentsService.update({
                            ...updateDto,
                            image_path: updateFile?.filePath,
                        }),
                        updateFile: updateFile.generate(),
                    }
                }))
            })

            await Promise.all(dataTransactions.map(async ({ updateFile }, i) => {
                updateFile;
            }))

            const data = dataTransactions.map(dataTransaction => dataTransaction.data);

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data }));

        } catch (e) {
            throw e;
        }

    }

    @UseGuards(AuthGuard, MuseumIdGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.GOD, Role.OWNER)
    @Post("delete")
    async deleteMany(@Req() req: Request, @Res() res: Response, @Body(new JoiValidationPipe(deleteManyMuseumSchedulePaymentSchema)) deleteManyDto: DeleteMuseumSchedulePaymentDto[]) {
        try {
            const dataTransactions = await this.prisma.$transaction(async () => {
                return await Promise.all(deleteManyDto.map(async (deleteDto, i) => {
                    const dataById = await this.museumSchedulePaymentsService.findById(deleteDto.id);
                    const deleteFile = deleteFileGenerator(dataById.image_path);
                    return {
                        data: await this.museumSchedulePaymentsService.delete({
                            id: deleteDto.id,
                        }),
                        deleteFile: deleteFile?.generate(),
                    }
                }))
            })

            await Promise.all(dataTransactions.map(async ({ deleteFile }, i) => {
                deleteFile;
            }))

            const data = dataTransactions.map(dataTransaction => dataTransaction.data);

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }
}
