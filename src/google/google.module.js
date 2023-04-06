"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GoogleModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var google_service_1 = require("./google.service");
var GoogleModule = /** @class */ (function () {
    function GoogleModule() {
    }
    GoogleModule = __decorate([
        (0, common_1.Module)({
            providers: [google_service_1.GoogleService, config_1.ConfigService],
            exports: [google_service_1.GoogleService]
        })
    ], GoogleModule);
    return GoogleModule;
}());
exports.GoogleModule = GoogleModule;
