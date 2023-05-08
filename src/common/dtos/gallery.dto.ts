export interface CreateGalleryDto {
    title: string
    description?: string
    museum_id: number
    author_id: number
}

export interface UpdateGalleryDto extends Partial<CreateGalleryDto> {
    id: number
}

export interface DeleteGalleryDto {
    id: number
}

