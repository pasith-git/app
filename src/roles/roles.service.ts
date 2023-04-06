import { Injectable, UseGuards } from '@nestjs/common';
import { CreateRoleDto, DeleteRoleDto, UpdateRoleDto } from 'common/dtos/role.dto';
import { AuthGuard } from 'common/guards/auth.guard';
import RoleQuery from 'common/querys/role.query';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class RolesService {
    constructor(private prisma: PrismaService) { }

    async findByName(name: string) {
        return this.prisma.role.findFirst({
            where: {
                name: {
                    equals: name,
                    not: {
                        equals: "superadmin",
                    }
                }
            }
        })
    }

    async findById(id: number) {
        return this.prisma.role.findFirst({
            where: {
                id,
                name: {
                    not: {
                        equals: "superadmin",
                    }
                }
            }
        })
    }


    async findByIdsWithoutSuperAdmin(ids: number[]) {
        return this.prisma.role.findMany({
            where: {
                id: {
                    in: ids,
                },
                name: {
                    not: {
                        equals: "superadmin",
                    }
                }
            }
        })
    }

    async findAll(query?: RoleQuery) {
        return this.prisma.role.findMany({
            where: {
                name: {
                    contains: query?.filter?.name,
                    notIn: ["superadmin", "user"]
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
    
    /* superadmin */

    async findByIdForSuperadmin(id: number) {
        return this.prisma.role.findFirst({
            where: {
                id,
            }
        })
    }

    async findAllForSuperadmin(query?: RoleQuery) {
        return this.prisma.role.findMany({
            where: {
                name: {
                    contains: query?.filter?.name,
                    notIn: ["superadmin", "user"]
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

    async findByNameForSuperadmin(name: string) {
        return this.prisma.role.findFirst({
            where: {
                name: {
                    equals: name,
                }
            }
        })
    }

    async createForSuperadmin(createDto: CreateRoleDto) {
        return this.prisma.role.create({
            data: {
                ...createDto,
            }
        })
    }

    async updateForSuperadmin({ id, ...updateDto }: UpdateRoleDto) {

        return this.prisma.role.update({
            where: {
                id,
            },
            data: {
                ...updateDto,
            }
        })
    }

    async deleteForSuperadmin({ id }: DeleteRoleDto) {
        return this.prisma.role.delete({
            where: {
                id,
            }
        })
    }

}
