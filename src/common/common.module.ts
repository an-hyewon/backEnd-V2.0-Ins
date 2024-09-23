import { Global, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsCom } from './entities/ins-com.entity';
import { InsProd } from './entities/ins-prod.entity';
import { SiteInfo } from './entities/site-info.entity';
import { InsComRatioInfo } from './entities/ins-com-ratio-info.entity';
import { CcaliUploads } from './entities/ccali-uploads.entity';
import { CcaliJoin } from 'src/insurance/join/entities/ccali-join.entity';
import { NtsBizType } from 'src/insurance/plan/entities/nts-biz-type.entity';
import { CcaliBizTypeView } from 'src/insurance/plan/entities/ccali-biz-type-view.entity';
import { PlanGuaranteeContent } from 'src/insurance/plan/entities/plan-guarantee-content.entity';
import { AlimtalkTemplate } from 'src/sms/entities/alimtalk-template.entity';
import { SmsSendLogs } from 'src/sms/entities/sms-send-logs.entity';
import { CcaliJoinSubCompany } from 'src/insurance/join/entities/ccali-join-sub-company.entity';
import { CcaliClaim } from 'src/insurance/claim/entities/ccali-claim.entity';
import { CcaliAnswerResponse } from 'src/insurance/plan/entities/ccali-answer-response.entity';
import { CcaliInsCostNotice } from 'src/insurance/join/entities/ccali-ins-cost-notice.entity';
import { MasterInsStockNo } from 'src/insurance/join/entities/master-ins-stock-no.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      InsCom,
      InsProd,
      SiteInfo,
      InsComRatioInfo,
      CcaliUploads,
      CcaliJoin,
      NtsBizType,
      CcaliBizTypeView,
      PlanGuaranteeContent,
      AlimtalkTemplate,
      SmsSendLogs,
      CcaliJoin,
      NtsBizType,
      CcaliBizTypeView,
      PlanGuaranteeContent,
      CcaliJoinSubCompany,
      CcaliClaim,
      CcaliAnswerResponse,
      CcaliInsCostNotice,
      MasterInsStockNo,
    ]),
  ],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
