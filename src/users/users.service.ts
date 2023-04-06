import { Injectable } from '@nestjs/common';
import { AuthService } from 'auth/auth.service';
import { RegisterConfirmDto, RegisterDto } from 'common/dtos/auth.dto';
import { CreateUserDto, DeleteUserDto, UpdateUserDto } from 'common/dtos/user.dto';
import UserQuery from 'common/querys/user.query';
import dayjsUtil from 'common/utils/dayjs.util';
import { PrismaService } from 'prisma/prisma.service';
import { RolesService } from 'roles/roles.service';


@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService, private authService: AuthService, private rolesService: RolesService) { }

    async findByEmail(email: string) {
        return this.prisma.user.findFirst({
            where: {
                email
            }
        })
    }

    async findByUsername(username: string) {
        return this.prisma.user.findFirst({
            where: {
                username
            }
        })
    }


    async findByPhone(phone: string) {
        return this.prisma.user.findFirst({
            where: {
                phone
            }
        })
    }

    async findAll(museum_id_query?: number, query?: UserQuery) {
        return this.prisma.user.findMany({
            where: {
                museum_id: {
                    equals: museum_id_query,
                },
                first_name: {
                    contains: query?.filter?.first_name,
                },
                last_name: {
                    contains: query?.filter?.last_name,
                },
                username: {
                    contains: query?.filter?.username,
                },
                email: {
                    contains: query?.filter?.email,
                },
                is_staff: {
                    equals: query?.filter?.is_staff !== undefined ? Boolean(query?.filter?.is_staff) : undefined,
                },
                created_at: {
                    gte: query?.filter?.created_at?.start_date,
                    lt: query?.filter?.created_at?.end_date,
                },
                updated_at: {
                    gte: query?.filter?.updated_at?.start_date,
                    lt: query?.filter?.updated_at?.end_date
                },
                roles: {
                    every: {
                        role: {
                            name: query?.filter?.role_name,
                        }
                    }
                }

            },
            orderBy: {
                ...(query?.sort?.first_name && {
                    first_name: query.sort.first_name
                }),
                ...(query?.sort?.last_name && {
                    last_name: query.sort.last_name
                }),
                ...(query?.sort?.username && {
                    username: query.sort.username
                }),
                ...(query?.sort?.email && {
                    username: query.sort.email
                }),
                ...(query?.sort?.created_at && {
                    created_at: query.sort.created_at
                }),
                ...(query?.sort?.updated_at && {
                    updated_at: query.sort.updated_at
                }),
            },
            ...(query?.limit && {
                take: parseInt(query.limit),
            }),
            ...(query?.offset && {
                skip: parseInt(query.offset),
            }),
            include: {
                roles: {
                    include: {
                        role: true,
                    }
                },
                country: true,
                district: {
                    include: {
                        province: true,
                    }
                },
            }
        });
    }

    async findByUsernameOrEmail({ username, email }: { username?: string, email?: string }) {
        return this.prisma.user.findFirst({
            where: {
                OR: [
                    {
                        username,
                    },
                    {
                        email
                    }
                ]
            },
            include: {
                roles: {
                    include: {
                        role: true,
                    }
                },
                payment_packages: true,

            },

        })
    }

    async register({ code, ...registerDto }: RegisterConfirmDto) {
        const roleUser = await this.rolesService.findByName("user");
        return this.prisma.user.create({
            data: {
                ...registerDto,
                phone: `+${registerDto.phone}`,
                password: await this.authService.generatePassword(registerDto.password),
                /* birth_date: dayjsUtil(registerDto.birth_date).toDate(), */
                is_active: true,
                is_staff: false,
                roles: {
                    create: {
                        role: {
                            connect: {
                                id: roleUser.id,
                            }
                        }
                    }
                }
            },
            include: {
                roles: true,
            }


        });
    }

    async findById(id: number) {
        return this.prisma.user.findFirstOrThrow({
            where: {
                id,
            },
            include: {
                roles: {
                    include: {
                        role: true,
                    }
                },
                payment_packages: {
                    include: {
                        package: true,
                    }
                },
                country: true,
                district: {
                    include: {
                        province: true,
                    }
                },
            },
        })
    }

    async create({ role_ids, ...createDto }: CreateUserDto) {
        return this.prisma.user.create({
            data: {
                ...createDto,
                roles: {
                    createMany: {
                        data: role_ids.map(role_id => {
                            return {
                                role_id,
                            }
                        })
                    }
                }
            },
            include: {
                roles: {
                    include: {
                        role: true,
                    }
                },
            }
        })
    }

    async update({ role_ids, id, delete_image, ...updateDto }: UpdateUserDto) {
        return this.prisma.user.update({
            where: {
                id,
            },
            data: {
                ...updateDto,
                ...(role_ids?.length > 0 && {
                    roles: {
                        deleteMany: {
                            user_id: id,
                        },
                        createMany: {
                            data: role_ids.map(role_id => {
                                return {
                                    role_id,
                                }
                            })
                        }
                    },
                })
            },
            include: {
                roles: {
                    include: {
                        role: true,
                    }
                },
                country: true,
                district: {
                    include: {
                        province: true,
                    }
                },
            }
        })
    }

    async delete({ id }: DeleteUserDto) {
        return this.prisma.user.delete({
            where: {
                id,
            },
            include: {
                roles: {
                    include: {
                        role: true,
                    }
                },
            }
        });
    }

    /* superadmin */


    async findAllForSuperadmin(museum_id_query?: number, query?: UserQuery) {
        return this.prisma.user.findMany({
            where: {
                museum_id: {
                    equals: museum_id_query,
                },
                first_name: {
                    contains: query?.filter?.first_name,
                },
                last_name: {
                    contains: query?.filter?.last_name,
                },
                username: {
                    contains: query?.filter?.username,
                },
                email: {
                    contains: query?.filter?.email,
                },
                is_staff: {
                    equals: query?.filter?.is_staff !== undefined ? Boolean(query?.filter?.is_staff) : undefined,
                },
                created_at: {
                    gte: query?.filter?.created_at?.start_date,
                    lt: query?.filter?.created_at?.end_date,
                },
                updated_at: {
                    gte: query?.filter?.updated_at?.start_date,
                    lt: query?.filter?.updated_at?.end_date
                },
                roles: {
                    every: {
                        role: {
                            name: query?.filter?.role_name,
                        }
                    }
                }

            },
            orderBy: {
                ...(query?.sort?.first_name && {
                    first_name: query.sort.first_name
                }),
                ...(query?.sort?.last_name && {
                    last_name: query.sort.last_name
                }),
                ...(query?.sort?.username && {
                    username: query.sort.username
                }),
                ...(query?.sort?.email && {
                    username: query.sort.email
                }),
                ...(query?.sort?.created_at && {
                    created_at: query.sort.created_at
                }),
                ...(query?.sort?.updated_at && {
                    updated_at: query.sort.updated_at
                }),
            },
            ...(query?.limit && {
                take: parseInt(query.limit),
            }),
            ...(query?.offset && {
                skip: parseInt(query.offset),
            }),
            include: {
                roles: {
                    include: {
                        role: true,
                    }
                },
                country: true,
                district: {
                    include: {
                        province: true,
                    }
                },
            }
        });
    }

    async findByIdForSuperadmin(id: number) {
        return this.prisma.user.findFirstOrThrow({
            where: {
                id,
            },
            include: {
                roles: {
                    include: {
                        role: true,
                    }
                },
                payment_packages: true,
            },
        })
    }

    async findByUsernameOrEmailForSuperadmin({ username, email }: { username?: string, email?: string }) {
        return this.prisma.user.findFirstOrThrow({
            where: {
                OR: [
                    {
                        username,
                    },
                    {
                        email
                    }
                ]
            },
            include: {
                roles: {
                    include: {
                        role: true,
                    }
                },
                payment_packages: true,
            },

        })
    }


    async createForSuperadmin({ role_ids, ...createDto }: CreateUserDto
    ) {
        return this.prisma.user.create({
            data: {
                ...createDto,
                phone: `+${createDto.phone}`,
                password: this.authService.generatePassword(createDto.password),
                /* birth_date: dayjsUtil(createDto.birth_date, "DD/MM/YYYY").utc(true).toDate(), */
                roles: {
                    createMany: {
                        data: role_ids.map(role_id => {
                            return {
                                role_id,
                            }
                        })
                    }
                }
            },
            include: {
                roles: {
                    include: {
                        role: true,
                    }
                },
            }
        })
    }

    async updateForSuperadmin({ role_ids, id, delete_image, ...updateDto }: UpdateUserDto) {
        return this.prisma.user.update({
            where: {
                id,
            },
            data: {
                ...updateDto,
                ...(updateDto.phone && { phone: `+${updateDto.phone}` }),
                ...(updateDto.password && { password: this.authService.generatePassword(updateDto.password) }),
                /* ...(updateDto.birth_date && { birth_date: dayjsUtil(updateDto.birth_date, "DD/MM/YYYY").utc(true).toDate() }), */
                ...(role_ids?.length > 0 && {
                    roles: {
                        deleteMany: {
                            user_id: id,
                        },
                        createMany: {
                            data: role_ids.map(role_id => {
                                return {
                                    role_id,
                                }
                            })
                        }
                    },
                })
            },
            include: {
                roles: {
                    include: {
                        role: true,
                    }
                },
            }
        })
    }

    async deleteForSuperadmin({ id }: DeleteUserDto) {
        return this.prisma.user.delete({
            where: {
                id,
            },
            include: {
                roles: {
                    include: {
                        role: true,
                    }
                },
            }
        });
    }
}


