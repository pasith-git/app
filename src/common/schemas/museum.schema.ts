import * as JoiCore from "joi";
import JoiDate from '@joi/date';

const Joi = JoiCore.extend(JoiDate) as typeof JoiCore;

const createMuseumSchemaPattern = {
    name: Joi.string().required().max(70).trim(),
    email: Joi.string().email({ tlds: { allow: false } }),
    phone: Joi.string().max(25).trim(),
    country_id: Joi.number().strict().required(),
    district_id: Joi.number().strict(),
    website: Joi.string().uri({
        scheme: ['http', 'https'],
    }),
    info: Joi.string(),
    description: Joi.string(),
}

const updateMuseumSchemaPattern = {
    id: Joi.number().strict().required(),
    name: Joi.string().max(70).trim(),
    email: Joi.string().email({ tlds: { allow: false } }).allow(null),
    phone: Joi.string().max(25).trim().allow(null),
    website: Joi.string().uri({
        scheme: ['http', 'https'],
    }).allow(null),
    info: Joi.string().allow(null),
    description: Joi.string().allow(null),
    country_id: Joi.number().strict(),
    district_id: Joi.number().strict().allow(null),
}


export const createFirstTimeMuseumSchema = Joi.object({
    ...createMuseumSchemaPattern,
})

export const connectStripeToMuseumSchema = Joi.object({
    museum_id: Joi.number().strict().required(),
    card_number: Joi.string().max(40).trim().required(),
    exp_month: Joi.number().strict().required(),
    exp_year: Joi.number().strict().required(),
    cvc: Joi.string().max(5).required(),
})

export const createMuseumSchema = Joi.object({
    ...createMuseumSchemaPattern,
})

export const updateMuseumSchema = Joi.object({
    ...updateMuseumSchemaPattern,
    delete_image: Joi.boolean(),
})

export const deleteMuseumSchema = Joi.object({
    id: Joi.number().strict().required(),
})

export const createMuseumSchemaForSuperadmin = Joi.object({
    ...createMuseumSchemaPattern,
})

export const updateMuseumSchemaForSuperadmin = Joi.object({
    ...updateMuseumSchemaPattern,
    delete_image: Joi.boolean(),
})

export const deleteMuseumSchemaForSuperadmin = Joi.object({
    id: Joi.number().strict().required(),
})