import { Injectable, UseGuards } from '@nestjs/common';
import { CreateRoleDto, DeleteRoleDto, UpdateRoleDto } from 'common/dtos/role.dto';
import { AuthGuard } from 'common/guards/auth.guard';
import RoleQuery from 'common/querys/role.query';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class RolesService {
    constructor(private prisma: PrismaService) { }

    async findById(id: number, withOutSuperAdmin?: boolean) {
        return this.prisma.role.findFirst({
            where: {
                id,
                ...(withOutSuperAdmin && {
                    name: {
                        notIn: ["admin", "user", "god"]
                    }
                })
            }
        })
    }

    async findByName(name: string){
        return this.prisma.role.findFirst({
            where: {
                name
            }
        })
    }

    async findByIds(ids: number[], withOutSuperAdmin?: boolean) {
        return this.prisma.role.findMany({
            where: {
                id: {
                    in: ids
                },
                ...(withOutSuperAdmin && {
                    name: {
                        notIn: ["admin", "user", "god"]
                    }
                })
            }
        })
    }

    async findAll(query?: RoleQuery, withOutSuperAdmin?: boolean) {
        return this.prisma.role.findMany({
            where: {
                name: {
                    contains: query?.filter?.name,
                    ...(withOutSuperAdmin && {
                        notIn: ["admin", "god", "user"]
                    })
                },

            },
            orderBy: {
                ...(query?.sort?.name && {
                    name: query.sort.name
                }),
            },
            ...(query?.limit && {
                take: parseInt(query.limit),
            }),
            ...(query?.offset && {
                skip: parseInt(query.offset),
            }),
        })
    }


    async create(createDto: CreateRoleDto) {
        return this.prisma.role.create({
            data: {
                ...createDto,
            }
        })
    }

    async update({ id, ...updateDto }: UpdateRoleDto) {

        return this.prisma.role.update({
            where: {
                id,
            },
            data: {
                ...updateDto,
            }
        })
    }

    async delete({ id }: DeleteRoleDto) {
        return this.prisma.role.delete({
            where: {
                id,
            }
        })
    }
}
