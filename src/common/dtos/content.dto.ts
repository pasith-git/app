export interface CreateContentDto {
    title: string
    description: string
    museum_id: number
    author_id: number
    main_content_image_path?: string
}

export interface UpdateContentDto extends Partial<CreateContentDto> {
    id: number
    delete_image?: boolean
}

export interface DeleteContentDto {
    id: number
}

