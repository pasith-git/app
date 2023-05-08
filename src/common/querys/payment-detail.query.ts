export default interface PaymentDetailQuery {
    sort?: {
        name: "asc" | "desc"
    }
    filter?: {
        name?: string
    }
    limit?: string
    offset?: string
}