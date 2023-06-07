export default interface ReportBookingQuery {
    sort?: {
    }
    status?: string
    filter?: {
        reserved_date?: string
        reserved_time?: string
        museum_id?: string
        way?: string
    }
    limit?: string
    offset?: string
}