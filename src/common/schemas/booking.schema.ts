import * as JoiCore from "joi";
import JoiDate from '@joi/date';

const Joi = JoiCore.extend(JoiDate) as typeof JoiCore;

const createBookingSchemaPattern = {
    schedule_time_id: Joi.number().strict().required(),
    schedule_date: Joi.date().format("DD/MM/YYYY").required(),
    discount_type: Joi.string().valid("percent", "money"),
    is_foreigner: Joi.boolean().required().when("user_id", {
        is: Joi.number().required(),
        then: Joi.forbidden(),
    }),
    total_pay: Joi.number().strict().precision(2).max(99999999.99).when("status", {
        is: Joi.string().valid("success"),
        then: Joi.number().required(),
    }),
    discount_amount: Joi.number().strict().when("discount_type", {
        is: Joi.string().valid("percent").required(),
        then: Joi.number().max(100).required(),
    }).when("discount_type", {
        is: Joi.string().valid("money").required(),
        then: Joi.number().precision(2).max(99999999.99).required(),
    }).when("discount_type", {
        is: Joi.disallow("percent", "money"),
        then: Joi.forbidden(),
    }),
    type: Joi.string().valid("bank", "cash").required(),
    way: Joi.string().valid("booking", "walkin").required(),
    status: Joi.string().valid("pending", "success", "failure").required(),
    people: Joi.array().items({
        amount: Joi.number().strict().required(),
        age_group: Joi.string().valid("adult", "child").required(),
    }).required(),
}

const updateBookingSchemaPattern = {
    id: Joi.number().strict().required(),
    type: Joi.string().valid("bank", "cash"),
    way: Joi.string().valid("booking", "walkin"),
    status: Joi.string().valid("pending", "success", "failure"),
}

export const createBookingSchema = Joi.object({
    ...createBookingSchemaPattern,
})

export const updateBookingSchema = Joi.object({
    ...updateBookingSchemaPattern,
})

export const deleteBookingSchema = Joi.object({
    id: Joi.number().strict().required(),
})


export const createBookingSchemaForSuperadmin = Joi.object({
    ...createBookingSchemaPattern,
    museum_id: Joi.number().strict().required(),
    user_id: Joi.number().strict().required(),
})

export const updateBookingSchemaForSuperadmin = Joi.object({
    ...updateBookingSchemaPattern,
    museum_id: Joi.number().strict(),
    user_id: Joi.number().strict(),
})

export const deleteBookingSchemaForSuperadmin = Joi.object({
    id: Joi.number().strict().required(),
})