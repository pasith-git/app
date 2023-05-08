import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { CreateDistrictDto, DeleteDistrictDto, UpdateDistrictDto } from 'common/dtos/district.dto';
import { JoiValidationPipe } from 'common/pipes/joi-validation.pipe';
import DistrictQuery from 'common/querys/district.query';
import { createDistrictSchemaForSuperadmin, deleteDistrictSchemaForSuperadmin, updateDistrictSchemaForSuperadmin } from 'common/schemas/district.schema';
import MESSAGE from 'common/utils/message.util';
import responseUtil from 'common/utils/response.util';
import { Request, Response } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import { DistrictsService } from './districts.service';
import { AuthGuard } from 'common/guards/auth.guard';
import Role from 'common/enums/role.enum';
import { Roles } from 'common/decorators/role.decorator';
import { parseInt } from 'lodash';

@Controller('')
export class DistrictsController {
    constructor(private prisma: PrismaService, private districtsService: DistrictsService) { }



    @Get("districts/:id")
    async findById(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const data = await this.districtsService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }

    @Get("districts")
    async findAll(@Req() req: Request, @Res() res: Response, @Query() { filter, ...query }: DistrictQuery) {
        /* const [_, access_token] = req.headers.authorization.split(' ');
        const jwtPayload = this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]); */
        const data_fixed = await this.districtsService.findAll();
        const data_temp = await this.districtsService.findAll({
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
    @Get("superadmin/districts/:id")
    async findByIdForSuperadmin(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const data = await this.districtsService.findByIdForSuperadmin(Number(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }


    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Get("superadmin/districts")
    async findAllForSuperadmin(@Req() req: Request, @Res() res: Response, @Query() { filter, ...query }: DistrictQuery) {
        /* const [_, access_token] = req.headers.authorization.split(' ');
        const jwtPayload = this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]); */
        const data_fixed = await this.districtsService.findAllForSuperadmin();
        const data_temp = await this.districtsService.findAllForSuperadmin({
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
    @Post("superadmin/districts")
    async createForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(createDistrictSchemaForSuperadmin)) createDto: CreateDistrictDto) {
        try {
            const data = await this.districtsService.createForSuperadmin({
                ...createDto,
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Put("superadmin/districts")
    async updateForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(updateDistrictSchemaForSuperadmin)) updateDto: UpdateDistrictDto) {
        try {
            const data = await this.districtsService.updateForSuperadmin({
                ...updateDto,
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Delete("superadmin/districts/delete/:id")
    async deleteForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const data = await this.districtsService.deleteForSuperadmin({
                id: parseInt(id),
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }
}
