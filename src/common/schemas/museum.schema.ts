import * as JoiCore from "joi";
import JoiDate from '@joi/date';
import { createUserSchemaPattern } from "./user.schema";

const Joi = JoiCore.extend(JoiDate) as typeof JoiCore;

const createMuseumSchemaPattern = {
    name: Joi.string().required().max(70).trim(),
    email: Joi.string().email({ tlds: { allow: false } }),
    phone: Joi.string().max(15).trim().pattern(/^[0-9]+$/).required(),
    open_time: Joi.date().format("HH:mm"),
    close_time: Joi.date().format("HH:mm"),
    close_day_of_week: Joi.array().unique().items(Joi.valid("sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday").required()).required(),
    latitude: Joi.number().precision(6).max(99.999999),
    longitude: Joi.number().precision(6).max(999.999999),
    website: Joi.string().uri({
        scheme: ['http', 'https'],
    }),
    address: Joi.string().trim().required(),
    vat_percentage: Joi.number().integer().strict().max(100).required(),
    vat_pay_type: Joi.valid("customer", "museum").required(),
    vat_auth_date: Joi.date().format("DD/MM/YYYY"),
    vat_auth_code: Joi.string().trim(),
}

const updateMuseumSchemaPattern = {
    id: Joi.number().strict().required(),
    name: Joi.string().max(70).trim().allow(null),
    email: Joi.string().email({ tlds: { allow: false } }).allow(null),
    phone: Joi.string().max(15).pattern(/^[0-9]+$/).trim(),
    open_time: Joi.date().format("HH:mm").allow(null),
    close_time: Joi.date().format("HH:mm").allow(null),
    close_day_of_week: Joi.array().unique().items(Joi.valid("sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday").required()).allow(null),
    website: Joi.string().uri({
        scheme: ['http', 'https'],
    }).allow(null),
    address: Joi.string().trim(),
    latitude: Joi.number().precision(6).max(99.999999).allow(null),
    longitude: Joi.number().precision(6).max(999.999999).allow(null),
    vat_percentage: Joi.number().integer().strict(),
    vat_pay_type: Joi.valid("customer", "museum"),
    vat_auth_date: Joi.date().format("DD/MM/YYYY").allow(null),
    vat_auth_code: Joi.string().trim().allow(null),
}

export const createFirstTimeMuseumSchema = Joi.object({
    ...createMuseumSchemaPattern,
})

export const createMuseumSchema = Joi.object({
    ...createMuseumSchemaPattern,
})

export const updateMuseumSchema = Joi.object({
    ...updateMuseumSchemaPattern,
    delete_image: Joi.boolean(),
})

export const deleteMuseumSchema = Joi.object({
    id: Joi.number().strict().required(),
})

export const createMuseumSchemaForSuperadmin = Joi.object({
    ...createMuseumSchemaPattern,
    is_deleted: Joi.boolean().required(),
})

export const updateMuseumSchemaForSuperadmin = Joi.object({
    ...updateMuseumSchemaPattern,
    is_deleted: Joi.boolean(),
    delete_image: Joi.boolean(),
})

export const deleteMuseumSchemaForSuperadmin = Joi.object({
    id: Joi.number().strict().required(),
})

export const createMuseumWithOwnerSchemaForSuperadmin = Joi.object({
    museum: Joi.object({
        ...createMuseumSchemaPattern,
    }).required(),
    owner: Joi.object({
        ...createUserSchemaPattern,
    }).required(),
})