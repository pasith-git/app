import { CustomException } from "common/exceptions/custom.exception";
import dayjsUtil from "./dayjs.util";
import MESSAGE from "./message.util";
import { ErrorCode } from "./error-code.util";

export const checkTimeStartAndEnd = (start_time_input: Date, end_time_input: Date) => {
    const start_time_hour = dayjsUtil(start_time_input, "HH:mm").hour();
    const end_time_hour = dayjsUtil(end_time_input, "HH:mm").hour();
    const start_time_minute = dayjsUtil(start_time_input, "HH:mm").minute();
    const end_time_minute = dayjsUtil(end_time_input, "HH:mm").minute();
    const start_time = dayjsUtil().utc().set('year', 1970).set('month', 0).set('date', 1)
        .set('hour', start_time_hour).set('minute', start_time_minute).second(0).millisecond(0);
    const end_time = dayjsUtil().utc().set('year', 1970).set('month', 0).set('date', 1)
        .set('hour', end_time_hour).set('minute', end_time_minute).second(0).millisecond(0);

    if (!(start_time.isBefore(end_time))) {
        throw new CustomException({ error: MESSAGE.time.sc_error, code: ErrorCode.invalidTime });
    }
    return {
        start_time: start_time.toDate(),
        end_time: end_time.toDate(),
    }
}

export const checkTimeStartOrEnd = (start_time_p?: {input: Date, value: Date},
    end_time_p?: {input: Date, value: Date}) => {
        const start_time_hour = dayjsUtil(start_time_p.input, "HH:mm").hour();
        const start_time_minute = dayjsUtil(start_time_p.input, "HH:mm").minute();
        const end_time_hour = dayjsUtil(end_time_p.input, "HH:mm").hour();
        const end_time_minute = dayjsUtil(end_time_p.input, "HH:mm").minute();
        const start_time = dayjsUtil().utc().set('year', 1970).set('month', 0).set('date', 1)
            .set('hour', start_time_hour).set('minute', start_time_minute).second(0).millisecond(0);
        const end_time = dayjsUtil().utc().set('year', 1970).set('month', 0).set('date', 1)
            .set('hour', end_time_hour).set('minute', end_time_minute).second(0).millisecond(0);

        if (start_time_p.input && start_time_p.input) {
            if (!(start_time.isBefore(end_time))) {
                throw new CustomException({ error: MESSAGE.time.sc_error, code: ErrorCode.invalidTime });
            }
        } else if (start_time_p.input) {
            const sc_end_time = dayjsUtil(end_time_p.value);
            if (!(start_time.isBefore(sc_end_time))) {
                throw new CustomException({ error: MESSAGE.time.sc_error, code: ErrorCode.invalidTime });
            }
        } else if (end_time_p.input) {
            const sc_start_time = dayjsUtil(start_time_p.value);
            if (!(sc_start_time.isBefore(end_time))) {
                throw new CustomException({ error: MESSAGE.time.sc_error, code: ErrorCode.invalidTime });
            }
        }


        return {
            start_time: start_time_p.input !== undefined ? start_time.toDate() : start_time_p.input === null ? null : undefined,
            end_time: end_time_p.input !== undefined ? end_time.toDate() : end_time_p.input === null ? null : undefined,
        }
}