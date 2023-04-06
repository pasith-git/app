import * as JoiCore from "joi";
import JoiDate from '@joi/date';

const Joi = JoiCore.extend(JoiDate) as typeof JoiCore;


const createPackageSchemaPattern = {
    name: Joi.string().required(),
    description: Joi.string(),
    duration: Joi.number().strict().required(),
    user_limit: Joi.number().strict().required(),
    price: Joi.number().strict().precision(2).max(99999999.99).required(),
    discount: Joi.number().strict().precision(2).max(99999999.99),
}

const updatePackageSchemaPattern = {
    id: Joi.number().strict().required(),
    name: Joi.string(),
    description: Joi.string().allow(null),
    duration: Joi.number().strict(),
    user_limit: Joi.number().strict(),
    price: Joi.number().strict().precision(2).max(99999999.99),
    discount: Joi.number().strict().precision(2).max(99999999.99).allow(null),
}

export const createPackageSchemaForSuperadmin = Joi.object({
    ...createPackageSchemaPattern,
})

export const updatePackageSchemaForSuperadmin = Joi.object({
    ...updatePackageSchemaPattern,
})

export const deletePackageSchemaForSuperadmin = Joi.object({
    id: Joi.number().strict().required(),
})