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
        last_login_at?: {
            start_date: string
            end_date: string
        }
        created_at?: {
            start_date: string
            end_date: string
        }
        updated_at?: {
            start_date: string
            end_date: string
        },
        is_staff?: boolean
        is_deleted?: boolean
        museum_id?: string
        role_name?: string
        role_names?: string
    }
    limit?: string
    offset?: string
}