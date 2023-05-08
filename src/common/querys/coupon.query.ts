export default interface GalleryQuery {
    sort?: {
        code: "asc" | "desc"
        expired_date: "asc" | "desc"
    }
    filter?: {
        code?: string
        expired_date?: {
            start_date: Date
            end_date: Date
        }
        discount_type?: string
        discount_amount?: string
        museum_id?: string
        coupon_status?: string
        created_at?: {
            start_date: Date
            end_date: Date
        }
        updated_at?: {
            start_date: Date
            end_date: Date
        }
    }
    limit?: string
    offset?: string
}