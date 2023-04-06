export interface CreateMuseumGalleryDto {
    title: string
    museum_gallery_category_id: number
    image_path: string
    description?: string
}

export interface UpdateMuseumGalleryDto extends Partial<CreateMuseumGalleryDto> {
    id: number
    delete_image?: boolean
}

export interface DeleteMuseumGalleryDto {
    id: number
}