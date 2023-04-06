import { Request } from "express"
import dayjsUtil from "./dayjs.util"

export default ({ req, statusCode = 200, ...data }: { req: Request, body?: any, error?: any, message?: any, statusCode?: number, code?: string }) => {
    return {
        datetime: dayjsUtil().format("DD/MM/YYYY HH:mm:ss"),
        method: req.method,
        path: req.path,
        ...data,
        status_code: statusCode,
    }
}