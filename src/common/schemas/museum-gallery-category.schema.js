"use strict";
exports.__esModule = true;
exports.deleteManyMuseumGalleryCategorySchemaBySp = exports.updateManyMuseumGalleryCategorySchemaBySp = exports.createManyMuseumGalleryCategorySchemaBySp = exports.deleteManyMuseumGalleryCategorySchema = exports.updateManyMuseumGalleryCategorySchema = exports.createManyMuseumGalleryCategorySchema = void 0;
var JoiCore = require("joi");
var date_1 = require("@joi/date");
var Joi = JoiCore.extend(date_1["default"]);
exports.createManyMuseumGalleryCategorySchema = Joi.array().items({
    name: Joi.string().max(70).trim().required()
}).min(1);
exports.updateManyMuseumGalleryCategorySchema = Joi.array().items({
    id: Joi.number().strict().required(),
    name: Joi.string().max(70).trim()
}).min(1);
exports.deleteManyMuseumGalleryCategorySchema = Joi.array().items({
    id: Joi.number().strict().required()
}).min(1);
exports.createManyMuseumGalleryCategorySchemaBySp = Joi.array().items({
    name: Joi.string().max(70).trim().required(),
    museum_id: Joi.number().strict().required()
}).min(1);
exports.updateManyMuseumGalleryCategorySchemaBySp = Joi.array().items({
    id: Joi.number().strict().required(),
    name: Joi.string().max(70).trim(),
    museum_id: Joi.number().strict()
}).min(1);
exports.deleteManyMuseumGalleryCategorySchemaBySp = Joi.array().items({
    id: Joi.number().strict().required()
}).min(1);
