import { Test, TestingModule } from '@nestjs/testing';
import { MuseumGalleryCategoriesController } from './museum-gallery-categories.controller';

describe('MuseumGalleryCategoriesController', () => {
  let controller: MuseumGalleryCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MuseumGalleryCategoriesController],
    }).compile();

    controller = module.get<MuseumGalleryCategoriesController>(MuseumGalleryCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
