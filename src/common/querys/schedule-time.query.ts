export default interface ScheduleTimeQuery {
    sort?: {
        title?: "asc" | "desc"
        start_time?: "asc" | "desc"
        end_time?: "asc" | "desc"
        capacity_limit?: "asc" | "desc"
    }
    filter?: {
        title?: string
        start_time?: string
        end_time?: string
        museum_id?: string
        capacity_limit?: string
    }
    limit?: string
    offset?: string
}