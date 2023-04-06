export default interface DistrictQuery {
    sort?: {
        name: "asc" | "desc"
    }
    filter?: {
        name?: string
        province_id?: string
    }
    limit?: string
    offset?: string
}