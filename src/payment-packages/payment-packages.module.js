"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PaymentPackageModule = void 0;
var common_1 = require("@nestjs/common");
var bcel_service_1 = require("bcel/bcel.service");
var packages_service_1 = require("packages/packages.service");
var shared_module_1 = require("shared/shared.module");
var payment_packages_controller_1 = require("./payment-packages.controller");
var payment_packages_service_1 = require("./payment-packages.service");
var PaymentPackageModule = /** @class */ (function () {
    function PaymentPackageModule() {
    }
    PaymentPackageModule = __decorate([
        (0, common_1.Module)({
            imports: [shared_module_1.SharedModule],
            controllers: [payment_packages_controller_1.PaymentPackagesController],
            providers: [payment_packages_service_1.PaymentPackagesService, packages_service_1.PackagesService, bcel_service_1.BcelService]
        })
    ], PaymentPackageModule);
    return PaymentPackageModule;
}());
exports.PaymentPackageModule = PaymentPackageModule;
