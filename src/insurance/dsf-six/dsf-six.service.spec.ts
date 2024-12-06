import { Test, TestingModule } from '@nestjs/testing';
import { DsfSixService } from './dsf-six.service';

describe('DsfSixService', () => {
  let service: DsfSixService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DsfSixService],
    }).compile();

    service = module.get<DsfSixService>(DsfSixService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
