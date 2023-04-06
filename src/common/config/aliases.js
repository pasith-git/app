"use strict";
exports.__esModule = true;
var module_alias_1 = require("module-alias");
var path_1 = require("path");
var rootPath = path_1["default"].resolve(__dirname, '..', '..', 'dist');
module_alias_1["default"].addAliases({
    'src': rootPath
});
