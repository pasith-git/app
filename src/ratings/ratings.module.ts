import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { SharedModule } from 'shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [RatingsService],
  controllers: [RatingsController]
})
export class RatingsModule {}
