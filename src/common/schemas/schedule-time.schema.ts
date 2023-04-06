import * as JoiCore from "joi";
import JoiDate from '@joi/date';

const Joi = JoiCore.extend(JoiDate) as typeof JoiCore;

const createScheduletimeSchemaPattern = {
    title: Joi.string().max(70).trim().required(),
    start_time: Joi.date().format("HH:mm").required(),
    end_time: Joi.date().format("HH:mm").required(),
}

const updateScheduletimeSchemaPattern = {
    id: Joi.number().strict().required(),
    title: Joi.string().max(70).trim(),
    start_time: Joi.date().format("HH:mm"),
    end_time: Joi.date().format("HH:mm"),
}

export const createScheduleTimeschema = Joi.object({
    ...createScheduletimeSchemaPattern,
})


export const updateScheduleTimeschema = Joi.object({
    ...updateScheduletimeSchemaPattern,
})

export const deleteScheduleTimeSchema = Joi.object({
    id: Joi.number().strict().required(),
})

export const createScheduleTimeschemaForSuperadmin = Joi.object({
    ...createScheduletimeSchemaPattern,
    museum_id: Joi.number().strict().required(),
})


export const updateScheduleTimeschemaForSuperadmin = Joi.object({
    ...updateScheduletimeSchemaPattern,
    museum_id: Joi.number().strict(),
})

export const deleteScheduleTimeSchemaForSuperadmin = Joi.object({
    id: Joi.number().strict().required(),
})
