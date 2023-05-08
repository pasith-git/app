import { Injectable } from '@nestjs/common';
import { CreateCountryDto, DeleteCountryDto, UpdateCountryDto } from 'common/dtos/country.dto';
import CountryQuery from 'common/querys/country.query';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CountriesService {
    constructor(private prisma: PrismaService) { }

    async findAll(query?: CountryQuery) {
        return this.prisma.country.findMany({
            where: {
                name: {
                    contains: query?.filter?.name
                },
                num_code: {
                    contains: query?.filter?.num_code
                },
                locale: {
                    contains: query?.filter?.locale
                },
            },
            orderBy: {
                ...(query?.sort?.name && {
                    name: query.sort.name
                }),
                ...(query?.sort?.num_code && {
                    num_code: query.sort.num_code
                }),
                ...(query?.sort?.locale && {
                    locale: query.sort.locale
                }),
            },
            ...(query?.limit && {
                take: parseInt(query.limit),
            }),
            ...(query?.offset && {
                skip: parseInt(query.offset),
            }),
        });
    }

    async findById(id: number) {
        return this.prisma.country.findFirstOrThrow({
            where: {
                id
            }
        })
    }

    async create(createDto: CreateCountryDto) {
        return this.prisma.country.create({
            data: createDto,
        })
    }



    async update({ delete_image, id, ...updateDto }: UpdateCountryDto) {
        return this.prisma.country.update({
            where: {
                id,
            },
            data: updateDto,
        })
    }

    async delete({ id }: DeleteCountryDto) {
        return this.prisma.country.delete({
            where: {
                id,
            },
        });
    }

}
