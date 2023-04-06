import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Roles } from 'common/decorators/role.decorator';
import { CreateRoleDto, DeleteRoleDto, UpdateRoleDto } from 'common/dtos/role.dto';
import Role from 'common/enums/role.enum';
import { AuthGuard } from 'common/guards/auth.guard';
import { JoiValidationPipe } from 'common/pipes/joi-validation.pipe';
import RoleQuery from 'common/querys/role.query';
import { createRoleSchemaForSuperadmin, deleteRoleSchemaForSuperadmin, updateRoleSchemaForSuperadmin } from 'common/schemas/role.schema';
import MESSAGE from 'common/utils/message.util';
import responseUtil from 'common/utils/response.util';
import { Request, Response } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import { RolesService } from './roles.service';

const PREFIX = "roles";

@Controller('')
export class RolesController {
    constructor(private prisma: PrismaService, private rolesService: RolesService) { }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.GUIDE, Role.SUPERADMIN, Role.OWNER)
    @Get("roles/:id")
    async findById(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const data = await this.rolesService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.GUIDE, Role.SUPERADMIN, Role.OWNER)
    @Get("roles")
    async findAll(@Req() req: Request, @Res() res: Response, @Query() { filter, ...query }: RoleQuery) {
        /* const [_, access_token] = req.headers.authorization.split(' ');
        const jwtPayload = this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]); */
        const data_fixed = await this.rolesService.findAll();
        const data_temp = await this.rolesService.findAll({
            filter,
            ...query,
        });
        res.append('X-Total-Count-Fixed', data_fixed.length.toString());
        res.append('X-Total-Count-Temp', data_temp.length.toString());
        return res.json(responseUtil({
            req,
            body: data_temp,
        }))
    }

    /* superadmin */
    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN)
    @Get("superadmin/roles/:id")
    async findByIdForSuperadmin(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const data = await this.rolesService.findByIdForSuperadmin(Number(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }

    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN)
    @Get("superadmin/roles")
    async findAllForSuperadmin(@Req() req: Request, @Res() res: Response, @Query() { filter, ...query }: RoleQuery) {
        /* const [_, access_token] = req.headers.authorization.split(' ');
        const jwtPayload = this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]); */
        const data_fixed = await this.rolesService.findAllForSuperadmin();
        const data_temp = await this.rolesService.findAllForSuperadmin({
            filter,
            ...query,
        });
        res.append('X-Total-Count-Fixed', data_fixed.length.toString());
        res.append('X-Total-Count-Temp', data_temp.length.toString());
        return res.json(responseUtil({
            req,
            body: data_temp,
        }))
    }

    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN)
    @Post("superadmin/roles")
    async createForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(createRoleSchemaForSuperadmin)) createDto: CreateRoleDto) {
        try {
            const data = await this.rolesService.createForSuperadmin({
                ...createDto,
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN)
    @Put("superadmin/roles")
    async updateForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(updateRoleSchemaForSuperadmin)) updateDto: UpdateRoleDto) {
        try {
            const data = await this.rolesService.updateForSuperadmin({
                ...updateDto,
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data, }));

        } catch (e) {
            throw e;
        }
    }
    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN)
    @Delete("superadmin/roles/delete")
    async deleteManyForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const data = await this.rolesService.deleteForSuperadmin({
                id: parseInt(id),
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }

}
