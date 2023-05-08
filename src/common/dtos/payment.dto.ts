import { DiscountType, PaymentType, PaymentWay, Status } from "@prisma/client"

export interface CreatePaymentDto {
    booking_id: number
    user_id?: number
    transaction_id: string
    type: PaymentType
    total: number
    total_with_discount?: number
    total_pay: number
    total_charge: number
    people: {
        amount: number
        price_id: number
    }[]
    bank_reference_code?: string
    bank_bill_number?: string
    bank_bill_name?: string
    bank_bill_phone?: string
    bank_percentage?: number
    bank_percentage_amount?: number
    confirmed_image_path?: string
    is_foreigner: boolean
    way: PaymentWay
    discount_type?: DiscountType
    discount_amount?: number
    discount_total?: number
    booked_at: Date
    status: Status
}

export interface UpdatePaymentDto extends Partial<CreatePaymentDto> {
    id: number
}

export interface DeletePaymentDto {
    id: number
}
