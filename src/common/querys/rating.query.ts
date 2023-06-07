export default interface RatingQuery {
    sort?: {
        rating: "asc" | "desc"
    }
    status?: string
    filter?: {
        rating?: number
        museum_id?: string
    }
    limit?: string
    offset?: string
}