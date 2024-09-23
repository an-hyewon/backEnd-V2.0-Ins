import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Brackets,
  Connection,
  In,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import { CommonService } from 'src/common/common.service';
import { SelectPlanGuaranteeDto } from './dto/select-plan-guarantee.dto';
import { InsProd } from 'src/common/entities/ins-prod.entity';
import { InsCom } from 'src/common/entities/ins-com.entity';
import { InsProdTerms } from 'src/common/entities/ins-prod-terms.entity';
import { CheckBizNoReqDto } from './dto/check-biz-no-req.dto';
import { CcaliBizTypeView } from './entities/ccali-biz-type-view.entity';
import { FinpcCorpBusinessInfo } from './entities/finpc-corp-business-info.entity';
import { ZeropayBusinessInfo } from './entities/zeropay-business-info.entity';
import { KodataBusinessInfo } from './entities/kodata-business-info.entity';
import { KodataCorpBusinessInfo } from './entities/kodata-corp-business-info.entity';
import { KoreaBusinessInfo } from './entities/korea-business-type.entity';
import { NtsBizType } from './entities/nts-biz-type.entity';
import { SelectNtsBizTypeDto } from './dto/select-nts-biz-type.dto';
import { CcaliSalesCost } from './entities/ccali-sales-cost.entity';
import { CcaliCoverageLimit } from './entities/ccali-coverage-limit.entity';
import { CcaliSalesCoverageLimitDefaultMap } from './entities/ccali-sales-coverage-limit-default-map.entity';
import { CcaliEmployeeCnt } from './entities/ccali-employee-cnt.entity';
import { SelectInsCostReqDto } from './dto/select-ins-cost-req.dto';
import { CcaliInsCost } from './entities/ccali-ins-cost.entity';
import { SelectInsCostDto } from './dto/select-ins-cost.dto';
import { CcaliPlan } from './entities/ccali-plan.entity';
import { SelectBizTypeReqDto } from './dto/select-biz-type-req.dto';
import { CcaliNtsBizTypeMap } from './entities/ccali-nts-biz-type-map.entity';
import { CcaliJoin } from '../join/entities/ccali-join.entity';
import { CcaliKoreaBizTypeMap } from './entities/ccali-korea-biz-type-map.entity';
import { CcaliKoreaBizTypeQuestion } from './entities/ccali-korea-biz-type-question.entity';
import { NtsKoreaBizTypeMap } from './entities/nts-korea-biz-type-map.entity';
import { CheckBizTypeReqDto } from './dto/check-biz-type-req.dto';
import { PlanGuaranteeContent } from './entities/plan-guarantee-content.entity';
import { PlanGuarantee } from './entities/plan-guarantee.entity';
import { PlanGuaranteeMap } from './entities/plan-guarantee-map.entity';
import { CcaliQuestion } from './entities/ccali-question.entity';
import { CcaliQuestionCategory } from './entities/ccali-question-category.entity';
import { CcaliQuestionAnswerTemplate } from './entities/ccali-question-answer-template.entity';
import { SelectQuestionReqDto } from './dto/select-question-req.dto';
import { SelectJoinPlanGuaranteeDto } from './dto/select-join-plan-guarantee.dto';
import { CcaliQuestionPlanGuaranteeContentMap } from './entities/ccali-question-plan-guarantee-content-map.entity';
import { CcaliAnswerResponse } from './entities/ccali-answer-response.entity';
import { KodataCorpBusinessInfo2 } from './entities/kodata-corp-business-info2.entity';

@Injectable()
export class PlanService {
  constructor(
    private readonly commonService: CommonService,
    private readonly connection: Connection,
    @InjectRepository(InsProdTerms)
    private insProdTermsRepository: Repository<InsProdTerms>,
    @InjectRepository(CcaliBizTypeView)
    private ccaliBizTypeRepository: Repository<CcaliBizTypeView>,
    @InjectRepository(KoreaBusinessInfo)
    private koreaBusinessInfoRepository: Repository<KoreaBusinessInfo>,
    @InjectRepository(NtsBizType)
    private ntsBizTypeRepository: Repository<NtsBizType>,
    @InjectRepository(FinpcCorpBusinessInfo)
    private finpcCorpBusinessInfoRepository: Repository<FinpcCorpBusinessInfo>,
    @InjectRepository(ZeropayBusinessInfo)
    private zeropayBusinessInfoRepository: Repository<ZeropayBusinessInfo>,
    @InjectRepository(KodataBusinessInfo)
    private kodataBusinessInfoRepository: Repository<KodataBusinessInfo>,
    @InjectRepository(KodataCorpBusinessInfo)
    private kodataCorpBusinessInfoRepository: Repository<KodataCorpBusinessInfo>,
    @InjectRepository(KodataCorpBusinessInfo2)
    private kodataCorpBusinessInfo2Repository: Repository<KodataCorpBusinessInfo2>,
    @InjectRepository(CcaliEmployeeCnt)
    private ccaliEmployeeCntRepository: Repository<CcaliEmployeeCnt>,
    @InjectRepository(CcaliSalesCost)
    private ccaliSalesCostRepository: Repository<CcaliSalesCost>,
    @InjectRepository(CcaliCoverageLimit)
    private ccaliCoverageLimitRepository: Repository<CcaliCoverageLimit>,
    @InjectRepository(CcaliSalesCoverageLimitDefaultMap)
    private ccaliSalesCoverageLimitDefaultMapRepository: Repository<CcaliSalesCoverageLimitDefaultMap>,
    @InjectRepository(CcaliInsCost)
    private ccaliInsCostRepository: Repository<CcaliInsCost>,
    @InjectRepository(CcaliPlan)
    private ccaliPlanRepository: Repository<CcaliPlan>,
    @InjectRepository(CcaliNtsBizTypeMap)
    private ccaliNtsBizTypeMapRepository: Repository<CcaliNtsBizTypeMap>,
    @InjectRepository(CcaliJoin)
    private ccaliJoinRepository: Repository<CcaliJoin>,
    @InjectRepository(CcaliKoreaBizTypeMap)
    private ccaliKoreaBizTypeMapRepository: Repository<CcaliKoreaBizTypeMap>,
    @InjectRepository(CcaliKoreaBizTypeQuestion)
    private ccaliKoreaBizTypeQuestionRepository: Repository<CcaliKoreaBizTypeQuestion>,
    @InjectRepository(NtsKoreaBizTypeMap)
    private ntsKoreaBizTypeMapRepository: Repository<NtsKoreaBizTypeMap>,
    @InjectRepository(PlanGuaranteeMap)
    private planGuaranteeMapRepository: Repository<PlanGuaranteeMap>,
    @InjectRepository(PlanGuaranteeContent)
    private planGuaranteeContentRepository: Repository<PlanGuaranteeContent>,
    @InjectRepository(CcaliQuestion)
    private ccaliQuestionRepository: Repository<CcaliQuestion>,
    @InjectRepository(CcaliQuestionCategory)
    private ccaliQuestionCategoryRepository: Repository<CcaliQuestionCategory>,
    @InjectRepository(CcaliQuestionAnswerTemplate)
    private ccaliQuestionAnswerTemplateRepository: Repository<CcaliQuestionAnswerTemplate>,
    @InjectRepository(CcaliQuestionPlanGuaranteeContentMap)
    private ccaliQuestionPlanGuaranteeContentMapRepository: Repository<CcaliQuestionPlanGuaranteeContentMap>,
  ) {}

  async checkBizNo(req: any, { locationHref, insuredBizNo }: CheckBizNoReqDto) {
    let statusCode = 200000;
    let returnMsg = 'ok';

    let result: any = {
      plan: {},
    };

    const url = req?.headers?.referer || req?.hostname;
    // url 체크
    let referer = this.commonService.getRefererStr(
      locationHref,
      req?.headers?.referer,
    );
    const siteInfo = await this.commonService.getSiteInfo(referer);
    console.log('siteInfo', siteInfo);
    if (siteInfo?.responseCode != 0) {
      throw new BadRequestException('Validation Failed(url)');
    }

    const insProdCd = siteInfo?.responseData?.insProdCd;
    const insProdNm = siteInfo?.responseData?.insProdNm;
    const payYn = siteInfo?.responseData?.payYn;
    const joinAccount = siteInfo?.responseData?.joinAccount;
    const joinPath = siteInfo?.responseData?.joinPath;
    const insCom = siteInfo?.responseData?.insCom;

    /* 사업자번호 자리수 검증 */
    const isBizNoType = this.commonService.checkBizNoValid(insuredBizNo);
    if (!isBizNoType) {
      throw new BadRequestException('Validation Failed(insuredBizNo)');
    }
    /* 사업자번호 자리수 검증 */

    /* 사업자등록 상태조회 */
    const bizStatus = await this.commonService.getBizNoStatus(insuredBizNo);
    console.log('bizStatus', bizStatus);
    let bizStatusInsertData: any = {
      bizNo: insuredBizNo,
      referer: referer,
    };
    bizStatusInsertData = {
      ...bizStatusInsertData,
      ...bizStatus.data,
      insuredBizNo,
    };
    if (bizStatus.success) {
      bizStatusInsertData.statusCd = 1;
    } else if (
      !bizStatus.success &&
      bizStatus.msg == '휴/폐업자는 가입할 수 없습니다.'
    ) {
      bizStatusInsertData.statusCd = 2;
    } else {
      bizStatusInsertData.statusCd = 0;
    }
    console.log('bizStatusInsertData', bizStatusInsertData);
    if (
      !bizStatus.success &&
      bizStatus.msg == '휴/폐업자는 가입할 수 없습니다.'
    ) {
      statusCode = 200010;
      returnMsg = '휴/폐업자는 가입할 수 없습니다.';
    }
    /* 사업자등록 상태조회 */

    /* 중복가입 체크 */
    let ckResult = true;
    let ckBizArr = [];
    let ckJoinBizArr = [];
    const checkBizData = await this.ccaliJoinRepository.find({
      where: {
        insuredBizNo,
        joinStatusCd: In(['N', 'Y', 'X', 'A', 'P']),
      },
    });
    if (checkBizData.length > 0) {
      for (let index = 0; index < checkBizData.length; index++) {
        const element = checkBizData[index];
        // console.log(index, 'checkBizInfo', element);
        let ckInsuredBizNo = element.insuredBizNo;
        let ckInsStartYmd = element.insStartYmd;
        let ckInsStartTime = element.insStartTime;
        let ckInsEndYmd = element.insEndYmd;
        let ckInsEndTime = element.insEndTime;
        let ckInsStartDt =
          dayjs(ckInsStartYmd).format('YYYY-MM-DD') + ' ' + ckInsStartTime;
        let ckInsEndDt =
          dayjs(ckInsEndYmd).format('YYYY-MM-DD') + ' ' + ckInsEndTime;
        let ckJoinStatusCd = element.joinStatusCd;
        let ckJoinAccount = element.joinAccount;
        let ckJoinPath = element.joinPath;
        let ckInsuredRoadAddr = element.insuredRoadAddr;
        let ckInsuredJibunAddr = element.insuredJibunAddr;
        let ckJoinYmd = dayjs(element.joinYmd).format('YYYY-MM-DD');

        let ckPeriod = 0;
        const insPeriodDuration = dayjs.duration(
          dayjs(ckInsEndDt).diff(dayjs()),
        );
        ckPeriod = Math.ceil(insPeriodDuration.as('days'));

        if (ckJoinStatusCd == 'P' || ckJoinStatusCd == 'A') {
          ckBizArr.push({
            insProdNm,
            insStartDt: ckInsStartDt,
            insEndDt: ckInsEndDt,
            joinDay: ckJoinYmd,
            joinCk: ckJoinStatusCd,
            joinAccount: ckJoinAccount,
            joinPath: ckJoinPath,
            newPlatPlc: ckInsuredRoadAddr,
            platPlc: ckInsuredJibunAddr,
          });
        } else if (
          ckPeriod > 15 &&
          (ckJoinStatusCd == 'Y' || ckJoinStatusCd == 'N')
        ) {
          ckBizArr.push({
            insProdNm,
            insStartDt: ckInsStartDt,
            insEndDt: ckInsEndDt,
            joinDay: ckJoinYmd,
            joinCk: ckJoinStatusCd,
            joinAccount: ckJoinAccount,
            joinPath: ckJoinPath,
            newPlatPlc: ckInsuredRoadAddr,
            platPlc: ckInsuredJibunAddr,
          });
        } else if (
          ckPeriod > 0 &&
          (ckJoinStatusCd == 'Y' || ckJoinStatusCd == 'N')
        ) {
          ckJoinBizArr.push({
            insProdNm,
            insStartDt: ckInsStartDt,
            insEndDt: ckInsEndDt,
            joinDay: ckJoinYmd,
            joinCk: ckJoinStatusCd,
            joinAccount: ckJoinAccount,
            joinPath: ckJoinPath,
            newPlatPlc: ckInsuredRoadAddr,
            platPlc: ckInsuredJibunAddr,
          });
        }
      }
      if (ckBizArr.length > 0) {
        statusCode = 200040;
        returnMsg = '이전에 가입을 신청하신 사업자번호입니다.';
      }
    }
    /* 중복가입 체크 */

    /* 사업자번호 개인/법인 구분 */
    const bizNoType = this.commonService.getBizNoType(insuredBizNo);
    let corpNationality = '';
    if (bizNoType != 'C') {
      corpNationality = '대한민국';
    } else if (bizNoType == 'C' && insuredBizNo.substring(3, 5) == '84') {
      corpNationality = '';
    }
    /* 사업자번호 개인/법인 구분 */

    // 사업자정보 조회
    // 기가입자, KODATA법인2, KODATA법인, KODATA, 글로벌핀테크법인, 제로페이 사업자정보 UNION 하여 한번에 조회
    const bizData = await this.selectAllBusinessInfoByBizNo(insuredBizNo);
    let bizInfo: any = {};
    let ntsBizLargeTypeCd = null;
    let ntsBizLargeTypeNm = null;
    let ntsBizTypeId = null;
    let ntsBizTypeCd = null;
    let ntsBizTypeNm = null;
    let ccaliBizLargeTypeCd = null;
    let ccaliBizLargeTypeNm = null;
    let ccaliBizTypeId = null;
    let ccaliBizTypeCd = null;
    let ccaliBizTypeNm = null;
    if (bizData.length == 0) {
      // 수동입력 - 사업자정보X, 주소정보X
      statusCode = 200001;
      result.plan = {
        ...result.plan,
        insuredBizNo,
        bizStatus: bizStatus.success,
        bizNoType,
        bizInfo: {},
        addrInfo: {},
        brinfo: {},
        payYn: 'Y',
      };
    } else if (statusCode == 200040 && bizData.length > 0) {
      bizInfo = bizData[0];
      // code == 200040 중복
      // 수동입력(가입내역O) - 사업자정보O, 주소정보X
      result.plan = {
        ...result.plan,
        insuredBizNo,
        bizStatus: bizStatus.success,
        bizNoType,
        bizInfo: {
          ...bizInfo,
          corpNationality,
          ntsBizLargeTypeCd,
          ntsBizLargeTypeNm,
          ntsBizTypeId,
          ntsBizTypeCd,
          ntsBizTypeNm,
          ccaliBizLargeTypeCd,
          ccaliBizLargeTypeNm,
          ccaliBizTypeId,
          ccaliBizTypeCd,
          ccaliBizTypeNm,
        },
        addrInfo: {},
        brinfo: {},
        payYn: 'Y',
        joinBizInfo: ckBizArr,
      };
    }

    if (statusCode == 200000) {
      // 1. 사업자정보 주소 검색
      console.log('bizData', bizData);
      let addrInfo: any = {};
      bizInfo = bizData[0];
      if (bizInfo?.franAddress != null) {
        addrInfo = await this.commonService.searchAddrApi(bizInfo?.franAddress);
      }
      if (bizData.length >= 2 && addrInfo?.query == null) {
        bizInfo = bizData[1];
        addrInfo = await this.commonService.searchAddrApi(bizInfo?.franAddress);
      }
      if (bizData.length >= 3 && addrInfo?.query == null) {
        bizInfo = bizData[2];
        addrInfo = await this.commonService.searchAddrApi(bizInfo?.franAddress);
      }
      if (bizData.length >= 4 && addrInfo?.query == null) {
        bizInfo = bizData[3];
        addrInfo = await this.commonService.searchAddrApi(bizInfo?.franAddress);
      }
      if (bizData.length >= 5 && addrInfo?.query == null) {
        bizInfo = bizData[4];
        addrInfo = await this.commonService.searchAddrApi(bizInfo?.franAddress);
      }

      // 2. 주소 유효하면 업종코드 사용 -> 업종코드 없으면 수동가입
      if (addrInfo?.query == null) {
        statusCode = 200001;
      }
      if (bizInfo?.bzcCd != null) {
        // 3. 표준10차 업종코드 -> 중대재해 업종코드, 국세청 업종코드 조회
        // 4. 표준10차 업종코드 & 국세청 업종코드 매핑을 위한 질문 여부 체크
        const bizTypeData = await this.selectCcaliNtsBizTypeByKoreaBizType(
          bizInfo?.bzcCd,
        );
        console.log('bizTypeData', bizTypeData);
        if (
          bizTypeData.ccali.length == 1 &&
          bizTypeData.ccali[0]?.ccaliBizTypeData?.length == 1
        ) {
          ccaliBizLargeTypeCd = bizTypeData.ccali[0].ccaliBizLargeTypeCd;
          ccaliBizLargeTypeNm = bizTypeData.ccali[0].ccaliBizLargeTypeNm;
          ccaliBizTypeId =
            bizTypeData.ccali[0]?.ccaliBizTypeData[0]?.ccaliBizTypeId;
          ccaliBizTypeCd =
            bizTypeData.ccali[0]?.ccaliBizTypeData[0]?.ccaliBizTypeCd;
          ccaliBizTypeNm =
            bizTypeData.ccali[0]?.ccaliBizTypeData[0]?.ccaliBizTypeNm;
        } else if (
          bizTypeData.ccali.length == 1 &&
          bizTypeData.ccali[0]?.ccaliBizTypeData?.length > 1
        ) {
          ccaliBizLargeTypeCd = bizTypeData.ccali[0].ccaliBizLargeTypeCd;
          ccaliBizLargeTypeNm = bizTypeData.ccali[0].ccaliBizLargeTypeNm;
        }

        if (
          bizTypeData.nts.length == 1 &&
          bizTypeData.nts[0]?.ntsBizTypeData?.length == 1
        ) {
          ntsBizLargeTypeCd = bizTypeData.nts[0].ntsBizLargeTypeCd;
          ntsBizLargeTypeNm = bizTypeData.nts[0].ntsBizLargeTypeNm;
          ntsBizTypeId = bizTypeData.nts[0]?.ntsBizTypeData[0]?.ntsBizTypeId;
          ntsBizTypeCd = bizTypeData.nts[0]?.ntsBizTypeData[0]?.ntsBizTypeCd;
          ntsBizTypeNm = bizTypeData.nts[0]?.ntsBizTypeData[0]?.ntsBizTypeNm;
        } else if (
          bizTypeData.nts.length == 1 &&
          bizTypeData.nts[0]?.ntsBizTypeData?.length > 1
        ) {
          ntsBizLargeTypeCd = bizTypeData.nts[0].ntsBizLargeTypeCd;
          ntsBizLargeTypeNm = bizTypeData.nts[0].ntsBizLargeTypeNm;
          ntsBizTypeId = bizTypeData.nts[0]?.ntsBizTypeData[0]?.ntsBizTypeId;
          ntsBizTypeCd = bizTypeData.nts[0]?.ntsBizTypeData[0]?.ntsBizTypeCd;
          ntsBizTypeNm = bizTypeData.nts[0]?.ntsBizTypeData[0]?.ntsBizTypeNm;
        }
        const ccaliQuestion = await this.selectCcaliBizQuestionByKoreaBizType(
          bizInfo?.bzcCd,
        );
        console.log('ccaliQuestion', ccaliQuestion);
        result.plan.bizInfo = {
          ...result.plan.bizInfo,
          question: ccaliQuestion,
          bizTypeData,
        };
      }

      result.plan = {
        ...result.plan,
        insuredBizNo,
        bizStatus: bizStatus.success,
        bizNoType,
        bizInfo: {
          ...result.plan.bizInfo,
          ...bizInfo,
          corpNationality,
          ntsBizLargeTypeCd,
          ntsBizLargeTypeNm,
          ntsBizTypeId,
          ntsBizTypeCd,
          ntsBizTypeNm,
          ccaliBizLargeTypeCd,
          ccaliBizLargeTypeNm,
          ccaliBizTypeId,
          ccaliBizTypeCd,
          ccaliBizTypeNm,
        },
        addrInfo,
        brinfo: {},
        payYn: 'Y',
      };
    }

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  async findBizTypeList() {
    let statusCode = 200000;
    let returnMsg = 'ok';
    let result: any = {
      plan: {},
    };

    const ntsBizTypeList = await this.selectBizTypeListAll('nts');
    const ccaliBizTypeList = await this.selectBizTypeListAll('ccali');
    if (ntsBizTypeList.length == 0) {
      statusCode = 200020;
      returnMsg = '검색 결과 없음';
    } else if (ccaliBizTypeList.length == 0) {
      statusCode = 200020;
      returnMsg = '검색 결과 없음';
    } else {
      result.plan = {
        nts: ntsBizTypeList,
        ccali: ccaliBizTypeList,
      };
    }

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  async checkBizType(data: CheckBizTypeReqDto) {
    let statusCode = 200000;
    let returnMsg = 'ok';
    let result: any = {
      plan: {},
    };

    const { ntsBizTypeId, ccaliBizTypeId, totEmployeeCnt, salesCost } = data;
    let planId = 1;

    let bizCheck = false;
    const ccaliBizType = await this.selectBizTypeList('nts', ntsBizTypeId);
    console.log('ccaliBizType', ccaliBizType);
    if (ccaliBizType.length == 0) {
      statusCode = 200020;
      returnMsg = '검색 결과 없음';
    }
    if (statusCode == 200000) {
      for (let largeIndex = 0; largeIndex < ccaliBizType.length; largeIndex++) {
        const largeElement = ccaliBizType[largeIndex];
        for (
          let index = 0;
          index < ccaliBizType[largeIndex].ccaliBizTypeData.length;
          index++
        ) {
          const element = ccaliBizType[largeIndex].ccaliBizTypeData[index];
          if (ccaliBizTypeId == element.ccaliBizTypeId) {
            bizCheck = true;
          }
        }
      }
      if (!bizCheck) {
        throw new BadRequestException('Validation Failed(ccaliBizTypeId)');
      }
      const checkCcaliBizType = await this.ccaliBizTypeRepository.findOne({
        where: {
          bizSmallTypeId: ccaliBizTypeId,
        },
      });
      console.log('checkCcaliBizType', checkCcaliBizType);
      if (totEmployeeCnt == null || salesCost == null) {
        if (
          checkCcaliBizType?.civilDstrIndivYn == 'Y' ||
          checkCcaliBizType?.indstDstrIndivYn == 'Y'
        ) {
          statusCode = 200030;
          returnMsg = '온라인 가입대상 아님';
        }
      } else {
        // 총 근로자수 체크
        if (totEmployeeCnt >= 50) {
          // 50인 이상
          planId = 5;
        } else if (totEmployeeCnt < 50 && salesCost > 100000000000) {
          // 50인 미만 매출액 1,000억원 초과
          planId = 4;
        } else {
          // 50인 미만 매출액 1,000억원 이하
          // 업종 체크
          if (
            checkCcaliBizType?.civilDstrIndivYn == 'Y' ||
            checkCcaliBizType?.indstDstrIndivYn == 'Y'
          ) {
            planId = 3;
          } else if (totEmployeeCnt <= 4) {
            planId = 2;
          }
        }
      }
    }

    if (statusCode == 200000) {
      result.plan = {
        planId,
      };

      // 보장내용 조회
      const planGuarantee = await this.selectCcaliPlanGuarantee({ planId });
      let guaranteeRegionList = [];
      let coverageLimitList = [];
      let specialClauseList = [];
      if (planId < 3) {
        // 보상 한도 리스트
        coverageLimitList = await this.selectCoverageLimitListByPlanId(planId);

        result.plan = {
          ...result.plan,
          guaranteeRegionList,
          coverageLimitList,
          specialClauseList,
          planGuarantee,
        };
      } else if (planId >= 3) {
        // 보상 한도 리스트
        coverageLimitList = await this.selectCoverageLimitListByPlanId(planId);

        // 특별약관 리스트
        specialClauseList = await this.selectSiteQuestionAnswerTemplates([
          16, 19, 68,
        ]);

        result.plan = {
          ...result.plan,
          guaranteeRegionList,
          coverageLimitList,
          specialClauseList,
          planGuarantee,
        };
      }
      if (planId == 5) {
        // 보험 담보 지역 리스트
        guaranteeRegionList = await this.selectSiteAnswerTemplates(24);

        // 보상 한도 리스트
        coverageLimitList = await this.selectCoverageLimitListByPlanId(planId);

        // 특별약관 리스트
        specialClauseList = await this.selectSiteQuestionAnswerTemplates([
          16, 17, 18, 19, 68, 20, 21, 22, 23,
        ]);

        result.plan = {
          ...result.plan,
          guaranteeRegionList,
          coverageLimitList,
          specialClauseList,
        };
      }
    }

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  async findBizType(data: SelectBizTypeReqDto) {
    let statusCode = 200000;
    let returnMsg = 'ok';
    let result: any = {
      plan: {},
    };

    const { changeType, ntsBizTypeId, ccaliBizTypeId } = data;

    // const ntsBizTypeList = await this.selectBizTypeListAll('nts');
    // const ccaliBizTypeList = await this.selectBizTypeListAll('ccali');
    // if (ntsBizTypeList.length == 0) {
    //   statusCode = 200020;
    //   returnMsg = '검색 결과 없음';
    // } else if (ccaliBizTypeList.length == 0) {
    //   statusCode = 200020;
    //   returnMsg = '검색 결과 없음';
    // }

    if (changeType == 'nts' && ntsBizTypeId == null) {
      throw new BadRequestException('Validation Failed(ntsBizTypeId)');
    } else if (changeType == 'nts') {
      const bizType = await this.selectCcaliNtsBizTypeListByBizTypeId(
        'nts',
        ntsBizTypeId,
      );
      if (bizType.ccali.length == 0) {
        statusCode = 200020;
        returnMsg = '검색 결과 없음';
      } else {
        result.plan = {
          nts: bizType.nts,
          ccali: bizType.ccali,
        };
      }
      // const ccaliBizType = await this.selectBizTypeList('nts', ntsBizTypeId);
      // if (ccaliBizType.length == 0) {
      //   statusCode = 200020;
      //   returnMsg = '검색 결과 없음';
      // } else {
      //   if (ccaliBizTypeId != null) {
      //     const ntsBizType = await this.selectBizType('nts', ntsBizTypeId);
      //     if (ntsBizType.length == 0) {
      //     }
      //     result.plan = {
      //       // ntsBizTypeList,
      //       // ccaliBizTypeList,
      //       nts: ntsBizType,
      //       ccali: ccaliBizType,
      //       test: bizType,
      //     };
      //   } else {
      //     result.plan = {
      //       // ntsBizTypeList,
      //       // ccaliBizTypeList,
      //       nts: [],
      //       ccali: ccaliBizType,
      //       test: bizType,
      //     };
      //   }
      // }
    } else if (changeType == 'ccali' && ccaliBizTypeId == null) {
      throw new BadRequestException('Validation Failed(ccaliBizTypeId)');
    } else if (changeType == 'ccali') {
      const bizType = await this.selectCcaliNtsBizTypeListByBizTypeId(
        'ccali',
        ccaliBizTypeId,
      );
      if (bizType.nts.length == 0) {
        statusCode = 200020;
        returnMsg = '검색 결과 없음';
      } else {
        result.plan = {
          nts: bizType.nts,
          ccali: bizType.ccali,
        };
      }
      // const ntsBizType = await this.selectBizTypeList('ccali', ccaliBizTypeId);
      // if (ntsBizType.length == 0) {
      //   statusCode = 200020;
      //   returnMsg = '검색 결과 없음';
      // } else {
      //   result.plan = {
      //     // ntsBizTypeList,
      //     // ccaliBizTypeList,
      //     nts: ntsBizType,
      //     ccali: [],
      //     test: bizType,
      //   };
      // }
    }

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  async findDefaultCoverageLimit(salesCost: number) {
    let statusCode = 200000;
    let returnMsg = 'ok';

    let result = {
      plan: [],
    };
    if (salesCost > 100000000000) {
      statusCode = 200030;
      returnMsg = '온라인 가입대상 아님(매출액 1000억 초과)';

      let responseResult = {
        code: statusCode,
        message: returnMsg,
        result,
      };

      return responseResult;
    }

    const defaultCoverageLimit =
      await this.selectDefaultCoverageLimit(salesCost);
    if (defaultCoverageLimit.length == 0) {
      statusCode = 200020;
      returnMsg = '검색 결과 없음';
    } else {
      result.plan = defaultCoverageLimit;
    }

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  async calculateInsCostGuarantee({
    ccaliBizTypeCd,
    employeeCnt,
    perAccidentCoverageLimit,
    totCoverageLimit,
    salesCost,
    planId,
  }: SelectInsCostReqDto) {
    let statusCode = 200000;
    let returnMsg = 'ok';

    let result = {
      plan: {},
    };

    if (planId >= 3) {
      statusCode = 200021;
      returnMsg = '보험료 계산 불가 플랜';
    } else {
      const ccaliBizTypeInfo = await this.ccaliBizTypeRepository.findOne({
        where: {
          bizSmallTypeCd: ccaliBizTypeCd,
        },
      });
      if (!ccaliBizTypeInfo) {
        statusCode = 200020;
        returnMsg = '검색 결과 없음';
      } else {
        // 보장내용 조회
        const planGuarantee = await this.selectCcaliPlanGuarantee({ planId });

        const insCostInfo = await this.selectInsCost({
          insProdId: 1,
          planId,
          bizSmallTypeCd: ccaliBizTypeCd,
          employeeCnt,
          perAccidentCoverageLimit,
          totCoverageLimit,
          salesCost,
        });
        if (insCostInfo.length == 0) {
          statusCode = 200021;
          returnMsg = '보험료 계산 불가 플랜';
        } else {
          result.plan = {
            planId,
            bizLargeTypeCd: ccaliBizTypeInfo.bizLargeTypeCd,
            bizLargeTypeNm: ccaliBizTypeInfo.bizLargeTypeNm,
            bizMediumTypeCd: ccaliBizTypeInfo.bizMediumTypeCd,
            bizMediumTypeNm: ccaliBizTypeInfo.bizMediumTypeNm,
            bizSmallTypeCd: ccaliBizTypeInfo.bizSmallTypeCd,
            employeeCnt,
            perAccidentCoverageLimit,
            totCoverageLimit,
            insCostInfo,
            planGuarantee,
          };
        }
      }
    }

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  async findQuestionList(data: SelectQuestionReqDto) {
    let statusCode = 200000;
    let returnMsg = 'ok';
    let result: any = {
      plan: {},
    };

    const { ccaliBizTypeId, planId } = data;

    // 제조업 여부 판단
    const checkCcaliBizType = await this.ccaliBizTypeRepository.findOne({
      where: {
        bizSmallTypeId: ccaliBizTypeId,
      },
    });
    if (planId == 5) {
      // 산업재해
      const industryList = await this.funSiteQuestionAnswerTemplates(
        [4],
        [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
      );

      // 시민재해
      const civilList = await this.funSiteQuestionAnswerTemplates(
        [4],
        [22, 23, 24, 25, 26, 27, 28, 29],
      );

      result.plan = {
        industryList,
        civilList,
      };
    } else if (planId < 3) {
    } else {
      // planId >= 3 && planId <= 4
    }

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  async selectInsProdTermsUrlByInsProdId(insProdId: number) {
    const query = this.insProdTermsRepository
      .createQueryBuilder('terms')
      .select('terms.id', 'termsId')
      .addSelect('terms.trms_url', 'insProdTermsUrl')
      .where('terms.ins_prod_id = :insProdId', { insProdId })
      .andWhere('NOW() BETWEEN terms.strt_dt AND terms.end_dt');

    query.orderBy('termsId', 'DESC');

    const results = await query.getRawOne();
    return results;
  }

  queryFinpcCorpBusinessInfoByBizNo(bizNo: string) {
    const query = this.finpcCorpBusinessInfoRepository
      .createQueryBuilder('finpcCorp')
      .select('REGEXP_REPLACE(finpcCorp.sales_cnt, "[-,]", "")', 'salesCost')
      .addSelect('NULL', 'totAnnualWages')
      .addSelect(
        'REGEXP_REPLACE(finpcCorp.employee_cnt, "[-,]", "")',
        'employeeCnt',
      )
      .addSelect('finpcCorp.fran_nm', 'franNm')
      .addSelect('finpcCorp.fran_addr', 'franAddress')
      .addSelect('NULL', 'ownerNm')
      .addSelect('NULL', 'ownerNo')
      .addSelect('finpcCorp.bzno_corp', 'corpNo')
      .addSelect('SUBSTR(finpcCorp.bzc_cd, 2)', 'bzcCd')
      .addSelect('finpcCorp.bzc_nm', 'bzcNm')
      .addSelect('NULL', 'franEmail')
      .addSelect('NULL', 'establishDt')
      .addSelect('"finpccorp"', 'origin')
      .leftJoin(
        (subQuery) => {
          return subQuery.select('kbi.*').from(KoreaBusinessInfo, 'kbi');
        },
        'korea',
        'SUBSTR(finpcCorp.bzc_cd, 1, 1) = korea.large_type_cd AND SUBSTR(finpcCorp.bzc_cd, 2) = korea.sub_sub_type_cd',
      )
      .where('finpcCorp.bzno = :bizNo', { bizNo })
      .orderBy('finpcCorp.seq_no', 'DESC')
      .limit(1);

    return query;
  }

  queryZeropayBusinessInfoByBizNo(bizNo: string) {
    const query = this.zeropayBusinessInfoRepository
      .createQueryBuilder('zeropay')
      .select('NULL', 'salesCost')
      .addSelect('NULL', 'totAnnualWages')
      .addSelect('NULL', 'employeeCnt')
      .addSelect('zeropay.fran_nm', 'franNm')
      .addSelect('zeropay.fran_addr', 'franAddress')
      .addSelect('zeropay.fran_owner', 'ownerNm')
      .addSelect('NULL', 'ownerNo')
      .addSelect('NULL', 'corpNo')
      .addSelect('zeropay.kbc_bzc_cd', 'bzcCd')
      .addSelect('zeropay.bzc_nm', 'bzcNm')
      .addSelect('NULL', 'franEmail')
      .addSelect('NULL', 'establishDt')
      .addSelect('"zeropay"', 'origin')
      .leftJoin(
        (subQuery) => {
          return subQuery.select('kbi.*').from(KoreaBusinessInfo, 'kbi');
        },
        'korea',
        'zeropay.kbc_bzc_cd = korea.sub_sub_type_cd',
      )
      .where('zeropay.bzno = :bizNo', { bizNo })
      .orderBy('zeropay.seq_no', 'DESC')
      .limit(1);

    return query;
  }

  queryKodataBusinessInfoByBizNo(bizNo: string) {
    const query = this.kodataBusinessInfoRepository
      .createQueryBuilder('kodata')
      .select('kodata.est_sales_1y', 'salesCost')
      .addSelect('NULL', 'totAnnualWages')
      .addSelect('kodata.em2021', 'employeeCnt')
      .addSelect('kodata.fran_nm', 'franNm')
      .addSelect('kodata.fran_addr', 'franAddress')
      .addSelect('NULL', 'ownerNm')
      .addSelect('NULL', 'ownerNo')
      .addSelect('NULL', 'corpNo')
      .addSelect('SUBSTR(kodata.bzc_cd, 2)', 'bzcCd')
      .addSelect('kodata.bzc_nm', 'bzcNm')
      .addSelect('NULL', 'franEmail')
      .addSelect('NULL', 'establishDt')
      .addSelect('"kodata"', 'origin')
      .leftJoin(
        (subQuery) => {
          return subQuery.select('kbi.*').from(KoreaBusinessInfo, 'kbi');
        },
        'korea',
        'SUBSTR(kodata.bzc_cd, 1, 1) = korea.large_type_cd AND SUBSTR(kodata.bzc_cd, 2) = korea.sub_sub_type_cd',
      )
      .where('kodata.bzno = :bizNo', { bizNo })
      .orderBy('kodata.seq_no', 'DESC')
      .limit(1);

    return query;
  }

  queryKodataCorpBusinessInfoByBizNo(bizNo: string) {
    const query = this.kodataCorpBusinessInfoRepository
      .createQueryBuilder('kodataCorp')
      .select('REGEXP_REPLACE(kodataCorp.sales_cnt, "[-,]", "")', 'salesCost')
      .addSelect('NULL', 'totAnnualWages')
      .addSelect(
        'REGEXP_REPLACE(kodataCorp.employee_cnt, "[-,]", "")',
        'employeeCnt',
      )
      .addSelect('kodataCorp.fran_nm', 'franNm')
      .addSelect('kodataCorp.fran_addr', 'franAddress')
      .addSelect('kodataCorp.owner_nm', 'ownerNm')
      .addSelect('REPLACE(kodataCorp.owner_no, "-", "")', 'ownerNo')
      .addSelect('REPLACE(kodataCorp.bzno_corp, "*", "")', 'corpNo')
      .addSelect('SUBSTR(kodataCorp.bzc_cd, 2)', 'bzcCd')
      .addSelect('kodataCorp.bzc_nm', 'bzcNm')
      .addSelect('kodataCorp.gen_email', 'franEmail')
      .addSelect('NULL', 'establishDt')
      .addSelect('"kodatacorp"', 'origin')
      .leftJoin(
        (subQuery) => {
          return subQuery.select('kbi.*').from(KoreaBusinessInfo, 'kbi');
        },
        'korea',
        'SUBSTR(kodataCorp.bzc_cd, 1, 1) = korea.large_type_cd AND SUBSTR(kodataCorp.bzc_cd, 2) = korea.sub_sub_type_cd',
      )
      .where('kodataCorp.bzno = :bizNo', { bizNo })
      .orderBy('kodataCorp.seq_no', 'DESC')
      .limit(1);

    return query;
  }

  queryKodataCorpBusinessInfo2ByBizNo(bizNo: string) {
    const query = this.kodataCorpBusinessInfo2Repository
      .createQueryBuilder('kodataCorp2')
      .select('kodataCorp2.sales', 'salesCost')
      .addSelect('kodataCorp2.wage', 'totAnnualWages')
      .addSelect('kodataCorp2.gobo2312', 'employeeCnt')
      .addSelect('kodataCorp2.fran_nm', 'franNm')
      .addSelect('kodataCorp2.fran_addr', 'franAddress')
      .addSelect('kodataCorp2.owner_nm', 'ownerNm')
      .addSelect('kodataCorp2.owner_no', 'ownerNo')
      .addSelect('kodataCorp2.bzno_corp', 'corpNo')
      .addSelect('SUBSTR(kodataCorp2.bzc_cd, 2)', 'bzcCd')
      .addSelect('kodataCorp2.bzc_nm', 'bzcNm')
      .addSelect('kodataCorp2.gen_email', 'franEmail')
      .addSelect('kodataCorp2.estb_dt', 'establishDt')
      .addSelect('"kodatacorp2"', 'origin')
      .leftJoin(
        (subQuery) => {
          return subQuery.select('kbi.*').from(KoreaBusinessInfo, 'kbi');
        },
        'korea',
        'SUBSTR(kodataCorp2.bzc_cd, 1, 1) = korea.large_type_cd AND SUBSTR(kodataCorp2.bzc_cd, 2) = korea.sub_sub_type_cd',
      )
      .where('kodataCorp2.bzno = :bizNo', { bizNo })
      .orderBy('kodataCorp2.seq_no', 'DESC')
      .limit(1);

    return query;
  }

  async selectAllBusinessInfoByBizNo(bizNo: string) {
    const unionQuery = `
      (${this.queryKodataCorpBusinessInfo2ByBizNo(bizNo).getSql()})
      UNION ALL
      (${this.queryKodataCorpBusinessInfoByBizNo(bizNo).getSql()})
      UNION ALL
      (${this.queryKodataBusinessInfoByBizNo(bizNo).getSql()})
      UNION ALL
      (${this.queryFinpcCorpBusinessInfoByBizNo(bizNo).getSql()})
      UNION ALL
      (${this.queryZeropayBusinessInfoByBizNo(bizNo).getSql()})
    `;
    const parameters = [bizNo, bizNo, bizNo, bizNo, bizNo];

    const results = await this.connection.query(unionQuery, parameters);
    const formattedResults = results.map((result) => ({
      ...result,
      establishDt:
        result.establishDt != null && result.establishDt.length == 8
          ? result.establishDt
          : null,
      salesCost:
        result.salesCost == null
          ? null
          : isNaN(Number(result.salesCost))
            ? 0
            : Number(result.salesCost) * 1000,
      totAnnualWages:
        result.totAnnualWages == null
          ? null
          : isNaN(Number(result.totAnnualWages))
            ? 0
            : Number(result.totAnnualWages) * 1000,
      employeeCnt:
        result.employeeCnt == null
          ? null
          : isNaN(Number(result.employeeCnt))
            ? 0
            : Number(result.employeeCnt),
    }));
    return formattedResults;
  }

  async selectBizTypeListAll(type: string, bizTypeCd?: string) {
    const query = this.ccaliNtsBizTypeMapRepository
      .createQueryBuilder('map')
      .select('ccali.biz_large_type_cd', 'ccaliBizLargeTypeCd')
      .addSelect('ccali.biz_large_type_nm', 'ccaliBizLargeTypeNm')
      .addSelect('ccali.biz_small_type_id', 'ccaliBizTypeId')
      .addSelect('ccali.biz_small_type_cd', 'ccaliBizTypeCd')
      .addSelect('ccali.biz_small_type_nm', 'ccaliBizTypeNm')
      .addSelect('nts.biz_large_type_cd', 'ntsBizLargeTypeCd')
      .addSelect('nts.biz_large_type_nm', 'ntsBizLargeTypeNm')
      .addSelect('nts.id', 'ntsBizTypeId')
      .addSelect('nts.biz_sub_sub_type_cd', 'ntsBizTypeCd')
      .addSelect('nts.biz_sub_sub_type_nm', 'ntsBizTypeNm')
      .innerJoin(
        (subQuery) => {
          return subQuery.select('cbt.*').from(CcaliBizTypeView, 'cbt');
        },
        'ccali',
        'map.ccali_biz_type_id = ccali.biz_small_type_id',
      )
      .innerJoin(
        (subQuery) => {
          return subQuery.select('nbt.*').from(NtsBizType, 'nbt');
        },
        'nts',
        'map.nts_biz_type_id = nts.id',
      );

    if (type == 'ccali') {
      query
        .groupBy('ccali.biz_large_type_cd')
        .addGroupBy('ccali.biz_small_type_cd');
    } else if (type == 'nts') {
      query
        .groupBy('nts.biz_large_type_cd')
        .addGroupBy('nts.biz_sub_sub_type_cd');
    }

    if (type == 'ccali') {
      query
        .orderBy('ccali.biz_large_type_cd', 'ASC')
        .addOrderBy('ccali.biz_medium_type_cd', 'ASC')
        .addOrderBy('ccali.biz_small_type_cd', 'ASC');
    } else if (type == 'nts') {
      query
        .orderBy('nts.biz_large_type_cd', 'ASC')
        .addOrderBy('nts.biz_medium_type_cd', 'ASC')
        .addOrderBy('nts.biz_small_type_cd', 'ASC')
        .addOrderBy('nts.biz_sub_type_cd', 'ASC')
        .addOrderBy('nts.biz_sub_sub_type_cd', 'ASC');
    }

    const results = await query.getRawMany();
    let formattedResults = [];
    for (let index = 0; index < results.length; index++) {
      const element = results[index];
      const {
        ccaliBizLargeTypeCd,
        ccaliBizLargeTypeNm,
        ccaliBizTypeId,
        ccaliBizTypeCd,
        ccaliBizTypeNm,
        ntsBizLargeTypeCd,
        ntsBizLargeTypeNm,
        ntsBizTypeId,
        ntsBizTypeCd,
        ntsBizTypeNm,
      } = element;

      let tmpBizLargeInfo: any = {};
      let tmpBizTypeInfo: any = {};

      if (type == 'ccali') {
        if (index == 0) {
          tmpBizTypeInfo = {
            ccaliBizTypeId: parseInt(ccaliBizTypeId),
            ccaliBizTypeCd,
            ccaliBizTypeNm,
          };
          tmpBizLargeInfo = {
            ccaliBizLargeTypeCd,
            ccaliBizLargeTypeNm,
            ccaliBizTypeData: [tmpBizTypeInfo],
          };
          formattedResults.push(tmpBizLargeInfo);
        } else {
          if (
            formattedResults[formattedResults.length - 1].ccaliBizLargeTypeCd ==
            ccaliBizLargeTypeCd
          ) {
            tmpBizTypeInfo = {
              ccaliBizTypeId: parseInt(ccaliBizTypeId),
              ccaliBizTypeCd,
              ccaliBizTypeNm,
            };
            formattedResults[formattedResults.length - 1].ccaliBizTypeData.push(
              tmpBizTypeInfo,
            );
          } else {
            tmpBizTypeInfo = {
              ccaliBizTypeId: parseInt(ccaliBizTypeId),
              ccaliBizTypeCd,
              ccaliBizTypeNm,
            };
            tmpBizLargeInfo = {
              ccaliBizLargeTypeCd,
              ccaliBizLargeTypeNm,
              ccaliBizTypeData: [tmpBizTypeInfo],
            };
            formattedResults.push(tmpBizLargeInfo);
          }
        }
      } else if (type == 'nts') {
        if (index == 0) {
          tmpBizTypeInfo = {
            ntsBizTypeId: parseInt(ntsBizTypeId),
            ntsBizTypeCd,
            ntsBizTypeNm,
          };
          tmpBizLargeInfo = {
            ntsBizLargeTypeCd,
            ntsBizLargeTypeNm,
            ntsBizTypeData: [tmpBizTypeInfo],
          };
          formattedResults.push(tmpBizLargeInfo);
        } else {
          if (
            formattedResults[formattedResults.length - 1].ntsBizLargeTypeCd ==
            ntsBizLargeTypeCd
          ) {
            tmpBizTypeInfo = {
              ntsBizTypeId: parseInt(ntsBizTypeId),
              ntsBizTypeCd,
              ntsBizTypeNm,
            };
            formattedResults[formattedResults.length - 1].ntsBizTypeData.push(
              tmpBizTypeInfo,
            );
          } else {
            tmpBizTypeInfo = {
              ntsBizTypeId: parseInt(ntsBizTypeId),
              ntsBizTypeCd,
              ntsBizTypeNm,
            };
            tmpBizLargeInfo = {
              ntsBizLargeTypeCd,
              ntsBizLargeTypeNm,
              ntsBizTypeData: [tmpBizTypeInfo],
            };
            formattedResults.push(tmpBizLargeInfo);
          }
        }
      }
    }

    return formattedResults;
  }

  async selectBizTypeList(type: string, bizTypeId: number) {
    const query = this.ccaliNtsBizTypeMapRepository
      .createQueryBuilder('map')
      .select('ccali.biz_large_type_cd', 'ccaliBizLargeTypeCd')
      .addSelect('ccali.biz_large_type_nm', 'ccaliBizLargeTypeNm')
      .addSelect('ccali.biz_small_type_id', 'ccaliBizTypeId')
      .addSelect('ccali.biz_small_type_cd', 'ccaliBizTypeCd')
      .addSelect('ccali.biz_small_type_nm', 'ccaliBizTypeNm')
      .addSelect('nts.biz_large_type_cd', 'ntsBizLargeTypeCd')
      .addSelect('nts.biz_large_type_nm', 'ntsBizLargeTypeNm')
      .addSelect('nts.id', 'ntsBizTypeId')
      .addSelect('nts.biz_sub_sub_type_cd', 'ntsBizTypeCd')
      .addSelect('nts.biz_sub_sub_type_nm', 'ntsBizTypeNm')
      .innerJoin(
        (subQuery) => {
          return subQuery.select('cbt.*').from(CcaliBizTypeView, 'cbt');
        },
        'ccali',
        'map.ccali_biz_type_id = ccali.biz_small_type_id',
      )
      .innerJoin(
        (subQuery) => {
          return subQuery.select('nbt.*').from(NtsBizType, 'nbt');
        },
        'nts',
        'map.nts_biz_type_id = nts.id',
      );

    if (type == 'ccali') {
      query
        .where('ccali.biz_small_type_id = :bizTypeId', { bizTypeId })
        .groupBy('nts.biz_large_type_cd')
        .addGroupBy('nts.biz_sub_sub_type_cd');
    } else if (type == 'nts') {
      query
        .where('nts.id = :bizTypeId', { bizTypeId })
        .groupBy('ccali.biz_large_type_cd')
        .addGroupBy('ccali.biz_small_type_cd');
    }

    if (type == 'nts') {
      query
        .orderBy('ccali.biz_large_type_cd', 'ASC')
        .addOrderBy('ccali.biz_medium_type_cd', 'ASC')
        .addOrderBy('ccali.biz_small_type_cd', 'ASC');
    } else if (type == 'ccali') {
      query
        .orderBy('nts.biz_large_type_cd', 'ASC')
        .addOrderBy('nts.biz_medium_type_cd', 'ASC')
        .addOrderBy('nts.biz_small_type_cd', 'ASC')
        .addOrderBy('nts.biz_sub_type_cd', 'ASC')
        .addOrderBy('nts.biz_sub_sub_type_cd', 'ASC');
    }

    const results = await query.getRawMany();
    let formattedResults = [];
    for (let index = 0; index < results.length; index++) {
      const element = results[index];
      const {
        ccaliBizLargeTypeCd,
        ccaliBizLargeTypeNm,
        ccaliBizTypeId,
        ccaliBizTypeCd,
        ccaliBizTypeNm,
        ntsBizLargeTypeCd,
        ntsBizLargeTypeNm,
        ntsBizTypeId,
        ntsBizTypeCd,
        ntsBizTypeNm,
      } = element;

      let tmpBizLargeInfo: any = {};
      let tmpBizTypeInfo: any = {};

      if (type == 'nts') {
        if (index == 0) {
          tmpBizTypeInfo = {
            ccaliBizTypeId: parseInt(ccaliBizTypeId),
            ccaliBizTypeCd,
            ccaliBizTypeNm,
          };
          tmpBizLargeInfo = {
            ccaliBizLargeTypeCd,
            ccaliBizLargeTypeNm,
            ccaliBizTypeData: [tmpBizTypeInfo],
          };
          formattedResults.push(tmpBizLargeInfo);
        } else {
          if (
            formattedResults[formattedResults.length - 1].ccaliBizLargeTypeCd ==
            ccaliBizLargeTypeCd
          ) {
            tmpBizTypeInfo = {
              ccaliBizTypeId: parseInt(ccaliBizTypeId),
              ccaliBizTypeCd,
              ccaliBizTypeNm,
            };
            formattedResults[formattedResults.length - 1].ccaliBizTypeData.push(
              tmpBizTypeInfo,
            );
          } else {
            tmpBizTypeInfo = {
              ccaliBizTypeId: parseInt(ccaliBizTypeId),
              ccaliBizTypeCd,
              ccaliBizTypeNm,
            };
            tmpBizLargeInfo = {
              ccaliBizLargeTypeCd,
              ccaliBizLargeTypeNm,
              ccaliBizTypeData: [tmpBizTypeInfo],
            };
            formattedResults.push(tmpBizLargeInfo);
          }
        }
      } else if (type == 'ccali') {
        if (index == 0) {
          tmpBizTypeInfo = {
            ntsBizTypeId: parseInt(ntsBizTypeId),
            ntsBizTypeCd,
            ntsBizTypeNm,
          };
          tmpBizLargeInfo = {
            ntsBizLargeTypeCd,
            ntsBizLargeTypeNm,
            ntsBizTypeData: [tmpBizTypeInfo],
          };
          formattedResults.push(tmpBizLargeInfo);
        } else {
          if (
            formattedResults[formattedResults.length - 1].ntsBizLargeTypeCd ==
            ntsBizLargeTypeCd
          ) {
            tmpBizTypeInfo = {
              ntsBizTypeId: parseInt(ntsBizTypeId),
              ntsBizTypeCd,
              ntsBizTypeNm,
            };
            formattedResults[formattedResults.length - 1].ntsBizTypeData.push(
              tmpBizTypeInfo,
            );
          } else {
            tmpBizTypeInfo = {
              ntsBizTypeId: parseInt(ntsBizTypeId),
              ntsBizTypeCd,
              ntsBizTypeNm,
            };
            tmpBizLargeInfo = {
              ntsBizLargeTypeCd,
              ntsBizLargeTypeNm,
              ntsBizTypeData: [tmpBizTypeInfo],
            };
            formattedResults.push(tmpBizLargeInfo);
          }
        }
      }
    }

    return formattedResults;
  }

  async selectBizType(type: string, bizTypeId: number) {
    const query = this.ccaliNtsBizTypeMapRepository
      .createQueryBuilder('map')
      .select('ccali.biz_large_type_cd', 'ccaliBizLargeTypeCd')
      .addSelect('ccali.biz_large_type_nm', 'ccaliBizLargeTypeNm')
      .addSelect('ccali.biz_small_type_id', 'ccaliBizTypeId')
      .addSelect('ccali.biz_small_type_cd', 'ccaliBizTypeCd')
      .addSelect('ccali.biz_small_type_nm', 'ccaliBizTypeNm')
      .addSelect('nts.biz_large_type_cd', 'ntsBizLargeTypeCd')
      .addSelect('nts.biz_large_type_nm', 'ntsBizLargeTypeNm')
      .addSelect('nts.id', 'ntsBizTypeId')
      .addSelect('nts.biz_sub_sub_type_cd', 'ntsBizTypeCd')
      .addSelect('nts.biz_sub_sub_type_nm', 'ntsBizTypeNm')
      .innerJoin(
        (subQuery) => {
          return subQuery.select('cbt.*').from(CcaliBizTypeView, 'cbt');
        },
        'ccali',
        'map.ccali_biz_type_id = ccali.biz_small_type_id',
      )
      .innerJoin(
        (subQuery) => {
          return subQuery.select('nbt.*').from(NtsBizType, 'nbt');
        },
        'nts',
        'map.nts_biz_type_id = nts.id',
      );

    if (type == 'ccali') {
      query
        .where('ccali.biz_small_type_id = :bizTypeId', { bizTypeId })
        .groupBy('ccali.biz_large_type_cd')
        .addGroupBy('ccali.biz_small_type_cd');
    } else if (type == 'nts') {
      query
        .where('nts.id = :bizTypeId', { bizTypeId })

        .groupBy('nts.biz_large_type_cd')
        .addGroupBy('nts.biz_sub_sub_type_cd');
    }

    if (type == 'nts') {
      query
        .orderBy('nts.biz_large_type_cd', 'ASC')
        .addOrderBy('nts.biz_medium_type_cd', 'ASC')
        .addOrderBy('nts.biz_small_type_cd', 'ASC')
        .addOrderBy('nts.biz_sub_type_cd', 'ASC')
        .addOrderBy('nts.biz_sub_sub_type_cd', 'ASC');
    } else if (type == 'ccali') {
      query
        .orderBy('ccali.biz_large_type_cd', 'ASC')
        .addOrderBy('ccali.biz_medium_type_cd', 'ASC')
        .addOrderBy('ccali.biz_small_type_cd', 'ASC');
    }

    const results = await query.getRawMany();
    let formattedResults = [];
    for (let index = 0; index < results.length; index++) {
      const element = results[index];
      const {
        ccaliBizLargeTypeCd,
        ccaliBizLargeTypeNm,
        ccaliBizTypeId,
        ccaliBizTypeCd,
        ccaliBizTypeNm,
        ntsBizLargeTypeCd,
        ntsBizLargeTypeNm,
        ntsBizTypeId,
        ntsBizTypeCd,
        ntsBizTypeNm,
      } = element;

      let tmpBizLargeInfo: any = {};
      let tmpBizTypeInfo: any = {};

      if (type == 'ccali') {
        if (index == 0) {
          tmpBizTypeInfo = {
            ccaliBizTypeId: parseInt(ccaliBizTypeId),
            ccaliBizTypeCd,
            ccaliBizTypeNm,
          };
          tmpBizLargeInfo = {
            ccaliBizLargeTypeCd,
            ccaliBizLargeTypeNm,
            ccaliBizTypeData: [tmpBizTypeInfo],
          };
          formattedResults.push(tmpBizLargeInfo);
        } else {
          if (
            formattedResults[formattedResults.length - 1].ccaliBizLargeTypeCd ==
            ccaliBizLargeTypeCd
          ) {
            tmpBizTypeInfo = {
              ccaliBizTypeId: parseInt(ccaliBizTypeId),
              ccaliBizTypeCd,
              ccaliBizTypeNm,
            };
            formattedResults[formattedResults.length - 1].ccaliBizTypeData.push(
              tmpBizTypeInfo,
            );
          } else {
            tmpBizTypeInfo = {
              ccaliBizTypeId: parseInt(ccaliBizTypeId),
              ccaliBizTypeCd,
              ccaliBizTypeNm,
            };
            tmpBizLargeInfo = {
              ccaliBizLargeTypeCd,
              ccaliBizLargeTypeNm,
              ccaliBizTypeData: [tmpBizTypeInfo],
            };
            formattedResults.push(tmpBizLargeInfo);
          }
        }
      } else if (type == 'nts') {
        if (index == 0) {
          tmpBizTypeInfo = {
            ntsBizTypeId: parseInt(ntsBizTypeId),
            ntsBizTypeCd,
            ntsBizTypeNm,
          };
          tmpBizLargeInfo = {
            ntsBizLargeTypeCd,
            ntsBizLargeTypeNm,
            ntsBizTypeData: [tmpBizTypeInfo],
          };
          formattedResults.push(tmpBizLargeInfo);
        } else {
          if (
            formattedResults[formattedResults.length - 1].ntsBizLargeTypeCd ==
            ntsBizLargeTypeCd
          ) {
            tmpBizTypeInfo = {
              ntsBizTypeId: parseInt(ntsBizTypeId),
              ntsBizTypeCd,
              ntsBizTypeNm,
            };
            formattedResults[formattedResults.length - 1].ntsBizTypeData.push(
              tmpBizTypeInfo,
            );
          } else {
            tmpBizTypeInfo = {
              ntsBizTypeId: parseInt(ntsBizTypeId),
              ntsBizTypeCd,
              ntsBizTypeNm,
            };
            tmpBizLargeInfo = {
              ntsBizLargeTypeCd,
              ntsBizLargeTypeNm,
              ntsBizTypeData: [tmpBizTypeInfo],
            };
            formattedResults.push(tmpBizLargeInfo);
          }
        }
      }
    }

    return formattedResults;
  }

  async selectDefaultCoverageLimit(salesCost: number) {
    const query = this.ccaliSalesCoverageLimitDefaultMapRepository
      .createQueryBuilder('map')
      .select('coverageLimit.per_acdnt_cvrg_limit', 'perAccidentCoverageLimit')
      .addSelect('coverageLimit.tot_cvrg_limit', 'totCoverageLimit')
      .innerJoin(
        (subQuery) => {
          return subQuery.select('csc.*').from(CcaliSalesCost, 'csc');
        },
        'salesCost',
        'map.sales_cst_id = salesCost.id',
      )
      .innerJoin(
        (subQuery) => {
          return subQuery.select('ccl.*').from(CcaliCoverageLimit, 'ccl');
        },
        'coverageLimit',
        'map.cvrg_limit_id = coverageLimit.id',
      )
      .where('1=1')
      .andWhere('salesCost.min_sales_cst <= :salesCost', { salesCost })
      .andWhere('salesCost.max_sales_cst > :salesCost', { salesCost });

    const results = await query.getRawMany();
    const formattedResults = results.map((result) => ({
      ...result,
      perAccidentCoverageLimit: parseInt(result.perAccidentCoverageLimit),
      totCoverageLimit: parseInt(result.totCoverageLimit),
    }));

    return formattedResults;
  }

  async selectInsCost({
    insProdId,
    planId,
    bizSmallTypeCd,
    employeeCnt,
    perAccidentCoverageLimit,
    totCoverageLimit,
    salesCost,
  }: SelectInsCostDto) {
    const query = this.ccaliInsCostRepository
      .createQueryBuilder('cost')
      .select('cost.ins_cst', 'insCost')
      .addSelect('cost.sales_cst_cd', 'salesCostCd')
      .addSelect(
        'coverageLimit.per_acdnt_cvrg_limit',
        'perAccidentCoverageLimit',
      )
      .addSelect('coverageLimit.tot_cvrg_limit', 'totCoverageLimit')
      .addSelect('coverageLimit.id', 'coverageLimitId')
      .leftJoin(
        (subQuery) => {
          return subQuery.select('cec.*').from(CcaliEmployeeCnt, 'cec');
        },
        'employeeCnt',
        'cost.emp_cnt_id = employeeCnt.id',
      )
      .leftJoin(
        (subQuery) => {
          return subQuery.select('ccl.*').from(CcaliCoverageLimit, 'ccl');
        },
        'coverageLimit',
        'cost.cvrg_limit_id = coverageLimit.id',
      )
      .where('employeeCnt.ins_prod_id = :insProdId', {
        insProdId,
      })
      .andWhere('employeeCnt.min_emp_cnt <= :employeeCnt', {
        employeeCnt,
      })
      .andWhere('employeeCnt.max_emp_cnt > :employeeCnt', {
        employeeCnt,
      })
      .andWhere('coverageLimit.ins_prod_id = :insProdId', {
        insProdId,
      })
      .andWhere('cost.plan_id = :planId', {
        planId,
      })
      .andWhere('cost.biz_small_type_cd = :bizSmallTypeCd', {
        bizSmallTypeCd,
      });

    // 조건적으로 적용
    if (perAccidentCoverageLimit != null && perAccidentCoverageLimit != 0) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where(
            'coverageLimit.per_acdnt_cvrg_limit = :perAccidentCoverageLimit',
            { perAccidentCoverageLimit },
          );
        }),
      );
    }
    if (totCoverageLimit != null && totCoverageLimit != 0) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('coverageLimit.tot_cvrg_limit = :totCoverageLimit', {
            totCoverageLimit,
          });
        }),
      );
    }

    const results = await query.getRawMany();
    let formattedResults = [];
    for (let index = 0; index < results.length; index++) {
      const element = results[index];
      const {
        insCost,
        salesCostCd,
        perAccidentCoverageLimit,
        totCoverageLimit,
        coverageLimitId,
      } = element;

      let tmp = {
        insCost: parseInt(insCost),
        salesCostCd,
        perAccidentCoverageLimit: parseInt(perAccidentCoverageLimit),
        totCoverageLimit: parseInt(totCoverageLimit),
        coverageLimitId: parseInt(coverageLimitId),
      };

      if (salesCostCd == '1') {
        if (salesCost != null && salesCost <= 10000000000) {
          formattedResults.push(tmp);
        }
      } else if (salesCostCd == '2') {
        if (
          salesCost != null &&
          salesCost > 10000000000 &&
          salesCost <= 100000000000
        ) {
          formattedResults.push(tmp);
        }
      } else {
        formattedResults.push(tmp);
      }
    }

    return formattedResults;
  }

  async selectInsProdComPlanByPlanId(planId: number, joinAccount: string) {
    const query = this.ccaliPlanRepository
      .createQueryBuilder('plan')
      .select('plan.id', 'planId')
      .addSelect('plan.plan_type', 'planType')
      .addSelect('plan.plan_nm', 'planNm')
      .addSelect('prod.id', 'insProdId')
      .addSelect('prod.ins_prod_cd', 'insProdCd')
      .addSelect('prod.ins_prod_nm', 'insProdNm')
      .addSelect('prod.ins_prod_full_nm', 'insProdFullNm')
      .addSelect('com.ins_com_cd', 'insComCd')
      .addSelect('com.ins_com_nm', 'insComNm')
      .addSelect('com.ins_com_full_nm', 'insComFullNm')
      .leftJoin(
        (subQuery) => {
          return subQuery.select('ins_prod.*').from(InsProd, 'ins_prod');
        },
        'prod',
        'plan.ins_prod_id = prod.id',
      );

    if (joinAccount == 'SK엠앤서비스') {
      query.leftJoin(
        (subQuery) => {
          return subQuery.select('ins_com.*').from(InsCom, 'ins_com');
        },
        'com',
        '"MR" = com.ins_com_cd',
      );
    } else {
      query.leftJoin(
        (subQuery) => {
          return subQuery.select('ins_com.*').from(InsCom, 'ins_com');
        },
        'com',
        'prod.ins_com_cd = com.ins_com_cd',
      );
    }

    query.where('plan.id = :planId', { planId });

    const results = await query.getRawOne();
    return results;
  }

  async selectCoverageLimitListByPlanId(planId: number) {
    const query = this.ccaliCoverageLimitRepository
      .createQueryBuilder('coverage')
      .select('coverage.id', 'coverageLimitId')
      .addSelect('coverage.per_acdnt_cvrg_limit', 'perAccidentCoverageLimit')
      .addSelect('coverage.tot_cvrg_limit', 'totCoverageLimit');

    if (planId < 5) {
      query.where('coverage.id <= 4');
    } else {
      query.where('coverage.id >= 2');
    }

    query.orderBy('coverage.sort_seq', 'ASC');

    const results = await query.getRawMany();
    const formattedResults = results.map((result) => ({
      coverageLimitId: parseInt(result.coverageLimitId),
      perAccidentCoverageLimit: parseInt(result.perAccidentCoverageLimit),
      totCoverageLimit: parseInt(result.totCoverageLimit),
    }));
    return formattedResults;
  }

  async selectOneCoverageLimitById(coverageLimitId: number) {
    return await this.ccaliCoverageLimitRepository.findOne({
      where: {
        id: coverageLimitId,
      },
    });
  }

  async selectOneCcaliBizTypeByBizSmallTypeCd(bizSmallTypeCd: string) {
    return await this.ccaliBizTypeRepository.findOne({
      where: {
        bizSmallTypeCd,
      },
    });
  }

  async selectOneNtsBizTypeByBizSmallTypeCd(bizSubSubTypeCd: string) {
    return await this.ntsBizTypeRepository.findOne({
      where: {
        bizSubSubTypeCd,
      },
    });
  }

  async selectNtsBizTypeByKoreaBizType(koreaBizTypeCd: string) {
    const query = this.ntsKoreaBizTypeMapRepository
      .createQueryBuilder('map')
      .select('nts.biz_large_type_cd', 'ntsBizLargeTypeCd')
      .addSelect('nts.biz_large_type_nm', 'ntsBizLargeTypeNm')
      .addSelect('nts.id', 'ntsBizTypeId')
      .addSelect('nts.biz_sub_sub_type_cd', 'ntsBizTypeCd')
      .addSelect('nts.biz_sub_sub_type_nm', 'ntsBizTypeNm')
      .addSelect('kor.large_type_cd', 'korBizLargeTypeCd')
      .addSelect('kor.large_type_nm', 'korBizLargeTypeNm')
      .addSelect('kor.seq_no', 'korBizTypeId')
      .addSelect('kor.sub_sub_type_cd', 'korBizTypeCd')
      .addSelect('kor.sub_sub_type_nm', 'korBizTypeNm')
      .innerJoin(
        (subQuery) => {
          return subQuery.select('nbt.*').from(NtsBizType, 'nbt');
        },
        'nts',
        'map.nts_biz_type_id = nts.id',
      )
      .innerJoin(
        (subQuery) => {
          return subQuery.select('kbi.*').from(KoreaBusinessInfo, 'kbi');
        },
        'kor',
        'map.kor_biz_type_id = kor.seq_no',
      )
      .where('kor.sub_sub_type_cd = :koreaBizTypeCd', { koreaBizTypeCd });

    query
      .orderBy('nts.biz_large_type_cd', 'ASC')
      .addOrderBy('nts.biz_medium_type_cd', 'ASC')
      .addOrderBy('nts.biz_small_type_cd', 'ASC')
      .addOrderBy('nts.biz_sub_type_cd', 'ASC')
      .addOrderBy('nts.biz_sub_sub_type_cd', 'ASC');

    const results = await query.getRawMany();
    let formattedResults = [];
    for (let index = 0; index < results.length; index++) {
      const element = results[index];
      const {
        ntsBizLargeTypeCd,
        ntsBizLargeTypeNm,
        ntsBizTypeId,
        ntsBizTypeCd,
        ntsBizTypeNm,
        korBizLargeTypeCd,
        korBizLargeTypeNm,
        korBizTypeId,
        korBizTypeCd,
        korBizTypeNm,
      } = element;

      let tmpBizLargeInfo: any = {};
      let tmpBizTypeInfo: any = {};

      if (index == 0) {
        tmpBizTypeInfo = {
          ntsBizTypeId: parseInt(ntsBizTypeId),
          ntsBizTypeCd,
          ntsBizTypeNm,
        };
        tmpBizLargeInfo = {
          ntsBizLargeTypeCd,
          ntsBizLargeTypeNm,
          ntsBizTypeData: [tmpBizTypeInfo],
        };
        formattedResults.push(tmpBizLargeInfo);
      } else {
        if (
          formattedResults[formattedResults.length - 1].ntsBizLargeTypeCd ==
          ntsBizLargeTypeCd
        ) {
          tmpBizTypeInfo = {
            ntsBizTypeId: parseInt(ntsBizTypeId),
            ntsBizTypeCd,
            ntsBizTypeNm,
          };
          formattedResults[formattedResults.length - 1].ntsBizTypeData.push(
            tmpBizTypeInfo,
          );
        } else {
          tmpBizTypeInfo = {
            ntsBizTypeId: parseInt(ntsBizTypeId),
            ntsBizTypeCd,
            ntsBizTypeNm,
          };
          tmpBizLargeInfo = {
            ntsBizLargeTypeCd,
            ntsBizLargeTypeNm,
            ntsBizTypeData: [tmpBizTypeInfo],
          };
          formattedResults.push(tmpBizLargeInfo);
        }
      }
    }

    return formattedResults;
  }

  async selectCcaliBizTypeByKoreaBizType(koreaBizTypeCd: string) {
    const query = this.ccaliKoreaBizTypeMapRepository
      .createQueryBuilder('map')
      .select('ccali.biz_large_type_cd', 'ccaliBizLargeTypeCd')
      .addSelect('ccali.biz_large_type_nm', 'ccaliBizLargeTypeNm')
      .addSelect('ccali.biz_small_type_id', 'ccaliBizTypeId')
      .addSelect('ccali.biz_small_type_cd', 'ccaliBizTypeCd')
      .addSelect('ccali.biz_small_type_nm', 'ccaliBizTypeNm')
      .addSelect('kor.large_type_cd', 'korBizLargeTypeCd')
      .addSelect('kor.large_type_nm', 'korBizLargeTypeNm')
      .addSelect('kor.seq_no', 'korBizTypeId')
      .addSelect('kor.sub_sub_type_cd', 'korBizTypeCd')
      .addSelect('kor.sub_sub_type_nm', 'korBizTypeNm')
      .innerJoin(
        (subQuery) => {
          return subQuery
            .select('ccali2.*')
            .from(CcaliNtsBizTypeMap, 'ccali_nts_map')
            .innerJoin(
              (subQuery) => {
                return subQuery.select('cbt.*').from(CcaliBizTypeView, 'cbt');
              },
              'ccali2',
              'ccali_nts_map.ccali_biz_type_id = ccali2.biz_small_type_id',
            )
            .innerJoin(
              (subQuery) => {
                return subQuery.select('nbt.*').from(NtsBizType, 'nbt');
              },
              'nts',
              'ccali_nts_map.nts_biz_type_id = nts.id',
            )
            .groupBy('ccali2.biz_large_type_cd')
            .addGroupBy('ccali2.biz_small_type_cd');
        },
        'ccali',
        'map.ccali_biz_type_id = ccali.biz_small_type_id',
      )
      .innerJoin(
        (subQuery) => {
          return subQuery.select('kbi.*').from(KoreaBusinessInfo, 'kbi');
        },
        'kor',
        'map.kor_biz_type_id = kor.seq_no',
      )
      .where('kor.sub_sub_type_cd = :koreaBizTypeCd', { koreaBizTypeCd });

    query
      .orderBy('ccali.biz_large_type_cd', 'ASC')
      .addOrderBy('ccali.biz_medium_type_cd', 'ASC')
      .addOrderBy('ccali.biz_small_type_cd', 'ASC');

    const results = await query.getRawMany();
    let formattedResults = [];
    for (let index = 0; index < results.length; index++) {
      const element = results[index];
      const {
        ccaliBizLargeTypeCd,
        ccaliBizLargeTypeNm,
        ccaliBizTypeId,
        ccaliBizTypeCd,
        ccaliBizTypeNm,
        korBizLargeTypeCd,
        korBizLargeTypeNm,
        korBizTypeId,
        korBizTypeCd,
        korBizTypeNm,
      } = element;

      let tmpBizLargeInfo: any = {};
      let tmpBizTypeInfo: any = {};

      if (index == 0) {
        tmpBizTypeInfo = {
          ccaliBizTypeId: parseInt(ccaliBizTypeId),
          ccaliBizTypeCd,
          ccaliBizTypeNm,
        };
        tmpBizLargeInfo = {
          ccaliBizLargeTypeCd,
          ccaliBizLargeTypeNm,
          ccaliBizTypeData: [tmpBizTypeInfo],
        };
        formattedResults.push(tmpBizLargeInfo);
      } else {
        if (
          formattedResults[formattedResults.length - 1].ccaliBizLargeTypeCd ==
          ccaliBizLargeTypeCd
        ) {
          tmpBizTypeInfo = {
            ccaliBizTypeId: parseInt(ccaliBizTypeId),
            ccaliBizTypeCd,
            ccaliBizTypeNm,
          };
          formattedResults[formattedResults.length - 1].ccaliBizTypeData.push(
            tmpBizTypeInfo,
          );
        } else {
          tmpBizTypeInfo = {
            ccaliBizTypeId: parseInt(ccaliBizTypeId),
            ccaliBizTypeCd,
            ccaliBizTypeNm,
          };
          tmpBizLargeInfo = {
            ccaliBizLargeTypeCd,
            ccaliBizLargeTypeNm,
            ccaliBizTypeData: [tmpBizTypeInfo],
          };
          formattedResults.push(tmpBizLargeInfo);
        }
      }
    }

    return formattedResults;
  }

  async selectCcaliNtsBizTypeByKoreaBizType(koreaBizTypeCd: string) {
    const query = this.ccaliKoreaBizTypeMapRepository
      .createQueryBuilder('map')
      .select('map.ccali_biz_type_id', 'ccaliBizTypeId')
      .addSelect('ccali.biz_large_type_cd', 'ccaliBizLargeTypeCd')
      .addSelect('ccali.biz_large_type_nm', 'ccaliBizLargeTypeNm')
      .addSelect('ccali.biz_medium_type_cd', 'ccaliBizMediumTypeCd')
      .addSelect('ccali.biz_medium_type_nm', 'ccaliBizMediumTypeNm')
      .addSelect('ccali.biz_small_type_cd', 'ccaliBizTypeCd')
      .addSelect('ccali.biz_small_type_nm', 'ccaliBizTypeNm')
      .addSelect('ccali.indst_dstr_indiv_yn', 'indstDstrIndivYn')
      .addSelect('ccali.civil_dstr_indiv_yn', 'civilDstrIndivYn')
      .addSelect('nts_kor.nts_biz_type_id', 'ntsBizTypeId')
      .addSelect('nts_kor.nts_biz_large_type_cd', 'ntsBizLargeTypeCd')
      .addSelect('nts_kor.nts_biz_large_type_nm', 'ntsBizLargeTypeNm')
      .addSelect('nts_kor.nts_biz_medium_type_cd', 'ntsBizMediumTypeCd')
      .addSelect('nts_kor.nts_biz_medium_type_nm', 'ntsBizMediumTypeNm')
      .addSelect('nts_kor.nts_biz_small_type_cd', 'ntsBizSmallTypeCd')
      .addSelect('nts_kor.nts_biz_small_type_nm', 'ntsBizSmallTypeNm')
      .addSelect('nts_kor.nts_biz_sub_type_cd', 'ntsBizSubTypeCd')
      .addSelect('nts_kor.nts_biz_sub_type_nm', 'ntsBizSubTypeNm')
      .addSelect('nts_kor.nts_biz_sub_sub_type_cd', 'ntsBizTypeCd')
      .addSelect('nts_kor.nts_biz_sub_sub_type_nm', 'ntsBizTypeNm')
      .addSelect('nts_kor.kor_biz_type_id', 'korBizTypeId')
      .addSelect('nts_kor.kor_biz_large_type_cd', 'korBizLargeTypeCd')
      .addSelect('nts_kor.kor_biz_large_type_nm', 'korBizLargeTypeNm')
      .addSelect('nts_kor.kor_biz_mediuim_type_cd', 'korBizMediuimTypeCd')
      .addSelect('nts_kor.kor_biz_medium_type_nm', 'korBizMediumTypeNm')
      .addSelect('nts_kor.kor_biz_small_type_cd', 'korBizSmallTypeCd')
      .addSelect('nts_kor.kor_biz_small_type_nm', 'korBizSmallTypeNm')
      .addSelect('nts_kor.kor_biz_sub_type_cd', 'korBizSubTypeCd')
      .addSelect('nts_kor.kor_biz_sub_type_nm', 'korBizSubTypeNm')
      .addSelect('nts_kor.kor_biz_sub_sub_type_cd', 'korBizTypeCd')
      .addSelect('nts_kor.kor_biz_sub_sub_type_nm', 'korBizTypeNm')
      .innerJoin(
        (subQuery) => {
          return subQuery.select('cbt.*').from(CcaliBizTypeView, 'cbt');
        },
        'ccali',
        'map.ccali_biz_type_id = ccali.biz_small_type_id',
      )
      .innerJoin(
        (subQuery) => {
          return subQuery.select('kbi.*').from(KoreaBusinessInfo, 'kbi');
        },
        'kor',
        'map.kor_biz_type_id = kor.seq_no',
      )
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select('map2.nts_biz_type_id')
            .addSelect('nts2.biz_large_type_cd', 'nts_biz_large_type_cd')
            .addSelect('nts2.biz_large_type_nm', 'nts_biz_large_type_nm')
            .addSelect('nts2.biz_medium_type_cd', 'nts_biz_medium_type_cd')
            .addSelect('nts2.biz_medium_type_nm', 'nts_biz_medium_type_nm')
            .addSelect('nts2.biz_small_type_cd', 'nts_biz_small_type_cd')
            .addSelect('nts2.biz_small_type_nm', 'nts_biz_small_type_nm')
            .addSelect('nts2.biz_sub_type_cd', 'nts_biz_sub_type_cd')
            .addSelect('nts2.biz_sub_type_nm', 'nts_biz_sub_type_nm')
            .addSelect('nts2.biz_sub_sub_type_cd', 'nts_biz_sub_sub_type_cd')
            .addSelect('nts2.biz_sub_sub_type_nm', 'nts_biz_sub_sub_type_nm')
            .addSelect('map2.kor_biz_type_id')
            .addSelect('kor2.large_type_cd', 'kor_biz_large_type_cd')
            .addSelect('kor2.large_type_nm', 'kor_biz_large_type_nm')
            .addSelect('kor2.medium_type_cd', 'kor_biz_mediuim_type_cd')
            .addSelect('kor2.medium_type_nm', 'kor_biz_medium_type_nm')
            .addSelect('kor2.small_type_cd', 'kor_biz_small_type_cd')
            .addSelect('kor2.small_type_nm', 'kor_biz_small_type_nm')
            .addSelect('kor2.sub_type_cd', 'kor_biz_sub_type_cd')
            .addSelect('kor2.sub_type_nm', 'kor_biz_sub_type_nm')
            .addSelect('kor2.sub_sub_type_cd', 'kor_biz_sub_sub_type_cd')
            .addSelect('kor2.sub_sub_type_nm', 'kor_biz_sub_sub_type_nm')
            .from(NtsKoreaBizTypeMap, 'map2')
            .innerJoin(
              (subQuery) => {
                return subQuery.select('nbt2.*').from(NtsBizType, 'nbt2');
              },
              'nts2',
              'map2.nts_biz_type_id = nts2.id',
            )
            .innerJoin(
              (subQuery) => {
                return subQuery
                  .select('kbi2.*')
                  .from(KoreaBusinessInfo, 'kbi2');
              },
              'kor2',
              'map2.kor_biz_type_id = kor2.seq_no',
            );
        },
        'nts_kor',
        'map.kor_biz_type_id = nts_kor.kor_biz_type_id',
      )
      .where('kor.sub_sub_type_cd = :koreaBizTypeCd', { koreaBizTypeCd });

    query
      .orderBy('ccali.biz_large_type_cd', 'ASC')
      .addOrderBy('ccali.biz_small_type_cd', 'ASC')
      .addOrderBy('nts_kor.nts_biz_large_type_cd', 'ASC')
      .addOrderBy('nts_kor.nts_biz_sub_sub_type_cd', 'ASC');

    const results = await query.getRawMany();
    let formattedResult = {
      ccali: [],
      nts: [],
    };
    for (let index = 0; index < results.length; index++) {
      const element = results[index];
      const {
        ccaliBizLargeTypeCd,
        ccaliBizLargeTypeNm,
        ccaliBizMediumTypeCd,
        ccaliBizMediumTypeNm,
        ccaliBizTypeId,
        ccaliBizTypeCd,
        ccaliBizTypeNm,
        indstDstrIndivYn,
        civilDstrIndivYn,
        ntsBizLargeTypeCd,
        ntsBizLargeTypeNm,
        ntsBizMediumTypeCd,
        ntsBizMediumTypeNm,
        ntsBizSmallTypeCd,
        ntsBizSmallTypeNm,
        ntsBizSubTypeCd,
        ntsBizSubTypeNm,
        ntsBizTypeId,
        ntsBizTypeCd,
        ntsBizTypeNm,
        korBizLargeTypeCd,
        korBizLargeTypeNm,
        korBizMediuimTypeCd,
        korBizMediumTypeNm,
        korBizSmallTypeCd,
        korBizSmallTypeNm,
        korBizSubTypeCd,
        korBizSubTypeNm,
        korBizTypeId,
        korBizTypeCd,
        korBizTypeNm,
      } = element;

      let tmpCcaliBizLargeInfo: any = {};
      let tmpCcaliBizTypeInfo: any = {};

      let tmpNtsBizLargeInfo: any = {};
      let tmpNtsBizTypeInfo: any = {};

      // let tmpKorBizLargeInfo: any = {};
      // let tmpKorBizTypeInfo: any = {};

      if (index == 0) {
        tmpCcaliBizTypeInfo = {
          ccaliBizTypeId: parseInt(ccaliBizTypeId),
          ccaliBizTypeCd,
          ccaliBizTypeNm,
        };
        tmpCcaliBizLargeInfo = {
          ccaliBizLargeTypeCd,
          ccaliBizLargeTypeNm,
          ccaliBizTypeData: [tmpCcaliBizTypeInfo],
        };
        formattedResult.ccali.push(tmpCcaliBizLargeInfo);

        tmpNtsBizTypeInfo = {
          ntsBizTypeId: parseInt(ntsBizTypeId),
          ntsBizTypeCd,
          ntsBizTypeNm,
        };
        tmpNtsBizLargeInfo = {
          ntsBizLargeTypeCd,
          ntsBizLargeTypeNm,
          ntsBizTypeData: [tmpNtsBizTypeInfo],
        };
        formattedResult.nts.push(tmpNtsBizLargeInfo);

        // tmpKorBizTypeInfo = {
        //   korBizTypeId: parseInt(korBizTypeId),
        //   korBizTypeCd,
        //   korBizTypeNm,
        // };
        // tmpKorBizLargeInfo = {
        //   korBizLargeTypeCd,
        //   korBizLargeTypeNm,
        //   korBizTypeData: [tmpKorBizTypeInfo],
        // };
        // formattedResult.kor.push(tmpKorBizLargeInfo)
      } else {
        if (
          formattedResult.ccali[formattedResult.ccali.length - 1]
            .ccaliBizLargeTypeCd == ccaliBizLargeTypeCd
        ) {
          if (
            formattedResult.ccali[formattedResult.ccali.length - 1]
              .ccaliBizTypeData[
              formattedResult.ccali[formattedResult.ccali.length - 1]
                .ccaliBizTypeData.length - 1
            ].ccaliBizTypeId != parseInt(ccaliBizTypeId)
          ) {
            tmpCcaliBizTypeInfo = {
              ccaliBizTypeId: parseInt(ccaliBizTypeId),
              ccaliBizTypeCd,
              ccaliBizTypeNm,
            };
            formattedResult.ccali[
              formattedResult.ccali.length - 1
            ].ccaliBizTypeData.push(tmpCcaliBizTypeInfo);

            formattedResult.ccali[
              formattedResult.ccali.length - 1
            ].ccaliBizTypeData.sort(
              (a, b) => a.ccaliBizTypeId - b.ccaliBizTypeId,
            );
          }
        } else if (
          formattedResult.ccali[formattedResult.ccali.length - 1]
            .ccaliBizLargeTypeCd != ccaliBizLargeTypeCd
        ) {
          tmpCcaliBizTypeInfo = {
            ccaliBizTypeId: parseInt(ccaliBizTypeId),
            ccaliBizTypeCd,
            ccaliBizTypeNm,
          };
          tmpCcaliBizLargeInfo = {
            ccaliBizLargeTypeCd,
            ccaliBizLargeTypeNm,
            ccaliBizTypeData: [tmpCcaliBizTypeInfo],
          };
          formattedResult.ccali.push(tmpCcaliBizLargeInfo);
        }

        if (
          formattedResult.nts[formattedResult.nts.length - 1]
            .ntsBizLargeTypeCd == ntsBizLargeTypeCd
        ) {
          if (
            formattedResult.nts[formattedResult.nts.length - 1].ntsBizTypeData[
              formattedResult.nts[formattedResult.nts.length - 1].ntsBizTypeData
                .length - 1
            ].ntsBizTypeId != parseInt(ntsBizTypeId)
          ) {
            tmpNtsBizTypeInfo = {
              ntsBizTypeId: parseInt(ntsBizTypeId),
              ntsBizTypeCd,
              ntsBizTypeNm,
            };
            formattedResult.nts[
              formattedResult.nts.length - 1
            ].ntsBizTypeData.push(tmpNtsBizTypeInfo);

            formattedResult.nts[
              formattedResult.nts.length - 1
            ].ntsBizTypeData.sort((a, b) => a.ntsBizTypeId - b.ntsBizTypeId);
          }
        } else if (
          formattedResult.nts[formattedResult.nts.length - 1]
            .ntsBizLargeTypeCd != ntsBizLargeTypeCd
        ) {
          tmpNtsBizTypeInfo = {
            ntsBizTypeId: parseInt(ntsBizTypeId),
            ntsBizTypeCd,
            ntsBizTypeNm,
          };
          tmpNtsBizLargeInfo = {
            ntsBizLargeTypeCd,
            ntsBizLargeTypeNm,
            ntsBizTypeData: [tmpNtsBizTypeInfo],
          };
          formattedResult.nts.push(tmpNtsBizLargeInfo);
        }
      }
    }

    return formattedResult;
  }

  async selectCcaliNtsBizTypeListByBizTypeId(type: string, bizTypeId: number) {
    const query = this.ccaliKoreaBizTypeMapRepository
      .createQueryBuilder('map')
      .select('map.ccali_biz_type_id', 'ccaliBizTypeId')
      .addSelect('ccali.biz_large_type_cd', 'ccaliBizLargeTypeCd')
      .addSelect('ccali.biz_large_type_nm', 'ccaliBizLargeTypeNm')
      .addSelect('ccali.biz_medium_type_cd', 'ccaliBizMediumTypeCd')
      .addSelect('ccali.biz_medium_type_nm', 'ccaliBizMediumTypeNm')
      .addSelect('ccali.biz_small_type_cd', 'ccaliBizTypeCd')
      .addSelect('ccali.biz_small_type_nm', 'ccaliBizTypeNm')
      .addSelect('ccali.indst_dstr_indiv_yn', 'indstDstrIndivYn')
      .addSelect('ccali.civil_dstr_indiv_yn', 'civilDstrIndivYn')
      .addSelect('nts_kor.nts_biz_type_id', 'ntsBizTypeId')
      .addSelect('nts_kor.nts_biz_large_type_cd', 'ntsBizLargeTypeCd')
      .addSelect('nts_kor.nts_biz_large_type_nm', 'ntsBizLargeTypeNm')
      .addSelect('nts_kor.nts_biz_medium_type_cd', 'ntsBizMediumTypeCd')
      .addSelect('nts_kor.nts_biz_medium_type_nm', 'ntsBizMediumTypeNm')
      .addSelect('nts_kor.nts_biz_small_type_cd', 'ntsBizSmallTypeCd')
      .addSelect('nts_kor.nts_biz_small_type_nm', 'ntsBizSmallTypeNm')
      .addSelect('nts_kor.nts_biz_sub_type_cd', 'ntsBizSubTypeCd')
      .addSelect('nts_kor.nts_biz_sub_type_nm', 'ntsBizSubTypeNm')
      .addSelect('nts_kor.nts_biz_sub_sub_type_cd', 'ntsBizTypeCd')
      .addSelect('nts_kor.nts_biz_sub_sub_type_nm', 'ntsBizTypeNm')
      .addSelect('nts_kor.kor_biz_type_id', 'korBizTypeId')
      .addSelect('nts_kor.kor_biz_large_type_cd', 'korBizLargeTypeCd')
      .addSelect('nts_kor.kor_biz_large_type_nm', 'korBizLargeTypeNm')
      .addSelect('nts_kor.kor_biz_mediuim_type_cd', 'korBizMediuimTypeCd')
      .addSelect('nts_kor.kor_biz_medium_type_nm', 'korBizMediumTypeNm')
      .addSelect('nts_kor.kor_biz_small_type_cd', 'korBizSmallTypeCd')
      .addSelect('nts_kor.kor_biz_small_type_nm', 'korBizSmallTypeNm')
      .addSelect('nts_kor.kor_biz_sub_type_cd', 'korBizSubTypeCd')
      .addSelect('nts_kor.kor_biz_sub_type_nm', 'korBizSubTypeNm')
      .addSelect('nts_kor.kor_biz_sub_sub_type_cd', 'korBizTypeCd')
      .addSelect('nts_kor.kor_biz_sub_sub_type_nm', 'korBizTypeNm')
      .innerJoin(
        (subQuery) => {
          return subQuery.select('cbt.*').from(CcaliBizTypeView, 'cbt');
        },
        'ccali',
        'map.ccali_biz_type_id = ccali.biz_small_type_id',
      )
      .innerJoin(
        (subQuery) => {
          return subQuery.select('kbi.*').from(KoreaBusinessInfo, 'kbi');
        },
        'kor',
        'map.kor_biz_type_id = kor.seq_no',
      )
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select('map2.nts_biz_type_id')
            .addSelect('nts2.biz_large_type_cd', 'nts_biz_large_type_cd')
            .addSelect('nts2.biz_large_type_nm', 'nts_biz_large_type_nm')
            .addSelect('nts2.biz_medium_type_cd', 'nts_biz_medium_type_cd')
            .addSelect('nts2.biz_medium_type_nm', 'nts_biz_medium_type_nm')
            .addSelect('nts2.biz_small_type_cd', 'nts_biz_small_type_cd')
            .addSelect('nts2.biz_small_type_nm', 'nts_biz_small_type_nm')
            .addSelect('nts2.biz_sub_type_cd', 'nts_biz_sub_type_cd')
            .addSelect('nts2.biz_sub_type_nm', 'nts_biz_sub_type_nm')
            .addSelect('nts2.biz_sub_sub_type_cd', 'nts_biz_sub_sub_type_cd')
            .addSelect('nts2.biz_sub_sub_type_nm', 'nts_biz_sub_sub_type_nm')
            .addSelect('map2.kor_biz_type_id')
            .addSelect('kor2.large_type_cd', 'kor_biz_large_type_cd')
            .addSelect('kor2.large_type_nm', 'kor_biz_large_type_nm')
            .addSelect('kor2.medium_type_cd', 'kor_biz_mediuim_type_cd')
            .addSelect('kor2.medium_type_nm', 'kor_biz_medium_type_nm')
            .addSelect('kor2.small_type_cd', 'kor_biz_small_type_cd')
            .addSelect('kor2.small_type_nm', 'kor_biz_small_type_nm')
            .addSelect('kor2.sub_type_cd', 'kor_biz_sub_type_cd')
            .addSelect('kor2.sub_type_nm', 'kor_biz_sub_type_nm')
            .addSelect('kor2.sub_sub_type_cd', 'kor_biz_sub_sub_type_cd')
            .addSelect('kor2.sub_sub_type_nm', 'kor_biz_sub_sub_type_nm')
            .from(NtsKoreaBizTypeMap, 'map2')
            .innerJoin(
              (subQuery) => {
                return subQuery.select('nbt2.*').from(NtsBizType, 'nbt2');
              },
              'nts2',
              'map2.nts_biz_type_id = nts2.id',
            )
            .innerJoin(
              (subQuery) => {
                return subQuery
                  .select('kbi2.*')
                  .from(KoreaBusinessInfo, 'kbi2');
              },
              'kor2',
              'map2.kor_biz_type_id = kor2.seq_no',
            );
        },
        'nts_kor',
        'map.kor_biz_type_id = nts_kor.kor_biz_type_id',
      );

    if (type == 'ccali') {
      query.where('map.ccali_biz_type_id = :bizTypeId', { bizTypeId });
      // .groupBy('nts_kor.nts_biz_large_type_cd')
      // .addGroupBy('nts_kor.nts_biz_sub_sub_type_cd');
    } else if (type == 'nts') {
      query.where('nts_kor.nts_biz_type_id = :bizTypeId', { bizTypeId });
      // .groupBy('ccali.biz_large_type_cd')
      // .addGroupBy('ccali.biz_small_type_cd');
    }

    if (type == 'nts') {
      query
        .orderBy('ccali.biz_large_type_cd', 'ASC')
        .addOrderBy('ccali.biz_small_type_cd', 'ASC');
    } else if (type == 'ccali') {
      query
        .orderBy('nts_kor.nts_biz_large_type_cd', 'ASC')
        .addOrderBy('nts_kor.nts_biz_sub_sub_type_cd', 'ASC');
    }

    const results = await query.getRawMany();
    let formattedResult = {
      ccali: [],
      nts: [],
    };
    for (let index = 0; index < results.length; index++) {
      const element = results[index];
      const {
        ccaliBizLargeTypeCd,
        ccaliBizLargeTypeNm,
        ccaliBizMediumTypeCd,
        ccaliBizMediumTypeNm,
        ccaliBizTypeId,
        ccaliBizTypeCd,
        ccaliBizTypeNm,
        indstDstrIndivYn,
        civilDstrIndivYn,
        ntsBizLargeTypeCd,
        ntsBizLargeTypeNm,
        ntsBizMediumTypeCd,
        ntsBizMediumTypeNm,
        ntsBizSmallTypeCd,
        ntsBizSmallTypeNm,
        ntsBizSubTypeCd,
        ntsBizSubTypeNm,
        ntsBizTypeId,
        ntsBizTypeCd,
        ntsBizTypeNm,
        korBizLargeTypeCd,
        korBizLargeTypeNm,
        korBizMediuimTypeCd,
        korBizMediumTypeNm,
        korBizSmallTypeCd,
        korBizSmallTypeNm,
        korBizSubTypeCd,
        korBizSubTypeNm,
        korBizTypeId,
        korBizTypeCd,
        korBizTypeNm,
      } = element;

      let tmpCcaliBizLargeInfo: any = {};
      let tmpCcaliBizTypeInfo: any = {};

      let tmpNtsBizLargeInfo: any = {};
      let tmpNtsBizTypeInfo: any = {};

      // let tmpKorBizLargeInfo: any = {};
      // let tmpKorBizTypeInfo: any = {};

      if (index == 0) {
        tmpCcaliBizTypeInfo = {
          ccaliBizTypeId: parseInt(ccaliBizTypeId),
          ccaliBizTypeCd,
          ccaliBizTypeNm,
        };
        tmpCcaliBizLargeInfo = {
          ccaliBizLargeTypeCd,
          ccaliBizLargeTypeNm,
          ccaliBizTypeData: [tmpCcaliBizTypeInfo],
        };
        formattedResult.ccali.push(tmpCcaliBizLargeInfo);

        tmpNtsBizTypeInfo = {
          ntsBizTypeId: parseInt(ntsBizTypeId),
          ntsBizTypeCd,
          ntsBizTypeNm,
        };
        tmpNtsBizLargeInfo = {
          ntsBizLargeTypeCd,
          ntsBizLargeTypeNm,
          ntsBizTypeData: [tmpNtsBizTypeInfo],
        };
        formattedResult.nts.push(tmpNtsBizLargeInfo);

        // tmpKorBizTypeInfo = {
        //   korBizTypeId: parseInt(korBizTypeId),
        //   korBizTypeCd,
        //   korBizTypeNm,
        // };
        // tmpKorBizLargeInfo = {
        //   korBizLargeTypeCd,
        //   korBizLargeTypeNm,
        //   korBizTypeData: [tmpKorBizTypeInfo],
        // };
        // formattedResult.kor.push(tmpKorBizLargeInfo)
      } else {
        if (
          formattedResult.ccali[formattedResult.ccali.length - 1]
            .ccaliBizLargeTypeCd == ccaliBizLargeTypeCd
        ) {
          if (
            formattedResult.ccali[formattedResult.ccali.length - 1]
              .ccaliBizTypeData[
              formattedResult.ccali[formattedResult.ccali.length - 1]
                .ccaliBizTypeData.length - 1
            ].ccaliBizTypeId != parseInt(ccaliBizTypeId)
          ) {
            tmpCcaliBizTypeInfo = {
              ccaliBizTypeId: parseInt(ccaliBizTypeId),
              ccaliBizTypeCd,
              ccaliBizTypeNm,
            };
            formattedResult.ccali[
              formattedResult.ccali.length - 1
            ].ccaliBizTypeData.push(tmpCcaliBizTypeInfo);

            formattedResult.ccali[
              formattedResult.ccali.length - 1
            ].ccaliBizTypeData.sort(
              (a, b) => a.ccaliBizTypeId - b.ccaliBizTypeId,
            );
          }
        } else if (
          formattedResult.ccali[formattedResult.ccali.length - 1]
            .ccaliBizLargeTypeCd != ccaliBizLargeTypeCd
        ) {
          tmpCcaliBizTypeInfo = {
            ccaliBizTypeId: parseInt(ccaliBizTypeId),
            ccaliBizTypeCd,
            ccaliBizTypeNm,
          };
          tmpCcaliBizLargeInfo = {
            ccaliBizLargeTypeCd,
            ccaliBizLargeTypeNm,
            ccaliBizTypeData: [tmpCcaliBizTypeInfo],
          };
          formattedResult.ccali.push(tmpCcaliBizLargeInfo);
        }

        if (
          formattedResult.nts[formattedResult.nts.length - 1]
            .ntsBizLargeTypeCd == ntsBizLargeTypeCd
        ) {
          if (
            formattedResult.nts[formattedResult.nts.length - 1].ntsBizTypeData[
              formattedResult.nts[formattedResult.nts.length - 1].ntsBizTypeData
                .length - 1
            ].ntsBizTypeId != parseInt(ntsBizTypeId)
          ) {
            tmpNtsBizTypeInfo = {
              ntsBizTypeId: parseInt(ntsBizTypeId),
              ntsBizTypeCd,
              ntsBizTypeNm,
            };
            formattedResult.nts[
              formattedResult.nts.length - 1
            ].ntsBizTypeData.push(tmpNtsBizTypeInfo);

            formattedResult.nts[
              formattedResult.nts.length - 1
            ].ntsBizTypeData.sort((a, b) => a.ntsBizTypeId - b.ntsBizTypeId);
          }
        } else if (
          formattedResult.nts[formattedResult.nts.length - 1]
            .ntsBizLargeTypeCd != ntsBizLargeTypeCd
        ) {
          tmpNtsBizTypeInfo = {
            ntsBizTypeId: parseInt(ntsBizTypeId),
            ntsBizTypeCd,
            ntsBizTypeNm,
          };
          tmpNtsBizLargeInfo = {
            ntsBizLargeTypeCd,
            ntsBizLargeTypeNm,
            ntsBizTypeData: [tmpNtsBizTypeInfo],
          };
          formattedResult.nts.push(tmpNtsBizLargeInfo);
        }
      }
    }

    return formattedResult;
  }

  async selectCcaliBizQuestionByKoreaBizType(koreaBizTypeCd: string) {
    const query = this.ccaliKoreaBizTypeQuestionRepository
      .createQueryBuilder('question')
      .select('question.kor_biz_sub_sub_type_cd', 'korBizTypeCd')
      .addSelect('question.qstn_no', 'questionNo')
      .addSelect('question.qstn_txt', 'questionTxt')
      .addSelect('ccali.biz_large_type_cd', 'ccaliBizLargeTypeCd')
      .addSelect('ccali.biz_large_type_nm', 'ccaliBizLargeTypeNm')
      .addSelect('ccali.biz_small_type_id', 'ccaliBizTypeId')
      .addSelect('ccali.biz_small_type_cd', 'ccaliBizTypeCd')
      .addSelect('ccali.biz_small_type_nm', 'ccaliBizTypeNm')
      .leftJoin(
        (subQuery) => {
          return subQuery.select('cbt.*').from(CcaliBizTypeView, 'cbt');
        },
        'ccali',
        'question.ccali_biz_small_type_cd = ccali.biz_small_type_cd',
      )
      .where('question.kor_biz_sub_sub_type_cd = :koreaBizTypeCd', {
        koreaBizTypeCd,
      });

    query.orderBy('question.qstn_no', 'ASC');

    const results = await query.getRawMany();
    const formattedResults = results.map((result) => ({
      ...result,
      questionNo: parseInt(result.questionNo),
      ccaliBizTypeId: parseInt(result.ccaliBizTypeId),
    }));

    return formattedResults;
  }

  async selectCcaliPlanGuaranteeOld({ planId }: SelectPlanGuaranteeDto) {
    const query = this.planGuaranteeMapRepository
      .createQueryBuilder('map')
      .select('plan.id', 'planId')
      .addSelect('plan.plan_type', 'planType')
      .addSelect('plan.plan_nm', 'planNm')
      .addSelect('plan.ins_prod_cd', 'insProdCd')
      .addSelect('plan.ins_prod_nm', 'insProdNm')
      .addSelect('plan.ins_prod_full_nm', 'insProdFullNm')
      .addSelect('plan.ins_com_cd', 'insComCd')
      .addSelect('plan.ins_com_nm', 'insComNm')
      .addSelect('plan.ins_com_full_nm', 'insComFullNm')
      .addSelect('guarantee.id', 'guaranteeId')
      .addSelect('guarantee.grnte_nm', 'guaranteeNm')
      .addSelect('guarantee.sort_seq', 'guaranteeSortSeq')
      .addSelect('guaranteeContent.grnte_cn', 'guaranteeContent')
      .addSelect('guaranteeContent.grnte_expln', 'guaranteeExplain')
      .innerJoin(
        (subQuery) => {
          return subQuery
            .select('ccali_plan.*')
            .addSelect('prod.ins_prod_cd')
            .addSelect('prod.ins_prod_nm')
            .addSelect('prod.ins_prod_full_nm')
            .addSelect('prod.ins_com_cd')
            .addSelect('prod.ins_com_nm')
            .addSelect('prod.ins_com_full_nm')
            .from(CcaliPlan, 'ccali_plan')
            .leftJoin(
              (subQuery) => {
                return subQuery
                  .select('ins_prod.*')
                  .addSelect('com.ins_com_nm')
                  .addSelect('com.ins_com_full_nm')
                  .from(InsProd, 'ins_prod')
                  .leftJoin(
                    (subQuery) => {
                      return subQuery
                        .select('ins_com.*')
                        .from(InsCom, 'ins_com');
                    },
                    'com',
                    'ins_prod.ins_com_cd = com.ins_com_cd',
                  );
              },
              'prod',
              'ccali_plan.ins_prod_id = prod.id',
            )
            .where('ccali_plan.ins_prod_id = :insProdId', { insProdId: 1 });
        },
        'plan',
        'map.plan_id = plan.id',
      )
      .innerJoin(
        (subQuery) => {
          return subQuery
            .select('grnte.*')
            .from(PlanGuarantee, 'grnte')
            .where('grnte.ins_prod_id = :insProdId', { insProdId: 1 });
        },
        'guarantee',
        'map.grnte_id = guarantee.id',
      )
      .leftJoin(
        (subQuery) => {
          return subQuery.select('cn.*').from(PlanGuaranteeContent, 'cn');
        },
        'guaranteeContent',
        'plan.id = guaranteeContent.plan_id AND guarantee.id = guaranteeContent.grnte_id',
      )
      .where('1=1');

    if (planId != null && planId != 0) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('map.plan_id = :planId', {
            planId,
          });
        }),
      );
    }

    query.addOrderBy('planId', 'ASC').addOrderBy('guaranteeSortSeq', 'ASC');

    const results = await query.getRawMany();
    // const formattedResults = results.map((result) => ({
    //   ...result,
    //   planId: parseInt(result.planId),
    //   guaranteeId: parseInt(result.guaranteeId),
    // }));

    let formattedResults = [];
    for (let index = 0; index < results.length; index++) {
      const element = results[index];
      const {
        planId,
        planType,
        planNm,
        insProdCd,
        insProdNm,
        insProdFullNm,
        insComCd,
        insComNm,
        insComFullNm,
        guaranteeId,
        guaranteeNm,
        guaranteeContent,
        guaranteeExplain,
      } = element;

      let tmpPlanInfo: any = {};
      let tmpGuaranteeLargeInfo: any = {};
      let tmpGuaranteeInfo: any = {};

      if (index == 0) {
        tmpGuaranteeInfo = {
          guaranteeId: parseInt(guaranteeId),
          guaranteeNm,
          guaranteeContent,
          guaranteeExplain,
        };
        tmpPlanInfo = {
          planId: parseInt(planId),
          planType,
          planNm,
          insProdCd,
          insProdNm,
          insProdFullNm,
          insComCd,
          insComNm,
          insComFullNm,
          guaranteeData: [tmpGuaranteeInfo],
        };

        formattedResults.push(tmpPlanInfo);
      } else {
        if (
          formattedResults[formattedResults.length - 1].planId ==
          parseInt(planId)
        ) {
          tmpGuaranteeInfo = {
            guaranteeId: parseInt(guaranteeId),
            guaranteeNm,
            guaranteeContent,
            guaranteeExplain,
          };
          formattedResults[formattedResults.length - 1].guaranteeData.push(
            tmpGuaranteeInfo,
          );
          // if (
          //   formattedResults[formattedResults.length - 1].guaranteeData[
          //     formattedResults[formattedResults.length - 1].guaranteeData
          //       .length - 1
          //   ].guaranteeId == parseInt(guaranteeId)
          // ) {
          //   formattedResults[formattedResults.length - 1].guaranteeData[
          //     formattedResults[formattedResults.length - 1].guaranteeData
          //       .length - 1
          //   ].guaranteeData.push(tmpGuaranteeInfo);
          // } else {
          //   formattedResults[formattedResults.length - 1].guaranteeData.push(
          //     tmpGuaranteeInfo,
          //   );
          // }
        } else {
          tmpGuaranteeInfo = {
            guaranteeId: parseInt(guaranteeId),
            guaranteeNm,
            guaranteeContent,
            guaranteeExplain,
          };
          tmpPlanInfo = {
            planId: parseInt(planId),
            planType,
            planNm,
            insProdCd,
            insProdNm,
            insProdFullNm,
            insComCd,
            insComNm,
            insComFullNm,
            guaranteeData: [tmpGuaranteeInfo],
          };

          formattedResults.push(tmpPlanInfo);
        }
      }
    }

    return formattedResults;
  }

  async selectCcaliPlanGuarantee({ planId }: SelectPlanGuaranteeDto) {
    const query = this.planGuaranteeContentRepository
      .createQueryBuilder('guaranteeContent')
      .select('plan.id', 'planId')
      .addSelect('plan.plan_type', 'planType')
      .addSelect('plan.plan_nm', 'planNm')
      .addSelect('plan.ins_prod_cd', 'insProdCd')
      .addSelect('plan.ins_prod_nm', 'insProdNm')
      .addSelect('plan.ins_prod_full_nm', 'insProdFullNm')
      .addSelect('plan.ins_com_cd', 'insComCd')
      .addSelect('plan.ins_com_nm', 'insComNm')
      .addSelect('plan.ins_com_full_nm', 'insComFullNm')
      .addSelect('guarantee.id', 'guaranteeId')
      .addSelect('guarantee.grnte_nm', 'guaranteeNm')
      .addSelect('guarantee.sort_seq', 'guaranteeSortSeq')
      .addSelect('guaranteeContent.grnte_cn', 'guaranteeContent')
      .addSelect('guaranteeContent.grnte_expln', 'guaranteeExplain')
      .addSelect('guaranteeContent.required_yn', 'requiredYn')
      .innerJoin(
        (subQuery) => {
          return subQuery
            .select('ccali_plan.*')
            .addSelect('prod.ins_prod_cd')
            .addSelect('prod.ins_prod_nm')
            .addSelect('prod.ins_prod_full_nm')
            .addSelect('prod.ins_com_cd')
            .addSelect('prod.ins_com_nm')
            .addSelect('prod.ins_com_full_nm')
            .from(CcaliPlan, 'ccali_plan')
            .leftJoin(
              (subQuery) => {
                return subQuery
                  .select('ins_prod.*')
                  .addSelect('com.ins_com_nm')
                  .addSelect('com.ins_com_full_nm')
                  .from(InsProd, 'ins_prod')
                  .leftJoin(
                    (subQuery) => {
                      return subQuery
                        .select('ins_com.*')
                        .from(InsCom, 'ins_com');
                    },
                    'com',
                    'ins_prod.ins_com_cd = com.ins_com_cd',
                  );
              },
              'prod',
              'ccali_plan.ins_prod_id = prod.id',
            )
            .where('ccali_plan.ins_prod_id = :insProdId', { insProdId: 1 });
        },
        'plan',
        'guaranteeContent.plan_id = plan.id',
      )
      .innerJoin(
        (subQuery) => {
          return subQuery
            .select('grnte.*')
            .from(PlanGuarantee, 'grnte')
            .where('grnte.ins_prod_id = :insProdId', { insProdId: 1 });
        },
        'guarantee',
        'guaranteeContent.grnte_id = guarantee.id',
      )
      // .leftJoin(
      //   (subQuery) => {
      //     return subQuery.select('cn.*').from(PlanGuaranteeContent, 'cn');
      //   },
      //   'guaranteeContent',
      //   'plan.id = guaranteeContent.plan_id AND guarantee.id = guaranteeContent.grnte_id',
      // )
      .where('1=1');

    if (planId != null && planId != 0) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('guaranteeContent.plan_id = :planId', {
            planId,
          });
        }),
      );
    }

    query.addOrderBy('planId', 'ASC').addOrderBy('guaranteeSortSeq', 'ASC');

    const results = await query.getRawMany();
    // const formattedResults = results.map((result) => ({
    //   ...result,
    //   planId: parseInt(result.planId),
    //   guaranteeId: parseInt(result.guaranteeId),
    // }));

    let formattedResults = [];
    for (let index = 0; index < results.length; index++) {
      const element = results[index];
      const {
        planId,
        planType,
        planNm,
        insProdCd,
        insProdNm,
        insProdFullNm,
        insComCd,
        insComNm,
        insComFullNm,
        guaranteeId,
        guaranteeNm,
        guaranteeContent,
        guaranteeExplain,
        requiredYn,
      } = element;

      let tmpPlanInfo: any = {};
      let tmpGuaranteeLargeInfo: any = {};
      let tmpGuaranteeInfo: any = {};

      if (index == 0) {
        tmpGuaranteeInfo = {
          guaranteeId: parseInt(guaranteeId),
          guaranteeNm,
          guaranteeContent,
          guaranteeExplain,
          requiredYn,
        };
        tmpPlanInfo = {
          planId: parseInt(planId),
          planType,
          planNm,
          insProdCd,
          insProdNm,
          insProdFullNm,
          insComCd,
          insComNm,
          insComFullNm,
          guaranteeData: [tmpGuaranteeInfo],
        };

        formattedResults.push(tmpPlanInfo);
      } else {
        if (
          formattedResults[formattedResults.length - 1].planId ==
          parseInt(planId)
        ) {
          tmpGuaranteeInfo = {
            guaranteeId: parseInt(guaranteeId),
            guaranteeNm,
            guaranteeContent,
            guaranteeExplain,
            requiredYn,
          };
          formattedResults[formattedResults.length - 1].guaranteeData.push(
            tmpGuaranteeInfo,
          );
        } else {
          tmpGuaranteeInfo = {
            guaranteeId: parseInt(guaranteeId),
            guaranteeNm,
            guaranteeContent,
            guaranteeExplain,
            requiredYn,
          };
          tmpPlanInfo = {
            planId: parseInt(planId),
            planType,
            planNm,
            insProdCd,
            insProdNm,
            insProdFullNm,
            insComCd,
            insComNm,
            insComFullNm,
            guaranteeData: [tmpGuaranteeInfo],
          };

          formattedResults.push(tmpPlanInfo);
        }
      }
    }

    return formattedResults;
  }

  async selectSiteAnswerTemplates(questionId: number) {
    const query = this.ccaliQuestionRepository
      .createQueryBuilder('question')
      .select('template.id', 'answerId')
      .addSelect(
        `CASE WHEN template.qstn_id = 17 THEN "radio"
                         ELSE template.ans_type
                         END`,
        'answerType',
      )
      .addSelect(
        `CASE WHEN template.site_ans_text IS NOT NULL THEN template.site_ans_text
                         ELSE template.ans_text
                         END`,
        'answerText',
      )
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select('cqat.*')
            .from(CcaliQuestionAnswerTemplate, 'cqat');
        },
        'template',
        'question.id = template.qstn_id',
      )
      .where('question.id = :questionId', { questionId });

    query.orderBy('template.site_sort_seq', 'ASC');

    const results = await query.getRawMany();
    const formattedResults = results.map((result) => ({
      ...result,
      answerId: parseInt(result.answerId),
    }));

    return formattedResults;
  }

  async selectSiteQuestionAnswerTemplates(questionIds: Array<number>) {
    const query = this.ccaliQuestionRepository
      .createQueryBuilder('question')
      .select('template.id', 'answerId')
      .addSelect(
        `CASE WHEN template.qstn_id = 17 THEN "radio"
                         ELSE template.ans_type
                         END`,
        'answerType',
      )
      .addSelect(
        `CASE WHEN template.site_ans_text IS NOT NULL THEN template.site_ans_text
                         ELSE template.ans_text
                         END`,
        'answerText',
      )
      .addSelect(
        `CASE WHEN question.site_qstn_text IS NOT NULL THEN question.site_qstn_text
                         ELSE question.qstn_text
                         END`,
        'questionText',
      )
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select('cqat.*')
            .from(CcaliQuestionAnswerTemplate, 'cqat');
        },
        'template',
        'question.id = template.qstn_id',
      )
      .where('question.id IN (:...questionIds)', { questionIds });

    query
      .orderBy('question.site_sort_seq', 'ASC')
      .addOrderBy('template.site_sort_seq', 'ASC');

    const results = await query.getRawMany();
    let formattedResults = [];
    for (let index = 0; index < results.length; index++) {
      const element = results[index];
      const { answerId, answerType, answerText, questionText } = element;

      let tmpQuestionInfo: any = {};
      let tmpAnswerInfo = {
        answerId: parseInt(answerId),
        answerType,
        answerText,
      };

      if (index == 0) {
        tmpQuestionInfo = {
          questionText,
          answerData: [tmpAnswerInfo],
        };

        formattedResults.push(tmpQuestionInfo);
      } else {
        if (
          formattedResults[formattedResults.length - 1].questionText ==
          questionText
        ) {
          formattedResults[formattedResults.length - 1].answerData.push(
            tmpAnswerInfo,
          );
        } else {
          tmpQuestionInfo = {
            questionText,
            answerData: [tmpAnswerInfo],
          };

          formattedResults.push(tmpQuestionInfo);
        }
      }
    }

    return formattedResults;
  }

  async funSiteQuestionAnswerTemplates(
    fileIds: Array<number>,
    categoryIds: Array<number>,
  ) {
    const query = this.ccaliQuestionRepository
      .createQueryBuilder('question')
      .select('template.id', 'answerId')
      .addSelect(
        `CASE WHEN template.qstn_id = 17 THEN "radio"
                         ELSE template.ans_type
                         END`,
        'answerType',
      )
      .addSelect(
        `CASE WHEN template.site_ans_text IS NOT NULL THEN template.site_ans_text
                         ELSE template.ans_text
                         END`,
        'answerText',
      )
      .addSelect('question.id', 'questionId')
      .addSelect(
        `CASE WHEN question.site_qstn_text IS NOT NULL THEN question.site_qstn_text
                         ELSE question.qstn_text
                         END`,
        'questionText',
      )
      .addSelect('question.site_qstn_expln', 'questionExplain')
      .addSelect('question.ctgry_id', 'categoryId')
      .addSelect('category.prnt_id', 'parentCategoryId')
      .addSelect(
        `CASE WHEN category.site_ctgry_nm IS NOT NULL THEN category.site_ctgry_nm
                         ELSE category.ctgry_nm
                         END`,
        'categoryNm',
      )
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select('cqat.*')
            .from(CcaliQuestionAnswerTemplate, 'cqat');
        },
        'template',
        'question.id = template.qstn_id',
      )
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select('ctgry.*')
            .from(CcaliQuestionCategory, 'ctgry');
        },
        'category',
        'question.ctgry_id = category.id',
      )
      .where('question.file_id IN (:...fileIds)', { fileIds })
      .andWhere('category.id IN (:...categoryIds)', { categoryIds });

    query
      .orderBy('question.site_sort_seq', 'ASC')
      .addOrderBy('template.site_sort_seq', 'ASC');

    const results = await query.getRawMany();
    let formattedResults = [];
    let tmpFormattedResults = [];
    for (let index = 0; index < results.length; index++) {
      const element = results[index];
      const {
        answerId,
        answerType,
        answerText,
        questionId,
        questionText,
        questionExplain,
        categoryId,
        categoryNm,
        parentCategoryId,
      } = element;

      let tmpCategoryInfo: any = {};
      let tmpQuestionInfo: any = {};
      let tmpAnswerInfo = {
        answerId: parseInt(answerId),
        answerType,
        answerText,
      };

      tmpQuestionInfo = {
        questionId: parseInt(questionId),
        questionText,
        questionExplain,
        answerData: [tmpAnswerInfo],
      };
      if (index == 0) {
        tmpCategoryInfo = {
          categoryId: parseInt(categoryId),
          categoryNm,
          parentCategoryId:
            parentCategoryId == null ? null : parseInt(parentCategoryId),
          questionData: [tmpQuestionInfo],
        };

        tmpFormattedResults.push(tmpCategoryInfo);
      } else {
        if (
          tmpFormattedResults[tmpFormattedResults.length - 1].categoryId ==
            parseInt(categoryId) &&
          tmpFormattedResults[tmpFormattedResults.length - 1].questionData[
            tmpFormattedResults[tmpFormattedResults.length - 1].questionData
              .length - 1
          ].questionId == parseInt(questionId)
        ) {
          tmpFormattedResults[tmpFormattedResults.length - 1].questionData[
            tmpFormattedResults[tmpFormattedResults.length - 1].questionData
              .length - 1
          ].answerData.push(tmpAnswerInfo);
        } else if (
          tmpFormattedResults[tmpFormattedResults.length - 1].categoryId ==
            parseInt(categoryId) &&
          tmpFormattedResults[tmpFormattedResults.length - 1].questionData[
            tmpFormattedResults[tmpFormattedResults.length - 1].questionData
              .length - 1
          ].questionId != parseInt(questionId)
        ) {
          tmpFormattedResults[tmpFormattedResults.length - 1].questionData.push(
            tmpQuestionInfo,
          );
        } else {
          tmpCategoryInfo = {
            categoryId: parseInt(categoryId),
            categoryNm,
            parentCategoryId:
              parentCategoryId == null ? null : parseInt(parentCategoryId),
            questionData: [tmpQuestionInfo],
          };

          tmpFormattedResults.push(tmpCategoryInfo);
        }
      }
    }

    for (
      let resultIndex = 0;
      resultIndex < tmpFormattedResults.length;
      resultIndex++
    ) {
      const element = tmpFormattedResults[resultIndex];
      let currentCategory: any = {};
      if (formattedResults.length == 0 && element.parentCategoryId == null) {
        formattedResults.push(element);
      } else if (
        formattedResults.length == 0 &&
        element.parentCategoryId != null
      ) {
        const parentCategory =
          await this.ccaliQuestionCategoryRepository.findOne({
            where: {
              id: element.parentCategoryId,
            },
          });
        currentCategory = {
          categoryId: parentCategory.id,
          categoryNm:
            parentCategory.siteCategoryNm == null
              ? parentCategory.categoryNm
              : parentCategory.siteCategoryNm,
          parentCategoryId: parentCategory.parentId,
          categoryData: [element],
        };
        formattedResults.push(currentCategory);
      } else {
        formattedResults.forEach(async (value, index) => {
          if (element.parentCategoryId == null) {
            formattedResults.push(element);
          } else if (value.categoryId == element.parentCategoryId) {
            if (formattedResults[index]?.categoryData == null) {
              formattedResults[index] = {
                ...formattedResults[index],
                categoryData: [element],
              };
            } else {
              formattedResults[index].categoryData.push(element);
            }
          } else {
            const parentCategory =
              await this.ccaliQuestionCategoryRepository.findOne({
                where: {
                  id: element.parentCategoryId,
                },
              });
            currentCategory = {
              categoryId: parentCategory.id,
              categoryNm:
                parentCategory.siteCategoryNm == null
                  ? parentCategory.categoryNm
                  : parentCategory.siteCategoryNm,
              parentCategoryId: parentCategory.parentId,
              categoryData: [element],
            };
            formattedResults.push(currentCategory);
          }
        });
      }
    }

    return formattedResults;
  }
}
