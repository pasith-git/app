export interface CreatePackageDto {
    name: string
    description: string
    duration: number
    user_limit: number
    price: number
    discount?: number
}

export interface UpdatePackageDto extends Partial<CreatePackageDto> {
    id: number
}

export interface DeletePackageDto {
    id: number
}