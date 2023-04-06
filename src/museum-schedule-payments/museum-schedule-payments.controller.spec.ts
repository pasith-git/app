import { Test, TestingModule } from '@nestjs/testing';
import { PaymentMuseumSchedulesController } from './museum-schedule-payments.controller';

describe('PaymentMuseumSchedulesController', () => {
  let controller: PaymentMuseumSchedulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentMuseumSchedulesController],
    }).compile();

    controller = module.get<PaymentMuseumSchedulesController>(PaymentMuseumSchedulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
