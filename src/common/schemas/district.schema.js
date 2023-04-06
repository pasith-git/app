"use strict";
exports.__esModule = true;
exports.deleteManyDistrictSchema = exports.updateManyDistrictSchema = exports.createManyDistrictSchema = void 0;
var JoiCore = require("joi");
var date_1 = require("@joi/date");
var Joi = JoiCore.extend(date_1["default"]);
exports.createManyDistrictSchema = Joi.array().items({
    name: Joi.string().required().max(70).trim(),
    province_id: Joi.number().strict().required()
}).min(1);
exports.updateManyDistrictSchema = Joi.array().items({
    id: Joi.number().strict().required(),
    name: Joi.string().max(70).trim(),
    province_id: Joi.number().strict()
}).min(1);
exports.deleteManyDistrictSchema = Joi.array().items({
    id: Joi.number().strict().required()
}).min(1);
