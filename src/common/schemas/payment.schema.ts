import * as JoiCore from "joi";
import JoiDate from '@joi/date';

const Joi = JoiCore.extend(JoiDate) as typeof JoiCore;

const createPaymentSchemaPattern = {
    booking_id: Joi.number().strict().required(),
    user_id: Joi.number().strict(),
    is_foreigner: Joi.boolean().required().when("user_id", {
        is: Joi.number().required(),
        then: Joi.forbidden(),
    }),
    total_pay: Joi.number().strict().precision(2).max(99999999.99).when("status", {
        is: Joi.string().valid("success"),
        then: Joi.number().required(),
    }),
    type: Joi.string().valid("bank", "cash").required(),
    way: Joi.string().valid("booking", "walkin").required(),
    status: Joi.string().valid("pending", "success", "failure").required(),
    people: Joi.array().items({
        amount: Joi.number().strict().required(),
        price_id: Joi.number().strict().required(),
    }).required(),
}

const updatePaymentSchemaPattern = {
    total_pay: Joi.number().strict().precision(2).max(99999999.99).allow(null),
    status: Joi.string().valid("pending", "success", "failure"),
}

export const createPaymentSchema = Joi.object({
    ...createPaymentSchemaPattern,
})

export const updatePaymentSchema = Joi.object({
    ...updatePaymentSchemaPattern,
})

export const deletePaymentSchema = Joi.object({
    id: Joi.number().strict().required(),
})


export const createPaymentSchemaForSuperadmin = Joi.object({
    ...createPaymentSchemaPattern,
})

export const updatePaymentSchemaForSuperadmin = Joi.object({
    ...updatePaymentSchemaPattern,
})

export const deletePaymentSchemaForSuperadmin = Joi.object({
    id: Joi.number().strict().required(),
})