import { Gender } from "@prisma/client"

export interface CreateUserDto {
    username: string
    email: string
    password: string
    first_name: string
    last_name: string
    phone: string
    gender: Gender
    country_id: number
    /* village: string */
    is_deleted: boolean
    is_active: boolean
    role_ids: number[]
    profile_image_path?: string
    museum_id?: number
    last_login_at?: Date
}

export interface ResetPasswordDto {
    phone: string
    new_password?: string
    code?: string
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
    id: number
    delete_image?: boolean
    museum_id?: number
}

export interface DeleteUserDto {
    id: number
}