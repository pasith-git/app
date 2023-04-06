"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.JoiValidationPipe = void 0;
var common_1 = require("@nestjs/common");
var custom_exception_1 = require("common/exceptions/custom.exception");
var JoiValidationPipe = /** @class */ (function () {
    function JoiValidationPipe(schema) {
        this.schema = schema;
    }
    JoiValidationPipe.prototype.transform = function (value, metadata) {
        var error = this.schema.validate(value).error;
        if (error) {
            throw new custom_exception_1.CustomException({ message: "data validation", error: error.details });
        }
        return value;
    };
    JoiValidationPipe = __decorate([
        (0, common_1.Injectable)()
    ], JoiValidationPipe);
    return JoiValidationPipe;
}());
exports.JoiValidationPipe = JoiValidationPipe;
