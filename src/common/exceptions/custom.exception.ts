import { HttpException } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common/enums";

export class CustomException extends HttpException {
    constructor(errors: { message?: any, error: any, code?: string }, status = HttpStatus.BAD_REQUEST) {
        super(errors, status);
    }
}