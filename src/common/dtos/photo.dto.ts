export interface CreatePhotoDto {
    title?: string
    content_id: number
    path: string
}

export interface UpdatePhotoDto extends Partial<CreatePhotoDto> {
    id: number
}

export interface DeletePhotoDto {
    id: number
}

