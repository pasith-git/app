"use strict";
exports.__esModule = true;
function exclude(user, keys) {
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        delete user[key];
    }
    return user;
}
exports["default"] = exclude;
