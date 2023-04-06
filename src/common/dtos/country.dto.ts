export interface CreateCountryDto {
    name: string
    image_path?: string
    num_code?: string
    locale: string
}

export interface UpdateCountryDto extends Partial<CreateCountryDto> {
    id: number
    delete_image?: boolean
}

export interface DeleteCountryDto {
    id: number
}