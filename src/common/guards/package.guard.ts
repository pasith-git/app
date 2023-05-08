import { CanActivate, ExecutionContext, HttpStatus, Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { Reflector } from "@nestjs/core";
import { AuthService } from "auth/auth.service";
import { CustomException } from "common/exceptions/custom.exception";
import { JsonWebTokenError } from 'jsonwebtoken';
import { UsersService } from "users/users.service";
import dayjsUtil from "common/utils/dayjs.util";

@Injectable()
export class PackageGuard implements CanActivate {
    constructor(private reflector: Reflector, private authService: AuthService, private usersService: UsersService) { }
    async canActivate(
        context: ExecutionContext,
    ) {
        const ctx = context.switchToHttp();
        const req = ctx.getRequest<Request>();
        const res = ctx.getResponse<Response>();
        try {
            if (req.headers.authorization) {
                const [_, access_token] = req.headers.authorization?.split(' ');
                const jwtPayload = this.authService.jwtVerify(access_token);
                const user = await this.usersService.findById(jwtPayload["id"]);
                const roles = (await this.usersService.findById(jwtPayload["id"])).roles.map(data => data.role.name);
                const matchesRoles = ["superadmin"].some((role) => roles.includes(role));
                /* const isPaid = user.payment_packages.some(payment_package => dayjsUtil().isSameOrBefore(payment_package.package_end_date) && payment_package.status === "success");
                if (!isPaid && !matchesRoles) {
                    throw new CustomException({ error: "Users are required to pay for packages before utilizing the system", code: "UP" }, HttpStatus.PAYMENT_REQUIRED);
                } */
                return true;
            }

            throw new CustomException({ error: "No token provided" }, HttpStatus.UNAUTHORIZED);
        } catch (e) {
            if (e instanceof JsonWebTokenError) {
                throw new CustomException({ error: "Token is invalid or expired" }, HttpStatus.UNAUTHORIZED);
            }
            throw e;
        }
    }

}
