export interface CreateRatingDto {
    user_id: number
    museum_id: number
    rating: number
    comment?: string
}

export interface UpdateRatingDto extends Partial<CreateRatingDto> {
    id: number
}

export interface DeleteRatingDto {
    id: number
}