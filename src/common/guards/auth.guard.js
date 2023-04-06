"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.AuthGuard = void 0;
var common_1 = require("@nestjs/common");
var role_decorator_1 = require("common/decorators/role.decorator");
var custom_exception_1 = require("common/exceptions/custom.exception");
var jsonwebtoken_1 = require("jsonwebtoken");
var AuthGuard = /** @class */ (function () {
    function AuthGuard(reflector, authService, usersService) {
        this.reflector = reflector;
        this.authService = authService;
        this.usersService = usersService;
    }
    AuthGuard.prototype.canActivate = function (context) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var requiredRoles, ctx, req, res, _b, _1, access_token, jwtPayload, roles_1, matchesRoles, e_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        requiredRoles = this.reflector.getAllAndOverride(role_decorator_1.ROLES_KEY, [
                            context.getHandler(),
                            context.getClass(),
                        ]);
                        ctx = context.switchToHttp();
                        req = ctx.getRequest();
                        res = ctx.getResponse();
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 5, , 6]);
                        if (!req.headers.authorization) return [3 /*break*/, 4];
                        _b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' '), _1 = _b[0], access_token = _b[1];
                        jwtPayload = this.authService.jwtVerify(access_token);
                        if (!!requiredRoles) return [3 /*break*/, 2];
                        return [2 /*return*/, true];
                    case 2: return [4 /*yield*/, this.usersService.findById(jwtPayload["id"])];
                    case 3:
                        roles_1 = (_c.sent()).roles.map(function (data) { return data.role.name; });
                        matchesRoles = requiredRoles.some(function (role) { return roles_1.includes(role); });
                        if (matchesRoles) {
                            return [2 /*return*/, true];
                        }
                        else {
                            throw new custom_exception_1.CustomException({ error: "Permission error (require: [".concat(requiredRoles, "])") }, common_1.HttpStatus.FORBIDDEN);
                        }
                        _c.label = 4;
                    case 4: throw new custom_exception_1.CustomException({ error: "No token provided" }, common_1.HttpStatus.UNAUTHORIZED);
                    case 5:
                        e_1 = _c.sent();
                        if (e_1 instanceof jsonwebtoken_1.JsonWebTokenError) {
                            throw new custom_exception_1.CustomException({ error: "Token is invalid" }, common_1.HttpStatus.UNAUTHORIZED);
                        }
                        throw e_1;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AuthGuard = __decorate([
        (0, common_1.Injectable)()
    ], AuthGuard);
    return AuthGuard;
}());
exports.AuthGuard = AuthGuard;
