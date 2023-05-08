import { CouponStatus, DiscountType } from "@prisma/client"

export interface CreateCouponDto {
    code: string
    museum_id: number
    discount_type: DiscountType
    discount_amount: number
    expired_date: Date
    coupon_status: CouponStatus
}

export interface UpdateCouponDto extends Partial<CreateCouponDto> {
    id: number
    generate_code: boolean
}

export interface DeleteCouponDto {
    id: number
}