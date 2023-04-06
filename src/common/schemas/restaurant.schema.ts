import * as JoiCore from "joi";
import JoiDate from '@joi/date';

const Joi = JoiCore.extend(JoiDate) as typeof JoiCore;

export const createFirstTimeRestaurantSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({ tlds: { allow: false } }),
    phone: Joi.string(),
    country_id: Joi.number().strict().required(),
    district_id: Joi.number().strict(),
    website: Joi.string().uri({
        scheme: ['http', 'https'],
    }),
    info: Joi.string(),
    description: Joi.string(),
})

export const createManyRestaurantSchema = Joi.array().items({
    name: Joi.string().required(),
    country_id: Joi.number().strict().required(),
    district_id: Joi.number().strict(),
    email: Joi.string().email({ tlds: { allow: false } }),
    phone: Joi.string(),
    website: Joi.string().uri({
        scheme: ['http', 'https'],
    }),
    info: Joi.string(),
    description: Joi.string(),
}).min(1)

export const updateManyRestaurantSchema = Joi.array().items({
    id: Joi.number().strict().required(),
    name: Joi.string(),
    email: Joi.string().email({ tlds: { allow: false } }),
    phone: Joi.string(),
    website: Joi.string().uri({
        scheme: ['http', 'https'],
    }),
    info: Joi.string(),
    description: Joi.string(),
    delete_image: Joi.boolean(),
}).min(1)

export const deleteManyRestaurantSchema = Joi.array().items({
    id: Joi.number().strict().required(),
}).min(1)