import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleTimesService } from './schedule-times.service';

describe('ScheduleTimesService', () => {
  let service: ScheduleTimesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleTimesService],
    }).compile();

    service = module.get<ScheduleTimesService>(ScheduleTimesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
