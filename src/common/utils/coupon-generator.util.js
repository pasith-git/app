"use strict";
exports.__esModule = true;
function generateCouponCode(codeLength) {
    if (codeLength === void 0) { codeLength = 8; }
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var code = '';
    for (var i = 0; i < codeLength; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}
exports["default"] = generateCouponCode;
