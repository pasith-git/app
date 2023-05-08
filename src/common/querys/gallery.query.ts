export default interface GalleryQuery {
    sort?: {
        title: "asc" | "desc"
        description: "asc" | "desc"
    }
    filter?: {
        title?: string
        description?: string
        museum_id?: string
        author_id?: string
    }
    limit?: string
    offset?: string
}