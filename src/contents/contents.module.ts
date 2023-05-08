import { Module } from '@nestjs/common';
import { ContentsController } from './contents.controller';
import { ContentsService } from './contents.service';
import { SharedModule } from 'shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [ContentsController],
  providers: [ContentsService]
})
export class ContentsModule {}
