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
exports.MuseumGalleriesService = void 0;
var common_1 = require("@nestjs/common");
var MuseumGalleriesService = /** @class */ (function () {
    function MuseumGalleriesService(prisma) {
        this.prisma = prisma;
    }
    MuseumGalleriesService.prototype.findAll = function (museum_id_query, query) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_e) {
                return [2 /*return*/, this.prisma.museumGallery.findMany(__assign(__assign(__assign({ where: {
                            museum_gallery_category: {
                                museum_id: {
                                    equals: museum_id_query !== undefined ? Number(museum_id_query) : undefined
                                },
                                name: {
                                    contains: (_a = query === null || query === void 0 ? void 0 : query.filter) === null || _a === void 0 ? void 0 : _a.category_name
                                }
                            },
                            description: {
                                contains: (_b = query === null || query === void 0 ? void 0 : query.filter) === null || _b === void 0 ? void 0 : _b.description
                            }
                        }, orderBy: __assign(__assign({}, (((_c = query === null || query === void 0 ? void 0 : query.sort) === null || _c === void 0 ? void 0 : _c.category_name) && {
                            museum_gallery_category: {
                                name: query.sort.category_name
                            }
                        })), (((_d = query === null || query === void 0 ? void 0 : query.sort) === null || _d === void 0 ? void 0 : _d.description) && {
                            description: query.sort.description
                        })) }, ((query === null || query === void 0 ? void 0 : query.limit) && {
                        take: parseInt(query.limit)
                    })), ((query === null || query === void 0 ? void 0 : query.offset) && {
                        skip: parseInt(query.offset)
                    })), { include: {
                            museum_gallery_category: true
                        } }))];
            });
        });
    };
    MuseumGalleriesService.prototype.findById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.museumGallery.findFirstOrThrow({
                        where: {
                            id: id
                        }
                    })];
            });
        });
    };
    MuseumGalleriesService.prototype.create = function (createDto) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.museumGallery.create({
                        data: createDto
                    })];
            });
        });
    };
    MuseumGalleriesService.prototype.update = function (_a) {
        var delete_image = _a.delete_image, id = _a.id, updateDto = __rest(_a, ["delete_image", "id"]);
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, this.prisma.museumGallery.update({
                        where: {
                            id: id
                        },
                        data: updateDto
                    })];
            });
        });
    };
    MuseumGalleriesService.prototype["delete"] = function (_a) {
        var id = _a.id;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, this.prisma.museumGallery["delete"]({
                        where: {
                            id: id
                        }
                    })];
            });
        });
    };
    MuseumGalleriesService = __decorate([
        (0, common_1.Injectable)()
    ], MuseumGalleriesService);
    return MuseumGalleriesService;
}());
exports.MuseumGalleriesService = MuseumGalleriesService;
