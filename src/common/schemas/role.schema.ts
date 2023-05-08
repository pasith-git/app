import * as JoiCore from "joi";
import JoiDate from '@joi/date';

const Joi = JoiCore.extend(JoiDate) as typeof JoiCore;

const createRoleSchemaPattern = {
    name: Joi.string().required().max(40).trim(),
    display: Joi.string().max(50).required().trim()
}

const updateRoleSchemaPattern = {
    id: Joi.number().strict().required(),
    name: Joi.string().max(40).trim(),
    display: Joi.string().max(50).trim()
}

export const createRoleSchemaForSuperadmin = Joi.object({
    ...createRoleSchemaPattern,
})


export const updateRoleSchemaForSuperadmin = Joi.object({
    ...updateRoleSchemaPattern,
})

export const deleteRoleSchemaForSuperadmin = Joi.object({
    id: Joi.number().strict().required(),
})