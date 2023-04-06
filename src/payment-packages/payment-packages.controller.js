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
exports.PaymentPackagesController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var bcel_1 = require("bcel/bcel");
var role_decorator_1 = require("common/decorators/role.decorator");
var role_enum_1 = require("common/enums/role.enum");
var custom_exception_1 = require("common/exceptions/custom.exception");
var auth_guard_1 = require("common/guards/auth.guard");
var museumId_guard_1 = require("common/guards/museumId.guard");
var package_guard_1 = require("common/guards/package.guard");
var file_validation_pipe_1 = require("common/pipes/file-validation.pipe");
var form_data_validation_pipe_1 = require("common/pipes/form-data-validation.pipe");
var joi_validation_pipe_1 = require("common/pipes/joi-validation.pipe");
var payment_package_schema_1 = require("common/schemas/payment-package.schema");
var dayjs_util_1 = require("common/utils/dayjs.util");
var image_processor_util_1 = require("common/utils/image-processor.util");
var inv_generator_util_1 = require("common/utils/inv-generator.util");
var message_util_1 = require("common/utils/message.util");
var response_util_1 = require("common/utils/response.util");
var transaction_generator_util_1 = require("common/utils/transaction-generator.util");
var PREFIX = "payment-packages";
var PaymentPackagesController = /** @class */ (function () {
    function PaymentPackagesController(paymentPackagesService, packagesService, usersService, authService) {
        this.paymentPackagesService = paymentPackagesService;
        this.packagesService = packagesService;
        this.usersService = usersService;
        this.authService = authService;
    }
    PaymentPackagesController.prototype.findAll = function (req, res, _a) {
        var _b;
        var _c = _a.filter, _d = _c === void 0 ? {} : _c, museum_id = _d.museum_id, filter = __rest(_d, ["museum_id"]), query = __rest(_a, ["filter"]);
        return __awaiter(this, void 0, void 0, function () {
            var _e, _, access_token, jwtPayload, user, data_fixed, data_temp;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _e = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' '), _ = _e[0], access_token = _e[1];
                        return [4 /*yield*/, this.authService.jwtDecode(access_token)];
                    case 1:
                        jwtPayload = _f.sent();
                        return [4 /*yield*/, this.usersService.findById(jwtPayload["id"])];
                    case 2:
                        user = _f.sent();
                        return [4 /*yield*/, this.paymentPackagesService.findAll(museum_id)];
                    case 3:
                        data_fixed = _f.sent();
                        return [4 /*yield*/, this.paymentPackagesService.findAll(museum_id, __assign({ filter: filter }, query))];
                    case 4:
                        data_temp = _f.sent();
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
    PaymentPackagesController.prototype.generateQrCode = function (req, res, createDto) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, _1, access_token, jwtPayload, _package, user, qrCode_1, oneClickPay_1, transactionId, invoiceId, description, onePay, price, e_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        _b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' '), _1 = _b[0], access_token = _b[1];
                        jwtPayload = this.authService.jwtVerify(access_token);
                        return [4 /*yield*/, this.packagesService.findById(createDto.package_id)];
                    case 1:
                        _package = _c.sent();
                        return [4 /*yield*/, this.usersService.findById(jwtPayload["id"])];
                    case 2:
                        user = _c.sent();
                        qrCode_1 = null;
                        oneClickPay_1 = null;
                        transactionId = (0, transaction_generator_util_1["default"])();
                        invoiceId = (0, inv_generator_util_1["default"])();
                        description = "INV:".concat(invoiceId, "|PCK_ID:").concat(_package.id, "|USER_NAME:").concat(user.username);
                        onePay = new bcel_1.Bcel(transactionId, "mch62baa8923023e", "7372");
                        price = Number(_package.price) - (Number(_package.price) * Number(_package.discount || 0));
                        onePay.getCode({
                            transactionId: transactionId,
                            invoiceId: invoiceId,
                            terminalId: "TIDPCK",
                            amount: price,
                            description: description,
                            expireTime: 2
                        }, function (code) {
                            qrCode_1 = "https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=".concat(code, "&choe=UTF-8");
                            oneClickPay_1 = "onepay://qr/".concat(code);
                        });
                        onePay.pubnubSubscribe();
                        return [2 /*return*/, res.status(common_1.HttpStatus.OK).json((0, response_util_1["default"])({
                                req: req,
                                message: message_util_1["default"].created, body: __assign(__assign({}, _package), { bcel_details: {
                                        transaction_id: transactionId,
                                        qr_code: qrCode_1,
                                        one_click_pay: oneClickPay_1,
                                        description: description
                                    } })
                            }))];
                    case 3:
                        e_1 = _c.sent();
                        throw e_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PaymentPackagesController.prototype.createAndPayQrCode = function (req, res, createDto, file) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, _2, access_token, jwtPayload, _package, user, total, createFile, isPaid, data, e_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        _b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' '), _2 = _b[0], access_token = _b[1];
                        jwtPayload = this.authService.jwtVerify(access_token);
                        return [4 /*yield*/, this.packagesService.findById(createDto.package_id)];
                    case 1:
                        _package = _c.sent();
                        return [4 /*yield*/, this.usersService.findById(jwtPayload["id"])];
                    case 2:
                        user = _c.sent();
                        total = Number(_package.price) - (Number(_package.price) * Number(_package.discount || 0));
                        createFile = (0, image_processor_util_1.createfileGenerator)(file, PREFIX, PREFIX);
                        isPaid = user.payment_packages.some(function (payment_package) { return (0, dayjs_util_1["default"])().isSameOrBefore(payment_package.package_end_date); });
                        if (isPaid) {
                            throw new custom_exception_1.CustomException({ error: "The User is already paid packages" });
                        }
                        return [4 /*yield*/, this.paymentPackagesService.create(__assign(__assign(__assign(__assign({}, createDto), { user_id: user.id, bank_percentage: 1, bank_percent_amount: total * 0.01, bank_name: "BCEL", payment_type: "bank", museum_id: user.museum_id, package_start_date: (0, dayjs_util_1["default"])().toDate(), package_end_date: (0, dayjs_util_1["default"])().add(_package.duration, 'months').toDate(), status: "success", payment_date: (0, dayjs_util_1["default"])().toDate(), total: total }), (_package.discount && {
                                discount: Number(_package.discount)
                            })), { image_path: createFile === null || createFile === void 0 ? void 0 : createFile.filePath }))];
                    case 3:
                        data = _c.sent();
                        return [4 /*yield*/, (createFile === null || createFile === void 0 ? void 0 : createFile.generate())];
                    case 4:
                        _c.sent();
                        return [2 /*return*/, res.status(common_1.HttpStatus.OK).json((0, response_util_1["default"])({ req: req, message: message_util_1["default"].created, body: data }))];
                    case 5:
                        e_2 = _c.sent();
                        throw e_2;
                    case 6: return [2 /*return*/];
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
    ], PaymentPackagesController.prototype, "findAll");
    __decorate([
        (0, common_1.Post)("generate"),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Body)(new joi_validation_pipe_1.JoiValidationPipe(payment_package_schema_1.generatePaymentPackageWithBankSchema)))
    ], PaymentPackagesController.prototype, "generateQrCode");
    __decorate([
        (0, common_1.Post)("pay"),
        (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Body)(new form_data_validation_pipe_1.FormDataValidationPipe(payment_package_schema_1.CreatePaymentPackageWithBankSchema))),
        __param(3, (0, common_1.UploadedFiles)(new file_validation_pipe_1.FileValidationPipe()))
    ], PaymentPackagesController.prototype, "createAndPayQrCode");
    PaymentPackagesController = __decorate([
        (0, common_1.Controller)('payment-packages')
    ], PaymentPackagesController);
    return PaymentPackagesController;
}());
exports.PaymentPackagesController = PaymentPackagesController;
