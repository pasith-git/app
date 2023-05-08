import { Request } from "express"
import dayjsUtil from "./dayjs.util"
import { sendMessageToMuseumBotGroupChat } from "common/instances/telegram.instance"

export default ({ req, statusCode = 200, ...data }: { req: Request, body?: any, error?: any, message?: any, statusCode?: number, code?: string }) => {
    const messageToMuseumBotChat = {
        ...(data.message && {
            message: data.message
        }),
        ...(data.error && {
            error: data.error
        }),
    }

    if (data.error) {
        sendMessageToMuseumBotGroupChat(`datetime: ${dayjsUtil().format("DD/MM/YYYY HH:mm:ss")}\n----------\npath: ${req.path}\n----------\nmethod: ${req.method}\n----------\nerrors: ${JSON.stringify(messageToMuseumBotChat)}`).then();
    }

    return {
        datetime: dayjsUtil().format("DD/MM/YYYY HH:mm:ss"),
        method: req.method,
        path: req.path,
        ...data,
        status_code: statusCode,
    }
}