"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FileValidationPipe = exports.FilesValidationPipe = void 0;
var common_1 = require("@nestjs/common");
var custom_exception_1 = require("common/exceptions/custom.exception");
var FILE_MAXSIZE = 1000 * 1000 * 4;
var FilesValidationPipe = /** @class */ (function () {
    function FilesValidationPipe() {
    }
    FilesValidationPipe.prototype.transform = function (files, metadata) {
        // "value" is an object containing the file's attributes and metadata
        if ((files === null || files === void 0 ? void 0 : files.length) > 0) {
            for (var i = 0; i < files.length; i++) {
                if (files[i].size > FILE_MAXSIZE) {
                    throw new custom_exception_1.CustomException({ error: "Validation failed (expected size is less than ".concat(FILE_MAXSIZE, ")"), message: "file errors" }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
                }
                if (!/(jpe?g|png)$/i.test(files[0].mimetype)) {
                    throw new custom_exception_1.CustomException({ error: "Validation failed (expected type is jp?g or png)", message: "file errors" }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
                }
                return files;
            }
        }
    };
    FilesValidationPipe = __decorate([
        (0, common_1.Injectable)()
    ], FilesValidationPipe);
    return FilesValidationPipe;
}());
exports.FilesValidationPipe = FilesValidationPipe;
var FileValidationPipe = /** @class */ (function () {
    function FileValidationPipe() {
    }
    FileValidationPipe.prototype.transform = function (file, metadata) {
        // "value" is an object containing the file's attributes and metadata
        if (file) {
            if (file.size > FILE_MAXSIZE) {
                throw new custom_exception_1.CustomException({ error: "Validation failed (expected size is less than ".concat(FILE_MAXSIZE, ")"), message: "file errors" }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
            }
            if (!/(jpe?g|png)$/i.test(file.mimetype)) {
                throw new custom_exception_1.CustomException({ error: "Validation failed (expected type is jp?g or png)", message: "file errors" }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
            }
            return file;
        }
    };
    FileValidationPipe = __decorate([
        (0, common_1.Injectable)()
    ], FileValidationPipe);
    return FileValidationPipe;
}());
exports.FileValidationPipe = FileValidationPipe;
