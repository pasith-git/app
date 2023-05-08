export interface CreatePaymentDetailDto {
    payment_id: number
    booking_code?: string
    is_printed?: boolean
    is_checked_in?: boolean
    checked_at?: Date
}

export interface UpdatePaymentDetailDto extends Partial<CreatePaymentDetailDto> {
    id: number
}

export interface DeletePaymentDetailDto {
    id: number
}