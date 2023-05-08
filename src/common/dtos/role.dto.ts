export interface CreateRoleDto {
    name: string
    display: string
}

export interface UpdateRoleDto extends Partial<CreateRoleDto> {
    id: number
}

export interface DeleteRoleDto {
    id: number
}