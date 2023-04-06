"use strict";
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
exports.__esModule = true;
exports.deleteFileGenerator = exports.updatefileGenerator = exports.createfileGenerator = void 0;
var path = require("path");
var uuid_1 = require("uuid");
var fs = require("fs-extra");
var IMAGE_PATH = 'assets/images/';
var createfileGenerator = function (file, filePrefixPath, fileNamePath) {
    if (file) {
        var folderNameUUID_1 = (0, uuid_1.v4)();
        var filePath_1 = path.join(filePrefixPath, "".concat(fileNamePath, "_").concat(folderNameUUID_1), "".concat((0, uuid_1.v4)()).concat(path.extname(file.originalname)));
        return {
            filePath: filePath_1,
            generate: function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!fs.pathExistsSync(path.join(IMAGE_PATH, filePrefixPath))) return [3 /*break*/, 3];
                            return [4 /*yield*/, fs.mkdir(path.join(IMAGE_PATH, filePrefixPath))];
                        case 1:
                            _a.sent();
                            if (!!fs.pathExistsSync(path.join(IMAGE_PATH, filePrefixPath, "".concat(fileNamePath, "_").concat(folderNameUUID_1)))) return [3 /*break*/, 3];
                            return [4 /*yield*/, fs.mkdir(path.join(IMAGE_PATH, filePrefixPath, "".concat(fileNamePath, "_").concat(folderNameUUID_1)))];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [4 /*yield*/, fs.outputFile(path.join(IMAGE_PATH, filePath_1), file.buffer)];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }
        };
    }
};
exports.createfileGenerator = createfileGenerator;
var updatefileGenerator = function (file, filePrefixPath, oldFileNamePath, fileNamePath, dbFilePath, isDelete) {
    var filePath;
    var generate = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); };
    if (isDelete && dbFilePath) {
        filePath = null;
        generate = function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs.remove(path.dirname(path.join(IMAGE_PATH, dbFilePath)))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
    }
    if (fileNamePath && dbFilePath && !isDelete && fileNamePath !== oldFileNamePath) {
        var folderNameUUID_2 = (0, uuid_1.v4)();
        filePath = path.join(filePrefixPath, "".concat(fileNamePath, "_").concat(folderNameUUID_2), path.basename(dbFilePath));
        generate = function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs.rename(path.join(IMAGE_PATH, path.dirname(dbFilePath)), path.join(IMAGE_PATH, filePrefixPath, "".concat(fileNamePath, "_").concat(folderNameUUID_2)))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
    }
    if (file) {
        var folderNameUUID = (0, uuid_1.v4)();
        filePath = path.join(filePrefixPath, "".concat(fileNamePath, "_").concat(folderNameUUID), "".concat((0, uuid_1.v4)()).concat(path.extname(file.originalname)));
        generate = function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!dbFilePath) return [3 /*break*/, 2];
                        return [4 /*yield*/, fs.remove(path.dirname(path.join(IMAGE_PATH, dbFilePath)))];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, fs.outputFile(path.join(IMAGE_PATH, filePath), file.buffer)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
    }
    return {
        filePath: filePath,
        generate: generate
    };
};
exports.updatefileGenerator = updatefileGenerator;
var deleteFileGenerator = function (dbFilePath) {
    if (dbFilePath) {
        return {
            generate: function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fs.remove(path.dirname(path.join(IMAGE_PATH, dbFilePath)))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }
        };
    }
};
exports.deleteFileGenerator = deleteFileGenerator;
