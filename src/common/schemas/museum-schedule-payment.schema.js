"use strict";
exports.__esModule = true;
exports.deleteManyMuseumSchedulePaymentSchema = exports.updateManyMuseumSchedulePaymentSchema = exports.generateQrMuseumSchedulePaymentSchema = exports.createManyMuseumSchedulePaymentSchema = void 0;
var JoiCore = require("joi");
var date_1 = require("@joi/date");
var Joi = JoiCore.extend(date_1["default"]);
exports.createManyMuseumSchedulePaymentSchema = Joi.array().items({
    user_id: Joi.number().strict(),
    museum_schedules: Joi.array().items(Joi.object({
        id: Joi.number().strict().required(),
        user_limit: Joi.number().strict().required()
    }).required()).min(1).required(),
    payment_type: Joi.string().valid("bank", "cash").required(),
    info: Joi.string(),
    description: Joi.string(),
    bank_name: Joi.string()
}).min(1);
exports.generateQrMuseumSchedulePaymentSchema = Joi.array().items({
    id: Joi.number().strict().required(),
    user_limit: Joi.number().strict().required()
}).min(1);
exports.updateManyMuseumSchedulePaymentSchema = Joi.array().items({
    id: Joi.number().strict().required(),
    /* user_id: Joi.number().strict().allow(null), */
    /* museum_schedules: Joi.array().items(Joi.object({
        id: Joi.number().strict().required(),
        user_limit: Joi.number().strict().required(),
    }).required()).min(1).allow(null),
    payment_type: Joi.string().valid("bank", "cash"), */
    info: Joi.string().allow(null),
    description: Joi.string().allow(null),
    delete_image: Joi.boolean()
}).min(1);
exports.deleteManyMuseumSchedulePaymentSchema = Joi.array().items({
    id: Joi.number().strict().required()
}).min(1);
