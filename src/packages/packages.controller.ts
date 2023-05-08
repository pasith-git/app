import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from "express";
import responseUtil from 'common/utils/response.util';
import { PrismaService } from 'prisma/prisma.service';
import { PackagesService } from './packages.service';
import PackageQuery from 'common/querys/package.query';
import { Roles } from 'common/decorators/role.decorator';
import { AuthGuard } from 'common/guards/auth.guard';
import Role from 'common/enums/role.enum';
import { JoiValidationPipe } from 'common/pipes/joi-validation.pipe';
import { createPackageSchemaForSuperadmin, deletePackageSchemaForSuperadmin, updatePackageSchemaForSuperadmin } from 'common/schemas/package.schema';
import { CreatePackageDto, DeletePackageDto, UpdatePackageDto } from 'common/dtos/package.dto';
import MESSAGE from 'common/utils/message.util';


@Controller('packages')
export class PackagesController {
    constructor(private prisma: PrismaService, private packagesService: PackagesService) { }

    @Get(":id")
    async findById(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const data = await this.packagesService.findById(Number(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }

    @Get("")
    async findAll(@Req() req: Request, @Res() res: Response, @Query() { filter, ...query }: PackageQuery) {

        const data_fixed = await this.packagesService.findAll();
        const data_temp = await this.packagesService.findAll({
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
    @Get("superadmin/packages/:id")
    async findByIdForSuperadmin(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        const data = await this.packagesService.findByIdForSuperadmin(Number(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Get("superadmin/packages")
    async findAllForSuperadmin(@Req() req: Request, @Res() res: Response, @Query() { filter, ...query }: PackageQuery) {

        const data_fixed = await this.packagesService.findAllForSuperadmin();
        const data_temp = await this.packagesService.findAllForSuperadmin({
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
    @Post("superadmin/packages")
    async createForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(createPackageSchemaForSuperadmin)) createDto: CreatePackageDto) {
        try {
            const data = await this.packagesService.createForSuperadmin({
                ...createDto,
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Put("superadmin/packages")
    async updateForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new JoiValidationPipe(updatePackageSchemaForSuperadmin)) updateDto: UpdatePackageDto) {
        try {
            const data = await this.packagesService.updateForSuperadmin({
                ...updateDto,
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.GOD)
    @Delete("superadmin/packages/delete/:id")
    async deleteForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const data = await this.packagesService.deleteForSuperadmin({
                id: parseInt(id),
            });

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }
}
