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
exports.UsersService = void 0;
var common_1 = require("@nestjs/common");
var dayjs_util_1 = require("common/utils/dayjs.util");
var UsersService = /** @class */ (function () {
    function UsersService(prisma, authService, rolesService) {
        this.prisma = prisma;
        this.authService = authService;
        this.rolesService = rolesService;
    }
    UsersService.prototype.findByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.user.findFirst({
                        where: {
                            email: email
                        }
                    })];
            });
        });
    };
    UsersService.prototype.findByUsername = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.user.findFirst({
                        where: {
                            username: username
                        }
                    })];
            });
        });
    };
    UsersService.prototype.findByPhone = function (phone) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.user.findFirst({
                        where: {
                            phone: phone
                        }
                    })];
            });
        });
    };
    UsersService.prototype.findAll = function (museum_id_query, query) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_x) {
                return [2 /*return*/, this.prisma.user.findMany(__assign(__assign(__assign({ where: {
                            museum_id: {
                                equals: museum_id_query !== undefined ? Number(museum_id_query) : undefined
                            },
                            first_name: {
                                contains: (_a = query === null || query === void 0 ? void 0 : query.filter) === null || _a === void 0 ? void 0 : _a.first_name
                            },
                            last_name: {
                                contains: (_b = query === null || query === void 0 ? void 0 : query.filter) === null || _b === void 0 ? void 0 : _b.last_name
                            },
                            username: {
                                contains: (_c = query === null || query === void 0 ? void 0 : query.filter) === null || _c === void 0 ? void 0 : _c.username
                            },
                            email: {
                                contains: (_d = query === null || query === void 0 ? void 0 : query.filter) === null || _d === void 0 ? void 0 : _d.email
                            },
                            is_staff: {
                                equals: ((_e = query === null || query === void 0 ? void 0 : query.filter) === null || _e === void 0 ? void 0 : _e.is_staff) !== undefined ? Boolean((_f = query === null || query === void 0 ? void 0 : query.filter) === null || _f === void 0 ? void 0 : _f.is_staff) : undefined
                            },
                            created_at: {
                                gte: (_h = (_g = query === null || query === void 0 ? void 0 : query.filter) === null || _g === void 0 ? void 0 : _g.created_at) === null || _h === void 0 ? void 0 : _h.start_date,
                                lt: (_k = (_j = query === null || query === void 0 ? void 0 : query.filter) === null || _j === void 0 ? void 0 : _j.created_at) === null || _k === void 0 ? void 0 : _k.end_date
                            },
                            updated_at: {
                                gte: (_m = (_l = query === null || query === void 0 ? void 0 : query.filter) === null || _l === void 0 ? void 0 : _l.updated_at) === null || _m === void 0 ? void 0 : _m.start_date,
                                lt: (_p = (_o = query === null || query === void 0 ? void 0 : query.filter) === null || _o === void 0 ? void 0 : _o.updated_at) === null || _p === void 0 ? void 0 : _p.end_date
                            },
                            roles: {
                                every: {
                                    role: {
                                        name: (_q = query === null || query === void 0 ? void 0 : query.filter) === null || _q === void 0 ? void 0 : _q.role_name
                                    }
                                }
                            }
                        }, orderBy: __assign(__assign(__assign(__assign(__assign(__assign({}, (((_r = query === null || query === void 0 ? void 0 : query.sort) === null || _r === void 0 ? void 0 : _r.first_name) && {
                            first_name: query.sort.first_name
                        })), (((_s = query === null || query === void 0 ? void 0 : query.sort) === null || _s === void 0 ? void 0 : _s.last_name) && {
                            last_name: query.sort.last_name
                        })), (((_t = query === null || query === void 0 ? void 0 : query.sort) === null || _t === void 0 ? void 0 : _t.username) && {
                            username: query.sort.username
                        })), (((_u = query === null || query === void 0 ? void 0 : query.sort) === null || _u === void 0 ? void 0 : _u.email) && {
                            username: query.sort.email
                        })), (((_v = query === null || query === void 0 ? void 0 : query.sort) === null || _v === void 0 ? void 0 : _v.created_at) && {
                            created_at: query.sort.created_at
                        })), (((_w = query === null || query === void 0 ? void 0 : query.sort) === null || _w === void 0 ? void 0 : _w.updated_at) && {
                            updated_at: query.sort.updated_at
                        })) }, ((query === null || query === void 0 ? void 0 : query.limit) && {
                        take: parseInt(query.limit)
                    })), ((query === null || query === void 0 ? void 0 : query.offset) && {
                        skip: parseInt(query.offset)
                    })), { include: {
                            roles: {
                                include: {
                                    role: true
                                }
                            },
                            country: true,
                            district: {
                                include: {
                                    province: true
                                }
                            }
                        } }))];
            });
        });
    };
    UsersService.prototype.findByUsernameOrEmail = function (_a) {
        var username = _a.username, email = _a.email;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, this.prisma.user.findFirstOrThrow({
                        where: {
                            OR: [
                                {
                                    username: username
                                },
                                {
                                    email: email
                                }
                            ]
                        },
                        include: {
                            roles: {
                                include: {
                                    role: true
                                }
                            },
                            payment_packages: true
                        }
                    })];
            });
        });
    };
    UsersService.prototype.register = function (_a) {
        var code = _a.code, registerDto = __rest(_a, ["code"]);
        return __awaiter(this, void 0, void 0, function () {
            var roleUser, _b, _c, _d;
            var _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, this.rolesService.findByName("user")];
                    case 1:
                        roleUser = _g.sent();
                        _c = (_b = this.prisma.user).create;
                        _e = {};
                        _d = [__assign({}, registerDto)];
                        _f = { phone: "+".concat(registerDto.phone) };
                        return [4 /*yield*/, this.authService.generatePassword(registerDto.password)];
                    case 2: return [2 /*return*/, _c.apply(_b, [(_e.data = __assign.apply(void 0, _d.concat([(_f.password = _g.sent(), _f.birth_date = (0, dayjs_util_1["default"])(registerDto.birth_date).toDate(), _f.is_active = true, _f.is_staff = false, _f.roles = {
                                    create: {
                                        role: {
                                            connect: {
                                                id: roleUser.id
                                            }
                                        }
                                    }
                                }, _f)])),
                                _e.include = {
                                    roles: true
                                },
                                _e)])];
                }
            });
        });
    };
    UsersService.prototype.findById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.user.findFirstOrThrow({
                        where: {
                            id: id
                        },
                        include: {
                            roles: {
                                include: {
                                    role: true
                                }
                            },
                            payment_packages: {
                                include: {
                                    package: true
                                }
                            },
                            country: true,
                            district: {
                                include: {
                                    province: true
                                }
                            }
                        }
                    })];
            });
        });
    };
    UsersService.prototype.create = function (_a) {
        var role_ids = _a.role_ids, createDto = __rest(_a, ["role_ids"]);
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, this.prisma.user.create({
                        data: __assign(__assign({}, createDto), { roles: {
                                createMany: {
                                    data: role_ids.map(function (role_id) {
                                        return {
                                            role_id: role_id
                                        };
                                    })
                                }
                            } }),
                        include: {
                            roles: {
                                include: {
                                    role: true
                                }
                            }
                        }
                    })];
            });
        });
    };
    UsersService.prototype.update = function (_a) {
        var role_ids = _a.role_ids, id = _a.id, delete_image = _a.delete_image, updateDto = __rest(_a, ["role_ids", "id", "delete_image"]);
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, this.prisma.user.update({
                        where: {
                            id: id
                        },
                        data: __assign(__assign({}, updateDto), ((role_ids === null || role_ids === void 0 ? void 0 : role_ids.length) > 0 && {
                            roles: {
                                deleteMany: {
                                    user_id: id
                                },
                                createMany: {
                                    data: role_ids.map(function (role_id) {
                                        return {
                                            role_id: role_id
                                        };
                                    })
                                }
                            }
                        })),
                        include: {
                            roles: {
                                include: {
                                    role: true
                                }
                            }
                        }
                    })];
            });
        });
    };
    UsersService.prototype["delete"] = function (_a) {
        var id = _a.id;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, this.prisma.user["delete"]({
                        where: {
                            id: id
                        },
                        include: {
                            roles: {
                                include: {
                                    role: true
                                }
                            }
                        }
                    })];
            });
        });
    };
    UsersService = __decorate([
        (0, common_1.Injectable)()
    ], UsersService);
    return UsersService;
}());
exports.UsersService = UsersService;
