import { VatPayType } from "@prisma/client"
import { CreateUserDto } from "./user.dto"

export interface CreateMuseumDto {
    name: string
    email?: string
    phone: string
    website?: string
    address: string
    open_time?: Date
    close_time?: Date
    close_day_of_week?: string[] | string
    latitude?: number
    longitude?: number
    vat_percentage: number
    vat_pay_type: VatPayType
    vat_auth_date?: Date
    vat_auth_code?: string
    is_deleted: boolean
    logo_image_path?: string
}

export interface CreateMuseumDto {
    name: string
    email?: string
    phone: string
    website?: string
    address: string
    open_time?: Date
    close_time?: Date
    close_day_of_week?: string[] | string
    latitude?: number
    longitude?: number
    vat_percentage: number
    vat_pay_type: VatPayType
    vat_auth_date?: Date
    vat_auth_code?: string
    is_deleted: boolean
    logo_image_path?: string
}

export interface CreateMuseumWithOwnerDto {
    museum: CreateMuseumDto,
    owner: CreateUserDto
}

export interface ConnectStripeToMuseumDto {
    museum_id: number
    card_number: string
    exp_month: number
    exp_year: number
    cvc: string
}

export interface UpdateMuseumDto extends Partial<CreateMuseumDto> {
    id: number
    delete_image?: boolean
}

export interface DeleteMuseumDto {
    id: number
}