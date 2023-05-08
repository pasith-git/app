export default interface PhotoQuery {
    sort?: {
        title: "asc" | "desc"
    }
    filter?: {
        title?: string
        museum_id?: string
        content_id?: string
    }
    limit?: string
    offset?: string
}