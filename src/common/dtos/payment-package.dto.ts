import { PaymentType, Status } from "@prisma/client"

export interface CreatePaymentPackageDto {
    user_id: number
    museum_id: number
    package_id: number
    package_start_date?: Date
    package_end_date?: Date
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
    discount?: number
    bank_percentage?: number
    bank_percent_amount?: number
}

export interface UpdatePaymentPackageDto extends Partial<CreatePaymentPackageDto> {
    id: number
    delete_image?: boolean
}

export interface DeletePaymentPackageDto {
    id: number
}