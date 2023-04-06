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
exports.MuseumSchedulePaymentsService = void 0;
var common_1 = require("@nestjs/common");
var MuseumSchedulePaymentsService = /** @class */ (function () {
    function MuseumSchedulePaymentsService(prisma) {
        this.prisma = prisma;
    }
    MuseumSchedulePaymentsService.prototype.findAll = function (museum_id_query, query) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_x) {
                return [2 /*return*/, this.prisma.museumSchedulePayment.findMany({
                        where: __assign(__assign(__assign({ bank_name: {
                                contains: (_a = query === null || query === void 0 ? void 0 : query.filter) === null || _a === void 0 ? void 0 : _a.bank_name
                            }, total: {
                                equals: (_b = query === null || query === void 0 ? void 0 : query.filter) === null || _b === void 0 ? void 0 : _b.total
                            }, info: {
                                contains: (_c = query === null || query === void 0 ? void 0 : query.filter) === null || _c === void 0 ? void 0 : _c.info
                            }, description: {
                                contains: (_d = query === null || query === void 0 ? void 0 : query.filter) === null || _d === void 0 ? void 0 : _d.description
                            }, payment_type: {
                                equals: (_e = query === null || query === void 0 ? void 0 : query.filter) === null || _e === void 0 ? void 0 : _e.payment_type
                            }, payment_date: {
                                gte: (_g = (_f = query === null || query === void 0 ? void 0 : query.filter) === null || _f === void 0 ? void 0 : _f.payment_date) === null || _g === void 0 ? void 0 : _g.start_date,
                                lt: (_j = (_h = query === null || query === void 0 ? void 0 : query.filter) === null || _h === void 0 ? void 0 : _h.payment_date) === null || _j === void 0 ? void 0 : _j.end_date
                            } }, (((_k = query === null || query === void 0 ? void 0 : query.filter) === null || _k === void 0 ? void 0 : _k.user_username) && {
                            user: {
                                username: {
                                    contains: (_l = query === null || query === void 0 ? void 0 : query.filter) === null || _l === void 0 ? void 0 : _l.user_username
                                }
                            }
                        })), (((_m = query === null || query === void 0 ? void 0 : query.filter) === null || _m === void 0 ? void 0 : _m.employee_username) && {
                            employee: {
                                username: {
                                    contains: (_o = query === null || query === void 0 ? void 0 : query.filter) === null || _o === void 0 ? void 0 : _o.employee_username
                                }
                            }
                        })), { museum_id: {
                                equals: museum_id_query !== undefined ? Number(museum_id_query) : undefined
                            } }),
                        orderBy: __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, (((_p = query === null || query === void 0 ? void 0 : query.sort) === null || _p === void 0 ? void 0 : _p.bank_name) && {
                            first_name: query.sort.bank_name
                        })), (((_q = query === null || query === void 0 ? void 0 : query.sort) === null || _q === void 0 ? void 0 : _q.total) && {
                            last_name: query.sort.total
                        })), (((_r = query === null || query === void 0 ? void 0 : query.sort) === null || _r === void 0 ? void 0 : _r.info) && {
                            username: query.sort.info
                        })), (((_s = query === null || query === void 0 ? void 0 : query.sort) === null || _s === void 0 ? void 0 : _s.description) && {
                            username: query.sort.description
                        })), (((_t = query === null || query === void 0 ? void 0 : query.sort) === null || _t === void 0 ? void 0 : _t.payment_date) && {
                            created_at: query.sort.payment_date
                        })), (((_u = query === null || query === void 0 ? void 0 : query.sort) === null || _u === void 0 ? void 0 : _u.payment_type) && {
                            updated_at: query.sort.payment_type
                        })), (((_v = query === null || query === void 0 ? void 0 : query.sort) === null || _v === void 0 ? void 0 : _v.user_username) && {
                            user: {
                                username: query.sort.user_username
                            }
                        })), (((_w = query === null || query === void 0 ? void 0 : query.sort) === null || _w === void 0 ? void 0 : _w.employee_username) && {
                            user: {
                                username: query.sort.employee_username
                            }
                        })),
                        include: {
                            museum_schedules: {
                                include: {
                                    museum_schedule: true
                                }
                            },
                            user: true,
                            employee: true
                        }
                    })];
            });
        });
    };
    MuseumSchedulePaymentsService.prototype.findById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.museumSchedulePayment.findFirst({
                        where: {
                            id: id
                        }
                    })];
            });
        });
    };
    MuseumSchedulePaymentsService.prototype.create = function (_a) {
        var museum_schedules = _a.museum_schedules, createDto = __rest(_a, ["museum_schedules"]);
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, this.prisma.museumSchedulePayment.create({
                        data: __assign(__assign({}, createDto), { museum_schedules: {
                                createMany: {
                                    data: museum_schedules.map(function (museum_schedule) {
                                        return {
                                            museum_schedule_id: museum_schedule.id,
                                            user_limit: museum_schedule.user_limit,
                                            total: museum_schedule.total
                                        };
                                    })
                                }
                            } })
                    })];
            });
        });
    };
    MuseumSchedulePaymentsService.prototype.update = function (_a) {
        var museum_schedules = _a.museum_schedules, id = _a.id, delete_image = _a.delete_image, updateDto = __rest(_a, ["museum_schedules", "id", "delete_image"]);
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, this.prisma.museumSchedulePayment.update({
                        where: {
                            id: id
                        },
                        data: __assign(__assign({}, updateDto), ((museum_schedules === null || museum_schedules === void 0 ? void 0 : museum_schedules.length) > 0 && {
                            museum_schedules: {
                                deleteMany: {
                                    museum_schedule_id: id
                                },
                                createMany: {
                                    data: museum_schedules.map(function (museum_schedule) {
                                        return {
                                            museum_schedule_id: museum_schedule.id,
                                            user_limit: museum_schedule.user_limit,
                                            total: museum_schedule.total
                                        };
                                    })
                                }
                            }
                        }))
                    })];
            });
        });
    };
    MuseumSchedulePaymentsService.prototype["delete"] = function (_a) {
        var id = _a.id;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, this.prisma.museumSchedulePayment["delete"]({
                        where: {
                            id: id
                        }
                    })];
            });
        });
    };
    MuseumSchedulePaymentsService = __decorate([
        (0, common_1.Injectable)()
    ], MuseumSchedulePaymentsService);
    return MuseumSchedulePaymentsService;
}());
exports.MuseumSchedulePaymentsService = MuseumSchedulePaymentsService;
