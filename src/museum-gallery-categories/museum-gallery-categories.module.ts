import { Module } from '@nestjs/common';
import { SharedModule } from 'shared/shared.module';
import { MuseumGalleryCategoriesController } from './museum-gallery-categories.controller';
import { MuseumGalleryCategoriesService } from './museum-gallery-categories.service';

@Module({
  imports: [SharedModule],
  controllers: [MuseumGalleryCategoriesController,],
  providers: [MuseumGalleryCategoriesService],
 })
export class MuseumGalleryCategoriesModule { } 
