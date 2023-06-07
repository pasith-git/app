import * as JoiCore from "joi";
import JoiDate from '@joi/date';

const Joi = JoiCore.extend(JoiDate) as typeof JoiCore;

const createPaymentSchemaPattern = {
    booking_id: Joi.number().strict().required(),
    transaction_id: Joi.string().trim().required(),
    invoice_id: Joi.string().trim().required(),
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