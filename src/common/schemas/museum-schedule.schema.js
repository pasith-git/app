"use strict";
exports.__esModule = true;
exports.deleteManyMuseumScheduleSchema = exports.updateManyMuseumScheduleschema = exports.createManyMuseumScheduleschema = void 0;
var JoiCore = require("joi");
var date_1 = require("@joi/date");
var Joi = JoiCore.extend(date_1["default"]);
exports.createManyMuseumScheduleschema = Joi.array().items({
    title: Joi.string().max(70).trim().required(),
    start_date: Joi.date().required(),
    description: Joi.string().trim(),
    schedule_time_id: Joi.number().strict().required(),
    user_limit: Joi.number().strict().required(),
    price: Joi.number().strict().precision(2).max(99999999.99).required(),
    domestic_price: Joi.number().strict().precision(2).max(99999999.99),
    discount: Joi.number().strict().precision(2).max(99999999.99),
    status: Joi.string().valid("pending", "active", "ended").required()
}).min(1);
exports.updateManyMuseumScheduleschema = Joi.array().items({
    id: Joi.number().strict().required(),
    title: Joi.string().max(70).trim(),
    start_date: Joi.date(),
    description: Joi.string().allow(null),
    price: Joi.number().strict().precision(2).max(99999999.99),
    domestic_price: Joi.number().strict().precision(2).max(99999999.99).allow(null),
    schedule_time_id: Joi.number().strict(),
    discount: Joi.number().strict().precision(2).max(99999999.99).allow(null),
    status: Joi.string().valid("pending", "active", "ended"),
    user_limit: Joi.number().strict()
}).min(1);
exports.deleteManyMuseumScheduleSchema = Joi.array().items({
    id: Joi.number().strict().required()
}).min(1);
