export default interface BankQuery {
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