import { Module } from '@nestjs/common';
import { ClaimService } from './claim.service';
import { ClaimController } from './claim.controller';
import { JoinModule } from '../join/join.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CcaliJoin } from '../join/entities/ccali-join.entity';
import { CcaliClaim } from './entities/ccali-claim.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CcaliJoin, CcaliClaim], 'default'),
    JoinModule,
  ],
  controllers: [ClaimController],
  providers: [ClaimService],
})
export class ClaimModule {}
