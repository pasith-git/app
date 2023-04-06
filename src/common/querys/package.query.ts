export default interface PackageQuery {
    sort?: {
        name?: "asc" | "desc"
        description?: "asc" | "desc"
        duration?: "asc" | "desc"
        user_limit?: "asc" | "desc"
        price?: "asc" | "desc"
        discount?: "asc" | "desc"
    }
    filter?: {
        name?: string
        description?: string
        duration?: string
        user_limit?: string
        price?: string
        discount?: string
    }
    limit?: string
    offset?: string
}