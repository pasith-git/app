import * as JoiCore from "joi";
import JoiDate from '@joi/date';

const Joi = JoiCore.extend(JoiDate) as typeof JoiCore;

const createDistrictSchemaPattern = {
    name: Joi.string().required().max(70).trim(),
    province_id: Joi.number().strict().required()
}

const updateDistrictSchemaPattern = {
    id: Joi.number().strict().required(),
    name: Joi.string().max(70).trim(),
    province_id: Joi.number().strict()
}

export const createDistrictSchemaForSuperadmin = Joi.object({
    ...createDistrictSchemaPattern,
})


export const updateDistrictSchemaForSuperadmin = Joi.object({
    ...updateDistrictSchemaPattern,
})

export const deleteDistrictSchemaForSuperadmin = Joi.object({
    id: Joi.number().strict().required(),
})