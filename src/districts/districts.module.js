"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DistrictsModule = void 0;
var common_1 = require("@nestjs/common");
var shared_module_1 = require("shared/shared.module");
var districts_controller_1 = require("./districts.controller");
var districts_service_1 = require("./districts.service");
var DistrictsModule = /** @class */ (function () {
    function DistrictsModule() {
    }
    DistrictsModule = __decorate([
        (0, common_1.Module)({
            imports: [shared_module_1.SharedModule],
            controllers: [districts_controller_1.DistrictsController],
            providers: [districts_service_1.DistrictsService]
        })
    ], DistrictsModule);
    return DistrictsModule;
}());
exports.DistrictsModule = DistrictsModule;
