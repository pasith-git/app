"use strict";
exports.__esModule = true;
exports.deleteManyBranchSchema = exports.updateManyBranchSchema = exports.createManyBranchSchema = void 0;
var JoiCore = require("joi");
var date_1 = require("@joi/date");
var Joi = JoiCore.extend(date_1["default"]);
exports.createManyBranchSchema = Joi.array().items({
    name: Joi.string().required(),
    email: Joi.string().email({ tlds: { allow: false } }),
    phone: Joi.string(),
    website: Joi.string().uri({
        scheme: ['http', 'https']
    }),
    longtitude: Joi.number().strict().precision(6).max(999.999999),
    latitude: Joi.number().strict().precision(6).max(99.999999),
    restaurant_id: Joi.number().strict().required(),
    country_id: Joi.number().strict().required(),
    district_id: Joi.number().strict(),
    village: Joi.string().required(),
    info: Joi.string(),
    description: Joi.string()
}).min(1);
exports.updateManyBranchSchema = Joi.array().items({
    id: Joi.number().strict().required(),
    name: Joi.string(),
    email: Joi.string().email({ tlds: { allow: false } }),
    phone: Joi.string(),
    website: Joi.string().uri({
        scheme: ['http', 'https']
    }),
    longtitude: Joi.number().strict().precision(6),
    latitude: Joi.number().strict().precision(6),
    restaurant_id: Joi.number().strict(),
    country_id: Joi.number().strict(),
    district_id: Joi.number().strict(),
    village: Joi.string(),
    info: Joi.string(),
    description: Joi.string()
}).min(1);
exports.deleteManyBranchSchema = Joi.array().items({
    id: Joi.number().strict().required()
}).min(1);
