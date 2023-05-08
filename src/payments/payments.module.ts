import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { SharedModule } from 'shared/shared.module';
import { BookingsService } from 'bookings/bookings.service';
import { ScheduleTimesService } from 'schedule-times/schedule-times.service';
import { PaymentDetailsService } from 'payment-details/payment-details.service';
import { PricesService } from 'prices/prices.service';

@Module({
  imports: [SharedModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, BookingsService, ScheduleTimesService, PaymentDetailsService, PricesService]
})
export class PaymentsModule { }
