export interface CreateTicketDto {
    booking_id: number
    booking_code?: string
    is_printed?: boolean
    is_checked_in?: boolean
    checked_at?: Date
}

export interface UpdateTicketDto extends Partial<CreateTicketDto> {
    id: number
}

export interface DeleteTicketDto {
    id: number
}