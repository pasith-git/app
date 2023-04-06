"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MuseumGalleryCategoriesModule = void 0;
var common_1 = require("@nestjs/common");
var shared_module_1 = require("shared/shared.module");
var museum_gallery_categories_controller_1 = require("./museum-gallery-categories.controller");
var museum_gallery_categories_service_1 = require("./museum-gallery-categories.service");
var MuseumGalleryCategoriesModule = /** @class */ (function () {
    function MuseumGalleryCategoriesModule() {
    }
    MuseumGalleryCategoriesModule = __decorate([
        (0, common_1.Module)({
            imports: [shared_module_1.SharedModule],
            controllers: [museum_gallery_categories_controller_1.MuseumGalleryCategoriesController,],
            providers: [museum_gallery_categories_service_1.MuseumGalleryCategoriesService]
        })
    ], MuseumGalleryCategoriesModule);
    return MuseumGalleryCategoriesModule;
}());
exports.MuseumGalleryCategoriesModule = MuseumGalleryCategoriesModule;
