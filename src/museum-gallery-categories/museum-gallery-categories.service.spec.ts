import { Test, TestingModule } from '@nestjs/testing';
import { MuseumGalleryCategoriesService } from './museum-gallery-categories.service';

describe('MuseumGalleryCategoriesService', () => {
  let service: MuseumGalleryCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MuseumGalleryCategoriesService],
    }).compile();

    service = module.get<MuseumGalleryCategoriesService>(MuseumGalleryCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
