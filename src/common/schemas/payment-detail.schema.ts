import * as JoiCore from "joi";
import JoiDate from '@joi/date';

const Joi = JoiCore.extend(JoiDate) as typeof JoiCore;

const createPaymentDetailSchemaPattern = {
    payment_id: Joi.number().strict().required(),
}

const updatePaymentDetailSchemaPattern = {
    id: Joi.number().strict().required(),
    checked_at: Joi.date().format("DD/MM/YYYY HH:mm"),
    is_printed: Joi.boolean(),
    is_checked_in: Joi.boolean(),
}




export const createPaymentDetailSchema = Joi.object({
    ...createPaymentDetailSchemaPattern,
})

export const updatePaymentDetailSchema = Joi.object({
    ...updatePaymentDetailSchemaPattern,
})

export const deletePaymentDetailSchema = Joi.object({
    id: Joi.number().strict().required(),
})




export const createPaymentDetailSchemaForSuperadmin = Joi.object({
    ...createPaymentDetailSchemaPattern,
})


export const updatePaymentDetailSchemaForSuperadmin = Joi.object({
    ...updatePaymentDetailSchemaPattern,
})

export const deletePaymentDetailSchemaForSuperadmin = Joi.object({
    id: Joi.number().strict().required(),
})
