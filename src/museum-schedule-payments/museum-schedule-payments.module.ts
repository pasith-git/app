import { Module } from '@nestjs/common';
import { BcelService } from 'bcel/bcel.service';
import { MuseumSchedulesService } from 'museum-schedules/museum-schedules.service';
import { ScheduleTimesService } from 'schedule-times/schedule-times.service';
import { SharedModule } from 'shared/shared.module';
import { MuseumSchedulePaymentsController } from './museum-schedule-payments.controller';
import { MuseumSchedulePaymentsService } from './museum-schedule-payments.service';

@Module({
  imports: [SharedModule],
  controllers: [MuseumSchedulePaymentsController],
  providers: [MuseumSchedulePaymentsService, BcelService, MuseumSchedulesService, ScheduleTimesService]
})
export class MuseumSchedulePaymentsModule { }
