import { Gender } from "@prisma/client"

export interface CreateUserDto {
    username: string
    email: string
    password: string
    first_name: string
    last_name: string
    phone: string
    gender: Gender
    gender_other_info: string
    country_id: number
    district_id: number
    village: string
    info: string
    is_active: boolean
    is_staff: boolean
    role_ids: number[]
    image_path?: string
    museum_id: number
    stripe_customer_id?: string
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
    id: number
    delete_image?: boolean
    museum_id?: number
    last_login?: Date
}

export interface DeleteUserDto {
    id: number
}