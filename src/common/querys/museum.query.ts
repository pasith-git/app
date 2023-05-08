export default interface MuseumQuery {
    sort?: {
        name: "asc" | "desc"
        email: "asc" | "desc"
        phone: "asc" | "desc"
        address: "asc" | "desc"
        created_at: "asc" | "desc"
        updated_at: "asc" | "desc"
    }
    filter?: {
        museum_id?: string
        name?: string
        email?: string
        phone?: string
        address?: string
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