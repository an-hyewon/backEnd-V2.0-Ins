import { Module } from '@nestjs/common';
import { JoinService } from './join.service';
import { JoinController } from './join.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PlanModule } from '../plan/plan.module';
import { InsProd } from 'src/common/entities/ins-prod.entity';
import { JoinConfirm } from './entities/join-confirm.entity';
import { MasterInsStockNo } from './entities/master-ins-stock-no.entity';
import { CcaliJoin } from './entities/ccali-join.entity';
import { CcaliCoverageLimit } from '../plan/entities/ccali-coverage-limit.entity';
import { NtsBizType } from '../plan/entities/nts-biz-type.entity';
import { CcaliBizTypeView } from '../plan/entities/ccali-biz-type-view.entity';
import { TermsAgreeLogs } from 'src/terms/entities/terms-agree-logs.entity';
import { CcaliJoinSubCompany } from './entities/ccali-join-sub-company.entity';
import { CcaliAnswerResponse } from '../plan/entities/ccali-answer-response.entity';
import { CcaliQuestionAnswerTemplate } from '../plan/entities/ccali-question-answer-template.entity';
import { CcaliJoinPayLogs } from './entities/ccali-join-pay-logs.entity';
import { MailModule } from 'src/mail/mail.module';
import { DliJoin } from './entities/dli-join.entity';
import { MfliJoin } from './entities/mfli-join.entity';
import { DliJoinTmp } from './entities/dli-join-tmp.entity';
import { MfliJoinTmp } from './entities/mfli-join-tmp.entity';
import { InsuratorJoin } from './entities/insurator-join.entity';
import { InsuratorJoinFee } from './entities/insurator-join-fee.entity';
import { InsuratorEstimateFile } from './entities/insurator-estimate-file.entity';
import { TotalBizMember } from './entities/total-biz-member.entity';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/profile', // 파일이 저장될 경로
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
    TypeOrmModule.forFeature(
      [
        InsProd,
        JoinConfirm,
        MasterInsStockNo,

        CcaliJoin,
        CcaliCoverageLimit,
        NtsBizType,
        CcaliBizTypeView,
        TermsAgreeLogs,
        CcaliJoinSubCompany,
        CcaliAnswerResponse,
        CcaliQuestionAnswerTemplate,
        CcaliJoinPayLogs,

        DliJoin,
        MfliJoin,
        DliJoinTmp,
        MfliJoinTmp,
        InsuratorJoin,
        InsuratorJoinFee,
        InsuratorEstimateFile,
        TotalBizMember,
      ],
      'default',
    ),
    PlanModule,
    MailModule,
  ],
  controllers: [JoinController],
  providers: [JoinService],
  exports: [JoinService],
})
export class JoinModule {}
