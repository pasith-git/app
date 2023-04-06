import * as crypto from "crypto";
import {v4 as uuid} from "uuid";
import dayjsUtil from "./dayjs.util";

function generateTransactionId(){
    return uuid();
}

export default generateTransactionId;