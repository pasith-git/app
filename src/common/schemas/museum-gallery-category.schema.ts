import * as JoiCore from "joi";
import JoiDate from '@joi/date';

const Joi = JoiCore.extend(JoiDate) as typeof JoiCore;

const createMuseumGalleryCategorySchemaPattern = {
    name: Joi.string().max(70).trim().required(),
}

const updateMuseumGalleryCategorySchemaPattern = {
    id: Joi.number().strict().required(),
    name: Joi.string().max(70).trim(),
}

export const createMuseumGalleryCategorySchema = Joi.object({
    ...createMuseumGalleryCategorySchemaPattern,
})


export const updateMuseumGalleryCategorySchema = Joi.object({
    ...updateMuseumGalleryCategorySchemaPattern
})

export const deleteMuseumGalleryCategorySchema = Joi.object({
    id: Joi.number().strict().required(),
})

export const createMuseumGalleryCategorySchemaForSuperadmin = Joi.object({
    ...createMuseumGalleryCategorySchemaPattern,
    museum_id: Joi.number().strict().required()
})


export const updateMuseumGalleryCategorySchemaForSuperadmin = Joi.object({
    ...updateMuseumGalleryCategorySchemaPattern,
    museum_id: Joi.number().strict()
})

export const deleteManyMuseumGalleryCategorySchemaForSuperadmin = Joi.object({
    id: Joi.number().strict().required(),
})