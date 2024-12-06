import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsCom } from 'src/common/entities/ins-com.entity';
import { InsProd } from 'src/common/entities/ins-prod.entity';
import { InsProdTerms } from 'src/common/entities/ins-prod-terms.entity';
import { CcaliBizTypeView } from './entities/ccali-biz-type-view.entity';
import { FinpcCorpBusinessInfo } from './entities/finpc-corp-business-info.entity';
import { ZeropayBusinessInfo } from './entities/zeropay-business-info.entity';
import { KodataBusinessInfo } from './entities/kodata-business-info.entity';
import { KodataCorpBusinessInfo } from './entities/kodata-corp-business-info.entity';
import { NtsBizType } from './entities/nts-biz-type.entity';
import { KoreaBusinessInfo } from './entities/korea-business-type.entity';
import { CcaliEmployeeCnt } from './entities/ccali-employee-cnt.entity';
import { CcaliSalesCost } from './entities/ccali-sales-cost.entity';
import { CcaliCoverageLimit } from './entities/ccali-coverage-limit.entity';
import { CcaliSalesCoverageLimitDefaultMap } from './entities/ccali-sales-coverage-limit-default-map.entity';
import { CcaliInsCost } from './entities/ccali-ins-cost.entity';
import { CcaliPlan } from './entities/ccali-plan.entity';
import { CcaliNtsBizTypeMap } from './entities/ccali-nts-biz-type-map.entity';
import { CcaliJoin } from '../join/entities/ccali-join.entity';
import { CcaliKoreaBizTypeMap } from './entities/ccali-korea-biz-type-map.entity';
import { CcaliKoreaBizTypeQuestion } from './entities/ccali-korea-biz-type-question.entity';
import { NtsKoreaBizTypeMap } from './entities/nts-korea-biz-type-map.entity';
import { PlanGuaranteeMap } from './entities/plan-guarantee-map.entity';
import { CcaliQuestion } from './entities/ccali-question.entity';
import { CcaliQuestionCategory } from './entities/ccali-question-category.entity';
import { CcaliQuestionAnswerTemplate } from './entities/ccali-question-answer-template.entity';
import { PlanGuaranteeContent } from './entities/plan-guarantee-content.entity';
import { CcaliQuestionPlanGuaranteeContentMap } from './entities/ccali-question-plan-guarantee-content-map.entity';
import { KodataCorpBusinessInfo2 } from './entities/kodata-corp-business-info2.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        InsCom,
        InsProd,
        InsProdTerms,
        CcaliBizTypeView,
        NtsBizType,
        KoreaBusinessInfo,
        FinpcCorpBusinessInfo,
        ZeropayBusinessInfo,
        KodataBusinessInfo,
        KodataCorpBusinessInfo,
        KodataCorpBusinessInfo2,
        CcaliPlan,
        CcaliEmployeeCnt,
        CcaliSalesCost,
        CcaliCoverageLimit,
        CcaliSalesCoverageLimitDefaultMap,
        CcaliInsCost,
        CcaliNtsBizTypeMap,
        CcaliJoin,
        CcaliKoreaBizTypeMap,
        CcaliKoreaBizTypeQuestion,
        NtsKoreaBizTypeMap,
        PlanGuaranteeMap,
        PlanGuaranteeContent,
        CcaliQuestion,
        CcaliQuestionCategory,
        CcaliQuestionAnswerTemplate,
        CcaliQuestionPlanGuaranteeContentMap,
      ],
      'default',
    ),
  ],
  controllers: [PlanController],
  providers: [PlanService],
  exports: [PlanService],
})
export class PlanModule {}
