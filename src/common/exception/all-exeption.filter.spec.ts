import { HttpAdapterHost } from '@nestjs/core';
import { AllExceptionFilter } from './all-exeption.filter';

describe('AllExeptionFilter', () => {
  let httpAdapterHost: HttpAdapterHost;

  it('should be defined', () => {
    expect(new AllExceptionFilter(httpAdapterHost)).toBeDefined();
  });
});
