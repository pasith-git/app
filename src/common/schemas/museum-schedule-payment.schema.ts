import * as JoiCore from "joi";
import JoiDate from '@joi/date';

const Joi = JoiCore.extend(JoiDate) as typeof JoiCore;

export const payMuseumSchedulePaymentSchema = Joi.array().items({
    museum_schedules: Joi.array().items(Joi.object({
        id: Joi.number().strict().required(),
        user_limit: Joi.number().strict().required(),
    }).required()).min(1).required(),
})

export const createManyMuseumSchedulePaymentSchema = Joi.array().items({
    user_id: Joi.number().strict(),
    museum_schedules: Joi.array().items(Joi.object({
        id: Joi.number().strict().required(),
        user_limit: Joi.number().strict().required(),
    }).required()).min(1).required(),
    payment_type: Joi.string().valid("bank", "cash").required(),
    info: Joi.string(),
    description: Joi.string(),
    bank_name: Joi.string(),
}).min(1)

export const generateQrMuseumSchedulePaymentSchema = Joi.array().items({
    id: Joi.number().strict().required(),
    user_limit: Joi.number().strict().required(),
}).min(1)

export const updateManyMuseumSchedulePaymentSchema = Joi.array().items({
    id: Joi.number().strict().required(),
    /* user_id: Joi.number().strict().allow(null), */
    /* museum_schedules: Joi.array().items(Joi.object({
        id: Joi.number().strict().required(),
        user_limit: Joi.number().strict().required(),
    }).required()).min(1).allow(null),
    payment_type: Joi.string().valid("bank", "cash"), */
    info: Joi.string().allow(null),
    description: Joi.string().allow(null),
    delete_image: Joi.boolean(),
    /*  bank_name: Joi.string().allow(null), */
}).min(1)

export const deleteManyMuseumSchedulePaymentSchema = Joi.array().items({
    id: Joi.number().strict().required(),
}).min(1)