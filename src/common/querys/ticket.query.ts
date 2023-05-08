export default interface TicketQuery {
    sort?: {
        name: "asc" | "desc"
    }
    filter?: {
        name?: string
        museum_id?: string
    }
    limit?: string
    offset?: string
}