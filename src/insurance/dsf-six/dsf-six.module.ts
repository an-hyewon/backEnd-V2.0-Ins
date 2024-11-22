import { Module } from '@nestjs/common';
import { DsfSixService } from './dsf-six.service';
import { DsfSixController } from './dsf-six.controller';

@Module({
  controllers: [DsfSixController],
  providers: [DsfSixService],
})
export class DsfSixModule {}
