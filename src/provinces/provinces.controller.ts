import { Body, Controller, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { CreateProvinceDto, DeleteProvinceDto, UpdateProvinceDto } from 'common/dtos/province.dto';
import { JoiValidationPipe } from 'common/pipes/joi-validation.pipe';
import ProvinceQuery from 'common/querys/province.query';
import { createProvinceSchemaForSuperadmin, deleteProvinceSchemaForSuperadmin, updateProvinceSchemaForSuperadmin } from 'common/schemas/province.schema';
import MESSAGE from 'common/utils/message.util';
import responseUtil from 'common/utils/response.util';
import { Request, Response } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import { ProvincesService } from './provinces.service';
import { AuthGuard } from 'common/guards/auth.guard';
import { Roles } from 'common/decorators/role.decorator';
import Role from 'common/enums/role.enum';

@Controller('')
export class ProvincesController {
    constructor(private prisma: PrismaService, private provincesService: ProvincesService) { }

    @Get("provinces/:id")
    async findById(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const data = await this.provincesService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }

    @Get("provinces")
    async findAll(@Req() req: Request, @Res() res: Response, @Query() { filter, ...query }: ProvinceQuery) {
        /* const [_, access_token] = req.headers.authorization.split(' ');
        const jwtPayload = this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]); */
        const data_fixed = await this.provincesService.findAll();
        const data_temp = await this.provincesService.findAll({
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
    @Roles(Role.ADMIN, Role.GOD)
    @Get("superadmin/provinces/:id")
    async findByIdForSuperadmin(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        const data = await this.provincesService.findByIdForSuperadmin(Number(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Get("superadmin/provinces")
    async findAllForSuperadmin(@Req() req: Request, @Res() res: Response, @Query() { filter, ...query }: ProvinceQuery) {
        /* const [_, access_token] = req.headers.authorization.split(' ');
        const jwtPayload = this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]); */
        const data_fixed = await this.provincesService.findAllForSuperadmin();
        const data_temp = await this.provincesService.findAllForSuperadmin({
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
    @Roles(Role.ADMIN, Role.GOD)
    @Post("superadmin/provinces")
    async createForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(createProvinceSchemaForSuperadmin)) createDto: CreateProvinceDto) {
        try {
            const data = await this.provincesService.createForSuperadmin({
                ...createDto,
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Put("superadmin/provinces")
    async updateForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(updateProvinceSchemaForSuperadmin)) updateDto: UpdateProvinceDto) {
        try {
            const data = await this.provincesService.updateForSuperadmin({
                ...updateDto,
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Post("superadmin/provinces/delete/:id")
    async deleteForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const data = await this.provincesService.deleteForSuperadmin({
                id: parseInt(id),
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }
}
