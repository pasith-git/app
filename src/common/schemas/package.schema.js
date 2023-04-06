"use strict";
exports.__esModule = true;
exports.deleteManyPackageSchemaBySp = exports.updateManyPackageSchemaBySp = exports.createManyPackageSchemaBySp = void 0;
var JoiCore = require("joi");
var date_1 = require("@joi/date");
var Joi = JoiCore.extend(date_1["default"]);
exports.createManyPackageSchemaBySp = Joi.array().items({
    name: Joi.string().required(),
    description: Joi.string(),
    duration: Joi.number().strict().required(),
    user_limit: Joi.number().strict().required(),
    price: Joi.number().strict().precision(2).max(99999999.99).required(),
    discount: Joi.number().strict().precision(2).max(99999999.99)
}).min(1);
exports.updateManyPackageSchemaBySp = Joi.array().items({
    id: Joi.number().strict().required(),
    name: Joi.string(),
    description: Joi.string().allow(null),
    duration: Joi.number().strict(),
    user_limit: Joi.number().strict(),
    price: Joi.number().strict().precision(2).max(99999999.99),
    discount: Joi.number().strict().precision(2).max(99999999.99).allow(null)
}).min(1);
exports.deleteManyPackageSchemaBySp = Joi.array().items({
    id: Joi.number().strict().required()
}).min(1);
