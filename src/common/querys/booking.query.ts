export default interface BookingQuery {
    sort?: {
        schedule_time_str: "asc" | "desc"
        schedule_date: "asc" | "desc"
        booking_amount_limit: "asc" | "desc"
        user_active: "asc" | "desc"
        discount_amount: "asc" | "desc"
        created_at: "asc" | "desc"
        updated_at: "asc" | "desc"

    }
    filter?: {
        user_id?: string
        schedule_time_str?: string
        schedule_date?: string
        booking_amount_limit?: string
        user_active?: string
        discount_type?: string
        discount_amount?: string
        status?: string
        museum_id?: string
        created_at?: {
            start_date: string
            end_date: string
        }
        updated_at?: {
            start_date: string
            end_date: string
        }
    }
    limit?: string
    offset?: string
}