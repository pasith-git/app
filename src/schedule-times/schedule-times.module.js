"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ScheduleTimesModule = void 0;
var common_1 = require("@nestjs/common");
var shared_module_1 = require("shared/shared.module");
var schedule_times_controller_1 = require("./schedule-times.controller");
var schedule_times_service_1 = require("./schedule-times.service");
var ScheduleTimesModule = /** @class */ (function () {
    function ScheduleTimesModule() {
    }
    ScheduleTimesModule = __decorate([
        (0, common_1.Module)({
            imports: [shared_module_1.SharedModule],
            controllers: [schedule_times_controller_1.ScheduleTimesController],
            providers: [schedule_times_service_1.ScheduleTimesService]
        })
    ], ScheduleTimesModule);
    return ScheduleTimesModule;
}());
exports.ScheduleTimesModule = ScheduleTimesModule;
