export default interface GalleryDetailQuery {
    sort?: {
        title: "asc" | "desc"
    }
    filter?: {
        title?: string
        museum_id?: string
        gallery_id?: string
    }
    limit?: string
    offset?: string
}