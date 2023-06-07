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
    },
    take?: {
        museum?: string
        author?: string
        gallery_detail?: string
    }
    limit?: string
    offset?: string
}
