export default interface MuseumSchedulePaymentQuery {
    sort: {
        bank_name?: "asc" | "desc"
        museum_id?: "asc" | "desc"
        total?: "asc" | "desc"
        payment_type?: "asc" | "desc"
        user_username?: "asc" | "desc"
        employee_username?: "asc" | "desc"
        info?: "asc" | "desc"
        description?: "asc" | "desc"
        payment_date?: "asc" | "desc"
    }
    filter: {
        bank_name?: string
        museum_id?: string
        total?: string
        payment_type?: string
        user_username?: string
        employee_username?: string
        info?: string
        description?: string
        payment_date?: {
            start_date: Date
            end_date: Date
        }
    }
    limit: string
    offset: string
}