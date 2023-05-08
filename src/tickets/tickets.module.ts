import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { SharedModule } from 'shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [TicketsController],
  providers: [TicketsService]
})
export class TicketsModule {}
