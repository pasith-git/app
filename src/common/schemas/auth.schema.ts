import * as JoiCore from "joi";
import JoiDate from '@joi/date';
import { createUserSchemaPattern } from "./user.schema";

const Joi = JoiCore.extend(JoiDate) as typeof JoiCore;

export const loginSchema = Joi.object({
    username: Joi.string().when('email', {
        is: Joi.exist(),
        then: Joi.forbidden(),
        otherwise: Joi.required(),
    }).trim(),
    email: Joi.string().trim().email({ tlds: { allow: true } }),
    password: Joi.string().trim().required(),
})

export const registerSchema = Joi.object({
    ...createUserSchemaPattern,
})

export const registerSchemaConfirm = Joi.object({
    /* code: Joi.string().trim().required(), */
    ...createUserSchemaPattern,
})

export const refreshTokenSchema = Joi.object({
    refresh_token: Joi.string().trim()
})