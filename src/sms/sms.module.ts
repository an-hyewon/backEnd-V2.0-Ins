import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsSendLogs } from './entities/sms-send-logs.entity';
import { MessageType } from './entities/message-type.entity';
import { MessageContentCd } from './entities/message-content-cd.entity';
import { AlimtalkTemplate } from './entities/alimtalk-template.entity';
import { AlimtalkTemplateButton } from './entities/alimtalk-template-button.entity';
import { MessageContentAlimtalkTemplateMap } from './entities/message-content-alimtalk-template-map.entity';
import { JoinModule } from 'src/insurance/join/join.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SmsSendLogs,
      MessageType,
      MessageContentCd,
      AlimtalkTemplate,
      AlimtalkTemplateButton,
      MessageContentAlimtalkTemplateMap,
    ]),
    JoinModule,
  ],
  controllers: [SmsController],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
