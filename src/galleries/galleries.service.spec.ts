import { Test, TestingModule } from '@nestjs/testing';
import { MuseumGalleriesService } from './galleries.service';

describe('MuseumGalleriesService', () => {
  let service: MuseumGalleriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MuseumGalleriesService],
    }).compile();

    service = module.get<MuseumGalleriesService>(MuseumGalleriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
