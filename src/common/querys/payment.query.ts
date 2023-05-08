export default interface PaymentQuery {
    sort?: {
        paid_at: "asc" | "desc"
        booked_at: "asc" | "desc"
        created_at: "asc" | "desc"
        updated_at: "asc" | "desc"
        total: "asc" | "desc"
        total_with_discount: "asc" | "desc"
    }
    filter?: {
        museum_id?: string
        user_id?: string
        booking_id?: string
        way?: string
        type?: string
        is_foreigner?: boolean
        status?: string
        paid_at?: {
            start_date: Date
            end_date: Date
        }
        booked_at?: {
            start_date: Date
            end_date: Date
        }
        created_at?: {
            start_date: Date
            end_date: Date
        }
        updated_at?: {
            start_date: Date
            end_date: Date
        }
    }
    limit?: string
    offset?: string
}