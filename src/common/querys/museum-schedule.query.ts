export default interface MuseumScheduleQuery {
    sort?: {
        title?: "asc" | "desc"
        price?: "asc" | "desc"
        user_limit?: "asc" | "desc"
        discount?: "asc" | "desc"
        start_date?: "asc" | "desc"
        start_time?: "asc" | "desc"
        end_time?: "asc" | "desc"
        schedule_status?: "asc" | "desc"
        current_users?: "asc" | "desc"
    }
    filter?: {
        title?: string
        price?: string
        user_limit?: string
        discount?: string
        schedule_status?: string
        current_users?: string
        start_date?: {
            start_date: Date
            end_date: Date
        }
        start_time?: Date
        end_time?: Date
        user_limit_status?: string
        museum_id?: string
    }
    limit?: string
    offset?: string
}