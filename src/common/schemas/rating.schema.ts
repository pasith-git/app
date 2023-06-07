import * as JoiCore from "joi";
import JoiDate from '@joi/date';

const Joi = JoiCore.extend(JoiDate) as typeof JoiCore;

const createRatingSchemaPattern = {
    museum_id: Joi.number().strict().required(),
    rating: Joi.number().strict().min(1).max(5).required(),
    comment: Joi.string().trim(),
}

const updateRatingSchemaPattern = {
    id: Joi.number().strict().required(),
    museum_id: Joi.number().strict(),
    rating: Joi.number().strict().min(1).max(5),
    comment: Joi.string().trim(),
}

export const createRatingSchema = Joi.object({
    ...createRatingSchemaPattern
});

export const updateRatingSchema = Joi.object({
    ...updateRatingSchemaPattern,
})

export const createRatingSchemaForSuperadmin = Joi.object({
    ...createRatingSchemaPattern,
    user_id: Joi.number().strict().required(),
})


export const updateRatingSchemaForSuperadmin = Joi.object({
    ...updateRatingSchemaPattern,
    user_id: Joi.number().strict(),
})

export const deleteRatingSchemaForSuperadmin = Joi.object({
    id: Joi.number().strict().required(),
})