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
exports.UsersController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var role_decorator_1 = require("common/decorators/role.decorator");
var role_enum_1 = require("common/enums/role.enum");
var auth_guard_1 = require("common/guards/auth.guard");
var file_validation_pipe_1 = require("common/pipes/file-validation.pipe");
var form_data_validation_pipe_1 = require("common/pipes/form-data-validation.pipe");
var joi_validation_pipe_1 = require("common/pipes/joi-validation.pipe");
var user_schema_1 = require("common/schemas/user.schema");
var exclude_util_1 = require("common/utils/exclude.util");
var image_processor_util_1 = require("common/utils/image-processor.util");
var message_util_1 = require("common/utils/message.util");
var response_util_1 = require("common/utils/response.util");
var custom_exception_1 = require("common/exceptions/custom.exception");
var package_guard_1 = require("common/guards/package.guard");
var museumId_guard_1 = require("common/guards/museumId.guard");
var dayjs_util_1 = require("common/utils/dayjs.util");
var PREFIX = 'users';
var UsersController = /** @class */ (function () {
    function UsersController(prisma, authService, usersService, rolesService) {
        this.prisma = prisma;
        this.authService = authService;
        this.usersService = usersService;
        this.rolesService = rolesService;
    }
    UsersController.prototype.info = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _1, access_token, jwtPayload, data, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.headers.authorization.split(' '), _1 = _a[0], access_token = _a[1];
                        jwtPayload = this.authService.jwtDecode(access_token);
                        return [4 /*yield*/, this.usersService.findById(jwtPayload["id"])];
                    case 1:
                        data = _b.sent();
                        return [2 /*return*/, res.status(common_1.HttpStatus.OK).json((0, response_util_1["default"])({
                                req: req,
                                body: __assign(__assign({}, (0, exclude_util_1["default"])(data, ["password"])), { isPaid: data.payment_packages.some(function (payment_package) { return (0, dayjs_util_1["default"])().isSameOrBefore(payment_package.package_end_date) && payment_package.status === "success"; }) })
                            }))];
                    case 2:
                        e_1 = _b.sent();
                        throw new custom_exception_1.CustomException({ error: "Token is invalid" }, common_1.HttpStatus.UNAUTHORIZED);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersController.prototype.findById = function (req, res, id) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersService.findById(Number(id))];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, res.json((0, response_util_1["default"])({
                                req: req,
                                body: (0, exclude_util_1["default"])(data, ['password'])
                            }))];
                }
            });
        });
    };
    UsersController.prototype.findAll = function (req, res, _a) {
        var _b = _a.filter, _c = _b === void 0 ? {} : _b, museum_id = _c.museum_id, filter = __rest(_c, ["museum_id"]), query = __rest(_a, ["filter"]);
        return __awaiter(this, void 0, void 0, function () {
            var data_fixed, data_temp;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.usersService.findAll(museum_id)];
                    case 1:
                        data_fixed = _d.sent();
                        return [4 /*yield*/, this.usersService.findAll(museum_id, __assign({ filter: filter }, query))];
                    case 2:
                        data_temp = _d.sent();
                        res.append('X-Total-Count-Fixed', data_fixed.length.toString());
                        res.append('X-Total-Count-Temp', data_temp.length.toString());
                        return [2 /*return*/, res.json((0, response_util_1["default"])({
                                req: req,
                                body: data_temp.map(function (data) { return (0, exclude_util_1["default"])(data, ['password']); })
                            }))];
                }
            });
        });
    };
    UsersController.prototype.createMany = function (req, res, createManyDto, files) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _2, access_token, jwtPayload, user_1, users, payment_package, dataTransactions, data, e_2;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        _a = req.headers.authorization.split(' '), _2 = _a[0], access_token = _a[1];
                        jwtPayload = this.authService.jwtDecode(access_token);
                        return [4 /*yield*/, this.usersService.findById(jwtPayload["id"])];
                    case 1:
                        user_1 = _b.sent();
                        return [4 /*yield*/, this.usersService.findAll(String(user_1.museum_id))];
                    case 2:
                        users = _b.sent();
                        payment_package = user_1.payment_packages.filter(function (payment_package) { return (0, dayjs_util_1["default"])().isSameOrBefore(payment_package.package_end_date) && payment_package.status === "success"; })[0];
                        if ((users.length + 1) > payment_package.package.user_limit) {
                            throw new custom_exception_1.CustomException({ error: "Our paid package has a limit of ".concat(payment_package.package.user_limit, " users") }, common_1.HttpStatus.UNAUTHORIZED);
                        }
                        return [4 /*yield*/, this.prisma.$transaction(function () { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, Promise.all(createManyDto.map(function (createDto, i) { return __awaiter(_this, void 0, void 0, function () {
                                                var roleIds, createFile;
                                                var _a;
                                                return __generator(this, function (_b) {
                                                    switch (_b.label) {
                                                        case 0: return [4 /*yield*/, this.rolesService.findByIdsWithoutSuperAdmin(createDto.role_ids)];
                                                        case 1:
                                                            roleIds = _b.sent();
                                                            createFile = (0, image_processor_util_1.createfileGenerator)(files === null || files === void 0 ? void 0 : files[i], PREFIX, createDto.username);
                                                            _a = {};
                                                            return [4 /*yield*/, this.usersService.create(__assign(__assign({}, createDto), { phone: "+".concat(createDto.phone), password: this.authService.generatePassword(createDto.password), birth_date: (0, dayjs_util_1["default"])(createDto.birth_date).toDate(), museum_id: user_1.museum_id, role_ids: roleIds.map(function (data) { return data.id; }), is_staff: true, is_active: true, image_path: createFile === null || createFile === void 0 ? void 0 : createFile.filePath }))];
                                                        case 2: return [2 /*return*/, (_a.data = _b.sent(),
                                                                _a.createFile = createFile === null || createFile === void 0 ? void 0 : createFile.generate(),
                                                                _a)];
                                                    }
                                                });
                                            }); }))];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); })];
                    case 3:
                        dataTransactions = _b.sent();
                        return [4 /*yield*/, Promise.all(dataTransactions.map(function (_a, i) {
                                var createFile = _a.createFile;
                                return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_b) {
                                        createFile;
                                        return [2 /*return*/];
                                    });
                                });
                            }))];
                    case 4:
                        _b.sent();
                        data = dataTransactions.map(function (dataTransaction) { return dataTransaction.data; });
                        return [2 /*return*/, res.status(common_1.HttpStatus.OK).json((0, response_util_1["default"])({ req: req, message: message_util_1["default"].created, body: data.map(function (data) { return (0, exclude_util_1["default"])(data, ['password']); }) }))];
                    case 5:
                        e_2 = _b.sent();
                        throw e_2;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    UsersController.prototype.updateMany = function (req, res, updateManyDto, files) {
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
                                        case 0: return [4 /*yield*/, Promise.all(updateManyDto.map(function (updateDto, i) { return __awaiter(_this, void 0, void 0, function () {
                                                var user, roleIds, updateFile;
                                                var _a;
                                                return __generator(this, function (_b) {
                                                    switch (_b.label) {
                                                        case 0: return [4 /*yield*/, this.usersService.findById(updateDto.id)];
                                                        case 1:
                                                            user = _b.sent();
                                                            return [4 /*yield*/, this.rolesService.findByIdsWithoutSuperAdmin(updateDto.role_ids)];
                                                        case 2:
                                                            roleIds = _b.sent();
                                                            updateFile = (0, image_processor_util_1.updatefileGenerator)(files === null || files === void 0 ? void 0 : files[i], PREFIX, user.username, updateDto.username || user.username, user.image_path, updateDto.delete_image);
                                                            _a = {};
                                                            return [4 /*yield*/, this.usersService.update(__assign(__assign(__assign(__assign(__assign(__assign({}, updateDto), { role_ids: roleIds.map(function (data) { return data.id; }) }), (updateDto.phone && { phone: "+".concat(updateDto.phone) })), (updateDto.password && { password: this.authService.generatePassword(updateDto.password) })), (updateDto.birth_date && { birth_date: (0, dayjs_util_1["default"])(updateDto.birth_date).toDate() })), { image_path: updateFile === null || updateFile === void 0 ? void 0 : updateFile.filePath }))];
                                                        case 3: return [2 /*return*/, (_a.data = _b.sent(),
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
                        return [2 /*return*/, res.status(common_1.HttpStatus.OK).json((0, response_util_1["default"])({ req: req, message: message_util_1["default"].updated, body: data.map(function (data) { return (0, exclude_util_1["default"])(data, ['password']); }) }))];
                    case 3:
                        e_3 = _a.sent();
                        throw e_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UsersController.prototype.updateProfile = function (req, res, updateDto, file) {
        return __awaiter(this, void 0, void 0, function () {
            var user, updateFile, data, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.usersService.findById(updateDto.id)];
                    case 1:
                        user = _a.sent();
                        updateFile = (0, image_processor_util_1.updatefileGenerator)(file, PREFIX, user.username, updateDto.username || user.username, user.image_path, updateDto.delete_image);
                        return [4 /*yield*/, this.usersService.update(__assign(__assign(__assign(__assign(__assign({}, updateDto), (updateDto.phone && { phone: "+".concat(updateDto.phone) })), (updateDto.password && { password: this.authService.generatePassword(updateDto.password) })), (updateDto.birth_date && { birth_date: (0, dayjs_util_1["default"])(updateDto.birth_date).toDate() })), { image_path: updateFile === null || updateFile === void 0 ? void 0 : updateFile.filePath }))];
                    case 2:
                        data = _a.sent();
                        return [4 /*yield*/, updateFile.generate()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, res.status(common_1.HttpStatus.OK).json((0, response_util_1["default"])({ req: req, message: message_util_1["default"].updated, body: (0, exclude_util_1["default"])(data, ['password']) }))];
                    case 4:
                        e_4 = _a.sent();
                        throw e_4;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UsersController.prototype.deleteMany = function (req, res, deleteManyDto) {
        return __awaiter(this, void 0, void 0, function () {
            var dataTransactions, data, e_5;
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
                                                var user, deleteFile;
                                                var _a;
                                                return __generator(this, function (_b) {
                                                    switch (_b.label) {
                                                        case 0: return [4 /*yield*/, this.usersService.findById(deleteDto.id)];
                                                        case 1:
                                                            user = _b.sent();
                                                            deleteFile = (0, image_processor_util_1.deleteFileGenerator)(user.image_path);
                                                            _a = {};
                                                            return [4 /*yield*/, this.usersService["delete"]({
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
                        return [2 /*return*/, res.status(common_1.HttpStatus.OK).json((0, response_util_1["default"])({ req: req, message: message_util_1["default"].deleted, body: data.map(function (data) { return (0, exclude_util_1["default"])(data, ['password']); }) }))];
                    case 3:
                        e_5 = _a.sent();
                        throw e_5;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, common_1.UseGuards)(auth_guard_1.AuthGuard, package_guard_1.PackageGuard, museumId_guard_1.MuseumIdGuard),
        (0, role_decorator_1.Roles)(role_enum_1["default"].ADMIN, role_enum_1["default"].MANAGER, role_enum_1["default"].ACCOUNTANT, role_enum_1["default"].GUIDE, role_enum_1["default"].SUPERADMIN, role_enum_1["default"].OWNER),
        (0, common_1.Get)("info"),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Res)())
    ], UsersController.prototype, "info");
    __decorate([
        (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
        (0, role_decorator_1.Roles)(role_enum_1["default"].ADMIN, role_enum_1["default"].MANAGER, role_enum_1["default"].ACCOUNTANT, role_enum_1["default"].GUIDE, role_enum_1["default"].SUPERADMIN, role_enum_1["default"].OWNER),
        (0, common_1.Get)(":id"),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Param)("id"))
    ], UsersController.prototype, "findById");
    __decorate([
        (0, common_1.UseGuards)(auth_guard_1.AuthGuard, package_guard_1.PackageGuard, museumId_guard_1.MuseumIdGuard),
        (0, role_decorator_1.Roles)(role_enum_1["default"].ADMIN, role_enum_1["default"].MANAGER, role_enum_1["default"].ACCOUNTANT, role_enum_1["default"].GUIDE, role_enum_1["default"].SUPERADMIN, role_enum_1["default"].OWNER),
        (0, common_1.Get)(""),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Query)())
    ], UsersController.prototype, "findAll");
    __decorate([
        (0, common_1.UseGuards)(auth_guard_1.AuthGuard, package_guard_1.PackageGuard, museumId_guard_1.MuseumIdGuard),
        (0, role_decorator_1.Roles)(role_enum_1["default"].ADMIN, role_enum_1["default"].MANAGER, role_enum_1["default"].SUPERADMIN, role_enum_1["default"].OWNER),
        (0, common_1.Post)(""),
        (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files')),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Body)(new form_data_validation_pipe_1.FormDataValidationPipe(user_schema_1.createManyUserSchema))),
        __param(3, (0, common_1.UploadedFiles)(new file_validation_pipe_1.FilesValidationPipe()))
    ], UsersController.prototype, "createMany");
    __decorate([
        (0, common_1.UseGuards)(auth_guard_1.AuthGuard, package_guard_1.PackageGuard, museumId_guard_1.MuseumIdGuard),
        (0, role_decorator_1.Roles)(role_enum_1["default"].ADMIN, role_enum_1["default"].MANAGER, role_enum_1["default"].SUPERADMIN, role_enum_1["default"].OWNER),
        (0, common_1.Put)(""),
        (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files')),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Body)(new form_data_validation_pipe_1.FormDataValidationPipe(user_schema_1.updateManyUserSchema))),
        __param(3, (0, common_1.UploadedFiles)(new file_validation_pipe_1.FilesValidationPipe()))
    ], UsersController.prototype, "updateMany");
    __decorate([
        (0, common_1.UseGuards)(auth_guard_1.AuthGuard, package_guard_1.PackageGuard, museumId_guard_1.MuseumIdGuard),
        (0, role_decorator_1.Roles)(role_enum_1["default"].ADMIN, role_enum_1["default"].MANAGER, role_enum_1["default"].ACCOUNTANT, role_enum_1["default"].GUIDE, role_enum_1["default"].SUPERADMIN, role_enum_1["default"].OWNER, role_enum_1["default"].USER),
        (0, common_1.Put)("update-profile"),
        (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Body)(new form_data_validation_pipe_1.FormDataValidationPipe(user_schema_1.updateProfile))),
        __param(3, (0, common_1.UploadedFile)(new file_validation_pipe_1.FileValidationPipe()))
    ], UsersController.prototype, "updateProfile");
    __decorate([
        (0, common_1.UseGuards)(auth_guard_1.AuthGuard, package_guard_1.PackageGuard, museumId_guard_1.MuseumIdGuard),
        (0, role_decorator_1.Roles)(role_enum_1["default"].ADMIN, role_enum_1["default"].MANAGER, role_enum_1["default"].SUPERADMIN, role_enum_1["default"].OWNER),
        (0, common_1.Post)("delete"),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Body)(new joi_validation_pipe_1.JoiValidationPipe(user_schema_1.deleteManyUserSchema)))
    ], UsersController.prototype, "deleteMany");
    UsersController = __decorate([
        (0, common_1.Controller)('users')
    ], UsersController);
    return UsersController;
}());
exports.UsersController = UsersController;
