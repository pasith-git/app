export interface CreateBranchDto {
    name: string
    email?: string
    phone?: string
    website?: string
    image_path?: string
    longtitude?: string
    latitude?: string
    museum_id: number
    country_id: number
    district_id?: number
    village: string
    info?: string
    description?: string
}

export interface UpdateBranchDto extends Partial<CreateBranchDto> {
    id: number
    delete_image?: boolean
}

export interface DeleteBranchDto {
    id: number
}