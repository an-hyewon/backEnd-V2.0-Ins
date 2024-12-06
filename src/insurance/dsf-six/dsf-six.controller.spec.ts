import { Test, TestingModule } from '@nestjs/testing';
import { DsfSixController } from './dsf-six.controller';
import { DsfSixService } from './dsf-six.service';

describe('DsfSixController', () => {
  let controller: DsfSixController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DsfSixController],
      providers: [DsfSixService],
    }).compile();

    controller = module.get<DsfSixController>(DsfSixController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
