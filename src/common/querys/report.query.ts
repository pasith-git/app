export default interface ReportBookingQuery {
    sort?: {
    }
    filter?: {
        reserved_date?: string
        reserved_time?: string
        museum_id?: string
        way?: string
        day?: string
        month?: string
        year?: string
    }
    limit?: string
    offset?: string
}