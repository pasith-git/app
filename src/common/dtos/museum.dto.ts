export interface CreateMuseumDto {
    name: string
    email?: string
    phone?: string
    logo?: string
    website?: string
    info?: string
    description?: string
    country_id: number
    district_id?: number
    /* card_number?: string
    exp_month?: number
    exp_year?: number
    cvc?: string */
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