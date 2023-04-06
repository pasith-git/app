"use strict";
exports.__esModule = true;
var dayjs_1 = require("dayjs");
var customParseFormat_1 = require("dayjs/plugin/customParseFormat");
var utc_1 = require("dayjs/plugin/utc");
var isSameOrAfter_1 = require("dayjs/plugin/isSameOrAfter");
var isSameOrBefore_1 = require("dayjs/plugin/isSameOrBefore");
var localizedFormat_1 = require("dayjs/plugin/localizedFormat");
/* import timezone from "dayjs/plugin/timezone"; */
dayjs_1["default"].extend(localizedFormat_1["default"]);
dayjs_1["default"].extend(isSameOrAfter_1["default"]);
dayjs_1["default"].extend(isSameOrBefore_1["default"]);
dayjs_1["default"].extend(utc_1["default"]);
dayjs_1["default"].extend(customParseFormat_1["default"]);
var dayjsUtil = dayjs_1["default"];
exports["default"] = dayjsUtil;
