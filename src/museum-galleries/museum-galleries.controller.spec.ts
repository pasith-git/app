import { Test, TestingModule } from '@nestjs/testing';
import { MuseumGalleriesController } from './museum-galleries.controller';

describe('MuseumGalleriesController', () => {
  let controller: MuseumGalleriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MuseumGalleriesController],
    }).compile();

    controller = module.get<MuseumGalleriesController>(MuseumGalleriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
