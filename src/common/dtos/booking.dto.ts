import { Status, DiscountType, PaymentWay, PaymentType } from "@prisma/client"

export interface CreateBookingDto {
    schedule_time_str: string
    schedule_date: string
    transaction_id: string
    invoice_id: string
    booking_amount_limit: number
    user_id?: number
    paid_by_id?: number
    confirmed_image_path?: string
    discount_type?: DiscountType
    discount_amount?: number
    status: Status
    museum_id: number
    user_amount?: number
    booked_at: Date
    way: PaymentWay
    description?: string
    type: PaymentType
    is_foreigner: boolean
    total_pay: number
    schedule_time_id: number
    people: {
        amount: number
        age_group: string
    }[]
}

export interface UpdateBookingDto extends Partial<CreateBookingDto> {
    id: number
}

export interface DeleteBookingDto {
    id: number
}

