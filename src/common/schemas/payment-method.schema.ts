import * as JoiCore from "joi";
import JoiDate from '@joi/date';

const Joi = JoiCore.extend(JoiDate) as typeof JoiCore;

export const CreatePaymentPackageWithBankSchema = Joi.object({
    package_id: Joi.number().strict().required(),
    transaction_id: Joi.string().required(),
    payment_bank_bill_number: Joi.string().required(),
    payment_bank_bill_name: Joi.string().required(),
    payment_bank_bill_phone: Joi.string().required(),
    reference_number: Joi.string().required(),
    description: Joi.string().required(),
})

export const createPaymentMethodSchema = Joi.object({
    card_number: Joi.string().max(40).trim().required(),
    exp_month: Joi.number().strict().required(),
    exp_year: Joi.number().strict().required(),
    cvc: Joi.string().max(5).required(),
});
