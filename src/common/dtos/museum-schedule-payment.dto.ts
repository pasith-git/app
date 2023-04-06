import { PaymentType, Status } from "@prisma/client"

export interface PayMuseumSchedulePaymentDto {
    museum_schedules: {
        id: number
        user_limit: number
        total: number
    }[]
}

export interface CreateMuseumSchedulePaymentDto {
    user_id?: number
    museum_id: number
    employee_id: number
    status: Status
    total: number
    image_path?: string
    transaction_id: string
    bank_name?: string
    payment_type: PaymentType
    payment_date: Date
    payment_bank_bill_number?: string
    payment_bank_bill_name?: string
    payment_bank_bill_phone?: string
    reference_number?: string
    info?: string
    description?: string
    bank_percentage?: number
    bank_percent_amount?: number
    museum_schedules: {
        id: number
        user_limit: number
        total: number
    }[]
}


export interface GenerateQrMuseumSchedulePaymentDto {
    id: number
    user_limit: number
}

export interface UpdateMuseumSchedulePaymentDto extends Partial<CreateMuseumSchedulePaymentDto> {
    id: number
    delete_image?: boolean
}

export interface DeleteMuseumSchedulePaymentDto {
    id: number
}