import { Module } from '@nestjs/common';
import { CertService } from './cert.service';
import { CertController } from './cert.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhoneCertLogs } from './entities/phone-cert-logs.entity';
import { SecukitOneCertLogs } from './entities/secukit-one-cert-logs.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PhoneCertLogs, SecukitOneCertLogs], 'default'),
  ],
  controllers: [CertController],
  providers: [CertService],
  exports: [CertService],
})
export class CertModule {}
