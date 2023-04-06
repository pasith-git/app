"use strict";
exports.__esModule = true;
exports.deleteManyProvinceSchema = exports.updateManyProvinceSchema = exports.createManyProvinceSchema = void 0;
var JoiCore = require("joi");
var date_1 = require("@joi/date");
var Joi = JoiCore.extend(date_1["default"]);
exports.createManyProvinceSchema = Joi.array().items({
    name: Joi.string().required().max(70).trim()
}).min(1);
exports.updateManyProvinceSchema = Joi.array().items({
    id: Joi.number().strict().required(),
    name: Joi.string().max(70).trim()
}).min(1);
exports.deleteManyProvinceSchema = Joi.array().items({
    id: Joi.number().strict().required()
}).min(1);
