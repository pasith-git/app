"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
var dayjs_util_1 = require("./dayjs.util");
exports["default"] = (function (_a) {
    var req = _a.req, _b = _a.statusCode, statusCode = _b === void 0 ? 200 : _b, data = __rest(_a, ["req", "statusCode"]);
    return __assign(__assign({ datetime: (0, dayjs_util_1["default"])().format("DD/MM/YYYY HH:mm:ss"), method: req.method, path: req.path }, data), { status_code: statusCode });
});
