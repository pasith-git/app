import { Module } from '@nestjs/common';
import { SharedModule } from 'shared/shared.module';
import { MuseumsController } from './museums.controller';
import { MuseumsService } from './museums.service';
import { CountriesService } from 'countries/countries.service';
import { PaymentWalletsService } from 'payment-wallets/payment-wallets.service';

@Module({
  imports: [SharedModule],
  controllers: [MuseumsController],
  providers: [MuseumsService, CountriesService, PaymentWalletsService]
})
export class MuseumsModule { }
