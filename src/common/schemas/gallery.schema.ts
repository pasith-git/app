import * as JoiCore from "joi";
import JoiDate from '@joi/date';

const Joi = JoiCore.extend(JoiDate) as typeof JoiCore;

const createGallerySchemaPattern = {
    title: Joi.string().max(70).trim().required(),
    description: Joi.string().trim(),
    
}

const updateGallerySchemaPattern = {
    id: Joi.number().strict().required(),
    title: Joi.string().max(70).trim(),
    description: Joi.string().trim().allow(null),
}

export const createGallerySchema = Joi.object({
    ...createGallerySchemaPattern,
})

export const updateGallerySchema = Joi.object({
    ...updateGallerySchemaPattern,
})

export const deleteGallerySchema = Joi.object({
    id: Joi.number().strict().required(),
})




export const createGallerySchemaForSuperadmin = Joi.object({
    ...createGallerySchemaPattern,
    museum_id: Joi.number().strict().required(),
    author_id: Joi.number().strict().required(),
})


export const updateGallerySchemaForSuperadmin = Joi.object({
    ...updateGallerySchemaPattern,
    museum_id: Joi.number().strict(),
    author_id: Joi.number().strict(),
})

export const deleteGallerySchemaForSuperadmin = Joi.object({
    id: Joi.number().strict().required(),
})