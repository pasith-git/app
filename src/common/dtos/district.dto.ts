export interface CreateDistrictDto {
    name: string
    province_id: number
}

export interface UpdateDistrictDto extends Partial<CreateDistrictDto> {
    id: number
}

export interface DeleteDistrictDto {
    id: number
}