"use strict";
exports.__esModule = true;
exports.deleteManyPaymentPackageSchema = exports.updateManyPaymentPackageSchema = exports.createManyPaymentPackageSchema = exports.CreatePaymentPackageWithBankSchema = exports.generatePaymentPackageWithBankSchema = void 0;
var JoiCore = require("joi");
var date_1 = require("@joi/date");
var Joi = JoiCore.extend(date_1["default"]);
exports.generatePaymentPackageWithBankSchema = Joi.object({
    package_id: Joi.number().strict().required()
});
exports.CreatePaymentPackageWithBankSchema = Joi.object({
    package_id: Joi.number().strict().required(),
    transaction_id: Joi.string().required(),
    payment_bank_bill_number: Joi.string().required(),
    payment_bank_bill_name: Joi.string().required(),
    payment_bank_bill_phone: Joi.string().required(),
    reference_number: Joi.string().required(),
    description: Joi.string().required()
});
exports.createManyPaymentPackageSchema = Joi.array().items({
    user_id: Joi.number().strict(),
    payment_type: Joi.string().valid("bank", "cash"),
    package_id: Joi.number().strict().required(),
    status: Joi.string().valid('pending', 'success', 'failure'),
    info: Joi.string(),
    description: Joi.string()
}).min(1);
exports.updateManyPaymentPackageSchema = Joi.array().items({
    id: Joi.number().strict().required(),
    user_id: Joi.number().strict(),
    status: Joi.string().valid('pending', 'success', 'failure'),
    delete_image: Joi.boolean(),
    payment_type: Joi.string().valid("bank", "cash"),
    info: Joi.string(),
    description: Joi.string()
}).min(1);
exports.deleteManyPaymentPackageSchema = Joi.array().items({
    id: Joi.number().strict().required()
}).min(1);
