"use strict";
exports.__esModule = true;
exports.deleteManyScheduleTimeSchemaBySp = exports.updateManyScheduleTimeschemaBySp = exports.createManyScheduleTimeschemaBySp = exports.deleteManyScheduleTimeSchema = exports.updateManyScheduleTimeschema = exports.createManyScheduleTimeschema = void 0;
var JoiCore = require("joi");
var date_1 = require("@joi/date");
var Joi = JoiCore.extend(date_1["default"]);
exports.createManyScheduleTimeschema = Joi.array().items({
    title: Joi.string().max(70).trim().required(),
    start_time: Joi.date().required(),
    end_time: Joi.date().required()
}).min(1);
exports.updateManyScheduleTimeschema = Joi.array().items({
    id: Joi.number().strict().required(),
    title: Joi.string().max(70).trim()
}).min(1);
exports.deleteManyScheduleTimeSchema = Joi.array().items({
    id: Joi.number().strict().required()
}).min(1);
exports.createManyScheduleTimeschemaBySp = Joi.array().items({
    title: Joi.string().max(70).trim().required(),
    start_time: Joi.date().required(),
    end_time: Joi.date().required(),
    museum_id: Joi.number().strict().required()
}).min(1);
exports.updateManyScheduleTimeschemaBySp = Joi.array().items({
    id: Joi.number().strict().required(),
    title: Joi.string().max(70).trim(),
    museum_id: Joi.number().strict()
}).min(1);
exports.deleteManyScheduleTimeSchemaBySp = Joi.array().items({
    id: Joi.number().strict().required()
}).min(1);
