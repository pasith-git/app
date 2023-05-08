import * as JoiCore from "joi";
import JoiDate from '@joi/date';

const Joi = JoiCore.extend(JoiDate) as typeof JoiCore;

const createCountrySchemaPattern = {
    name: Joi.string().required().max(70).trim(),
    num_code: Joi.string().max(20).trim(),
    locale: Joi.string().required().max(10).trim(),
}

const updateCountrySchemaPattern = {
    id: Joi.number().strict().required(),
    name: Joi.string().max(70).trim(),
    num_code: Joi.string().max(20).trim().allow(null),
    locale: Joi.string().max(10).trim(),
}

export const createCountrySchemaForSuperadmin = Joi.object({
    ...createCountrySchemaPattern,
})


export const updateCountrySchemaForSuperadmin = Joi.object({
    ...updateCountrySchemaPattern,
    delete_image: Joi.boolean(),
})

export const deleteCountrySchemaForSuperadmin = Joi.object({
    id: Joi.number().strict().required(),
})