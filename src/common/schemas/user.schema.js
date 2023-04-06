"use strict";
exports.__esModule = true;
exports.updateProfile = exports.deleteManyUserSchema = exports.updateManyUserSchema = exports.createManyUserSchema = void 0;
var JoiCore = require("joi");
var date_1 = require("@joi/date");
var Joi = JoiCore.extend(date_1["default"]);
exports.createManyUserSchema = Joi.array().items({
    username: Joi.string().required().max(40).trim(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required(),
    first_name: Joi.string().required().max(70).trim(),
    last_name: Joi.string().required().max(70).trim(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    gender_other_info: Joi.string().when('gender', {
        is: 'other',
        then: Joi.forbidden(),
        otherwise: Joi.required()
    }),
    birth_date: Joi.date().required(),
    phone: Joi.string().required().max(25).trim(),
    country_id: Joi.number().strict().required(),
    district_id: Joi.number().strict(),
    village: Joi.string().required(),
    info: Joi.string(),
    role_ids: Joi.array().items(Joi.number().strict().required()).min(1).required()
}).min(1);
exports.updateManyUserSchema = Joi.array().items({
    id: Joi.number().strict().required(),
    username: Joi.string().max(40).trim(),
    email: Joi.string().email({ tlds: { allow: true } }),
    password: Joi.string().trim(),
    first_name: Joi.string().max(70).trim(),
    last_name: Joi.string().max(70).trim(),
    gender: Joi.string().valid('male', 'female', 'other'),
    gender_other_info: Joi.string().when('gender', {
        is: 'other',
        then: Joi.forbidden()
    }).trim(),
    birth_date: Joi.date(),
    phone: Joi.string().max(25).trim(),
    country_id: Joi.number().strict(),
    district_id: Joi.number().strict().allow(null),
    village: Joi.string().trim(),
    info: Joi.string().allow(null),
    role_ids: Joi.array().items(Joi.number().strict().required()),
    delete_image: Joi.boolean()
}).min(1);
exports.deleteManyUserSchema = Joi.array().items({
    id: Joi.number().strict().required()
}).min(1);
exports.updateProfile = Joi.object({
    id: Joi.number().strict().required(),
    username: Joi.string().max(40).trim(),
    email: Joi.string().email({ tlds: { allow: true } }),
    password: Joi.string(),
    first_name: Joi.string().max(70).trim(),
    last_name: Joi.string().max(70).trim(),
    gender: Joi.string().valid('male', 'female', 'other'),
    gender_other_info: Joi.string().when('gender', {
        is: 'other',
        then: Joi.forbidden()
    }),
    birth_date: Joi.date(),
    phone: Joi.string().max(25).trim(),
    country_id: Joi.number().strict(),
    district_id: Joi.number().strict().allow(null),
    village: Joi.string(),
    info: Joi.string().allow(null),
    delete_image: Joi.boolean()
});
