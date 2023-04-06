"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MuseumSchedulePaymentsModule = void 0;
var common_1 = require("@nestjs/common");
var bcel_service_1 = require("bcel/bcel.service");
var museum_schedules_service_1 = require("museum-schedules/museum-schedules.service");
var schedule_times_service_1 = require("schedule-times/schedule-times.service");
var shared_module_1 = require("shared/shared.module");
var museum_schedule_payments_controller_1 = require("./museum-schedule-payments.controller");
var museum_schedule_payments_service_1 = require("./museum-schedule-payments.service");
var MuseumSchedulePaymentsModule = /** @class */ (function () {
    function MuseumSchedulePaymentsModule() {
    }
    MuseumSchedulePaymentsModule = __decorate([
        (0, common_1.Module)({
            imports: [shared_module_1.SharedModule],
            controllers: [museum_schedule_payments_controller_1.MuseumSchedulePaymentsController],
            providers: [museum_schedule_payments_service_1.MuseumSchedulePaymentsService, bcel_service_1.BcelService, museum_schedules_service_1.MuseumSchedulesService, schedule_times_service_1.ScheduleTimesService]
        })
    ], MuseumSchedulePaymentsModule);
    return MuseumSchedulePaymentsModule;
}());
exports.MuseumSchedulePaymentsModule = MuseumSchedulePaymentsModule;
