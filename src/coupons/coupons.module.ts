import { Module } from '@nestjs/common';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';
import { SharedModule } from 'shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [CouponsController],
  providers: [CouponsService]
})
export class CouponsModule {}
