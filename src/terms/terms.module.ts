import { Module } from '@nestjs/common';
import { TermsService } from './terms.service';
import { TermsController } from './terms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TermsAgreeLogs } from './entities/terms-agree-logs.entity';
import { TermsAgreeMap } from './entities/terms-agree-map.entity';
import { TermsAgreeCdInfo } from './entities/terms-agree-cd-info.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TermsAgreeLogs, TermsAgreeCdInfo, TermsAgreeMap]),
  ],
  controllers: [TermsController],
  providers: [TermsService],
  exports: [TermsService],
})
export class TermsModule {}
