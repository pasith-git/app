import { Test, TestingModule } from '@nestjs/testing';
import { PaymentPackagesController } from './payment-packages.controller';

describe('PaymentPackageController', () => {
  let controller: PaymentPackagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentPackagesController],
    }).compile();

    controller = module.get<PaymentPackagesController>(PaymentPackagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
