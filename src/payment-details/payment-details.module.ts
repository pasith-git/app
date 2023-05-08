import { Module } from '@nestjs/common';
import { PaymentDetailsController } from './payment-details.controller';
import { PaymentDetailsService } from './payment-details.service';
import { SharedModule } from 'shared/shared.module';

@Module({

  imports: [SharedModule],
  controllers: [PaymentDetailsController],
  providers: [PaymentDetailsService]
})
export class PaymentDetailsModule { }
