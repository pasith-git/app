import { Test, TestingModule } from '@nestjs/testing';
import { MuseumSchedulesController } from './museum-schedules.controller';

describe('BookingSchedulesController', () => {
  let controller: MuseumSchedulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MuseumSchedulesController],
    }).compile();

    controller = module.get<MuseumSchedulesController>(MuseumSchedulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
