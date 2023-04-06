export interface CreateRoleDto {
    name: string
}

export interface UpdateRoleDto extends Partial<CreateRoleDto> {
    id: number
}

export interface DeleteRoleDto {
    id: number
}