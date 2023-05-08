import * as JoiCore from "joi";
import JoiDate from '@joi/date';

const Joi = JoiCore.extend(JoiDate) as typeof JoiCore;

const createPriceSchemaPattern = {
    title: Joi.string().trim().max(70).required(),
    adult_price: Joi.number().strict().precision(2).max(99999999.99).required(),
    child_price: Joi.number().strict().precision(2).max(99999999.99).required(),
    is_foreigner: Joi.boolean().required(),
}

const updatePriceSchemaPattern = {
    id: Joi.number().strict().required(),
    title: Joi.string().trim().max(70),
    adult_price: Joi.number().strict().precision(2).max(99999999.99),
    child_price: Joi.number().strict().precision(2).max(99999999.99),
    is_foreigner: Joi.boolean(),
}


export const createPriceSchema = Joi.object({
    ...createPriceSchemaPattern,
})

export const updatePriceSchema = Joi.object({
    ...updatePriceSchemaPattern,
})

export const deletePriceSchema = Joi.object({
    id: Joi.number().strict().required(),
})

export const createPriceSchemaForSuperadmin = Joi.object({
    ...createPriceSchemaPattern,
    museum_id: Joi.number().strict().required()
})


export const updatePriceSchemaForSuperadmin = Joi.object({
    ...updatePriceSchemaPattern,
    museum_id: Joi.number().strict(),
})

export const deletePriceSchemaForSuperadmin = Joi.object({
    id: Joi.number().strict().required(),
})