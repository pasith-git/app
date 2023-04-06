export default interface ProvinceQuery {
    sort?: {
        name: "asc" | "desc"
    }
    filter?: {
        name?: string
    }
    limit?: string
    offset?: string
}