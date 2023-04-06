import * as JoiCore from "joi";
import JoiDate from '@joi/date';

const Joi = JoiCore.extend(JoiDate) as typeof JoiCore;

const createPaymentPackageSchemaPattern = {
    user_id: Joi.number().strict(),
    payment_type: Joi.string().valid("bank", "cash"),
    package_id: Joi.number().strict().required(),
    status: Joi.string().valid('pending', 'success', 'failure'),
    info: Joi.string(),
    description: Joi.string(),
}

const updatePaymentPackageSchemaPattern = {
    id: Joi.number().strict().required(),
    user_id: Joi.number().strict(),
    status: Joi.string().valid('pending', 'success', 'failure'),
    payment_type: Joi.string().valid("bank", "cash"),
    info: Joi.string(),
    description: Joi.string(),
}

export const generatePaymentPackageWithBankSchema = Joi.object({
    package_id: Joi.number().strict().required(),
})

export const CreatePaymentPackageWithBankSchema = Joi.object({
    package_id: Joi.number().strict().required(),
    transaction_id: Joi.string().required(),
    payment_bank_bill_number: Joi.string().required(),
    payment_bank_bill_name: Joi.string().required(),
    payment_bank_bill_phone: Joi.string().required(),
    reference_number: Joi.string().required(),
    description: Joi.string().required(),
})

export const createPaymentPackageSchemaForSuperadmin = Joi.object({
    ...createPaymentPackageSchemaPattern,
})

export const updatePaymentPackageSchemaForSuperadmin = Joi.object({
    ...updatePaymentPackageSchemaPattern,
    delete_image: Joi.boolean(),
})

export const deletePaymentPackageSchemaForSuperadmin = Joi.object({
    id: Joi.number().strict().required(),
})