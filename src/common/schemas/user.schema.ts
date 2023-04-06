import * as JoiCore from "joi";
import JoiDate from '@joi/date';

const Joi = JoiCore.extend(JoiDate) as typeof JoiCore;


export const createUserSchemaPattern = {
    username: Joi.string().required().max(40).trim(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required(),
    first_name: Joi.string().required().max(70).trim(),
    last_name: Joi.string().required().max(70).trim(),
    gender: Joi.string().valid('male', 'female', 'lgbtq').required(),
    /* gender_other_info: Joi.string().when('gender', {
        is: Joi.valid("male", "female"),
        then: Joi.forbidden(),
    }), */
    phone: Joi.string().required().max(25).trim(),
    country_id: Joi.number().strict().required(),
    /* district_id: Joi.number().strict(), */
    village: Joi.string().required(),
    /* info: Joi.string(), */
}

export const updateUserSchemaPattern = {
    username: Joi.string().max(40).trim(),
    email: Joi.string().email({ tlds: { allow: true } }),
    password: Joi.string().trim(),
    first_name: Joi.string().max(70).trim(),
    last_name: Joi.string().max(70).trim(),
    gender: Joi.string().valid('male', 'female', 'lgbtq'),
    /* gender_other_info: Joi.string().when('gender', {
        is: Joi.valid("male", "female"),
        then: Joi.forbidden(),
    }).trim(), */
    phone: Joi.string().max(25).trim(),
    country_id: Joi.number().strict(),
    /* district_id: Joi.number().strict().allow(null), */
    village: Joi.string().trim(),
    /* info: Joi.string().allow(null), */
}

export const createUserSchema = Joi.object({
    ...createUserSchemaPattern,
    role_ids: Joi.array().items(Joi.number().strict().required()).min(1).required(),
})

export const updateUserSchema = Joi.object({
    id: Joi.number().strict().required(),
    ...updateUserSchemaPattern,
    delete_image: Joi.boolean(),
})

export const deleteUserSchema = Joi.array().items({
    id: Joi.number().strict().required(),
})

export const updateProfile = Joi.object({
    id: Joi.number().strict().required(),
    ...updateUserSchemaPattern,
    delete_image: Joi.boolean(),
})

export const createUserSchemaForSuperadmin = Joi.object({
    ...createUserSchemaPattern,
    role_ids: Joi.array().items(Joi.number().strict().required()).min(1).required(),
})

export const updateUserSchemaForSuperadmin = Joi.object({
    id: Joi.number().strict().required(),
    ...updateUserSchemaPattern,
    role_ids: Joi.array().items(Joi.number().strict().required()),
    delete_image: Joi.boolean(),
})

export const deleteUserSchemaForSuperadmin = Joi.object({
    id: Joi.number().strict().required(),
})