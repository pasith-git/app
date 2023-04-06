export default interface MuseumQuery {
    sort?: {
        name: "asc" | "desc"
        email: "asc" | "desc"
        phone: "asc" | "desc"
        info: "asc" | "desc"
        description: "asc" | "desc"
        created_at: "asc" | "desc"
        updated_at: "asc" | "desc"
    }
    filter?: {
        museum_id?: string
        name?: string
        email?: string
        phone?: string
        info?: string
        description?: string
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