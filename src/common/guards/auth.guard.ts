import { CanActivate, ExecutionContext, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "common/decorators/role.decorator";
import Role from "common/enums/role.enum";
import { AuthService } from "auth/auth.service";
import { CustomException } from "common/exceptions/custom.exception";
import { JsonWebTokenError } from 'jsonwebtoken';
import { UsersService } from "users/users.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private reflector: Reflector, private authService: AuthService, private usersService: UsersService) { }
    async canActivate(
        context: ExecutionContext,
    ) {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        const ctx = context.switchToHttp();
        const req = ctx.getRequest<Request>();
        const res = ctx.getResponse<Response>();
        try {
            if (req.headers.authorization) {
                const [_, access_token] = req.headers.authorization?.split(' ');
                const jwtPayload = this.authService.jwtVerify(access_token);
                if (!requiredRoles) {
                    return true;
                } else {
                    const roles = (await this.usersService.findById(jwtPayload["id"])).roles.map(data => data.role.name);
                    const matchesRoles = requiredRoles.some((role) => roles.includes(role));
                    if (matchesRoles) {
                        return true;
                    } else {
                        throw new CustomException({ error: `Permission error (require: [${requiredRoles}])` }, HttpStatus.FORBIDDEN);
                    }
                }
            }

            throw new CustomException({ error: "No token provided" }, HttpStatus.UNAUTHORIZED);
        } catch (e) {
            if(e instanceof CustomException) {
                throw e;
            }
            throw new CustomException({ error: "Unauthorized" }, HttpStatus.UNAUTHORIZED);
        }
    }

}
