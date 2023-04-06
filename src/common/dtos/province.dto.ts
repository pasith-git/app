export interface CreateProvinceDto {
    name: string
}

export interface UpdateProvinceDto extends Partial<CreateProvinceDto> {
    id: number
}

export interface DeleteProvinceDto {
    id: number
}