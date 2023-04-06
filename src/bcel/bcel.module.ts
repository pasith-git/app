import { Module } from '@nestjs/common';
import { BcelController } from './bcel.controller';
import { BcelService } from './bcel.service';

@Module({
  controllers: [BcelController],
  providers: [BcelService]
})
export class BcelModule {}
