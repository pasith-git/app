import { Test, TestingModule } from '@nestjs/testing';
import { PaymentMuseumSchedulesService } from './museum-schedule-payments.service';

describe('PaymentMuseumSchedulesService', () => {
  let service: PaymentMuseumSchedulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentMuseumSchedulesService],
    }).compile();

    service = module.get<PaymentMuseumSchedulesService>(PaymentMuseumSchedulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
