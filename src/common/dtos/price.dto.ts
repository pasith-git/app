
export interface CreatePriceDto {
    title: string
    is_foreigner: boolean
    adult_price: number
    child_price: number
    museum_id: number
    
}

export interface UpdatePriceDto extends Partial<CreatePriceDto> {
    id: number
}

export interface DeletePriceDto {
    id: number
}

