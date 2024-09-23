import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TermsModule } from 'src/terms/terms.module';
import { SmsModule } from 'src/sms/sms.module';
import { SmsSendLogs } from 'src/sms/entities/sms-send-logs.entity';
import { CcaliJoin } from 'src/insurance/join/entities/ccali-join.entity';
import { CcaliInsCostNotice } from 'src/insurance/join/entities/ccali-ins-cost-notice.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SmsSendLogs, CcaliJoin, CcaliInsCostNotice]),
    TermsModule,
    SmsModule,
    MailModule,
  ],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
