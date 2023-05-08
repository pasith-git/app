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
            },
            include: {
                contents: true,
                country: true,
                roles: {
                    include: {
                        role: true,
                    }
                },
                museum: true,
            }
        })
    }

    async findByUsername(username: string) {
        return this.prisma.user.findFirst({
            where: {
                username
            },
            include: {
                contents: true,
                country: true,
                roles: {
                    include: {
                        role: true,
                    }
                },
                museum: true,
            }
        })
    }


    async findByPhone(phone: string) {
        return this.prisma.user.findFirst({
            where: {
                phone: `+${phone}`
            },
            include: {
                contents: true,
                country: true,
                roles: true,
                museum: true,
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
                last_login_at: {
                    gte: query?.filter?.last_login_at?.start_date && dayjsUtil(query?.filter?.last_login_at?.start_date, "DD/MM/YYYY HH:mm").toDate(),
                    lt: query?.filter?.last_login_at?.end_date && dayjsUtil(query?.filter?.last_login_at?.end_date, "DD/MM/YYYY HH:mm").toDate(),
                },
                created_at: {
                    gte: query?.filter?.created_at?.start_date && dayjsUtil(query?.filter?.created_at?.start_date, "DD/MM/YYYY HH:mm").toDate(),
                    lt: query?.filter?.created_at?.end_date && dayjsUtil(query?.filter?.created_at?.end_date, "DD/MM/YYYY HH:mm").toDate(),
                },
                updated_at: {
                    gte: query?.filter?.updated_at?.start_date && dayjsUtil(query?.filter?.updated_at?.start_date, "DD/MM/YYYY HH:mm").toDate(),
                    lt: query?.filter?.updated_at?.end_date && dayjsUtil(query?.filter?.updated_at?.end_date, "DD/MM/YYYY HH:mm").toDate(),
                },
                roles: {
                    every: {
                        role: {
                            ...(query?.filter?.role_name && {
                                name: query?.filter?.role_name
                            }),
                            ...(query?.filter?.role_names?.split(",").length > 0 && {
                                name: {
                                    in: query?.filter?.role_names?.split(",")
                                }
                            }),
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
                contents: true,
                country: true,
                museum: true,

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
                contents: true,
                country: true,
                museum: true,

            }

        })
    }

    async register({ code, country_id, ...registerDto }: RegisterConfirmDto) {
        const roleUser = await this.rolesService.findByName("user");
        return this.prisma.user.create({
            data: {
                ...registerDto,
                country: {
                    connect: {
                        id: country_id
                    }
                },
                phone: `+${registerDto.phone}`,
                password: this.authService.generatePassword(registerDto.password),
                /* birth_date: dayjsUtil(registerDto.birth_date).toDate(), */
                is_active: true,
                is_deleted: false,
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
                roles: {
                    include: {
                        role: true,
                    }
                },
                contents: true,
                country: true,
                museum: true,

            }


        });
    }

    async findById(id: number) {
        return this.prisma.user.findFirst({
            where: {
                id,
            },
            include: {
                roles: {
                    include: {
                        role: true,
                    }
                },
                contents: true,
                country: true,
                museum: true,

            }
        })
    }

    async create({ role_ids, country_id, museum_id, ...createDto }: CreateUserDto) {
        return this.prisma.user.create({
            data: {
                ...createDto,
                ...(createDto.phone && {
                    phone: `+${createDto.phone}`,
                }),
                password: this.authService.generatePassword(createDto.password),
                country: {
                    connect: {
                        id: country_id,
                    }
                },
                ...(museum_id && {
                    museum: {
                        connect: {
                            id: museum_id
                        }
                    },
                }),
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

    async update({ role_ids, id, delete_image, country_id, museum_id, ...updateDto }: UpdateUserDto) {
        return this.prisma.user.update({
            where: {
                id,
            },
            data: {
                ...updateDto,
                ...(updateDto.phone && {
                    phone: `+${updateDto.phone}`,
                }),
                password: updateDto.password && this.authService.generatePassword(updateDto.password),
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
                }),

                ...(country_id && {
                    country: {
                        connect: {
                            id: country_id
                        }
                    },
                }),
                ...(museum_id && {
                    museum: {
                        connect: {
                            id: museum_id
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
                contents: true,
                country: true,
                museum: true,

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
                contents: true,
                country: true,
                museum: true,

            }
        });
    }

}


