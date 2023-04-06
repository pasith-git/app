"use strict";
exports.__esModule = true;
exports.deleteManyRoleSchema = exports.updateManyRoleSchema = exports.createManyRoleSchema = void 0;
var JoiCore = require("joi");
var date_1 = require("@joi/date");
var Joi = JoiCore.extend(date_1["default"]);
exports.createManyRoleSchema = Joi.array().items({
    name: Joi.string().required().max(40).trim()
}).min(1);
exports.updateManyRoleSchema = Joi.array().items({
    id: Joi.number().strict().required(),
    name: Joi.string().max(40).trim()
}).min(1);
exports.deleteManyRoleSchema = Joi.array().items({
    id: Joi.number().strict().required()
}).min(1);
