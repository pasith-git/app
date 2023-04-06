export default interface RoleQuery {
    sort?: {
        name: "asc" | "desc"
    }
    filter?: {
        name?: string
    }
    limit?: string
    offset?: string
}