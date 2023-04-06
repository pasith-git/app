"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.MuseumSchedulePaymentsController = void 0;
var common_1 = require("@nestjs/common");
var response_util_1 = require("common/utils/response.util");
var transaction_generator_util_1 = require("common/utils/transaction-generator.util");
var platform_express_1 = require("@nestjs/platform-express");
var form_data_validation_pipe_1 = require("common/pipes/form-data-validation.pipe");
var museum_schedule_payment_schema_1 = require("common/schemas/museum-schedule-payment.schema");
var file_validation_pipe_1 = require("common/pipes/file-validation.pipe");
var dayjs_util_1 = require("common/utils/dayjs.util");
var custom_exception_1 = require("common/exceptions/custom.exception");
var image_processor_util_1 = require("common/utils/image-processor.util");
var message_util_1 = require("common/utils/message.util");
var joi_validation_pipe_1 = require("common/pipes/joi-validation.pipe");
var auth_guard_1 = require("common/guards/auth.guard");
var package_guard_1 = require("common/guards/package.guard");
var museumId_guard_1 = require("common/guards/museumId.guard");
var role_decorator_1 = require("common/decorators/role.decorator");
var role_enum_1 = require("common/enums/role.enum");
var error_code_util_1 = require("common/utils/error-code.util");
var PREFIX = "museum-schedule-payments";
var MuseumSchedulePaymentsController = /** @class */ (function () {
    function MuseumSchedulePaymentsController(bcelService, museumSchedulePaymentsService, authService, usersService, prisma, museumSchedulesService) {
        this.bcelService = bcelService;
        this.museumSchedulePaymentsService = museumSchedulePaymentsService;
        this.authService = authService;
        this.usersService = usersService;
        this.prisma = prisma;
        this.museumSchedulesService = museumSchedulesService;
    }
    /* @Post("generate")
    async generateQrCode(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(generateQrMuseumSchedulePaymentSchema)) createManyDto: GenerateQrMuseumSchedulePaymentDto[]) {
        try {
            const [_, access_token] = req.headers.authorization?.split(' ');
            const jwtPayload = this.authService.jwtVerify(access_token);
            const user = await this.usersService.findById(jwtPayload["id"]);

            const dataTransactions = await this.prisma.$transaction(async () => {
                let total = 0;
                return await Promise.all(createManyDto.map(async (createDto, i) => {
                    const museum_schedule = await this.museumSchedulesService.findById(createDto.id);
                    const discount = Number(museum_schedule.discount || 0) / 100;
                    total += (Number(museum_schedule.price) - (Number(museum_schedule.price) * discount)) * createDto.user_limit;
                    return total;
                }))
            })
            let qrCode = null;
            let oneClickPay = null;
            let transactionId = generateTransactionId();
            let invoiceId = generateInvoiceId();
            let description = `INV:${invoiceId}|Museum tickets.required()sd`;
            let onePay = new Bcel(transactionId);

            onePay.getCode({
                transactionId,
                invoiceId,
                terminalId: `TIDPCK`,
                amount: dataTransactions,
                description,
                expireTime: 2
            }, (code) => {
                qrCode = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${code}&choe=UTF-8`;
                oneClickPay = `onepay://qr/${code}`;
            })

            onePay.pubnubSubscribe();

            return res.status(HttpStatus.OK).json(responseUtil({
                req, message: MESSAGE.created, body: {
                    bcel_details: {
                        transaction_id: transactionId,
                        qr_code: qrCode,
                        one_click_pay: oneClickPay,
                        description,
                    }

                },
            }));

        } catch (e) {
            throw e;
        }
    } */
    /* @Post("pay")
    async createAndPayQrCode() {
    } */
    MuseumSchedulePaymentsController.prototype.findAll = function (req, res, _a) {
        var _b = _a.filter, _c = _b === void 0 ? {} : _b, museum_id = _c.museum_id, filter = __rest(_c, ["museum_id"]), query = __rest(_a, ["filter"]);
        return __awaiter(this, void 0, void 0, function () {
            var data_fixed, data_temp;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.museumSchedulePaymentsService.findAll(museum_id)];
                    case 1:
                        data_fixed = _d.sent();
                        return [4 /*yield*/, this.museumSchedulePaymentsService.findAll(museum_id, __assign({ filter: filter }, query))];
                    case 2:
                        data_temp = _d.sent();
                        res.append('X-Total-Count-Fixed', data_fixed.length.toString());
                        res.append('X-Total-Count-Temp', data_temp.length.toString());
                        return [2 /*return*/, res.json((0, response_util_1["default"])({
                                req: req,
                                body: data_temp
                            }))];
                }
            });
        });
    };
    MuseumSchedulePaymentsController.prototype.createMany = function (req, res, createManyDto, files) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, _1, access_token, jwtPayload, user_1, dataTransactions, data, e_1;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 4, , 5]);
                        _b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' '), _1 = _b[0], access_token = _b[1];
                        jwtPayload = this.authService.jwtVerify(access_token);
                        return [4 /*yield*/, this.usersService.findById(jwtPayload["id"])];
                    case 1:
                        user_1 = _c.sent();
                        return [4 /*yield*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, Promise.all(createManyDto.map(function (createDto, i) { return __awaiter(_this, void 0, void 0, function () {
                                                var museum_schedules, total, museum_schedules_update, createFile;
                                                var _a;
                                                var _this = this;
                                                return __generator(this, function (_b) {
                                                    switch (_b.label) {
                                                        case 0: return [4 /*yield*/, this.museumSchedulesService.findByManyIds(createDto.museum_schedules.map(function (data) { return data.id; }))];
                                                        case 1:
                                                            museum_schedules = _b.sent();
                                                            total = 0;
                                                            museum_schedules_update = museum_schedules.map(function (museum_schedule, i) {
                                                                var discount = museum_schedule.discount ? Number(museum_schedule.discount) / 100 : 0;
                                                                var museum_schedule_total = (Number(museum_schedule.price) - (Number(museum_schedule.price) * discount)) * createDto.museum_schedules[i].user_limit;
                                                                total += museum_schedule_total;
                                                                var current_date = (0, dayjs_util_1["default"])().second(0).millisecond(0);
                                                                if (museum_schedule.status !== "pending" || museum_schedule.user_limit_status !== "available") {
                                                                    throw new custom_exception_1.CustomException({ error: "It's in action, can't create", code: error_code_util_1.ErrorCode.raCreate });
                                                                }
                                                                if ((0, dayjs_util_1["default"])(museum_schedule.start_date).isSameOrBefore(current_date)) {
                                                                    throw new custom_exception_1.CustomException({ error: "Some of the museum_schedules's times have expired" });
                                                                }
                                                                if ((createDto.museum_schedules[i].user_limit + museum_schedule.current_users) > museum_schedule.user_limit) {
                                                                    throw new custom_exception_1.CustomException({ error: "Some of the museum schedules have reached its user limit" });
                                                                }
                                                                return {
                                                                    data: __assign(__assign({}, createDto.museum_schedules[i]), { total: museum_schedule_total }),
                                                                    generate: _this.prisma.museumSchedule.update({
                                                                        where: {
                                                                            id: createDto.museum_schedules[i].id
                                                                        },
                                                                        data: __assign(__assign({}, ((createDto.museum_schedules[i].user_limit + museum_schedule.current_users) === museum_schedule.user_limit && {
                                                                            user_limit_status: "full"
                                                                        })), { current_users: {
                                                                                increment: createDto.museum_schedules[i].user_limit
                                                                            }, user_limit: {
                                                                                decrement: createDto.museum_schedules[i].user_limit
                                                                            } })
                                                                    })
                                                                };
                                                            });
                                                            createFile = (0, image_processor_util_1.createfileGenerator)(files === null || files === void 0 ? void 0 : files[i], PREFIX, PREFIX);
                                                            _a = {};
                                                            return [4 /*yield*/, this.museumSchedulePaymentsService.create(__assign(__assign(__assign(__assign({}, createDto), { museum_id: user_1.museum_id, museum_schedules: museum_schedules_update.map(function (_a) {
                                                                        var data = _a.data;
                                                                        return data;
                                                                    }), employee_id: user_1.id, transaction_id: (0, transaction_generator_util_1["default"])(), payment_date: (0, dayjs_util_1["default"])().toDate(), total: total, status: "success" }), (createDto.payment_type === "bank" && {
                                                                    bank_percent_amount: total * 0.01,
                                                                    bank_percentage: 1
                                                                })), { image_path: createFile === null || createFile === void 0 ? void 0 : createFile.filePath }))];
                                                        case 2:
                                                            _a.data = _b.sent();
                                                            return [4 /*yield*/, Promise.all(museum_schedules_update.map(function (_a) {
                                                                    var generate = _a.generate;
                                                                    return generate;
                                                                }))];
                                                        case 3: return [2 /*return*/, (_a.update = _b.sent(),
                                                                _a.createFile = createFile === null || createFile === void 0 ? void 0 : createFile.generate(),
                                                                _a)];
                                                    }
                                                });
                                            }); }))];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); })];
                    case 2:
                        dataTransactions = _c.sent();
                        return [4 /*yield*/, Promise.all(dataTransactions.map(function (_a, i) {
                                var createFile = _a.createFile;
                                return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_b) {
                                        createFile;
                                        return [2 /*return*/];
                                    });
                                });
                            }))];
                    case 3:
                        _c.sent();
                        data = dataTransactions.map(function (dataTransaction) { return dataTransaction.data; });
                        return [2 /*return*/, res.status(common_1.HttpStatus.OK).json((0, response_util_1["default"])({ req: req, message: message_util_1["default"].created, body: data }))];
                    case 4:
                        e_1 = _c.sent();
                        throw e_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    MuseumSchedulePaymentsController.prototype.updateMany = function (req, res, updateManyDto, files) {
        return __awaiter(this, void 0, void 0, function () {
            var dataTransactions, data, e_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.prisma.$transaction(function () { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, Promise.all(updateManyDto.map(function (updateDto, i) { return __awaiter(_this, void 0, void 0, function () {
                                                var museum_schedule_payment, updateFile;
                                                var _a;
                                                return __generator(this, function (_b) {
                                                    switch (_b.label) {
                                                        case 0: return [4 /*yield*/, this.museumSchedulePaymentsService.findById(updateDto.id)];
                                                        case 1:
                                                            museum_schedule_payment = _b.sent();
                                                            updateFile = (0, image_processor_util_1.updatefileGenerator)(files === null || files === void 0 ? void 0 : files[i], PREFIX, PREFIX, PREFIX, museum_schedule_payment.image_path, updateDto.delete_image);
                                                            _a = {};
                                                            return [4 /*yield*/, this.museumSchedulePaymentsService.update(__assign(__assign({}, updateDto), { image_path: updateFile === null || updateFile === void 0 ? void 0 : updateFile.filePath }))];
                                                        case 2: return [2 /*return*/, (_a.data = _b.sent(),
                                                                _a.updateFile = updateFile.generate(),
                                                                _a)];
                                                    }
                                                });
                                            }); }))];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); })];
                    case 1:
                        dataTransactions = _a.sent();
                        return [4 /*yield*/, Promise.all(dataTransactions.map(function (_a, i) {
                                var updateFile = _a.updateFile;
                                return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_b) {
                                        updateFile;
                                        return [2 /*return*/];
                                    });
                                });
                            }))];
                    case 2:
                        _a.sent();
                        data = dataTransactions.map(function (dataTransaction) { return dataTransaction.data; });
                        return [2 /*return*/, res.status(common_1.HttpStatus.OK).json((0, response_util_1["default"])({ req: req, message: message_util_1["default"].updated, body: data }))];
                    case 3:
                        e_2 = _a.sent();
                        throw e_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MuseumSchedulePaymentsController.prototype.deleteMany = function (req, res, deleteManyDto) {
        return __awaiter(this, void 0, void 0, function () {
            var dataTransactions, data, e_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.prisma.$transaction(function () { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, Promise.all(deleteManyDto.map(function (deleteDto, i) { return __awaiter(_this, void 0, void 0, function () {
                                                var dataById, deleteFile;
                                                var _a;
                                                return __generator(this, function (_b) {
                                                    switch (_b.label) {
                                                        case 0: return [4 /*yield*/, this.museumSchedulePaymentsService.findById(deleteDto.id)];
                                                        case 1:
                                                            dataById = _b.sent();
                                                            deleteFile = (0, image_processor_util_1.deleteFileGenerator)(dataById.image_path);
                                                            _a = {};
                                                            return [4 /*yield*/, this.museumSchedulePaymentsService["delete"]({
                                                                    id: deleteDto.id
                                                                })];
                                                        case 2: return [2 /*return*/, (_a.data = _b.sent(),
                                                                _a.deleteFile = deleteFile === null || deleteFile === void 0 ? void 0 : deleteFile.generate(),
                                                                _a)];
                                                    }
                                                });
                                            }); }))];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); })];
                    case 1:
                        dataTransactions = _a.sent();
                        return [4 /*yield*/, Promise.all(dataTransactions.map(function (_a, i) {
                                var deleteFile = _a.deleteFile;
                                return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_b) {
                                        deleteFile;
                                        return [2 /*return*/];
                                    });
                                });
                            }))];
                    case 2:
                        _a.sent();
                        data = dataTransactions.map(function (dataTransaction) { return dataTransaction.data; });
                        return [2 /*return*/, res.status(common_1.HttpStatus.OK).json((0, response_util_1["default"])({ req: req, message: message_util_1["default"].deleted, body: data }))];
                    case 3:
                        e_3 = _a.sent();
                        throw e_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, common_1.UseGuards)(auth_guard_1.AuthGuard, package_guard_1.PackageGuard, museumId_guard_1.MuseumIdGuard),
        (0, role_decorator_1.Roles)(role_enum_1["default"].ADMIN, role_enum_1["default"].MANAGER, role_enum_1["default"].ACCOUNTANT, role_enum_1["default"].GUIDE, role_enum_1["default"].SUPERADMIN, role_enum_1["default"].OWNER),
        (0, common_1.Get)(""),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Query)())
    ], MuseumSchedulePaymentsController.prototype, "findAll");
    __decorate([
        (0, common_1.UseGuards)(auth_guard_1.AuthGuard, package_guard_1.PackageGuard, museumId_guard_1.MuseumIdGuard),
        (0, role_decorator_1.Roles)(role_enum_1["default"].ADMIN, role_enum_1["default"].MANAGER, role_enum_1["default"].SUPERADMIN, role_enum_1["default"].OWNER),
        (0, common_1.Post)(""),
        (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)("files")),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Body)(new form_data_validation_pipe_1.FormDataValidationPipe(museum_schedule_payment_schema_1.createManyMuseumSchedulePaymentSchema))),
        __param(3, (0, common_1.UploadedFiles)(new file_validation_pipe_1.FilesValidationPipe()))
    ], MuseumSchedulePaymentsController.prototype, "createMany");
    __decorate([
        (0, common_1.UseGuards)(auth_guard_1.AuthGuard, package_guard_1.PackageGuard, museumId_guard_1.MuseumIdGuard),
        (0, role_decorator_1.Roles)(role_enum_1["default"].ADMIN, role_enum_1["default"].MANAGER, role_enum_1["default"].SUPERADMIN, role_enum_1["default"].OWNER),
        (0, common_1.Put)(""),
        (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files')),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Body)(new form_data_validation_pipe_1.FormDataValidationPipe(museum_schedule_payment_schema_1.updateManyMuseumSchedulePaymentSchema))),
        __param(3, (0, common_1.UploadedFiles)(new file_validation_pipe_1.FilesValidationPipe()))
    ], MuseumSchedulePaymentsController.prototype, "updateMany");
    __decorate([
        (0, common_1.UseGuards)(auth_guard_1.AuthGuard, package_guard_1.PackageGuard, museumId_guard_1.MuseumIdGuard),
        (0, role_decorator_1.Roles)(role_enum_1["default"].ADMIN, role_enum_1["default"].MANAGER, role_enum_1["default"].SUPERADMIN, role_enum_1["default"].OWNER),
        (0, common_1.Post)("delete"),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Body)(new joi_validation_pipe_1.JoiValidationPipe(museum_schedule_payment_schema_1.deleteManyMuseumSchedulePaymentSchema)))
    ], MuseumSchedulePaymentsController.prototype, "deleteMany");
    MuseumSchedulePaymentsController = __decorate([
        (0, common_1.Controller)('museum-schedule-payments')
    ], MuseumSchedulePaymentsController);
    return MuseumSchedulePaymentsController;
}());
exports.MuseumSchedulePaymentsController = MuseumSchedulePaymentsController;
