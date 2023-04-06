import * as JoiCore from "joi";
import JoiDate from '@joi/date';

const Joi = JoiCore.extend(JoiDate) as typeof JoiCore;

const createMuseumScheduleschemaPattern = {
    title: Joi.string().max(70).trim().required(),
    start_date: Joi.date().required(),
    description: Joi.string().trim(),
    schedule_time_id: Joi.number().strict().required(),
    user_limit: Joi.number().strict().required(),
    price: Joi.number().strict().precision(2).max(99999999.99).required(),
    domestic_price: Joi.number().strict().precision(2).max(99999999.99),
    discount: Joi.number().strict().precision(2).max(99999999.99),
    status: Joi.string().valid("pending", "active", "ended").required(),
}

const updateMuseumScheduleschemaPattern = {
    title: Joi.string().max(70).trim().required(),
    start_date: Joi.date().required(),
    description: Joi.string().trim(),
    schedule_time_id: Joi.number().strict().required(),
    user_limit: Joi.number().strict().required(),
    price: Joi.number().strict().precision(2).max(99999999.99).required(),
    domestic_price: Joi.number().strict().precision(2).max(99999999.99),
    discount: Joi.number().strict().precision(2).max(99999999.99),
    status: Joi.string().valid("pending", "active", "ended").required(),
}

export const createMuseumScheduleschema = Joi.object({
    ...createMuseumScheduleschemaPattern
})


export const updateMuseumScheduleschema = Joi.object({
    ...updateMuseumScheduleschemaPattern
})

export const deleteMuseumScheduleSchema = Joi.object({
    id: Joi.number().strict().required(),
})