import * as JoiCore from "joi";
import JoiDate from '@joi/date';

const Joi = JoiCore.extend(JoiDate) as typeof JoiCore;

const createContentSchemaPattern = {
    title: Joi.string().max(70).trim().required(),
    description: Joi.string().trim().required(),

}

const updateContentSchemaPattern = {
    id: Joi.number().strict().required(),
    title: Joi.string().max(70).trim(),
    description: Joi.string().trim(),
}

export const createContentSchema = Joi.object({
    ...createContentSchemaPattern,
})

export const updateContentSchema = Joi.object({
    ...updateContentSchemaPattern,
    delete_image: Joi.boolean(),
})

export const deleteContentSchema = Joi.object({
    id: Joi.number().strict().required(),
})


export const createContentSchemaForSuperadmin = Joi.object({
    ...createContentSchemaPattern,
    museum_id: Joi.number().strict().required(),
    author_id: Joi.number().strict().required(),
})


export const updateContentSchemaForSuperadmin = Joi.object({
    ...updateContentSchemaPattern,
    museum_id: Joi.number().strict(),
    author_id: Joi.number().strict(),
    delete_image: Joi.boolean(),
})

export const deleteContentSchemaForSuperadmin = Joi.object({
    id: Joi.number().strict().required(),
})