import * as JoiCore from "joi";
import JoiDate from '@joi/date';

const Joi = JoiCore.extend(JoiDate) as typeof JoiCore;

const createProvinceSchemaPattern = {
    name: Joi.string().required().max(70).trim()
}

const updateProvinceSchemaPattern = {
    id: Joi.number().strict().required(),
    name: Joi.string().max(70).trim()
}

export const createProvinceSchemaForSuperadmin = Joi.object({
    ...createProvinceSchemaPattern
})


export const updateProvinceSchemaForSuperadmin = Joi.object({
    ...updateProvinceSchemaPattern,
})

export const deleteProvinceSchemaForSuperadmin = Joi.object({
    id: Joi.number().strict().required(),
})