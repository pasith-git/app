export interface CreatePaymentMethodDto {
    card_number: string
    exp_month: number
    exp_year: number
    cvc: string
    user_id?: number
}

export interface UpdatePaymentMethodDto extends Partial<CreatePaymentMethodDto> {
    id: number
}

export interface DeletePaymentMethodDto {
    id: number
}