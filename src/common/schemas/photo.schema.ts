import * as JoiCore from "joi";
import JoiDate from '@joi/date';

const Joi = JoiCore.extend(JoiDate) as typeof JoiCore;

const createPhotoSchemaPattern = {
    title: Joi.string().max(70).trim(),
    content_id: Joi.number().strict().required()
}

const updatePhotoSchemaPattern = {
    id: Joi.number().strict().required(),
    title: Joi.string().max(70).trim(),
    content_id: Joi.number().strict(),
}

export const createPhotoSchema = Joi.object({
    ...createPhotoSchemaPattern,
})

export const updatePhotoSchema = Joi.object({
    ...updatePhotoSchemaPattern,
})

export const deletePhotoSchema = Joi.object({
    id: Joi.number().strict().required(),
})


export const createPhotoSchemaForSuperadmin = Joi.object({
    ...createPhotoSchemaPattern,
})


export const updatePhotoSchemaForSuperadmin = Joi.object({
    ...updatePhotoSchemaPattern,
})

export const deletePhotoSchemaForSuperadmin = Joi.object({
    id: Joi.number().strict().required(),
})