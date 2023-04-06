import { Module } from '@nestjs/common';
import { SharedModule } from 'shared/shared.module';
import { MuseumGalleriesController } from './museum-galleries.controller';
import { MuseumGalleriesService } from './museum-galleries.service';

@Module({
  imports: [SharedModule],
  controllers: [MuseumGalleriesController],
  providers: [MuseumGalleriesService]
})
export class MuseumGalleriesModule {}
