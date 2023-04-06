import { Test, TestingModule } from '@nestjs/testing';
import { BcelController } from './bcel.controller';

describe('BcelController', () => {
  let controller: BcelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BcelController],
    }).compile();

    controller = module.get<BcelController>(BcelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
