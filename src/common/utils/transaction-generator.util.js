"use strict";
exports.__esModule = true;
var uuid_1 = require("uuid");
function generateTransactionId() {
    return (0, uuid_1.v4)();
}
exports["default"] = generateTransactionId;
