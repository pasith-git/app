import { DiscountType, PaymentType, PaymentWay, Status } from "@prisma/client"

export interface CreatePaymentDto {
    booking_id: number
    transaction_id: string
    invoice_id: string
    total: number
    bank_reference_code?: string
    bank_bill_number?: string
    bank_bill_name?: string
    bank_bill_phone?: string
    bank_percentage?: number
    bank_percentage_amount?: number
    bank_bill_description?: string
}

export interface UpdatePaymentDto extends Partial<CreatePaymentDto> {
    id: number
}

export interface DeletePaymentDto {
    id: number
}
