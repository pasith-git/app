import { Module } from '@nestjs/common';
import { BanksController } from './banks.controller';
import { BanksService } from './banks.service';
import { SharedModule } from 'shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [BanksController],
  providers: [BanksService]
})
export class BanksModule { }
