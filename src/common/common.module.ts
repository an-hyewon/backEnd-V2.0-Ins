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
import { OauthToken } from './entities/oauth-token.entity';
import { MeritzDliMfliRetrieveSnoLog } from './entities/meritz-dli-mfli-retrieve-sno-log.entity';
import { MeritzDliMfliPremCmptLog } from './entities/meritz-dli-mfli-prem-cmpt-log.entity';
import { MeritzDliMfliGrupCtrCcluLog } from './entities/meritz-dli-mfli-grup-ctr-cclu-log.entity';
import { KbDliMfliRetrieveSnoLog } from './entities/kb-dli-mfli-retrieve-sno-log.entity';
import { KbDliMfliPremCmptLog } from './entities/kb-dli-mfli-prem-cmpt-log.entity';
import { KbDliMfliGrupCtrCcluLog } from './entities/kb-dli-mfli-grup-ctr-cclu-log.entity';
import { RegionDepthNm } from './entities/region-depth-nm.entity';
import { InsuratorEstimateFile } from 'src/insurance/join/entities/insurator-estimate-file.entity';
import { ClientLog } from './entities/client-log.entity';
import { AdminUser } from './entities/admin-user.entity';
import { BoonCounseling } from './entities/boon-counseling.entity';
import { BoonSmsSendLog } from 'src/sms/entities/boon-sms-send-logs.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        ClientLog,
        InsCom,
        InsProd,
        SiteInfo,
        InsComRatioInfo,
        SmsSendLogs,
        AlimtalkTemplate,
        OauthToken,

        MeritzDliMfliRetrieveSnoLog,
        MeritzDliMfliPremCmptLog,
        MeritzDliMfliGrupCtrCcluLog,
        KbDliMfliRetrieveSnoLog,
        KbDliMfliPremCmptLog,
        KbDliMfliGrupCtrCcluLog,
        RegionDepthNm,
        InsuratorEstimateFile,

        CcaliUploads,
        CcaliJoin,
        NtsBizType,
        CcaliBizTypeView,
        PlanGuaranteeContent,
        CcaliJoinSubCompany,
        CcaliClaim,
        CcaliAnswerResponse,
        CcaliInsCostNotice,
        MasterInsStockNo,

        AdminUser,
        BoonCounseling,
      ],
      'default',
    ),
    TypeOrmModule.forFeature([BoonSmsSendLog], 'smsDbConnection'),
  ],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
