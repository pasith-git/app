import { v4 as uuidv4 } from "uuid";

export const generateBookingCode = () => {
    const code = uuidv4().substr(0, 8).toUpperCase();
    return `BKC-${code}`;
}