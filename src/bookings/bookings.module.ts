import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { SharedModule } from 'shared/shared.module';
import { ScheduleTimesService } from 'schedule-times/schedule-times.service';
import { PricesService } from 'prices/prices.service';
import { TicketsService } from 'tickets/tickets.service';

@Module({
  imports: [SharedModule],
  controllers: [BookingsController],
  providers: [BookingsService, ScheduleTimesService, PricesService, TicketsService]
})
export class BookingsModule { }
