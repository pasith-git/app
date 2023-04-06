"use strict";
exports.__esModule = true;
exports.deleteManyMuseumSchema = exports.updateManyMuseumSchema = exports.createManyMuseumSchema = exports.createFirstTimeMuseumSchema = void 0;
var JoiCore = require("joi");
var date_1 = require("@joi/date");
var Joi = JoiCore.extend(date_1["default"]);
exports.createFirstTimeMuseumSchema = Joi.object({
    name: Joi.string().required().max(70).trim(),
    email: Joi.string().email({ tlds: { allow: false } }),
    phone: Joi.string().max(25).trim(),
    country_id: Joi.number().strict().required(),
    district_id: Joi.number().strict(),
    website: Joi.string().uri({
        scheme: ['http', 'https']
    }),
    info: Joi.string(),
    description: Joi.string()
});
exports.createManyMuseumSchema = Joi.array().items({
    name: Joi.string().required().max(70).trim(),
    country_id: Joi.number().strict().required(),
    district_id: Joi.number().strict(),
    email: Joi.string().email({ tlds: { allow: false } }),
    phone: Joi.string().max(25).trim(),
    website: Joi.string().uri({
        scheme: ['http', 'https']
    }),
    info: Joi.string(),
    description: Joi.string()
}).min(1);
exports.updateManyMuseumSchema = Joi.array().items({
    id: Joi.number().strict().required(),
    name: Joi.string().max(70).trim(),
    email: Joi.string().email({ tlds: { allow: false } }).allow(null),
    phone: Joi.string().max(25).trim().allow(null),
    website: Joi.string().uri({
        scheme: ['http', 'https']
    }).allow(null),
    info: Joi.string().allow(null),
    description: Joi.string().allow(null),
    country_id: Joi.number().strict(),
    district_id: Joi.number().strict().allow(null),
    delete_image: Joi.boolean()
}).min(1);
exports.deleteManyMuseumSchema = Joi.array().items({
    id: Joi.number().strict().required()
}).min(1);
