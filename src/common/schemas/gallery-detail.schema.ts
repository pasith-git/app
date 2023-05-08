import * as JoiCore from "joi";
import JoiDate from '@joi/date';

const Joi = JoiCore.extend(JoiDate) as typeof JoiCore;

const createGalleryDetailSchemaPattern = {
    title: Joi.string().max(70).trim(),
    gallery_id: Joi.number().strict().required(),
}

const updateGalleryDetailSchemaPattern = {
    id: Joi.number().strict().required(),
    title: Joi.string().max(70).trim(),
    gallery_id: Joi.number().strict(),
}

export const createGalleryDetailSchema = Joi.object({
    ...createGalleryDetailSchemaPattern,
})

export const updateGalleryDetailSchema = Joi.object({
    ...updateGalleryDetailSchemaPattern,
    /* delete_image: Joi.boolean(), */
})

export const deleteGalleryDetailSchema = Joi.object({
    id: Joi.number().strict().required(),
})


export const createGalleryDetailSchemaForSuperadmin = Joi.object({
    ...createGalleryDetailSchemaPattern,
})

export const updateGalleryDetailSchemaForSuperadmin = Joi.object({
    ...updateGalleryDetailSchemaPattern,
    /* delete_image: Joi.boolean(), */
})

export const deleteGalleryDetailSchemaForSuperadmin = Joi.object({
    id: Joi.number().strict().required(),
})