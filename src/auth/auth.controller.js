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
exports.__esModule = true;
exports.AuthController = void 0;
var common_1 = require("@nestjs/common");
var common_2 = require("@nestjs/common");
var common_3 = require("@nestjs/common");
var joi_validation_pipe_1 = require("common/pipes/joi-validation.pipe");
var auth_schema_1 = require("common/schemas/auth.schema");
var custom_exception_1 = require("common/exceptions/custom.exception");
var response_util_1 = require("common/utils/response.util");
var exclude_util_1 = require("common/utils/exclude.util");
var dayjs_util_1 = require("common/utils/dayjs.util");
var auth_guard_1 = require("common/guards/auth.guard");
var form_data_validation_pipe_1 = require("common/pipes/form-data-validation.pipe");
var file_validation_pipe_1 = require("common/pipes/file-validation.pipe");
var image_processor_util_1 = require("common/utils/image-processor.util");
var AuthController = /** @class */ (function () {
    function AuthController(authService, usersService, twilioService, eventsGateway) {
        this.authService = authService;
        this.usersService = usersService;
        this.twilioService = twilioService;
        this.eventsGateway = eventsGateway;
    }
    AuthController.prototype.checkLoggedIn = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _1, access_token, jwtPayload;
            return __generator(this, function (_b) {
                try {
                    _a = req.headers.authorization.split(' '), _1 = _a[0], access_token = _a[1];
                    jwtPayload = this.authService.jwtDecode(access_token);
                    return [2 /*return*/, res.status(common_1.HttpStatus.OK).json((0, response_util_1["default"])({
                            req: req,
                            body: {
                                isAuth: true
                            }
                        }))];
                }
                catch (e) {
                    throw new custom_exception_1.CustomException({ error: "Token is invalid" }, common_1.HttpStatus.UNAUTHORIZED);
                }
                return [2 /*return*/];
            });
        });
    };
    AuthController.prototype.login = function (req, res, loginDto) {
        return __awaiter(this, void 0, void 0, function () {
            var user, isPassword, tokenPayload, accessToken, refreshToken, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.usersService.findByUsernameOrEmail({ email: loginDto.email, username: loginDto.username })];
                    case 1:
                        user = _a.sent();
                        if (!user) return [3 /*break*/, 4];
                        isPassword = this.authService.comparePassword(loginDto.password, user.password);
                        if (!isPassword) return [3 /*break*/, 3];
                        if (!user.is_active && !user.is_staff) {
                            throw new custom_exception_1.CustomException({ error: "Access to the system should be granted by an administrator first" });
                        }
                        return [4 /*yield*/, this.usersService.update({
                                id: user.id,
                                last_login: (0, dayjs_util_1["default"])().toDate()
                            })];
                    case 2:
                        _a.sent();
                        tokenPayload = {
                            id: user.id
                        };
                        accessToken = this.authService.jwtSign(__assign(__assign({}, tokenPayload), { name: "auth_token", exp: Math.floor((0, dayjs_util_1["default"])().add(3, 'minutes').valueOf() / 1000) }));
                        refreshToken = this.authService.jwtSign(__assign(__assign({}, tokenPayload), { name: "refresh_token", exp: Math.floor((0, dayjs_util_1["default"])().add(7, 'days').valueOf() / 1000) }));
                        return [2 /*return*/, res.status(common_1.HttpStatus.OK).cookie("refresh_token", refreshToken, {
                                expires: (0, dayjs_util_1["default"])().add(7, 'days').toDate()
                            }).json((0, response_util_1["default"])({
                                req: req,
                                message: "Login successfully", body: {
                                    access_token: accessToken
                                }
                            }))];
                    case 3: throw new custom_exception_1.CustomException({ error: "Your login information is incorrect" });
                    case 4: throw new custom_exception_1.CustomException({ error: "Your login information is incorrect" });
                    case 5:
                        e_1 = _a.sent();
                        throw e_1;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.refresh = function (req, res, refreshDto) {
        return __awaiter(this, void 0, void 0, function () {
            var jwtPayload, accessToken;
            return __generator(this, function (_a) {
                try {
                    jwtPayload = this.authService.jwtVerify(refreshDto.refresh_token || req.cookies['refresh_token']);
                    accessToken = this.authService.jwtSign({
                        name: "auth_token",
                        id: jwtPayload["id"],
                        exp: Math.floor((0, dayjs_util_1["default"])().add(1, 'days').valueOf() / 1000)
                    });
                    return [2 /*return*/, res.status(common_1.HttpStatus.OK).json((0, response_util_1["default"])({
                            req: req,
                            body: {
                                access_token: accessToken
                            }
                        }))];
                }
                catch (e) {
                    throw new custom_exception_1.CustomException({ error: "Token is invalid" }, common_1.HttpStatus.UNAUTHORIZED);
                }
                return [2 /*return*/];
            });
        });
    };
    AuthController.prototype.logout = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, res.status(common_1.HttpStatus.OK).clearCookie("refresh_token").json((0, response_util_1["default"])({
                        req: req,
                        message: "Logout successfully"
                    }))];
            });
        });
    };
    AuthController.prototype.register = function (req, res, registerDto) {
        return __awaiter(this, void 0, void 0, function () {
            var email, username, phone, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.usersService.findByEmail(registerDto.phone)];
                    case 1:
                        email = _a.sent();
                        return [4 /*yield*/, this.usersService.findByUsername(registerDto.phone)];
                    case 2:
                        username = _a.sent();
                        return [4 /*yield*/, this.usersService.findByPhone(registerDto.phone)];
                    case 3:
                        phone = _a.sent();
                        if (email) {
                            throw new custom_exception_1.CustomException({ error: "Email is exist" });
                        }
                        if (username) {
                            throw new custom_exception_1.CustomException({ error: "Username is exist" });
                        }
                        if (phone) {
                            throw new custom_exception_1.CustomException({ error: "Phone is exist" });
                        }
                        return [4 /*yield*/, this.twilioService.sendSms(registerDto.phone)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, res.status(common_1.HttpStatus.OK).json((0, response_util_1["default"])({ req: req, message: "A verification code has been sent to the phone number +".concat(registerDto.phone) }))];
                    case 5:
                        e_2 = _a.sent();
                        if (e_2.code) {
                            throw new custom_exception_1.CustomException({ error: "The phone number is incorrect" });
                        }
                        throw e_2;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.registerConfirm = function (req, res, registerDto, file) {
        return __awaiter(this, void 0, void 0, function () {
            var createFile, data, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        createFile = (0, image_processor_util_1.createfileGenerator)(file, "users", registerDto.username);
                        return [4 /*yield*/, this.twilioService.verifySmsCode(registerDto.phone, registerDto.code)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.usersService.register(__assign(__assign({}, registerDto), { image_path: createFile === null || createFile === void 0 ? void 0 : createFile.filePath }))];
                    case 2:
                        data = _a.sent();
                        return [4 /*yield*/, (createFile === null || createFile === void 0 ? void 0 : createFile.generate())];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, res.status(common_1.HttpStatus.OK).json((0, response_util_1["default"])({ req: req, message: "Registered successfully ", body: (0, exclude_util_1["default"])(data, ["password"]) }))];
                    case 4:
                        e_3 = _a.sent();
                        if (e_3.code) {
                            throw new custom_exception_1.CustomException({ error: "Something went wrong with the sms verification" });
                        }
                        throw e_3;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
        (0, common_1.Get)("check-logged-in"),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Res)())
    ], AuthController.prototype, "checkLoggedIn");
    __decorate([
        (0, common_1.Post)('login'),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_3.Body)(new joi_validation_pipe_1.JoiValidationPipe(auth_schema_1.loginSchema)))
    ], AuthController.prototype, "login");
    __decorate([
        (0, common_1.Post)("refresh"),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_3.Body)(new joi_validation_pipe_1.JoiValidationPipe(auth_schema_1.refreshTokenSchema)))
    ], AuthController.prototype, "refresh");
    __decorate([
        (0, common_1.Post)("logout"),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Res)())
    ], AuthController.prototype, "logout");
    __decorate([
        (0, common_1.Post)("register"),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_3.Body)(new joi_validation_pipe_1.JoiValidationPipe(auth_schema_1.registerSchema)))
    ], AuthController.prototype, "register");
    __decorate([
        (0, common_1.Post)("register/confirm"),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_3.Body)(new form_data_validation_pipe_1.FormDataValidationPipe(auth_schema_1.registerSchemaConfirm))),
        __param(3, (0, common_1.UploadedFile)(new file_validation_pipe_1.FileValidationPipe()))
    ], AuthController.prototype, "registerConfirm");
    AuthController = __decorate([
        (0, common_2.Controller)('auth')
    ], AuthController);
    return AuthController;
}());
exports.AuthController = AuthController;
