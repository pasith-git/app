import { Module } from '@nestjs/common';
import { GatewayModule } from 'gateway/gateway.module';
import { ScheduleTimesService } from 'schedule-times/schedule-times.service';
import { SharedModule } from 'shared/shared.module';
import { MuseumSchedulesController } from './museum-schedules.controller';
import { MuseumSchedulesService } from './museum-schedules.service';

@Module({
  imports: [SharedModule, GatewayModule],
  controllers: [MuseumSchedulesController],
  providers: [MuseumSchedulesService, ScheduleTimesService]
})
export class MuseumSchedulesModule { }
