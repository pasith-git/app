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
exports.MuseumsController = void 0;
var common_1 = require("@nestjs/common");
var response_util_1 = require("common/utils/response.util");
var role_decorator_1 = require("common/decorators/role.decorator");
var role_enum_1 = require("common/enums/role.enum");
var platform_express_1 = require("@nestjs/platform-express");
var museum_schema_1 = require("common/schemas/museum.schema");
var form_data_validation_pipe_1 = require("common/pipes/form-data-validation.pipe");
var file_validation_pipe_1 = require("common/pipes/file-validation.pipe");
var image_processor_util_1 = require("common/utils/image-processor.util");
var message_util_1 = require("common/utils/message.util");
var auth_guard_1 = require("common/guards/auth.guard");
var package_guard_1 = require("common/guards/package.guard");
var museumId_guard_1 = require("common/guards/museumId.guard");
var PREFIX = 'museums';
var MuseumsController = /** @class */ (function () {
    function MuseumsController(prisma, museumsService, usersService, authService) {
        this.prisma = prisma;
        this.museumsService = museumsService;
        this.usersService = usersService;
        this.authService = authService;
    }
    MuseumsController.prototype.findAll = function (req, res, _a) {
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
                        return [4 /*yield*/, this.museumsService.findAll(museum_id)];
                    case 3:
                        data_fixed = _f.sent();
                        return [4 /*yield*/, this.museumsService.findAll(museum_id, __assign({ filter: filter }, query))];
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
    MuseumsController.prototype.updateMany = function (req, res, updateManyDto, files) {
        return __awaiter(this, void 0, void 0, function () {
            var dataTransactions, data, e_1;
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
                                                var museum, updateFile;
                                                var _a;
                                                return __generator(this, function (_b) {
                                                    switch (_b.label) {
                                                        case 0: return [4 /*yield*/, this.museumsService.findById(updateDto.id)];
                                                        case 1:
                                                            museum = _b.sent();
                                                            updateFile = (0, image_processor_util_1.updatefileGenerator)(files === null || files === void 0 ? void 0 : files[i], PREFIX, museum.name, updateDto.name || museum.name, museum.logo, updateDto.delete_image);
                                                            _a = {};
                                                            return [4 /*yield*/, this.museumsService.update(__assign(__assign(__assign({}, updateDto), (updateDto.phone && { phone: "+".concat(updateDto.phone) })), { logo: updateFile === null || updateFile === void 0 ? void 0 : updateFile.filePath }))];
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
                        e_1 = _a.sent();
                        throw e_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MuseumsController.prototype.createForFirstTimeUse = function (req, res, createMuseumDto, file) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var createFile, museum, _b, _, access_token, jwtPayload, user;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        createFile = (0, image_processor_util_1.createfileGenerator)(file, PREFIX, createMuseumDto.name);
                        return [4 /*yield*/, this.museumsService.create(__assign(__assign(__assign({}, createMuseumDto), (createMuseumDto.phone && { phone: "+".concat(createMuseumDto.phone) })), { logo: createFile === null || createFile === void 0 ? void 0 : createFile.filePath }))];
                    case 1:
                        museum = _c.sent();
                        _b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' '), _ = _b[0], access_token = _b[1];
                        jwtPayload = this.authService.jwtDecode(access_token);
                        return [4 /*yield*/, this.usersService.findById(jwtPayload["id"])];
                    case 2:
                        user = _c.sent();
                        return [4 /*yield*/, this.usersService.update({
                                id: user.id,
                                museum_id: museum.id
                            })];
                    case 3:
                        _c.sent();
                        /* const tokenPayload = {
                            ...jwtPayload as any,
                            museum_id: museum.id,
                        };
                
                        const authToken = this.authService.jwtSign({
                            ...tokenPayload,
                            name: "auth_token",
                            exp: Math.floor(dayjsUtil().add(3, 'days').valueOf() / 1000),
                            iat: Math.floor(dayjsUtil().valueOf() / 1000),
                        });
                
                        const refreshToken = this.authService.jwtSign({
                            ...tokenPayload,
                            name: "refresh_token",
                            exp: Math.floor(dayjsUtil().add(7, 'days').valueOf() / 1000),
                            iat: Math.floor(dayjsUtil().valueOf() / 1000),
                        }); */
                        return [4 /*yield*/, (createFile === null || createFile === void 0 ? void 0 : createFile.generate())];
                    case 4:
                        /* const tokenPayload = {
                            ...jwtPayload as any,
                            museum_id: museum.id,
                        };
                
                        const authToken = this.authService.jwtSign({
                            ...tokenPayload,
                            name: "auth_token",
                            exp: Math.floor(dayjsUtil().add(3, 'days').valueOf() / 1000),
                            iat: Math.floor(dayjsUtil().valueOf() / 1000),
                        });
                
                        const refreshToken = this.authService.jwtSign({
                            ...tokenPayload,
                            name: "refresh_token",
                            exp: Math.floor(dayjsUtil().add(7, 'days').valueOf() / 1000),
                            iat: Math.floor(dayjsUtil().valueOf() / 1000),
                        }); */
                        _c.sent();
                        return [2 /*return*/, res.status(common_1.HttpStatus.OK).json((0, response_util_1["default"])({
                                req: req,
                                message: "The restaurant information is created. Enjoy :)", body: museum
                            }))];
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
    ], MuseumsController.prototype, "findAll");
    __decorate([
        (0, common_1.UseGuards)(auth_guard_1.AuthGuard, package_guard_1.PackageGuard, museumId_guard_1.MuseumIdGuard),
        (0, role_decorator_1.Roles)(role_enum_1["default"].ADMIN, role_enum_1["default"].MANAGER, role_enum_1["default"].SUPERADMIN, role_enum_1["default"].OWNER),
        (0, common_1.Put)(""),
        (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files')),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Body)(new form_data_validation_pipe_1.FormDataValidationPipe(museum_schema_1.updateManyMuseumSchema))),
        __param(3, (0, common_1.UploadedFiles)(new file_validation_pipe_1.FilesValidationPipe()))
    ], MuseumsController.prototype, "updateMany");
    __decorate([
        (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
        (0, role_decorator_1.Roles)(role_enum_1["default"].ADMIN, role_enum_1["default"].MANAGER, role_enum_1["default"].SUPERADMIN, role_enum_1["default"].OWNER),
        (0, common_1.Post)("first-time"),
        (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Body)(new form_data_validation_pipe_1.FormDataValidationPipe(museum_schema_1.createFirstTimeMuseumSchema))),
        __param(3, (0, common_1.UploadedFile)(new file_validation_pipe_1.FileValidationPipe()))
    ], MuseumsController.prototype, "createForFirstTimeUse");
    MuseumsController = __decorate([
        (0, common_1.Controller)('museums')
    ], MuseumsController);
    return MuseumsController;
}());
exports.MuseumsController = MuseumsController;
