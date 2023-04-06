import { NotFoundException, InternalServerErrorException, Catch, ExceptionFilter, ArgumentsHost, HttpStatus, BadRequestException } from "@nestjs/common";
import { HttpException } from "@nestjs/common/exceptions";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import { CustomException } from "common/exceptions/custom.exception";
import responseUtil from "common/utils/response.util";
import { Request, Response } from 'express';


@Catch(CustomException)
export class CustomFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        /* const status = exception.getStatus(); */
        return response
            .status(exception.getStatus())
            .json(responseUtil({
                req: request,
                statusCode: exception.getStatus(),
                message: exception.getResponse()["message"],
                error: exception.getResponse()["error"],
                code: exception.getResponse()["code"],
            }));

    }
}



@Catch(PrismaClientKnownRequestError, PrismaClientValidationError)
export class PrismaFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        /* const status = exception.getStatus(); */

        let error;
        let message;
        if (exception instanceof PrismaClientKnownRequestError) {
            message = "PrismaClientKnownRequestError"
            if (exception.code === "P2002") {
                error = `Unique constraint failed on the ${exception.meta.target}`;
            } else {
                error = exception.message;
            }
        } else if (exception instanceof PrismaClientValidationError) {
            message = "PrismaClientValidationError";
            error = exception.message
        }

        return response
            .status(HttpStatus.BAD_REQUEST)
            .json(responseUtil({
                req: request,
                statusCode: HttpStatus.BAD_REQUEST,
                error,
            }));

    }
}


@Catch(InternalServerErrorException, BadRequestException, NotFoundException)
export class ManyExceptionsFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        return response
            .status(exception.getStatus())
            .json(responseUtil({
                req: request,
                statusCode: exception.getStatus(),
                message: exception.getResponse()["message"],
                error: exception.getResponse()["error"],
            }));

    }
}