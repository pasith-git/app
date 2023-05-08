export interface CreateGalleryDetailDto {
    gallery_id: number
    title?: string
    gallery_image_path: string
}

export interface UpdateGalleryDetailDto extends Partial<CreateGalleryDetailDto> {
    id: number
    delete_image?: boolean
}

export interface DeleteGalleryDetailDto {
    id: number
}