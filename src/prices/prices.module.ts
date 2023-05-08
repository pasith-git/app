import { Module } from '@nestjs/common';
import { PricesService } from './prices.service';
import { PricesController } from './prices.controller';
import { SharedModule } from 'shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [PricesService],
  controllers: [PricesController]
})
export class PricesModule {}
