import { Module } from '@nestjs/common';
import { SharedModule } from 'shared/shared.module';
import { PaymentWalletsController } from './payment-wallets.controller';
import { PaymentWalletsService } from './payment-wallets.service';

@Module({
  imports: [SharedModule],
  controllers: [PaymentWalletsController],
  providers: [PaymentWalletsService]
})
export class PaymentWalletsModule { }
