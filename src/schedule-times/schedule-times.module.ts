import { Module } from '@nestjs/common';
import { SharedModule } from 'shared/shared.module';
import { ScheduleTimesController } from './schedule-times.controller';
import { ScheduleTimesService } from './schedule-times.service';
import { BookingsService } from 'bookings/bookings.service';
import { PricesService } from 'prices/prices.service';
import { TicketsService } from 'tickets/tickets.service';

@Module({
  imports: [SharedModule],
  controllers: [ScheduleTimesController],
  providers: [ScheduleTimesService]
})
export class ScheduleTimesModule { }
