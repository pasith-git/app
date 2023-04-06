"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ManyExceptionsFilter = exports.PrismaFilter = exports.CustomFilter = void 0;
var common_1 = require("@nestjs/common");
var library_1 = require("@prisma/client/runtime/library");
var custom_exception_1 = require("common/exceptions/custom.exception");
var response_util_1 = require("common/utils/response.util");
var CustomFilter = /** @class */ (function () {
    function CustomFilter() {
    }
    CustomFilter.prototype["catch"] = function (exception, host) {
        var ctx = host.switchToHttp();
        var response = ctx.getResponse();
        var request = ctx.getRequest();
        /* const status = exception.getStatus(); */
        return response
            .status(exception.getStatus())
            .json((0, response_util_1["default"])({
            req: request,
            statusCode: exception.getStatus(),
            message: exception.getResponse()["message"],
            error: exception.getResponse()["error"],
            code: exception.getResponse()["code"]
        }));
    };
    CustomFilter = __decorate([
        (0, common_1.Catch)(custom_exception_1.CustomException)
    ], CustomFilter);
    return CustomFilter;
}());
exports.CustomFilter = CustomFilter;
var PrismaFilter = /** @class */ (function () {
    function PrismaFilter() {
    }
    PrismaFilter.prototype["catch"] = function (exception, host) {
        var ctx = host.switchToHttp();
        var response = ctx.getResponse();
        var request = ctx.getRequest();
        /* const status = exception.getStatus(); */
        var error;
        var message;
        if (exception instanceof library_1.PrismaClientKnownRequestError) {
            message = "PrismaClientKnownRequestError";
            if (exception.code === "P2002") {
                error = "Unique constraint failed on the ".concat(exception.meta.target);
            }
            else {
                error = exception.message;
            }
        }
        else if (exception instanceof library_1.PrismaClientValidationError) {
            message = "PrismaClientValidationError";
            error = exception.message;
        }
        return response
            .status(common_1.HttpStatus.BAD_REQUEST)
            .json((0, response_util_1["default"])({
            req: request,
            statusCode: common_1.HttpStatus.BAD_REQUEST,
            error: error
        }));
    };
    PrismaFilter = __decorate([
        (0, common_1.Catch)(library_1.PrismaClientKnownRequestError, library_1.PrismaClientValidationError)
    ], PrismaFilter);
    return PrismaFilter;
}());
exports.PrismaFilter = PrismaFilter;
var ManyExceptionsFilter = /** @class */ (function () {
    function ManyExceptionsFilter() {
    }
    ManyExceptionsFilter.prototype["catch"] = function (exception, host) {
        var ctx = host.switchToHttp();
        var response = ctx.getResponse();
        var request = ctx.getRequest();
        return response
            .status(exception.getStatus())
            .json((0, response_util_1["default"])({
            req: request,
            statusCode: exception.getStatus(),
            message: exception.getResponse()["message"],
            error: exception.getResponse()["error"]
        }));
    };
    ManyExceptionsFilter = __decorate([
        (0, common_1.Catch)(common_1.InternalServerErrorException, common_1.BadRequestException, common_1.NotFoundException)
    ], ManyExceptionsFilter);
    return ManyExceptionsFilter;
}());
exports.ManyExceptionsFilter = ManyExceptionsFilter;
