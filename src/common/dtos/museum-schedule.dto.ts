import { ScheduleStatus, ScheduleUserLimitStatus } from "@prisma/client"

export interface CreateMuseumScheduleDto {
    title: string
    start_date: Date
    description?: string
    current_users: number
    user_limit: number
    museum_id: number
    price: number
    domestic_price?: number
    status: ScheduleStatus
    discount?: number
    user_limit_status: ScheduleUserLimitStatus
    schedule_time_id: number
}

export interface UpdateMuseumScheduleDto extends Partial<CreateMuseumScheduleDto> {
    id: number
    delete_image?: boolean
}

export interface DeleteMuseumScheduleDto {
    id: number
}