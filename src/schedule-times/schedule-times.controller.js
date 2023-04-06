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
exports.ScheduleTimesController = void 0;
var common_1 = require("@nestjs/common");
var role_decorator_1 = require("common/decorators/role.decorator");
var role_enum_1 = require("common/enums/role.enum");
var auth_guard_1 = require("common/guards/auth.guard");
var museumId_guard_1 = require("common/guards/museumId.guard");
var package_guard_1 = require("common/guards/package.guard");
var response_util_1 = require("common/utils/response.util");
var joi_validation_pipe_1 = require("common/pipes/joi-validation.pipe");
var schedule_time_schema_1 = require("common/schemas/schedule-time.schema");
var message_util_1 = require("common/utils/message.util");
var dayjs_util_1 = require("common/utils/dayjs.util");
var error_code_util_1 = require("common/utils/error-code.util");
var custom_exception_1 = require("common/exceptions/custom.exception");
var PREFIX = "schedule-times";
var ScheduleTimesController = /** @class */ (function () {
    function ScheduleTimesController(prisma, scheduleTimesService, authService, usersService) {
        this.prisma = prisma;
        this.scheduleTimesService = scheduleTimesService;
        this.authService = authService;
        this.usersService = usersService;
    }
    ScheduleTimesController.prototype.findById = function (req, res, id) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.scheduleTimesService.findById(Number(id))];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, res.json((0, response_util_1["default"])({
                                req: req,
                                body: data
                            }))];
                }
            });
        });
    };
    ScheduleTimesController.prototype.findAllByMuseumId = function (req, res, _a) {
        var _b = _a.filter, _c = _b === void 0 ? {} : _b, museum_id = _c.museum_id, filter = __rest(_c, ["museum_id"]), query = __rest(_a, ["filter"]);
        return __awaiter(this, void 0, void 0, function () {
            var data_fixed, data_temp;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.scheduleTimesService.findAll(museum_id)];
                    case 1:
                        data_fixed = _d.sent();
                        return [4 /*yield*/, this.scheduleTimesService.findAll(museum_id, __assign({ filter: filter }, query))];
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
    ScheduleTimesController.prototype.createMany = function (req, res, createManyDto) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, _1, access_token, jwtPayload, user_1, dataTransactions, data, e_1;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        _b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' '), _1 = _b[0], access_token = _b[1];
                        jwtPayload = this.authService.jwtVerify(access_token);
                        return [4 /*yield*/, this.usersService.findById(jwtPayload["id"])];
                    case 1:
                        user_1 = _c.sent();
                        return [4 /*yield*/, this.prisma.$transaction(function () { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, Promise.all(createManyDto.map(function (createDto, i) { return __awaiter(_this, void 0, void 0, function () {
                                                var start_time, end_time;
                                                var _a;
                                                return __generator(this, function (_b) {
                                                    switch (_b.label) {
                                                        case 0:
                                                            start_time = (0, dayjs_util_1["default"])(createDto.start_time).second(0).millisecond(0);
                                                            end_time = (0, dayjs_util_1["default"])(createDto.end_time).second(0).millisecond(0);
                                                            if (!(start_time.isBefore(end_time))) {
                                                                throw new custom_exception_1.CustomException({ error: message_util_1["default"].time.error, code: error_code_util_1.ErrorCode.invalidTime });
                                                            }
                                                            _a = {};
                                                            return [4 /*yield*/, this.scheduleTimesService.create(__assign(__assign({}, createDto), { museum_id: user_1.museum_id, start_time: start_time.toDate(), end_time: end_time.toDate() }))];
                                                        case 1: return [2 /*return*/, (_a.data = _b.sent(),
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
                        data = dataTransactions.map(function (dataTransaction) { return dataTransaction.data; });
                        return [2 /*return*/, res.status(common_1.HttpStatus.OK).json((0, response_util_1["default"])({ req: req, message: message_util_1["default"].created, body: data }))];
                    case 3:
                        e_1 = _c.sent();
                        throw e_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ScheduleTimesController.prototype.updateMany = function (req, res, updateManyDto) {
        return __awaiter(this, void 0, void 0, function () {
            var dataTransactions, data, e_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.prisma.$transaction(function () { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, Promise.all(updateManyDto.map(function (updateDto, i) { return __awaiter(_this, void 0, void 0, function () {
                                                var schedule_time, start_time, end_time, sc_end_time, sc_start_time;
                                                var _a;
                                                return __generator(this, function (_b) {
                                                    switch (_b.label) {
                                                        case 0: return [4 /*yield*/, this.scheduleTimesService.findById(updateDto.id)];
                                                        case 1:
                                                            schedule_time = _b.sent();
                                                            start_time = (0, dayjs_util_1["default"])(updateDto.start_time).second(0).millisecond(0);
                                                            end_time = (0, dayjs_util_1["default"])(updateDto.end_time).second(0).millisecond(0);
                                                            if (updateDto.start_time && updateDto.end_time) {
                                                                if (!(start_time.isBefore(end_time))) {
                                                                    throw new custom_exception_1.CustomException({ error: message_util_1["default"].time.error, code: error_code_util_1.ErrorCode.invalidTime });
                                                                }
                                                            }
                                                            else if (updateDto.start_time) {
                                                                sc_end_time = (0, dayjs_util_1["default"])(schedule_time.end_time).second(0).millisecond(0);
                                                                if (!(start_time.isBefore(sc_end_time))) {
                                                                    throw new custom_exception_1.CustomException({ error: message_util_1["default"].time.error, code: error_code_util_1.ErrorCode.invalidTime });
                                                                }
                                                            }
                                                            else if (updateDto.end_time) {
                                                                sc_start_time = (0, dayjs_util_1["default"])(schedule_time.start_time).second(0).millisecond(0);
                                                                if (!(sc_start_time.isBefore(end_time))) {
                                                                    throw new custom_exception_1.CustomException({ error: message_util_1["default"].time.error, code: error_code_util_1.ErrorCode.invalidTime });
                                                                }
                                                            }
                                                            _a = {};
                                                            return [4 /*yield*/, this.scheduleTimesService.update(__assign(__assign(__assign({}, updateDto), (updateDto.start_time && {
                                                                    start_time: (0, dayjs_util_1["default"])(updateDto.start_time).second(0).millisecond(0).toDate()
                                                                })), (updateDto.end_time && {
                                                                    end_time: (0, dayjs_util_1["default"])(updateDto.end_time).second(0).millisecond(0).toDate()
                                                                })))];
                                                        case 2: return [2 /*return*/, (_a.data = _b.sent(),
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
                        data = dataTransactions.map(function (dataTransaction) { return dataTransaction.data; });
                        return [2 /*return*/, res.status(common_1.HttpStatus.OK).json((0, response_util_1["default"])({ req: req, message: message_util_1["default"].updated, body: data }))];
                    case 2:
                        e_2 = _a.sent();
                        throw e_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ScheduleTimesController.prototype.deleteMany = function (req, res, deleteManyDto) {
        return __awaiter(this, void 0, void 0, function () {
            var dataTransactions, data, e_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.prisma.$transaction(function () { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, Promise.all(deleteManyDto.map(function (deleteDto, i) { return __awaiter(_this, void 0, void 0, function () {
                                                var _a;
                                                return __generator(this, function (_b) {
                                                    switch (_b.label) {
                                                        case 0:
                                                            _a = {};
                                                            return [4 /*yield*/, this.scheduleTimesService["delete"]({
                                                                    id: deleteDto.id
                                                                })];
                                                        case 1: return [2 /*return*/, (_a.data = _b.sent(),
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
                        data = dataTransactions.map(function (dataTransaction) { return dataTransaction.data; });
                        return [2 /*return*/, res.status(common_1.HttpStatus.OK).json((0, response_util_1["default"])({ req: req, message: message_util_1["default"].deleted, body: data }))];
                    case 2:
                        e_3 = _a.sent();
                        throw e_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
        (0, role_decorator_1.Roles)(role_enum_1["default"].ADMIN, role_enum_1["default"].MANAGER, role_enum_1["default"].ACCOUNTANT, role_enum_1["default"].GUIDE, role_enum_1["default"].SUPERADMIN, role_enum_1["default"].OWNER),
        (0, common_1.Get)(":id"),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Param)("id"))
    ], ScheduleTimesController.prototype, "findById");
    __decorate([
        (0, common_1.UseGuards)(auth_guard_1.AuthGuard, package_guard_1.PackageGuard, museumId_guard_1.MuseumIdGuard),
        (0, role_decorator_1.Roles)(role_enum_1["default"].ADMIN, role_enum_1["default"].MANAGER, role_enum_1["default"].ACCOUNTANT, role_enum_1["default"].GUIDE, role_enum_1["default"].SUPERADMIN, role_enum_1["default"].OWNER),
        (0, common_1.Get)(""),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Query)())
    ], ScheduleTimesController.prototype, "findAllByMuseumId");
    __decorate([
        (0, common_1.UseGuards)(auth_guard_1.AuthGuard, package_guard_1.PackageGuard, museumId_guard_1.MuseumIdGuard),
        (0, role_decorator_1.Roles)(role_enum_1["default"].ADMIN, role_enum_1["default"].MANAGER, role_enum_1["default"].SUPERADMIN, role_enum_1["default"].OWNER),
        (0, common_1.Post)(""),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Body)(new joi_validation_pipe_1.JoiValidationPipe(schedule_time_schema_1.createManyScheduleTimeschema)))
    ], ScheduleTimesController.prototype, "createMany");
    __decorate([
        (0, common_1.UseGuards)(auth_guard_1.AuthGuard, package_guard_1.PackageGuard, museumId_guard_1.MuseumIdGuard),
        (0, role_decorator_1.Roles)(role_enum_1["default"].ADMIN, role_enum_1["default"].MANAGER, role_enum_1["default"].SUPERADMIN, role_enum_1["default"].OWNER),
        (0, common_1.Put)(""),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Body)(new joi_validation_pipe_1.JoiValidationPipe(schedule_time_schema_1.updateManyScheduleTimeschema)))
    ], ScheduleTimesController.prototype, "updateMany");
    __decorate([
        (0, common_1.UseGuards)(auth_guard_1.AuthGuard, package_guard_1.PackageGuard, museumId_guard_1.MuseumIdGuard),
        (0, role_decorator_1.Roles)(role_enum_1["default"].ADMIN, role_enum_1["default"].MANAGER, role_enum_1["default"].SUPERADMIN, role_enum_1["default"].OWNER),
        (0, common_1.Post)("delete"),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Body)(new joi_validation_pipe_1.JoiValidationPipe(schedule_time_schema_1.deleteManyScheduleTimeSchema)))
    ], ScheduleTimesController.prototype, "deleteMany");
    ScheduleTimesController = __decorate([
        (0, common_1.Controller)('schedule-times')
    ], ScheduleTimesController);
    return ScheduleTimesController;
}());
exports.ScheduleTimesController = ScheduleTimesController;
