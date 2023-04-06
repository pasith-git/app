export default interface ScheduleTimeQuery {
    sort?: {
        title?: "asc" | "desc"
        start_time?: "asc" | "desc"
        end_time?: "asc" | "desc"
    }
    filter?: {
        title?: string
        start_time?: Date
        end_time?: Date
        museum_id?: string
    }
    limit?: string
    offset?: string
}