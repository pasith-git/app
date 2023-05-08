import { Test, TestingModule } from '@nestjs/testing';
import { GalleryDetailsService } from './gallery-details.service';

describe('GalleryDetailsService', () => {
  let service: GalleryDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GalleryDetailsService],
    }).compile();

    service = module.get<GalleryDetailsService>(GalleryDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
