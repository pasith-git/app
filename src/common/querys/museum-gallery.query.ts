export default interface MuseumGalleryQuery {
    sort?: {
        title: "asc" | "desc"
        category_name: "asc" | "desc"
        description: "asc" | "desc"
    }
    filter?: {
        title?: string
        category_name?: string
        description?: string
        museum_id?: string
    }
    limit?: string
    offset?: string
}