import { Module } from '@nestjs/common';
import { GalleryDetailsController } from './gallery-details.controller';
import { GalleryDetailsService } from './gallery-details.service';
import { SharedModule } from 'shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [GalleryDetailsController],
  providers: [GalleryDetailsService]
})
export class GalleryDetailsModule { }
