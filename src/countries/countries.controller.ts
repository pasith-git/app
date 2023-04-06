import { Transform } from '@nestjs/class-transformer';
import { Get, Req, Res, Controller, HttpStatus, Post, Body, UseInterceptors, UploadedFiles, Put, UploadedFile, Query, Param, UseGuards, Delete } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'common/decorators/role.decorator';
import { CreateCountryDto, DeleteCountryDto, UpdateCountryDto } from 'common/dtos/country.dto';
import Role from 'common/enums/role.enum';
import { AuthGuard } from 'common/guards/auth.guard';
import { FilesValidationPipe, FileValidationPipe } from 'common/pipes/file-validation.pipe';
import { FormDataValidationPipe } from 'common/pipes/form-data-validation.pipe';
import { JoiValidationPipe } from 'common/pipes/joi-validation.pipe';
import CountryQuery from 'common/querys/country.query';
import { createCountrySchemaForSuperadmin, deleteCountrySchemaForSuperadmin, updateCountrySchemaForSuperadmin } from 'common/schemas/country.schema';
import { createfileGenerator, deleteFileGenerator, updatefileGenerator } from 'common/utils/image-processor.util';
import MESSAGE from 'common/utils/message.util';
import responseUtil from 'common/utils/response.util';
import { Request, Response, Express } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import { CountriesService } from './countries.service';

const PREFIX = 'countries';


@Controller('')
export class CountriesController {
    constructor(private prisma: PrismaService, private countriesService: CountriesService) { }

    @Get("countries/:id")
    async findById(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        const data = await this.countriesService.findById(parseInt(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }

    @Get("countries")
    async findAll(@Req() req: Request, @Res() res: Response, @Query() { filter, ...query }: CountryQuery) {
        /* const [_, access_token] = req.headers.authorization.split(' ');
        const jwtPayload = this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]); */
        const data_fixed = await this.countriesService.findAll();
        const data_temp = await this.countriesService.findAll({
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
    @Get("superadmin/countries/:id")
    async findByIdForSuperadmin(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        const data = await this.countriesService.findByIdForSuperadmin(parseInt(id));
        return res.json(responseUtil({
            req,
            body: data,
        }))
    }

    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN)
    @Get("superadmin/countries")
    async findAllForSuperadmin(@Req() req: Request, @Res() res: Response, @Query() { filter, ...query }: CountryQuery) {
        /* const [_, access_token] = req.headers.authorization.split(' ');
        const jwtPayload = this.authService.jwtDecode(access_token);
        const user = await this.usersService.findById(jwtPayload["id"]); */
        const data_fixed = await this.countriesService.findAllForSuperadmin();
        const data_temp = await this.countriesService.findAllForSuperadmin({
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
    @Post("superadmin/countries")
    @UseInterceptors(FilesInterceptor("file"))
    async createForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(createCountrySchemaForSuperadmin)) createDto: CreateCountryDto,
        @UploadedFile(new FileValidationPipe()) file: Express.Multer.File) {
        try {
            const createFile = createfileGenerator(file, PREFIX, createDto.name);
            const data = await this.countriesService.createForSuperadmin({
                ...createDto,
                image_path: createFile?.filePath,
            });
            await createFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.created, body: data, }));

        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN)
    @Put("superadmin/countries")
    @UseInterceptors(FileInterceptor('file'))
    async updateForSuperadmin(@Req() req: Request, @Res() res: Response,
        @Body(new FormDataValidationPipe(updateCountrySchemaForSuperadmin)) updateDto: UpdateCountryDto,
        @UploadedFile(new FileValidationPipe()) file: Express.Multer.File) {
        try {
            const dataById = await this.countriesService.findByIdForSuperadmin(updateDto.id);
            const updateFile = updatefileGenerator(file, PREFIX, dataById.name, updateDto.name || dataById.name, dataById.image_path, updateDto.delete_image);
            const data = await this.countriesService.updateForSuperadmin({
                ...updateDto,
                image_path: updateFile?.filePath,
            });
            await updateFile.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.updated, body: data }));

        } catch (e) {
            throw e;
        }

    }

    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN)
    @Delete("superadmin/countries/delete/:id")
    async deleteMany(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        try {
            const dataById = await this.countriesService.findByIdForSuperadmin(parseInt(id));
            const deleteFile = deleteFileGenerator(dataById.image_path);
            const data = await this.countriesService.deleteForSuperadmin({
                id: dataById.id,
            });
            await deleteFile?.generate();

            return res.status(HttpStatus.OK).json(responseUtil({ req, message: MESSAGE.deleted, body: data }));

        } catch (e) {
            throw e;
        }
    }


}
