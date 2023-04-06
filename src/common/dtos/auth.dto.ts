import { PrismaClient, Prisma, Gender } from "@prisma/client"


export interface LoginDto {
    username?: string
    email?: string
    password: string
}

export interface RegisterDto {
    phone: string
    username: string
    email: string
}

export interface RegisterConfirmDto {
    username: string
    email: string
    password: string
    first_name: string
    last_name: string
    phone: string
    code: string
    gender: Gender
    gender_other_info: string
    country_id: number
    district_id: number
    village: string
    info: string
    image_path?: string
}