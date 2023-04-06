import { Test, TestingModule } from '@nestjs/testing';
import { MuseumSchedulesService } from './museum-schedules.service';

describe('BookingSchedulesService', () => {
  let service: MuseumSchedulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MuseumSchedulesService],
    }).compile();

    service = module.get<MuseumSchedulesService>(MuseumSchedulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
