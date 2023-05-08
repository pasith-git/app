import * as JoiCore from "joi";
import JoiDate from '@joi/date';

const Joi = JoiCore.extend(JoiDate) as typeof JoiCore;

const createCouponSchemaPattern = {
    code: Joi.string().max(40),
    discount_type: Joi.string().valid('money', 'percent').required(),
    discount_amount: Joi.number().strict().precision(2).max(99999999.99).required(),
    expired_date: Joi.date().format("DD/MM/YYYY").required(),

}

const updateCouponSchemaPattern = {
    id: Joi.number().strict().required(),
    code: Joi.string().max(40),
    discount_type: Joi.string().valid('money', 'percent'),
    discount_amount: Joi.number().strict().precision(2).max(99999999.99),
    expired_date: Joi.date().format("DD/MM/YYYY"),
    coupon_status: Joi.string().valid('pending', 'active', 'expired', 'redeemed'),
    generate_code: Joi.boolean(),
}

export const createCouponSchema = Joi.object({
    ...createCouponSchemaPattern,
})


export const updateCouponSchema = Joi.object({
    ...updateCouponSchemaPattern,
})

export const deleteCouponSchema = Joi.object({
    id: Joi.number().strict().required(),
})

export const createCouponSchemaForSuperadmin = Joi.object({
    ...createCouponSchemaPattern,
    museum_id: Joi.number().strict().required(),
})


export const updateCouponSchemaForSuperadmin = Joi.object({
    ...updateCouponSchemaPattern,
    museum_id: Joi.number().strict(),
})

export const deleteCouponSchemaForSuperadmin = Joi.object({
    id: Joi.number().strict().required(),
})