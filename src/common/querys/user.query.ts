export default interface UserQuery {
    sort?: {
        username: "asc" | "desc"
        first_name: "asc" | "desc"
        last_name: "asc" | "desc"
        email: "asc" | "desc"
        created_at: "asc" | "desc"
        updated_at: "asc" | "desc"
    }
    filter?: {
        username?: string
        first_name?: string
        last_name?: string
        email?: string
        created_at?: {
            start_date: Date
            end_date: Date
        }
        updated_at?: {
            start_date: Date
            end_date: Date
        },
        is_staff?: boolean
        museum_id?: string
        role_name?: string
    }
    limit?: string
    offset?: string
}