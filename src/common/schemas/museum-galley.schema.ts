import * as JoiCore from "joi";
import JoiDate from '@joi/date';

const Joi = JoiCore.extend(JoiDate) as typeof JoiCore;

const createMuseumGallerySchemaPattern = {
    title: Joi.string().max(70).trim().required(),
    museum_gallery_category_id: Joi.number().strict().required(),
    description: Joi.string(),
}

const updateMuseumGallerySchemaPattern = {
    id: Joi.number().strict().required(),
    title: Joi.string().max(70).trim(),
    museum_gallery_category_id: Joi.number().strict(),
    description: Joi.string().allow(null),
}

export const createMuseumGallerySchema = Joi.object({
    ...createMuseumGallerySchemaPattern,
})


export const updateMuseumGallerySchema = Joi.object({
    ...updateMuseumGallerySchemaPattern,
})

export const deleteMuseumGallerySchema = Joi.object({
    id: Joi.number().strict().required(),
})




export const createMuseumGallerySchemaForSuperadmin = Joi.object({
    ...createMuseumGallerySchemaPattern,
})


export const updateMuseumGallerySchemaForSuperadmin = Joi.object({
    ...updateMuseumGallerySchemaPattern,
})

export const deleteMuseumGallerySchemaForSuperadmin = Joi.object({
    id: Joi.number().strict().required(),
})