import { Test, TestingModule } from '@nestjs/testing';
import { GalleryDetailsController } from './gallery-details.controller';

describe('GalleryDetailsController', () => {
  let controller: GalleryDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GalleryDetailsController],
    }).compile();

    controller = module.get<GalleryDetailsController>(GalleryDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
