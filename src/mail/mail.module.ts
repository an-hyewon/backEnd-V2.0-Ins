import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailReceiveLogs } from './entities/email-receive-logs.entity';
import { EmailSendLogs } from './entities/email-send-logs.entity';
import { CcaliInsCostNotice } from 'src/insurance/join/entities/ccali-ins-cost-notice.entity';
import { CcaliJoin } from 'src/insurance/join/entities/ccali-join.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [EmailReceiveLogs, EmailSendLogs, CcaliInsCostNotice, CcaliJoin],
      'default',
    ),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
