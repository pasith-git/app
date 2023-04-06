"use strict";
exports.__esModule = true;
exports.deleteManyCountrySchema = exports.updateManyCountrySchema = exports.createManyCountrySchema = void 0;
var JoiCore = require("joi");
var date_1 = require("@joi/date");
var Joi = JoiCore.extend(date_1["default"]);
exports.createManyCountrySchema = Joi.array().items({
    name: Joi.string().required().max(70).trim(),
    num_code: Joi.string().max(20).trim(),
    locale: Joi.string().required().max(10).trim()
}).min(1);
exports.updateManyCountrySchema = Joi.array().items({
    id: Joi.number().strict().required(),
    name: Joi.string().max(70).trim(),
    num_code: Joi.string().max(20).trim().allow(null),
    locale: Joi.string().max(10).trim()
}).min(1);
exports.deleteManyCountrySchema = Joi.array().items({
    id: Joi.number().strict().required()
}).min(1);
