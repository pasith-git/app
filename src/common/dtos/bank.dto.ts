export interface CreateBankDto {
    name: string
    museum_id: number
    qrcode_image_path: string
}

export interface UpdateBankDto extends Partial<CreateBankDto> {
    id: number
    delete_image?: boolean
}

export interface DeleteBankDto {
    id: number
}