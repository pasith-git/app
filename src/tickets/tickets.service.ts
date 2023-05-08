import { Injectable } from '@nestjs/common';
import { CreateTicketDto, DeleteTicketDto, UpdateTicketDto } from 'common/dtos/ticket.dto';
import { CustomException } from 'common/exceptions/custom.exception';
import TicketQuery from 'common/querys/ticket.query';
import dayjsUtil from 'common/utils/dayjs.util';
import { generateBookingCode } from 'common/utils/generators.util';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TicketsService {
    constructor(private prisma: PrismaService) { }

    async findAll(museum_id_query?: number, query?: TicketQuery) {
        return this.prisma.ticket.findMany({
            where: {
                booking: {
                    museum_id: museum_id_query,
                }
            },
            orderBy: {

            },
            ...(query?.limit && {
                take: parseInt(query.limit),
            }),
            ...(query?.offset && {
                skip: parseInt(query.offset),
            }),
            include: {
                booking: true
            }
        });
    }

    async findById(id: number) {
        return this.prisma.ticket.findFirstOrThrow({
            where: {
                id
            },
            include: {
                booking: true,
            }
        })
    }

    async create({ booking_id, ...createDto }: CreateTicketDto) {
        return this.prisma.ticket.create({
            data: {
                ...createDto,
                booking_code: generateBookingCode(),
                is_checked_in: false,
                is_printed: false,
                booking: {
                    connect: {
                        id: booking_id,
                    }
                },
            },
            include: {
                booking: true,
            }
        })
    }



    async update({ id, booking_id, ...updateDto }: UpdateTicketDto) {
        return this.prisma.ticket.update({
            where: {
                id,
            },
            data: {
                ...updateDto,
                ...(booking_id && {
                    booking: {
                        connect: {
                            id: booking_id,
                        }
                    },
                }),
                ...(updateDto.is_checked_in && {
                    checked_at: updateDto.checked_at && dayjsUtil(updateDto.checked_at, "DD/MM/YYYY HH:mm").toDate(),
                })
            },
        })
    }

    async scanTicketByCode(booking_code: string){
        const ticket = await this.prisma.ticket.findFirstOrThrow({
            where: {
                booking_code,
            },
            include: {
                booking: true
            }
        });

        if(ticket.booking.status !== "success"){
            throw new CustomException({ error: "The ticket didn't pay" });
        }

        if(ticket.is_checked_in){
            throw new CustomException({ error: "The ticket has been used" });
        }

        return this.prisma.ticket.update({
            where: {
                id: ticket.id,
            },
            data: {
                is_checked_in: true,
                checked_at: dayjsUtil().toDate(),
            }
        })
    }

    async delete({ id }: DeleteTicketDto) {
        return this.prisma.ticket.delete({
            where: {
                id,
            },
        });
    }

}
