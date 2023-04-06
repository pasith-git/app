"use strict";
exports.__esModule = true;
exports.deleteManyCouponSchema = exports.updateManyCouponSchema = exports.createManyCouponSchema = void 0;
var JoiCore = require("joi");
var date_1 = require("@joi/date");
var Joi = JoiCore.extend(date_1["default"]);
exports.createManyCouponSchema = Joi.array().items({
    code: Joi.string(),
    type: Joi.string().valid('percent', 'price'),
    amount: Joi.number().strict().precision(2).max(99999999.99),
    expiration_date: Joi.date().format("DD/MM/YYYY").required(),
    branch_id: Joi.number().strict().required()
}).min(1);
exports.updateManyCouponSchema = Joi.array().items({
    id: Joi.number().strict().required(),
    code: Joi.string(),
    type: Joi.string().valid('percent', 'price'),
    amount: Joi.number().strict().precision(2).max(99999999.99),
    expiration_date: Joi.date().format("DD/MM/YYYY"),
    branch_id: Joi.number().strict(),
    random_code: Joi.boolean()
}).min(1);
exports.deleteManyCouponSchema = Joi.array().items({
    id: Joi.number().strict().required()
}).min(1);
