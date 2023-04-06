import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleTimesController } from './schedule-times.controller';

describe('ScheduleTimesController', () => {
  let controller: ScheduleTimesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleTimesController],
    }).compile();

    controller = module.get<ScheduleTimesController>(ScheduleTimesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
