export default interface CountryQuery {
    sort?: {
        name: "asc" | "desc"
        num_code: "asc" | "desc"
        locale: "asc" | "desc"
    }
    filter?: {
        name?: string
        num_code?: string
        locale?: string
    }
    limit?: string
    offset?: string
}