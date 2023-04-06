export interface CreateMuseumGalleryCategoryDto {
    name: string
    museum_id: number
}

export interface UpdateMuseumGalleryCategoryDto extends Partial<CreateMuseumGalleryCategoryDto> {
    id: number
}

export interface DeleteMuseumGalleryCategoryDto {
    id: number
}