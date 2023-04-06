
export interface CreateScheduleTimeDto {
    title: string
    start_time: Date
    end_time: Date
    museum_id: number
}

export interface UpdateScheduleTimeDto extends Partial<CreateScheduleTimeDto> {
    id: number
    delete_image?: boolean
}

export interface DeleteScheduleTimeDto {
    id: number
}