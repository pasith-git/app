import { Test, TestingModule } from '@nestjs/testing';
import { BcelService } from './bcel.service';

describe('BcelService', () => {
  let service: BcelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcelService],
    }).compile();

    service = module.get<BcelService>(BcelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
