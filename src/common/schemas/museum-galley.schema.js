"use strict";
exports.__esModule = true;
exports.deleteManyMuseumGallerySchemaBySp = exports.updateManyMuseumGallerySchemaBySp = exports.createManyMuseumGallerySchemaBySp = exports.deleteManyMuseumGallerySchema = exports.updateManyMuseumGallerySchema = exports.createManyMuseumGallerySchema = void 0;
var JoiCore = require("joi");
var date_1 = require("@joi/date");
var Joi = JoiCore.extend(date_1["default"]);
exports.createManyMuseumGallerySchema = Joi.array().items({
    title: Joi.string().max(70).trim().required(),
    museum_gallery_category_id: Joi.number().strict().required(),
    description: Joi.string()
}).min(1);
exports.updateManyMuseumGallerySchema = Joi.array().items({
    id: Joi.number().strict().required(),
    title: Joi.string().max(70).trim(),
    museum_gallery_category_id: Joi.number().strict(),
    description: Joi.string().allow(null)
}).min(1);
exports.deleteManyMuseumGallerySchema = Joi.array().items({
    id: Joi.number().strict().required()
}).min(1);
exports.createManyMuseumGallerySchemaBySp = Joi.array().items({
    title: Joi.string().max(70).trim().required(),
    museum_gallery_category_id: Joi.number().strict().required(),
    description: Joi.string()
}).min(1);
exports.updateManyMuseumGallerySchemaBySp = Joi.array().items({
    id: Joi.number().strict().required(),
    title: Joi.string().max(70).trim(),
    museum_gallery_category_id: Joi.number().strict(),
    description: Joi.string().allow(null)
}).min(1);
exports.deleteManyMuseumGallerySchemaBySp = Joi.array().items({
    id: Joi.number().strict().required()
}).min(1);
