export default interface PriceQuery {
    sort?: {
        adult_price: "asc" | "desc"
        child_price: "asc" | "desc"
        title: "asc" | "desc"
    }
    filter?: {
        title?: string
        museum_id?: string
        amount?: string
        is_foreigner?: string
        adult_price?: string
        child_price?: string
    }
    limit?: string
    offset?: string
}