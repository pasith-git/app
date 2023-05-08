import * as JoiCore from "joi";
import JoiDate from '@joi/date';

const Joi = JoiCore.extend(JoiDate) as typeof JoiCore;

const createTicketSchemaPattern = {
    booking_id: Joi.number().strict().required(),
}

const updateTicketSchemaPattern = {
    id: Joi.number().strict().required(),
    booking_id: Joi.number().strict(),
    is_printed: Joi.boolean(),
    is_checked_in: Joi.boolean(),
}


export const scanBookingTicketSchema = Joi.object({
    booking_code: Joi.string().trim().required(),
})

export const createTicketSchema = Joi.object({
    ...createTicketSchemaPattern,
})

export const updateTicketSchema = Joi.object({
    ...updateTicketSchemaPattern,
})

export const deleteTicketSchema = Joi.object({
    id: Joi.number().strict().required(),
})




export const createTicketSchemaForSuperadmin = Joi.object({
    ...createTicketSchemaPattern,
})


export const updateTicketSchemaForSuperadmin = Joi.object({
    ...updateTicketSchemaPattern,
})

export const deleteTicketSchemaForSuperadmin = Joi.object({
    id: Joi.number().strict().required(),
})
