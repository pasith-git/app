import { Test, TestingModule } from '@nestjs/testing';
import { PaymentPackagesService } from './payment-packages.service';

describe('PaymentPackageService', () => {
  let service: PaymentPackagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentPackagesService],
    }).compile();

    service = module.get<PaymentPackagesService>(PaymentPackagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
