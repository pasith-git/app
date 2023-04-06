"use strict";
exports.__esModule = true;
exports.refreshTokenSchema = exports.registerSchemaConfirm = exports.registerSchema = exports.loginSchema = void 0;
var JoiCore = require("joi");
var date_1 = require("@joi/date");
var Joi = JoiCore.extend(date_1["default"]);
exports.loginSchema = Joi.object({
    username: Joi.string().when('email', {
        is: Joi.exist(),
        then: Joi.forbidden(),
        otherwise: Joi.required()
    }).trim(),
    email: Joi.string().trim().email({ tlds: { allow: true } }),
    password: Joi.string().trim().required()
});
exports.registerSchema = Joi.object({
    username: Joi.string().trim().required(),
    email: Joi.string().trim().email({ tlds: { allow: true } }).required(),
    password: Joi.string().trim().required(),
    first_name: Joi.string().trim().required(),
    last_name: Joi.string().trim().required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    gender_other_info: Joi.string().when('gender', {
        is: 'other',
        then: Joi.forbidden(),
        otherwise: Joi.required()
    }).trim(),
    birth_date: Joi.date().required(),
    country_id: Joi.number().strict().required(),
    district_id: Joi.number().strict().required(),
    village: Joi.string().trim().required(),
    phone: Joi.string().trim().required()
});
exports.registerSchemaConfirm = Joi.object({
    code: Joi.string().trim().required(),
    phone: Joi.string().trim().required(),
    username: Joi.string().trim().required(),
    email: Joi.string().trim().email({ tlds: { allow: true } }).required(),
    password: Joi.string().trim().required(),
    first_name: Joi.string().trim().required(),
    last_name: Joi.string().trim().required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    gender_other_info: Joi.string().when('gender', {
        is: 'other',
        then: Joi.forbidden(),
        otherwise: Joi.required()
    }).trim(),
    birth_date: Joi.date().required(),
    country_id: Joi.number().strict().required(),
    district_id: Joi.number().strict().required(),
    village: Joi.string().trim().required(),
    info: Joi.string().trim()
});
exports.refreshTokenSchema = Joi.object({
    refresh_token: Joi.string().trim()
});
