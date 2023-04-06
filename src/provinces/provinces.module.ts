import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { SharedModule } from 'shared/shared.module';
import { ProvincesController } from './provinces.controller';
import { ProvincesService } from './provinces.service';

@Module({
  imports: [SharedModule],
  controllers: [ProvincesController],
  providers: [ProvincesService],
})
export class ProvincesModule { }
