import * as JoiCore from "joi";
import JoiDate from '@joi/date';

const Joi = JoiCore.extend(JoiDate) as typeof JoiCore;

export const createManyCouponSchema = Joi.array().items({
    code: Joi.string(),
    type: Joi.string().valid('percent', 'price'),
    amount: Joi.number().strict().precision(2).max(99999999.99),
    expiration_date: Joi.date().format("DD/MM/YYYY").required(),
    branch_id: Joi.number().strict().required(),
}).min(1)


export const updateManyCouponSchema = Joi.array().items({
    id: Joi.number().strict().required(),
    code: Joi.string(),
    type: Joi.string().valid('percent', 'price'),
    amount: Joi.number().strict().precision(2).max(99999999.99),
    expiration_date: Joi.date().format("DD/MM/YYYY"),
    branch_id: Joi.number().strict(),
    random_code: Joi.boolean(),
}).min(1)

export const deleteManyCouponSchema = Joi.array().items({
    id: Joi.number().strict().required(),
}).min(1)