import { Module } from '@nestjs/common';
import { PayService } from './pay.service';
import { PayController } from './pay.controller';
import { CertModule } from 'src/cert/cert.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayNicepayLogs } from './entities/pay-nicepay-logs.entity';
import { CardBinNoKicc } from './entities/card-bin-no-kicc.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PayNicepayLogs, CardBinNoKicc]),
    CertModule,
  ],
  controllers: [PayController],
  providers: [PayService],
})
export class PayModule {}
