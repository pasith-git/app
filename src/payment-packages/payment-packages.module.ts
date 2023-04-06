import { Module } from '@nestjs/common';
import { BcelService } from 'bcel/bcel.service';
import { PackagesService } from 'packages/packages.service';
import { SharedModule } from 'shared/shared.module';
import { PaymentPackagesController } from './payment-packages.controller';
import { PaymentPackagesService } from './payment-packages.service';

@Module({
  imports: [SharedModule],
  controllers: [PaymentPackagesController],
  providers: [PaymentPackagesService, PackagesService, BcelService]
})
export class PaymentPackageModule { }
