import * as JoiCore from "joi";
import JoiDate from '@joi/date';

const Joi = JoiCore.extend(JoiDate) as typeof JoiCore;

const createBankSchemaPattern = {
    name: Joi.string().max(70).trim().required(),
}

const updateBankSchemaPattern = {
    id: Joi.number().strict().required(),
    name: Joi.string().max(70).trim().required(),
}

export const createBankSchema = Joi.object({
    ...createBankSchemaPattern,
})

export const updateBankSchema = Joi.object({
    ...updateBankSchemaPattern,
    /* delete_image: Joi.boolean(), */
})

export const deleteBankSchema = Joi.object({
    id: Joi.number().strict().required(),
})


export const createBankSchemaForSuperadmin = Joi.object({
    ...createBankSchemaPattern,
    museum_id: Joi.number().strict().required(),
})


export const updateBankSchemaForSuperadmin = Joi.object({
    ...updateBankSchemaPattern,
    museum_id: Joi.number().strict(),
    /* delete_image: Joi.boolean(), */
})

export const deleteBankSchemaForSuperadmin = Joi.object({
    id: Joi.number().strict().required(),
})