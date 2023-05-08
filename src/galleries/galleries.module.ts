import { Module } from '@nestjs/common';
import { SharedModule } from 'shared/shared.module';
import { GalleriesController } from './galleries.controller';
import { GalleriesService } from './galleries.service';

@Module({
  imports: [SharedModule],
  controllers: [GalleriesController],
  providers: [GalleriesService]
})
export class GalleriesModule {}
