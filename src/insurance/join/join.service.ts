import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Brackets,
  Connection,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import * as dayjs from 'dayjs';
import * as fs from 'fs';
import * as pdf from 'html-pdf';
import { join } from 'path';
import axios from 'axios';
import * as qs from 'qs';
import { padStart } from 'lodash';
import { CommonService } from 'src/common/common.service';
import { PlanService } from '../plan/plan.service';
import { UpdateJoinReqDto } from './dto/update-join-req.dto';
import { UpdateJoinPaymentReqDto } from './dto/update-join-payment-req.dto';
import { SelectJoinListReqDto } from './dto/select-join-list-req.dto';
import { SelectJoinListDetailReqDto } from './dto/select-join-list-detail-req.dto';
import { InsCom } from 'src/common/entities/ins-com.entity';
import { InsProd } from 'src/common/entities/ins-prod.entity';
import { InsProdTerms } from 'src/common/entities/ins-prod-terms.entity';
import { JoinConfirm } from './entities/join-confirm.entity';
import { totalJoiningDeed } from 'html/totalJoiningDeed';
import { totalFile } from 'html/totalFile';
import { writeToFile } from 'src/common/utils/fs-utils';
import { MasterInsStockNo } from './entities/master-ins-stock-no.entity';
import { CreateCcaliJoinReqDto } from './dto/create-ccali-join-req.dto';
import { CcaliJoin } from './entities/ccali-join.entity';
import { CcaliCoverageLimit } from '../plan/entities/ccali-coverage-limit.entity';
import { CreateCcaliJoinInsStockNoReqDto } from './dto/create-ccali-join-ins-stock-no-req.dto';
import { JoinStatus } from 'src/common/entities/join-stts-cd.entity';
import { PayStatus } from 'src/common/entities/pay-stts-cd.entity';
import { CcaliClaim } from '../claim/entities/ccali-claim.entity';
import { ClaimStatus } from '../claim/entities/claim-stts-cd.entity';
import { UpdateCcaliJoinReqDto } from './dto/update-ccali-join-req.dto';
import { NtsBizType } from '../plan/entities/nts-biz-type.entity';
import { CcaliBizTypeView } from '../plan/entities/ccali-biz-type-view.entity';
import { PayNicepayLogs } from 'src/pay/entities/pay-nicepay-logs.entity';
import { TermsAgreeLogs } from 'src/terms/entities/terms-agree-logs.entity';
import { CreatePdfFileReqDto } from './dto/create-pdf-file-req.dto';
import { CcaliJoinSubCompany } from './entities/ccali-join-sub-company.entity';
import { SubCompanyDto } from './dto/sub-company.dto';
import { CcaliAnswerResponse } from '../plan/entities/ccali-answer-response.entity';
import { CcaliQuestionAnswerTemplate } from '../plan/entities/ccali-question-answer-template.entity';
import { CcaliQuestion } from '../plan/entities/ccali-question.entity';
import { SmsService } from 'src/sms/sms.service';
import { CcaliJoinPayLogs } from './entities/ccali-join-pay-logs.entity';
import { MailService } from 'src/mail/mail.service';
import { InsProdCdReqDto } from 'src/common/dto/ins-prod-cd-req.dto';
import { response } from 'src/common/constants/response.constant';
import { getKbAuthData } from 'src/common/utils/crypto-utils';
import { TotalBizMember } from './entities/total-biz-member.entity';
import { DliJoin } from './entities/dli-join.entity';
import { MfliJoin } from './entities/mfli-join.entity';
import { DliJoinTmp } from './entities/dli-join-tmp.entity';
import { MfliJoinTmp } from './entities/mfli-join-tmp.entity';
import { InsuratorJoin } from './entities/insurator-join.entity';
import { InsuratorJoinFee } from './entities/insurator-join-fee.entity';
import { InsuratorEstimateFile } from './entities/insurator-estimate-file.entity';
import { queries } from 'src/common/database/queries.sql';
import { CompleteInsContractReqDto } from './dto/complete-ins-contract-req.dto';

@Injectable()
export class JoinService {
  constructor(
    private readonly connection: Connection,
    private readonly commonService: CommonService,
    private readonly planService: PlanService,
    private readonly mailService: MailService,

    @InjectRepository(InsProd, 'default')
    private insProdRepository: Repository<InsProd>,

    @InjectRepository(JoinConfirm, 'default')
    private joinConfirmRepository: Repository<JoinConfirm>,
    @InjectRepository(MasterInsStockNo, 'default')
    private masterInsStockNoRepository: Repository<MasterInsStockNo>,

    @InjectRepository(CcaliJoin, 'default')
    private ccaliJoinRepository: Repository<CcaliJoin>,
    @InjectRepository(CcaliJoinSubCompany, 'default')
    private ccaliJoinSubCompanyRepository: Repository<CcaliJoinSubCompany>,
    @InjectRepository(CcaliCoverageLimit, 'default')
    private ccaliCoverageLimitRepository: Repository<CcaliCoverageLimit>,
    @InjectRepository(NtsBizType, 'default')
    private ntsBizTypeRepository: Repository<NtsBizType>,
    @InjectRepository(CcaliBizTypeView, 'default')
    private ccaliBizTypeRepository: Repository<CcaliBizTypeView>,
    @InjectRepository(TermsAgreeLogs, 'default')
    private termsAgreeLogsRepository: Repository<TermsAgreeLogs>,
    @InjectRepository(CcaliAnswerResponse, 'default')
    private ccaliAnswerResponseRepository: Repository<CcaliAnswerResponse>,
    @InjectRepository(CcaliQuestionAnswerTemplate, 'default')
    private ccaliQuestionAnswerTemplateRepository: Repository<CcaliQuestionAnswerTemplate>,
    @InjectRepository(CcaliJoinPayLogs, 'default')
    private ccaliJoinPayLogsRepository: Repository<CcaliJoinPayLogs>,

    @InjectRepository(TotalBizMember, 'default')
    private totalBizMemberRepository: Repository<TotalBizMember>,
    @InjectRepository(DliJoin, 'default')
    private dliJoinRepository: Repository<DliJoin>,
    @InjectRepository(MfliJoin, 'default')
    private mfliJoinRepository: Repository<MfliJoin>,
    @InjectRepository(DliJoinTmp, 'default')
    private dliJoinTmpRepository: Repository<DliJoinTmp>,
    @InjectRepository(MfliJoinTmp, 'default')
    private mfliJoinTmpRepository: Repository<MfliJoinTmp>,
    @InjectRepository(InsuratorJoin, 'default')
    private insuratorJoinRepository: Repository<InsuratorJoin>,
    @InjectRepository(InsuratorJoinFee, 'default')
    private insuratorJoinFeeRepository: Repository<InsuratorJoinFee>,
    @InjectRepository(InsuratorEstimateFile, 'default')
    private insuratorEstimateFileRepository: Repository<InsuratorEstimateFile>,
  ) {}

  async getInsJoinList(req, data: SelectJoinListReqDto) {
    let statusCode = 201000;
    let returnMsg = 'ok';
    let result: any = {
      join: {},
    };

    const { insuredBizNo } = data;

    const joinList = await this.selectJoinListByInsuredBizNo(insuredBizNo);
    console.log('joinList', joinList);
    if (joinList.length == 0) {
      statusCode = 201020;
      returnMsg = '검색 결과 없음';
    }

    if (statusCode == 201000) {
      result.join = joinList;
    }

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  async getInsJoinListDetail(
    req,
    joinId: number,
    data: SelectJoinListDetailReqDto,
  ) {
    let statusCode = 201000;
    let returnMsg = 'ok';
    let result = {
      join: {},
    };

    const { phPhoneNo } = data;

    const joinDetail = await this.commonService.selectJoinListDetailByJoinId(
      joinId,
      '',
    );
    console.log('joinDetail', joinDetail);
    if (joinDetail.length == 0) {
      statusCode = 201020;
      returnMsg = '검색 결과 없음';
    } else if (
      phPhoneNo != joinDetail[0].phPhoneNo &&
      phPhoneNo != joinDetail[0].corpManagerPhoneNo
    ) {
      statusCode = 201010;
      returnMsg = '본인 정보가 아님';
    } else {
      let joinInfo = joinDetail[0];
      const insProdCd = joinInfo.insProdCd;

      // 보장내용 조회

      // 가입확인서 생성
      if (joinInfo.joinStatusCd == 'Y' || joinInfo.joinStatusCd == 'X') {
        const { responseCode, responseData, responseMsg } =
          await this.commonService.funCreateInsJoinFileCcali(joinId);
        if (responseCode == 0) {
          const fileName = responseData.fileName;
          joinInfo = {
            ...joinInfo,
            insJoinFileUrl: `${process.env.HOST}/uploads/join/${insProdCd}/pdf/${fileName}.pdf`,
          };
        }
      }

      if (joinInfo.joinStatusCd == 'A') {
        const insCostNoticeInfo = joinInfo?.insCostNoticeData[0];
        let insCostInfo = {};
        // 보험료
        const totInsCost = joinInfo.totInsCost;
        // 일시납
        const single = [
          {
            payNo: 1,
            payInsCost: Number(insCostNoticeInfo.singleInsCost),
            totInsCost: Number(insCostNoticeInfo.singleInsCost),
          },
        ];
        insCostInfo = {
          single,
        };

        if (joinInfo.planId == 5) {
          // 2회납
          const biannual = [
            {
              payNo: 1,
              payInsCost: Number(insCostNoticeInfo.biannualInsCost / 2),
              totInsCost: Number(insCostNoticeInfo.biannualInsCost),
            },
            {
              payNo: 2,
              payInsCost: Number(insCostNoticeInfo.biannualInsCost / 2),
              totInsCost: Number(insCostNoticeInfo.biannualInsCost),
            },
          ];

          // 4회납
          const quarterly = [
            {
              payNo: 1,
              payInsCost: Number(insCostNoticeInfo.quarterlyInsCost / 4),
              totInsCost: Number(insCostNoticeInfo.quarterlyInsCost),
            },
            {
              payNo: 2,
              payInsCost: Number(insCostNoticeInfo.quarterlyInsCost / 4),
              totInsCost: Number(insCostNoticeInfo.quarterlyInsCost),
            },
            {
              payNo: 3,
              payInsCost: Number(insCostNoticeInfo.quarterlyInsCost / 4),
              totInsCost: Number(insCostNoticeInfo.quarterlyInsCost),
            },
            {
              payNo: 4,
              payInsCost: Number(insCostNoticeInfo.quarterlyInsCost / 4),
              totInsCost: Number(insCostNoticeInfo.quarterlyInsCost),
            },
          ];

          insCostInfo = {
            ...insCostInfo,
            biannual,
            quarterly,
          };
        }

        joinInfo = {
          ...joinInfo,
          insCostInfo,
        };

        // 보험료 안내문 생성
        const singleCostNoticeFileInfo =
          await this.commonService.funCreateAcqsPdfFile(
            joinId,
            'costNotice',
            1,
          );
        if (singleCostNoticeFileInfo.responseCode == 0) {
          const singleCostNoticeFileName =
            singleCostNoticeFileInfo.responseData.fileName;
          joinInfo = {
            ...joinInfo,
            singleCostNoticeFileUrl: `${process.env.HOST}/uploads/acqs/pdf/${singleCostNoticeFileName}.pdf`,
          };
        }
        if (joinInfo.planId == 5) {
          const biannualCostNoticeFileInfo =
            await this.commonService.funCreateAcqsPdfFile(
              joinId,
              'costNotice',
              2,
            );
          const quarterlyCostNoticeFileInfo =
            await this.commonService.funCreateAcqsPdfFile(
              joinId,
              'costNotice',
              4,
            );
          if (biannualCostNoticeFileInfo.responseCode == 0) {
            const biannualCostNoticeFileName =
              biannualCostNoticeFileInfo.responseData.fileName;
            joinInfo = {
              ...joinInfo,
              biannualCostNoticeFileUrl: `${process.env.HOST}/uploads/acqs/pdf/${biannualCostNoticeFileName}.pdf`,
            };
          }
          if (quarterlyCostNoticeFileInfo.responseCode == 0) {
            const quarterlyCostNoticeFileName =
              quarterlyCostNoticeFileInfo.responseData.fileName;
            joinInfo = {
              ...joinInfo,
              quarterlyCostNoticeFileUrl: `${process.env.HOST}/uploads/acqs/pdf/${quarterlyCostNoticeFileName}.pdf`,
            };
          }
        }
      }

      if (statusCode == 201000) {
        result.join = joinInfo;
      }
    }

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  async createInsJoinFile(req, joinId: number, data: any) {
    let statusCode = 200000;
    let returnMsg = 'ok';
    let result: any = {
      join: {},
    };

    const joinDetail = await this.commonService.selectJoinListDetailByJoinId(
      joinId,
      'JoinFile',
    );
    if (joinDetail.length == 0) {
      statusCode = 200020;
      returnMsg = '검색 결과 없음';
    } else if (
      joinDetail[0].joinStatusCd != 'Y' &&
      joinDetail[0].joinStatusCd != 'X'
    ) {
      statusCode = 200012;
      returnMsg = '가입 완료되지 않음';
    }
    console.log('joinDetail', joinDetail[0]);
    const insProdCd = joinDetail[0]?.insProdCd;
    console.log('insProdCd', insProdCd);

    let insertPDFResult = '';
    if (insProdCd == 'ccali') {
      console.log('ccali start');
      const { responseCode, responseData, responseMsg } =
        await this.commonService.funCreateInsJoinFileCcali(joinId);
      if (responseCode == 0) {
        insertPDFResult = responseData.fileName;
      }
    }
    if (insertPDFResult != '') {
      result.join.path = `${process.env.HOST}/uploads/join/${insProdCd}/pdf/${insertPDFResult}.pdf`;
      result.join.filename = insertPDFResult;
    } else {
      statusCode = 200010;
      returnMsg = '실패';
    }

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  /////////////////////////// 중대재해
  async selectJoinByPhBizNo(phBizNo: string) {
    return await this.ccaliJoinRepository.find({
      where: {
        phBizNo,
      },
    });
  }

  async selectCheckJoinWithSubCompanyByInsuredBizNo(insuredBizNo: string) {
    const excludedJoinStatus = ['W', 'E', 'C', 'D'];

    const query = this.ccaliJoinRepository
      .createQueryBuilder('join')
      .select('join.id', 'id')
      .addSelect('join.plan_id', 'planId')
      .addSelect('join.insured_biz_no', 'insuredBizNo')
      .addSelect('join.ph_nm', 'phNm')
      .addSelect('join.ph_fran_nm', 'phFranNm')
      .addSelect('join.join_stts_cd', 'joinStatusCd')
      .addSelect(
        'CONCAT(join.ins_strt_ymd, " ", join.ins_strt_tm)',
        'insStartDt',
      )
      .addSelect('CONCAT(join.ins_end_ymd, " ", join.ins_end_tm)', 'insEndDt')
      .addSelect('join.join_account', 'joinAccount')
      .addSelect('join.join_path', 'joinPath')
      .leftJoin(
        (subQuery) => {
          return subQuery.select('cjsc.*').from(CcaliJoinSubCompany, 'cjsc');
        },
        'subcompany',
        'join.id = subcompany.join_id',
      )
      .where('join.del_yn = "N"')
      .andWhere('join.join_stts_cd NOT IN (:...excludedJoinStatus)', {
        excludedJoinStatus,
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where('join.insured_biz_no = :insuredBizNo', {
            insuredBizNo,
          }).orWhere('subcompany.sub_com_biz_no = :insuredBizNo', {
            insuredBizNo,
          });
        }),
      );

    query.orderBy('join.id', 'ASC');

    const results = await query.getRawMany();
    const formattedResults = results.map((result) => ({
      ...result,
      id: parseInt(result.id),
      planId: parseInt(result.planId),
    }));

    return formattedResults;
  }

  async selectJoinListByInsuredBizNo(insuredBizNo: string) {
    const query = this.ccaliJoinRepository
      .createQueryBuilder('join')
      .select('join.id', 'id')
      .addSelect('prod.ins_prod_cd', 'insProdCd')
      .addSelect('prod.ins_prod_full_nm', 'insProdFullNm')
      .addSelect('join.ins_com_cd', 'insComCd')
      .addSelect('com.ins_com_nm', 'insComNm')
      .addSelect('com.ins_com_full_nm', 'insComFullNm')
      .addSelect('join.join_stts_cd', 'joinStatusCd')
      .addSelect('joinStatus.join_stts_nm', 'joinStatusNm')
      .addSelect('join.pay_stts_cd', 'payStatusCd')
      .addSelect('payStatus.pay_stts_nm', 'payStatusNm')
      .addSelect('join.crt_dt', 'createdDt')
      .addSelect(
        'CONCAT(join.ins_strt_ymd, " ", join.ins_strt_tm)',
        'insStartDt',
      )
      .addSelect('CONCAT(join.ins_end_ymd, " ", join.ins_end_tm)', 'insEndDt')
      .addSelect('join.join_account', 'joinAccount')
      .addSelect('join.join_path', 'joinPath')
      .leftJoin(
        (subQuery) => {
          return subQuery.select('ins_com.*').from(InsCom, 'ins_com');
        },
        'com',
        'join.ins_com_cd = com.ins_com_cd',
      )
      .leftJoin(
        (subQuery) => {
          return subQuery.select('ins_prod.*').from(InsProd, 'ins_prod');
        },
        'prod',
        'join.ins_prod_id = prod.id',
      )
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select('join_status.*')
            .from(JoinStatus, 'join_status');
        },
        'joinStatus',
        'join.join_stts_cd = joinStatus.join_stts_cd',
      )
      .leftJoin(
        (subQuery) => {
          return subQuery.select('pay_status.*').from(PayStatus, 'pay_status');
        },
        'payStatus',
        'join.pay_stts_cd = payStatus.pay_stts_cd',
      )
      .where('join.insured_biz_no = :insuredBizNo', { insuredBizNo })
      .andWhere('join.join_stts_cd NOT IN ("W", "C")')
      .andWhere('join.del_yn = "N"');

    query.orderBy('join.id', 'DESC');

    const results = await query.getRawMany();
    const formattedResults = results.map((result) => ({
      ...result,
      createdDt: dayjs(result.createdDt).format('YYYY.MM.DD HH:mm:ss'),
    }));

    return formattedResults;
  }

  async selectJoinListByPhBirthYmdAndNm(phBirthYmd: string, phNm: string) {
    const query = this.ccaliJoinRepository
      .createQueryBuilder('join')
      .select('join.id', 'id')
      .addSelect('prod.ins_prod_cd', 'insProdCd')
      .addSelect('prod.ins_prod_full_nm', 'insProdFullNm')
      .addSelect('join.ins_com_cd', 'insComCd')
      .addSelect('com.ins_com_nm', 'insComNm')
      .addSelect('join.join_stts_cd', 'joinStatusCd')
      .addSelect('joinStatus.join_stts_nm', 'joinStatusNm')
      .addSelect('join.pay_stts_cd', 'payStatusCd')
      .addSelect('payStatus.pay_stts_nm', 'payStatusNm')
      .addSelect(
        'CONCAT(join.ins_strt_ymd, " ", join.ins_strt_tm)',
        'insStartDt',
      )
      .addSelect('CONCAT(join.ins_end_ymd, " ", join.ins_end_tm)', 'insEndDt')
      .addSelect('join.join_account', 'joinAccount')
      .addSelect('join.join_path', 'joinPath')
      .leftJoin(
        (subQuery) => {
          return subQuery.select('ins_com.*').from(InsCom, 'ins_com');
        },
        'com',
        'join.ins_com_cd = com.ins_com_cd',
      )
      .leftJoin(
        (subQuery) => {
          return subQuery.select('ins_prod.*').from(InsProd, 'ins_prod');
        },
        'prod',
        'join.ins_prod_id = prod.id',
      )
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select('join_status.*')
            .from(JoinStatus, 'join_status');
        },
        'joinStatus',
        'join.join_stts_cd = joinStatus.join_stts_cd',
      )
      .leftJoin(
        (subQuery) => {
          return subQuery.select('pay_status.*').from(PayStatus, 'pay_status');
        },
        'payStatus',
        'join.pay_stts_cd = payStatus.pay_stts_cd',
      )
      .where('LEFT(join.ph_rr_no, 6) = :phBirthYmd', { phBirthYmd })
      .andWhere('join.ph_nm = :phNm', { phNm })
      .andWhere('join.join_stts_cd != "W"');

    query.orderBy('join.id', 'DESC');

    const results = await query.getRawMany();

    return results;
  }

  async createJoinWithSubCompanyAndPayLogsTransaction(
    ccaliJoinEntity: Partial<CcaliJoin>,
    answerIds: number[],
    subCompanyList: SubCompanyDto[] | null,
  ) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const joinResult = await queryRunner.manager.save(ccaliJoinEntity);
      console.log('joinResult', joinResult);

      if (
        ccaliJoinEntity?.planId == 5 &&
        ccaliJoinEntity?.subCompanyJoinYn == 'Y' &&
        subCompanyList?.length > 0
      ) {
        for (let index = 0; index < subCompanyList.length; index++) {
          const element = subCompanyList[index];

          if (ccaliJoinEntity?.insuredBizNo == element.subCompanyBizNo) {
            throw new BadRequestException('Validation Failed(subCompanyBizNo)');
          }

          const subCompanyBizNoGbCd = this.commonService.getBizNoType(
            element.subCompanyBizNo,
          );

          const ntsBizTypeInfo = await this.ntsBizTypeRepository.findOne({
            where: {
              id: element.ntsBizTypeId,
            },
          });
          const ntsBizTypeCd = ntsBizTypeInfo?.bizSubSubTypeCd;
          // 업종코드
          const ntsBizType =
            await this.planService.selectOneNtsBizTypeByBizSmallTypeCd(
              ntsBizTypeCd,
            );
          if (!ntsBizType) {
            throw new BadRequestException(
              'Validation Failed(유효하지 않은 국세청 업종코드)',
            );
          }
          console.log('ntsBizType', ntsBizType);
          const ntsBizTypeNm = ntsBizType?.bizSubSubTypeNm;

          const ccaliBizTypeInfo = await this.ccaliBizTypeRepository.findOne({
            where: {
              bizSmallTypeId: element.ccaliBizTypeId,
            },
          });
          const ccaliBizTypeCd = ccaliBizTypeInfo?.bizSmallTypeCd;
          const ccaliBizType =
            await this.planService.selectOneCcaliBizTypeByBizSmallTypeCd(
              ccaliBizTypeCd,
            );
          if (!ccaliBizType) {
            throw new BadRequestException(
              'Validation Failed(유효하지 않은 중대재해 업종코드)',
            );
          }
          console.log('ccaliBizType', ccaliBizType);
          const ccaliBizTypeNm = ccaliBizType?.bizSmallTypeNm;

          const totEmployeeCnt =
            element.employeeCnt + element.externalEmployeeCnt;

          const subCompanyEntity = this.ccaliJoinSubCompanyRepository.create({
            joinId: joinResult.id,
            ...element,
            subCompanyBizNoGbCd,
            ntsBizTypeCd,
            ntsBizTypeNm,
            ccaliBizTypeCd,
            ccaliBizTypeNm,
            // korBizTypeId: 0,
            totEmployeeCnt,
          });
          await queryRunner.manager.save(subCompanyEntity);
        }
      }

      if (ccaliJoinEntity?.planId >= 3 && answerIds?.length > 0) {
        for (
          let answerIndex = 0;
          answerIndex < answerIds.length;
          answerIndex++
        ) {
          const answerId = answerIds[answerIndex];
          const questionAnswerInfo =
            await this.ccaliQuestionAnswerTemplateRepository.findOne({
              where: {
                id: answerId,
              },
            });

          const answerResponseEntity =
            this.ccaliAnswerResponseRepository.create({
              joinId: joinResult.id,
              questionId: questionAnswerInfo?.questionId,
              answerId,
              answerValue: questionAnswerInfo.answerText,
            });
          await queryRunner.manager.save(answerResponseEntity);
        }
      }

      const insStartDt = dayjs(
        joinResult?.insStartYmd + ' ' + joinResult?.insStartTime,
      );
      const payScheduledDt = dayjs(
        insStartDt.subtract(1, 'day').format('YYYY-MM-DD') + ' 16:00',
      );
      const payDueDt = insStartDt;

      const joinPayLogsEntity = this.ccaliJoinPayLogsRepository.create({
        joinId: joinResult?.id,
        payNo: 1,
        payInsCost: joinResult?.totInsCost,
        payScheduledDt:
          joinResult?.planId < 3 ? dayjs(payScheduledDt).toDate() : null,
        payDueDt: joinResult?.planId < 3 ? dayjs(payDueDt).toDate() : null,
      });
      await queryRunner.manager.save(joinPayLogsEntity);

      await queryRunner.commitTransaction();
      return { success: true, message: '' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return { success: false, message: err.message };
    } finally {
      await queryRunner.release();
    }
  }

  async updateJoinWithSubCompanyAndPayLosgTransaction(
    ccaliJoinEntity: Partial<CcaliJoin>,
    answerIds: number[],
    subCompanyList: SubCompanyDto[] | null,
  ) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const joinResult = await queryRunner.manager.save(ccaliJoinEntity);
      console.log('joinResult', joinResult);

      const preSubCompany = await this.ccaliJoinSubCompanyRepository.find({
        where: {
          joinId: ccaliJoinEntity.id,
        },
      });
      console.log('preSubCompany', preSubCompany);
      if (preSubCompany?.length == 0) {
        // 자회사 가입 Y -> 새로 저장
        if (
          ccaliJoinEntity?.planId == 5 &&
          ccaliJoinEntity?.subCompanyJoinYn == 'Y' &&
          subCompanyList != null &&
          subCompanyList?.length > 0
        ) {
          for (let index = 0; index < subCompanyList.length; index++) {
            const element = subCompanyList[index];

            if (ccaliJoinEntity?.insuredBizNo == element.subCompanyBizNo) {
              throw new BadRequestException(
                'Validation Failed(subCompanyBizNo)',
              );
            }

            const subCompanyBizNoGbCd = this.commonService.getBizNoType(
              element.subCompanyBizNo,
            );

            const ntsBizTypeInfo = await this.ntsBizTypeRepository.findOne({
              where: {
                id: element.ntsBizTypeId,
              },
            });
            const ntsBizTypeCd = ntsBizTypeInfo?.bizSubSubTypeCd;
            // 업종코드
            const ntsBizType =
              await this.planService.selectOneNtsBizTypeByBizSmallTypeCd(
                ntsBizTypeCd,
              );
            if (!ntsBizType) {
              throw new BadRequestException(
                'Validation Failed(유효하지 않은 국세청 업종코드)',
              );
            }
            console.log('ntsBizType', ntsBizType);
            const ntsBizTypeNm = ntsBizType?.bizSubSubTypeNm;

            const ccaliBizTypeInfo = await this.ccaliBizTypeRepository.findOne({
              where: {
                bizSmallTypeId: element.ccaliBizTypeId,
              },
            });
            const ccaliBizTypeCd = ccaliBizTypeInfo?.bizSmallTypeCd;
            const ccaliBizType =
              await this.planService.selectOneCcaliBizTypeByBizSmallTypeCd(
                ccaliBizTypeCd,
              );
            if (!ccaliBizType) {
              throw new BadRequestException(
                'Validation Failed(유효하지 않은 중대재해 업종코드)',
              );
            }
            console.log('ccaliBizType', ccaliBizType);
            const ccaliBizTypeNm = ccaliBizType?.bizSmallTypeNm;

            const totEmployeeCnt =
              element.employeeCnt + element.externalEmployeeCnt;

            const subCompanyEntity = this.ccaliJoinSubCompanyRepository.create({
              joinId: joinResult.id,
              ...element,
              subCompanyBizNoGbCd,
              ntsBizTypeCd,
              ntsBizTypeNm,
              ccaliBizTypeCd,
              ccaliBizTypeNm,
              // korBizTypeId: 0,
              totEmployeeCnt,
            });
            await queryRunner.manager.save(subCompanyEntity);
          }
        }
        // 자회사 가입 N -> pass
      } else {
        // 자회사 가입 Y
        // 1. 저장된 데이터 >= 새 데이터 -> 새 데이터 업데이트, 남은 저장된 데이터 삭제
        if (
          ccaliJoinEntity?.planId == 5 &&
          ccaliJoinEntity?.subCompanyJoinYn == 'Y' &&
          subCompanyList != null &&
          subCompanyList?.length > 0 &&
          preSubCompany.length >= subCompanyList?.length
        ) {
          for (let index = 0; index < preSubCompany.length; index++) {
            const preElement = preSubCompany[index];
            if (index > subCompanyList.length - 1) {
              // 저장된 데이터 삭제
              await this.ccaliJoinSubCompanyRepository.softDelete({
                id: preElement.id,
              });
            } else {
              // 데이터 업데이트
              const element = subCompanyList[index];

              if (ccaliJoinEntity?.insuredBizNo == element.subCompanyBizNo) {
                throw new BadRequestException(
                  'Validation Failed(subCompanyBizNo)',
                );
              }

              const subCompanyBizNoGbCd = this.commonService.getBizNoType(
                element.subCompanyBizNo,
              );

              const ntsBizTypeInfo = await this.ntsBizTypeRepository.findOne({
                where: {
                  id: element.ntsBizTypeId,
                },
              });
              const ntsBizTypeCd = ntsBizTypeInfo?.bizSubSubTypeCd;
              // 업종코드
              const ntsBizType =
                await this.planService.selectOneNtsBizTypeByBizSmallTypeCd(
                  ntsBizTypeCd,
                );
              if (!ntsBizType) {
                throw new BadRequestException(
                  'Validation Failed(유효하지 않은 국세청 업종코드)',
                );
              }
              console.log('ntsBizType', ntsBizType);
              const ntsBizTypeNm = ntsBizType?.bizSubSubTypeNm;

              const ccaliBizTypeInfo =
                await this.ccaliBizTypeRepository.findOne({
                  where: {
                    bizSmallTypeId: element.ccaliBizTypeId,
                  },
                });
              const ccaliBizTypeCd = ccaliBizTypeInfo?.bizSmallTypeCd;
              const ccaliBizType =
                await this.planService.selectOneCcaliBizTypeByBizSmallTypeCd(
                  ccaliBizTypeCd,
                );
              if (!ccaliBizType) {
                throw new BadRequestException(
                  'Validation Failed(유효하지 않은 중대재해 업종코드)',
                );
              }
              console.log('ccaliBizType', ccaliBizType);
              const ccaliBizTypeNm = ccaliBizType?.bizSmallTypeNm;

              const totEmployeeCnt =
                element.employeeCnt + element.externalEmployeeCnt;

              const subCompanyEntity =
                this.ccaliJoinSubCompanyRepository.create({
                  ...preElement,
                  joinId: joinResult.id,
                  ...element,
                  subCompanyBizNoGbCd,
                  ntsBizTypeCd,
                  ntsBizTypeNm,
                  ccaliBizTypeCd,
                  ccaliBizTypeNm,
                  // korBizTypeId: 0,
                  totEmployeeCnt,
                });
              await queryRunner.manager.save(subCompanyEntity);
            }
          }
        }
        // 2. 저장된 데이터 < 새 데이터 -> 데이터 업데이트 + 새로 저장
        else if (
          ccaliJoinEntity?.planId == 5 &&
          ccaliJoinEntity?.subCompanyJoinYn == 'Y' &&
          subCompanyList != null &&
          subCompanyList?.length > 0 &&
          preSubCompany.length < subCompanyList?.length
        ) {
          for (let index = 0; index < subCompanyList.length; index++) {
            const element = subCompanyList[index];

            if (ccaliJoinEntity?.insuredBizNo == element.subCompanyBizNo) {
              throw new BadRequestException(
                'Validation Failed(subCompanyBizNo)',
              );
            }

            if (index > preSubCompany.length - 1) {
              // 새로 저장
              const subCompanyBizNoGbCd = this.commonService.getBizNoType(
                element.subCompanyBizNo,
              );

              const ntsBizTypeInfo = await this.ntsBizTypeRepository.findOne({
                where: {
                  id: element.ntsBizTypeId,
                },
              });
              const ntsBizTypeCd = ntsBizTypeInfo?.bizSubSubTypeCd;
              // 업종코드
              const ntsBizType =
                await this.planService.selectOneNtsBizTypeByBizSmallTypeCd(
                  ntsBizTypeCd,
                );
              if (!ntsBizType) {
                throw new BadRequestException(
                  'Validation Failed(유효하지 않은 국세청 업종코드)',
                );
              }
              console.log('ntsBizType', ntsBizType);
              const ntsBizTypeNm = ntsBizType?.bizSubSubTypeNm;

              const ccaliBizTypeInfo =
                await this.ccaliBizTypeRepository.findOne({
                  where: {
                    bizSmallTypeId: element.ccaliBizTypeId,
                  },
                });
              const ccaliBizTypeCd = ccaliBizTypeInfo?.bizSmallTypeCd;
              const ccaliBizType =
                await this.planService.selectOneCcaliBizTypeByBizSmallTypeCd(
                  ccaliBizTypeCd,
                );
              if (!ccaliBizType) {
                throw new BadRequestException(
                  'Validation Failed(유효하지 않은 중대재해 업종코드)',
                );
              }
              console.log('ccaliBizType', ccaliBizType);
              const ccaliBizTypeNm = ccaliBizType?.bizSmallTypeNm;

              const totEmployeeCnt =
                element.employeeCnt + element.externalEmployeeCnt;

              const subCompanyEntity =
                this.ccaliJoinSubCompanyRepository.create({
                  joinId: joinResult.id,
                  ...element,
                  subCompanyBizNoGbCd,
                  ntsBizTypeCd,
                  ntsBizTypeNm,
                  ccaliBizTypeCd,
                  ccaliBizTypeNm,
                  // korBizTypeId: 0,
                  totEmployeeCnt,
                });
              await queryRunner.manager.save(subCompanyEntity);
            } else {
              // 데이터 업데이트
              const preElement = preSubCompany[index];

              const subCompanyBizNoGbCd = this.commonService.getBizNoType(
                element.subCompanyBizNo,
              );

              const ntsBizTypeInfo = await this.ntsBizTypeRepository.findOne({
                where: {
                  id: element.ntsBizTypeId,
                },
              });
              const ntsBizTypeCd = ntsBizTypeInfo?.bizSubSubTypeCd;
              // 업종코드
              const ntsBizType =
                await this.planService.selectOneNtsBizTypeByBizSmallTypeCd(
                  ntsBizTypeCd,
                );
              if (!ntsBizType) {
                throw new BadRequestException(
                  'Validation Failed(유효하지 않은 국세청 업종코드)',
                );
              }
              console.log('ntsBizType', ntsBizType);
              const ntsBizTypeNm = ntsBizType?.bizSubSubTypeNm;

              const ccaliBizTypeInfo =
                await this.ccaliBizTypeRepository.findOne({
                  where: {
                    bizSmallTypeId: element.ccaliBizTypeId,
                  },
                });
              const ccaliBizTypeCd = ccaliBizTypeInfo?.bizSmallTypeCd;
              const ccaliBizType =
                await this.planService.selectOneCcaliBizTypeByBizSmallTypeCd(
                  ccaliBizTypeCd,
                );
              if (!ccaliBizType) {
                throw new BadRequestException(
                  'Validation Failed(유효하지 않은 중대재해 업종코드)',
                );
              }
              console.log('ccaliBizType', ccaliBizType);
              const ccaliBizTypeNm = ccaliBizType?.bizSmallTypeNm;

              const totEmployeeCnt =
                element.employeeCnt + element.externalEmployeeCnt;

              const subCompanyEntity =
                this.ccaliJoinSubCompanyRepository.create({
                  ...preElement,
                  joinId: joinResult.id,
                  ...element,
                  subCompanyBizNoGbCd,
                  ntsBizTypeCd,
                  ntsBizTypeNm,
                  ccaliBizTypeCd,
                  ccaliBizTypeNm,
                  // korBizTypeId: 0,
                  totEmployeeCnt,
                });
              await queryRunner.manager.save(subCompanyEntity);
            }
          }
        }

        // 자회사 가입 N -> 기존 데이터 삭제
        if (
          ccaliJoinEntity?.planId != 5 ||
          ccaliJoinEntity?.subCompanyJoinYn == 'N' ||
          ccaliJoinEntity?.subCompanyJoinYn == null
        ) {
          await this.ccaliJoinSubCompanyRepository.softDelete({
            joinId: ccaliJoinEntity.id,
          });
        }
      }

      if (ccaliJoinEntity?.planId >= 3 && answerIds?.length > 0) {
        await this.ccaliAnswerResponseRepository.softDelete({
          joinId: joinResult.id,
        });

        for (
          let answerIndex = 0;
          answerIndex < answerIds.length;
          answerIndex++
        ) {
          const answerId = answerIds[answerIndex];
          const questionAnswerInfo =
            await this.ccaliQuestionAnswerTemplateRepository.findOne({
              where: {
                id: answerId,
              },
            });

          const answerResponseEntity =
            this.ccaliAnswerResponseRepository.create({
              joinId: joinResult.id,
              questionId: questionAnswerInfo?.questionId,
              answerId,
              answerValue: questionAnswerInfo.answerText,
            });
          await queryRunner.manager.save(answerResponseEntity);
        }
      }

      console.log('insStartYmd', joinResult?.insStartYmd);
      console.log('insStartTime', joinResult?.insStartTime);
      const insStartDt = dayjs(
        dayjs(joinResult?.insStartYmd).format('YYYY-MM-DD') +
          ' ' +
          joinResult?.insStartTime,
      );
      console.log('insStartDt', insStartDt);
      const joinPayLogs = await this.ccaliJoinPayLogsRepository.find({
        where: {
          joinId: joinResult.id,
        },
        order: {
          payNo: 'ASC',
        },
      });
      if (
        joinResult?.planId == 5 &&
        joinResult?.instalmentNo != null &&
        joinResult?.instalmentNo > 1
      ) {
        for (let index = 0; index < joinResult?.instalmentNo; index++) {
          const payScheduledDt = dayjs(
            insStartDt.subtract(1, 'day').format('YYYY-MM-DD') + ' 16:00',
          ).add(index * (12 / joinResult?.instalmentNo), 'month');
          const payDueDt = insStartDt.add(
            index * (12 / joinResult?.instalmentNo),
            'month',
          );
          console.log(index, 'payScheduledDt', payScheduledDt);
          console.log(index, 'payDueDt', payDueDt);

          if (index > joinPayLogs.length - 1) {
            // 새로
            const joinPayLogsEntity = this.ccaliJoinPayLogsRepository.create({
              joinId: joinResult.id,
              payNo: index + 1,
              payInsCost: joinResult?.totInsCost / joinResult?.instalmentNo,
              payScheduledDt:
                index == 0 ? dayjs().toDate() : dayjs(payScheduledDt).toDate(),
              payDueDt: dayjs(payDueDt).toDate(),
            });
            await queryRunner.manager.save(joinPayLogsEntity);
          } else if (index <= joinPayLogs.length - 1) {
            // 기존
            const element = joinPayLogs[index];
            const joinPayLogsEntity = this.ccaliJoinPayLogsRepository.create({
              ...element,
              payInsCost: joinResult?.totInsCost / joinResult?.instalmentNo,
              payScheduledDt:
                index == 0 ? dayjs().toDate() : dayjs(payScheduledDt).toDate(),
              payDueDt: dayjs(payDueDt).toDate(),
            });
            await queryRunner.manager.save(joinPayLogsEntity);
          }
        }
      } else if (joinResult?.planId >= 3) {
        const payScheduledDt = dayjs(
          insStartDt.subtract(1, 'day').format('YYYY-MM-DD') + ' 16:00',
        );
        const payDueDt = insStartDt;

        const joinPayLogsEntity = this.ccaliJoinPayLogsRepository.create({
          ...joinPayLogs[0],
          payInsCost: joinResult?.totInsCost,
          payScheduledDt: dayjs(payScheduledDt).toDate(),
          payDueDt: dayjs(payDueDt).toDate(),
        });
        await queryRunner.manager.save(joinPayLogsEntity);
      }

      await queryRunner.commitTransaction();
      return { success: true, message: '' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return { success: false, message: err.message };
    } finally {
      await queryRunner.release();
    }
  }

  async updateJoinTransaction(ccaliJoinEntity: Partial<CcaliJoin>) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(ccaliJoinEntity);

      await queryRunner.commitTransaction();
      return { success: true, message: '' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return { success: false, message: err.message };
    } finally {
      await queryRunner.release();
    }
  }

  async updateJoinWithPayLogsTransaction(
    joinEntity: Partial<CcaliJoin>,
    joinPayLogsEntity: Partial<CcaliJoinPayLogs>,
  ) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(joinEntity);
      await queryRunner.manager.save(joinPayLogsEntity);

      await queryRunner.commitTransaction();
      return { success: true, message: '' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return { success: false, message: err.message };
    } finally {
      await queryRunner.release();
    }
  }

  async updateJoinWithInsStockNo(
    joinEntity: Partial<CcaliJoin>,
    joinConfirmEntity: Partial<JoinConfirm>,
  ) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(joinEntity);
      await queryRunner.manager.save(joinConfirmEntity);

      await queryRunner.commitTransaction();
      return { success: true, message: '' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return { success: false, message: err.message };
    } finally {
      await queryRunner.release();
    }
  }

  async updateJoin(req, joinId: number, data: UpdateCcaliJoinReqDto) {
    let statusCode = 200000;
    let returnMsg = 'ok';
    let result = {
      join: {},
    };

    const url = req?.headers?.referer || req?.hostname;
    const {
      locationHref,
      // referIdx,
      // planId,
      // phNm,
      // phFranNm,
      // phBizNo,
      // phPhoneNo,
      // phRrNo,
      // phEmail,
      // phJibunAddr,
      // phRoadAddr,
      // phZipCd,
      // insuredNm,
      insuredFranNm,
      insuredBizNo,
      insuredCorpNo,
      // insuredCorpNationality,
      insuredCorpFoundationYmd,
      // insuredPhoneNo,
      // insuredRrNo,
      // insuredEmail,
      // insuredJibunAddr,
      // insuredRoadAddr,
      // insuredZipCd,
      // insuredBzcOrigin,
      ntsBizTypeId,
      ccaliBizTypeId,
      // salesCost,
      // regularEmployeeCnt,
      // dispatchedEmployeeCnt,
      // subcontractEmployeeCnt,
      // totAnnualWages,
      // openedCurrentYearYn,
      // referralHistoryYn,
      coverageLimitId,
      // deductibleInsCost,
      // payInsCost,
      // totInsCost,
      insStartDt,
      insEndDt,
      // joinRenewNo,
      // beforeReferIdx,
      // recommenderOrganization,
      // recommenderNm,
      answerIds,
      subCompanyJoinYn,
      subCompanyList,
      instalmentNo,
      // productType,
      highRiskProducts,
      ...rest
    } = data;

    const ccaliJoin = await this.ccaliJoinRepository.findOne({
      where: { id: joinId },
    });
    if (!ccaliJoin) {
      statusCode = 200020;
      returnMsg = '가입 신청 내역 없음';

      let responseResult = {
        code: statusCode,
        message: returnMsg,
        result,
      };

      return responseResult;
    }

    let ccaliJoinEntity = this.ccaliJoinRepository.create({
      ...ccaliJoin,
      ...rest,
      highRiskProducts: JSON.stringify(highRiskProducts),
      // insuredFranNm,
      // insuredBizNo,
      // insuredCorpNo,
      // insuredCorpFoundationYmd,
      // ntsBizTypeId,
      // ccaliBizTypeId,
      // coverageLimitId,
      // subCompanyJoinYn,
      // instalmentNo,
    });
    console.log('ccaliJoinEntity', ccaliJoinEntity);
    if (insuredFranNm != null) {
      ccaliJoinEntity.insuredFranNm = insuredFranNm;
    }
    if (insuredBizNo != null) {
      ccaliJoinEntity.insuredBizNo = insuredBizNo;
    }
    if (insuredCorpNo != null) {
      ccaliJoinEntity.insuredCorpNo = insuredCorpNo;
    }
    if (insuredCorpFoundationYmd != null) {
      ccaliJoinEntity.insuredCorpFoundationYmd = dayjs(
        insuredCorpFoundationYmd,
      ).toDate();
    } else if (ccaliJoinEntity?.insuredCorpFoundationYmd != null) {
      ccaliJoinEntity.insuredCorpFoundationYmd = dayjs(
        ccaliJoinEntity.insuredCorpFoundationYmd,
      ).toDate();
    }
    if (ntsBizTypeId != null && ntsBizTypeId != 0) {
      ccaliJoinEntity.ntsBizTypeId = ntsBizTypeId;
    }
    if (ccaliBizTypeId != null && ccaliBizTypeId != 0) {
      ccaliJoinEntity.ccaliBizTypeId = ccaliBizTypeId;
    }
    if (coverageLimitId != null) {
      ccaliJoinEntity.coverageLimitId = coverageLimitId;
    }
    if (subCompanyJoinYn != null) {
      ccaliJoinEntity.subCompanyJoinYn = subCompanyJoinYn;
    }
    if (instalmentNo != null) {
      ccaliJoinEntity.instalmentNo = instalmentNo;
    }
    if (ccaliJoinEntity?.planId >= 3 && ccaliJoinEntity?.payNo == 0) {
      ccaliJoinEntity.payInsCost = 0;
    }

    // 사업자번호 중복체크
    let joinCheck = true;
    const joinBizData = await this.selectCheckJoinWithSubCompanyByInsuredBizNo(
      ccaliJoinEntity?.insuredBizNo,
    );
    console.log('joinBizData', joinBizData);
    for (
      let joinBizIndex = 0;
      joinBizIndex < joinBizData.length;
      joinBizIndex++
    ) {
      const joinBizElement = joinBizData[joinBizIndex];

      let nowInsStartDt = dayjs().format('YYYY-MM-DD HH:mm:ss');
      if (ccaliJoinEntity?.planId < 3) {
        nowInsStartDt = dayjs(insStartDt).format('YYYY-MM-DD') + ' ' + '00:00';
      }
      let joinBizInsEndDt = null;
      if (joinBizElement.insEndYmd != null) {
        joinBizInsEndDt =
          dayjs(joinBizElement.insEndYmd).format('YYYY-MM-DD') +
          ' ' +
          joinBizElement.insEndTime;
      }

      if (
        (joinBizElement.joinStatusCd == 'Y' ||
          joinBizElement.joinStatusCd == 'N') &&
        dayjs(nowInsStartDt) < dayjs(joinBizInsEndDt)
      ) {
        joinCheck = false;
        break;
      } else if (joinBizElement.joinStatusCd == 'P') {
        joinCheck = false;
        break;
      }
    }
    if (!joinCheck) {
      statusCode = 201012;
      returnMsg = '이미 가입신청한 사업자 등록번호예요';

      let responseResult = {
        code: statusCode,
        message: returnMsg,
        result,
      };

      return responseResult;
    }

    const totEmployeeCnt =
      ccaliJoinEntity?.regularEmployeeCnt +
      ccaliJoinEntity?.dispatchedEmployeeCnt +
      ccaliJoinEntity?.subcontractEmployeeCnt;

    // 플랜 ID -> 플랜 명
    const insPlan = await this.planService.selectInsProdComPlanByPlanId(
      ccaliJoinEntity?.planId,
      ccaliJoinEntity?.joinAccount,
    );
    if (!insPlan) {
      throw new BadRequestException('Validation Failed(planId)');
    } else if (insPlan?.insProdId == null || insPlan?.insComCd == null) {
      throw new BadRequestException('Validation Failed(planId)');
    } else if (ccaliJoinEntity?.planId != 5 && totEmployeeCnt >= 50) {
      throw new BadRequestException('Validation Failed(planId)');
    } else if (
      ccaliJoinEntity?.planId != 4 &&
      totEmployeeCnt < 50 &&
      ccaliJoinEntity?.salesCost > 100000000000
    ) {
      throw new BadRequestException('Validation Failed(planId)');
    }

    // 송치여부
    if (ccaliJoinEntity?.referralHistoryYn != 'N') {
      throw new BadRequestException('Validation Failed(referralHistoryYn)');
    }

    // 법인 설립일
    if (
      ccaliJoinEntity?.insuredCorpFoundationYmd != null &&
      dayjs(ccaliJoinEntity?.insuredCorpFoundationYmd).format('YYYYMMDD') ==
        'Invalid Date'
    ) {
      throw new BadRequestException(
        'Validation Failed(insuredCorpFoundationYmd)',
      );
    } else if (
      ccaliJoinEntity?.insuredCorpFoundationYmd != null &&
      dayjs().format('YYYYMMDD') <
        dayjs(ccaliJoinEntity?.insuredCorpFoundationYmd).format('YYYYMMDD')
    ) {
      throw new BadRequestException(
        'Validation Failed(insuredCorpFoundationYmd)',
      );
    }

    // 자회사 가입 여부
    if (
      ccaliJoinEntity?.planId != 5 &&
      ccaliJoinEntity?.subCompanyJoinYn == 'Y'
    ) {
      throw new BadRequestException('Validation Failed(subCompanyJoinYn)');
    } else if (ccaliJoinEntity?.planId != 5 && subCompanyList?.length > 0) {
      throw new BadRequestException('Validation Failed(subCompanyList)');
    } else if (
      ccaliJoinEntity?.subCompanyJoinYn == 'Y' &&
      subCompanyList?.length == 0
    ) {
      throw new BadRequestException('Validation Failed(subCompanyList)');
    }

    // 질문서 답변
    let specialClauseAnswerId = 0;
    let guaranteeRegionAnswerId = 0;
    let perAccidentCoverageLimitAnswerId = 0;
    let totCoverageLimitAnswerId = 0;
    let industryAnswerIds = [];
    let civilAnswerIds = [];
    if (
      ccaliJoinEntity?.planId >= 3 &&
      answerIds != null &&
      answerIds?.length > 0
    ) {
      // 특별약관 가입
      let specialClauseIds = [16, 18];
      let specialClauseAnswer = answerIds.filter((item) =>
        specialClauseIds.includes(item),
      );
      if (specialClauseAnswer.length != 1) {
        throw new BadRequestException('Validation Failed(answerIds)');
      } else {
        specialClauseAnswerId = specialClauseAnswer[0];
      }

      if (ccaliJoinEntity?.planId == 5) {
        // 보험 담보 지역
        let guaranteeRegionIds = [32, 33];
        let guaranteeRegionAnswer = answerIds.filter((item) =>
          guaranteeRegionIds.includes(item),
        );
        if (guaranteeRegionAnswer.length != 1) {
          throw new BadRequestException('Validation Failed(answerIds)');
        } else {
          guaranteeRegionAnswerId = guaranteeRegionAnswer[0];
        }

        // 중대산업재해 추가 정보
        let industryList = [
          {
            questionId: 29,
            questionText:
              '최근 3년 내 산업안전보건법 또는 중대재해 처벌법(산업재해) 위반 여부',
            questionExplain: null,
            answerData: [
              {
                answerId: 49,
                answerType: 'radio',
                answerText: '없음',
              },
              {
                answerId: 50,
                answerType: 'radio',
                answerText: '1회',
              },
              {
                answerId: 51,
                answerType: 'radio',
                answerText: '2회',
              },
              {
                answerId: 52,
                answerType: 'radio',
                answerText: '3회 이상',
              },
            ],
          },
          {
            questionId: 30,
            questionText:
              '현재 산업안전보건법 또는 중대재해처벌법 관련  계류중인 소송 여부',
            questionExplain: null,
            answerData: [
              {
                answerId: 53,
                answerType: 'radio',
                answerText: '없음',
              },
              {
                answerId: 54,
                answerType: 'radio',
                answerText: '1건',
              },
              {
                answerId: 55,
                answerType: 'radio',
                answerText: '2건',
              },
              {
                answerId: 56,
                answerType: 'radio',
                answerText: '3건 이상',
              },
            ],
          },
          {
            questionId: 31,
            questionText:
              '최근 3년 내 산업재해 관련 사망자 여부 (3년 누적 기준)',
            questionExplain: null,
            answerData: [
              {
                answerId: 57,
                answerType: 'radio',
                answerText: '없음',
              },
              {
                answerId: 58,
                answerType: 'radio',
                answerText: '3명 이하',
              },
              {
                answerId: 59,
                answerType: 'radio',
                answerText: '10명 이하',
              },
              {
                answerId: 60,
                answerType: 'radio',
                answerText: '11명 이상',
              },
            ],
          },
          {
            questionId: 32,
            questionText:
              '최근 3년 내 산업재해 관련 부상 인원 여부 (3년 누적 기준)',
            questionExplain: null,
            answerData: [
              {
                answerId: 61,
                answerType: 'radio',
                answerText: '10명 이하',
              },
              {
                answerId: 62,
                answerType: 'radio',
                answerText: '30명 이하',
              },
              {
                answerId: 63,
                answerType: 'radio',
                answerText: '50명 이하',
              },
              {
                answerId: 64,
                answerType: 'radio',
                answerText: '51명 이상',
              },
            ],
          },
          {
            questionId: 33,
            questionText:
              '최근 3년 내 산업재해 관련 질병 인원 여부 (3년 누적 기준)',
            questionExplain: null,
            answerData: [
              {
                answerId: 65,
                answerType: 'radio',
                answerText: '5명 이하',
              },
              {
                answerId: 66,
                answerType: 'radio',
                answerText: '10명 이하',
              },
              {
                answerId: 67,
                answerType: 'radio',
                answerText: '20명 이하',
              },
              {
                answerId: 68,
                answerType: 'radio',
                answerText: '21명 이상',
              },
            ],
          },
          {
            questionId: 34,
            questionText: '전체 근로자 중 60대 이상 근로자 비중',
            questionExplain: null,
            answerData: [
              {
                answerId: 69,
                answerType: 'radio',
                answerText: '20% 미만',
              },
              {
                answerId: 70,
                answerType: 'radio',
                answerText: '30% 미만',
              },
              {
                answerId: 71,
                answerType: 'radio',
                answerText: '40% 미만',
              },
              {
                answerId: 72,
                answerType: 'radio',
                answerText: '40% 이상',
              },
            ],
          },
          {
            questionId: 35,
            questionText: '전체 근로자 중 1년 미만 근로자 비중',
            questionExplain: null,
            answerData: [
              {
                answerId: 73,
                answerType: 'radio',
                answerText: '10% 미만',
              },
              {
                answerId: 74,
                answerType: 'radio',
                answerText: '15% 미만',
              },
              {
                answerId: 75,
                answerType: 'radio',
                answerText: '20% 미만',
              },
              {
                answerId: 76,
                answerType: 'radio',
                answerText: '20% 이상',
              },
            ],
          },
          {
            questionId: 36,
            questionText:
              '산업안전보건법 대비 교육시간전체 근로자 중 1년 미만 근로자 비중',
            questionExplain: null,
            answerData: [
              {
                answerId: 77,
                answerType: 'radio',
                answerText: '3배 이상',
              },
              {
                answerId: 78,
                answerType: 'radio',
                answerText: '2배 이상',
              },
              {
                answerId: 79,
                answerType: 'radio',
                answerText: '1배 초과',
              },
              {
                answerId: 80,
                answerType: 'radio',
                answerText: '1배 이하',
              },
            ],
          },
          {
            questionId: 37,
            questionText: '하청직원 작업 전 (1) 안전교육 실시, (2) 점검표 작성',
            questionExplain: null,
            answerData: [
              {
                answerId: 81,
                answerType: 'radio',
                answerText: '실시 O, 작성 O',
              },
              {
                answerId: 82,
                answerType: 'radio',
                answerText: '실시 O, 작성 X',
              },
              {
                answerId: 83,
                answerType: 'radio',
                answerText: '실시 X, 작성 O',
              },
              {
                answerId: 84,
                answerType: 'radio',
                answerText: '실시 X, 작성 X',
              },
            ],
          },
          {
            questionId: 38,
            questionText: '자율점검표 작성 및 긍정 비중',
            questionExplain: null,
            answerData: [
              {
                answerId: 85,
                answerType: 'radio',
                answerText: '긍정비율 90% 이상',
              },
              {
                answerId: 86,
                answerType: 'radio',
                answerText: '긍정비율 70% 이상',
              },
              {
                answerId: 87,
                answerType: 'radio',
                answerText: '긍정비율 50% 이상',
              },
              {
                answerId: 88,
                answerType: 'radio',
                answerText: '긍정비율 50% 미만',
              },
            ],
          },
          {
            questionId: 39,
            questionText: '전체 근로자 대비 외부 하청 근로자 비중',
            questionExplain: null,
            answerData: [
              {
                answerId: 89,
                answerType: 'radio',
                answerText: '10% 미만',
              },
              {
                answerId: 90,
                answerType: 'radio',
                answerText: '20% 미만',
              },
              {
                answerId: 91,
                answerType: 'radio',
                answerText: '30% 미만',
              },
              {
                answerId: 92,
                answerType: 'radio',
                answerText: '30% 이상',
              },
            ],
          },
          {
            questionId: 40,
            questionText: '보건 및 안전 관리에 대한 자율점검*',
            questionExplain: null,
            answerData: [
              {
                answerId: 93,
                answerType: 'radio',
                answerText: '1년에 4회 이상',
              },
              {
                answerId: 94,
                answerType: 'radio',
                answerText: '1년에 3회',
              },
              {
                answerId: 95,
                answerType: 'radio',
                answerText: '1년에 2회',
              },
              {
                answerId: 96,
                answerType: 'radio',
                answerText: '1년에 1회',
              },
            ],
          },
        ];
        // 중대시민재해 추가 정보
        let civilList = [
          {
            questionId: 41,
            questionText: '최근 3년 내 관련 법* 또는 중대재해 처벌법 위반 여부',
            questionExplain:
              '* 관련법 범위: 제조물책임법, 실내공기질관리법, 시설물의 안전 및 유지관리에 관한 특별법, 다중이용업소의 안전관리에 관한 특별법',
            answerData: [
              {
                answerId: 97,
                answerType: 'radio',
                answerText: '없음',
              },
              {
                answerId: 98,
                answerType: 'radio',
                answerText: '1회',
              },
              {
                answerId: 99,
                answerType: 'radio',
                answerText: '2회',
              },
              {
                answerId: 100,
                answerType: 'radio',
                answerText: '3회 이상',
              },
            ],
          },
          {
            questionId: 42,
            questionText:
              '현재 관련법 또는 중대재해처벌법 관련 계류중인 소송 여부',
            questionExplain: null,
            answerData: [
              {
                answerId: 101,
                answerType: 'radio',
                answerText: '없음',
              },
              {
                answerId: 102,
                answerType: 'radio',
                answerText: '1건',
              },
              {
                answerId: 103,
                answerType: 'radio',
                answerText: '2건',
              },
              {
                answerId: 104,
                answerType: 'radio',
                answerText: '3건 이상',
              },
            ],
          },
          {
            questionId: 43,
            questionText: '최근 3년내 시민재해 관련 사망자 여부',
            questionExplain: null,
            answerData: [
              {
                answerId: 105,
                answerType: 'radio',
                answerText: '없음',
              },
              {
                answerId: 106,
                answerType: 'radio',
                answerText: '3명 이하',
              },
              {
                answerId: 107,
                answerType: 'radio',
                answerText: '10명 이하',
              },
              {
                answerId: 108,
                answerType: 'radio',
                answerText: '11명 이상',
              },
            ],
          },
          {
            questionId: 44,
            questionText: '최근 3년내 시민재해 관련 부상 인원 여부',
            questionExplain: null,
            answerData: [
              {
                answerId: 109,
                answerType: 'radio',
                answerText: '10명 이하',
              },
              {
                answerId: 110,
                answerType: 'radio',
                answerText: '30명 이하',
              },
              {
                answerId: 111,
                answerType: 'radio',
                answerText: '50명 이하',
              },
              {
                answerId: 112,
                answerType: 'radio',
                answerText: '51명 이상',
              },
            ],
          },
          {
            questionId: 45,
            questionText: '최근 3년내 시민재해 관련 질병 인원 여부',
            questionExplain: null,
            answerData: [
              {
                answerId: 113,
                answerType: 'radio',
                answerText: '5명 이하',
              },
              {
                answerId: 114,
                answerType: 'radio',
                answerText: '10명 이하',
              },
              {
                answerId: 115,
                answerType: 'radio',
                answerText: '20명 이하',
              },
              {
                answerId: 116,
                answerType: 'radio',
                answerText: '21명 이상',
              },
            ],
          },
          {
            questionId: 46,
            questionText: '중대시민재해를 전담하는 조직 여부',
            questionExplain: null,
            answerData: [
              {
                answerId: 117,
                answerType: 'radio',
                answerText: '전담부서, 전담직원 O',
              },
              {
                answerId: 118,
                answerType: 'radio',
                answerText: '겸직부서, 전담직원 O',
              },
              {
                answerId: 119,
                answerType: 'radio',
                answerText: '겸직부서, 겸직직원 O',
              },
              {
                answerId: 120,
                answerType: 'radio',
                answerText: '부서배정 및 직원배정 없음',
              },
            ],
          },
          {
            questionId: 47,
            questionText: '보건 및 안전관리에 대한 자율점검',
            questionExplain: null,
            answerData: [
              {
                answerId: 121,
                answerType: 'radio',
                answerText: '1년에 4회 이상',
              },
              {
                answerId: 122,
                answerType: 'radio',
                answerText: '1년에 3회',
              },
              {
                answerId: 123,
                answerType: 'radio',
                answerText: '1년에 2회',
              },
              {
                answerId: 124,
                answerType: 'radio',
                answerText: '1년에 1회',
              },
            ],
          },
          {
            questionId: 48,
            questionText: '응급사태 매뉴얼 보유 및 모의 훈련 실시',
            questionExplain: null,
            answerData: [
              {
                answerId: 125,
                answerType: 'radio',
                answerText: '매뉴얼 X, 모의훈련 O',
              },
              {
                answerId: 126,
                answerType: 'radio',
                answerText: '매뉴얼 O, 모의훈련 O',
              },
              {
                answerId: 127,
                answerType: 'radio',
                answerText: '매뉴얼 O, 모의훈련 X',
              },
              {
                answerId: 128,
                answerType: 'radio',
                answerText: '매뉴얼 X, 모의훈련 X',
              },
            ],
          },
        ];

        if (specialClauseAnswerId == 16 || specialClauseAnswerId == 18) {
          // 중대산업재해
          for (
            let industryIndex = 0;
            industryIndex < industryList.length;
            industryIndex++
          ) {
            const industryElement = industryList[industryIndex];
            let industryIds = [];

            for (
              let industryAnswerIndex = 0;
              industryAnswerIndex < industryElement.answerData.length;
              industryAnswerIndex++
            ) {
              const industryAnswerElement =
                industryElement.answerData[industryAnswerIndex];

              industryIds.push(industryAnswerElement.answerId);

              if (
                industryAnswerIndex ==
                industryElement.answerData.length - 1
              ) {
                let industryAnswer = answerIds.filter((item) =>
                  industryIds.includes(item),
                );
                if (industryAnswer.length != 1) {
                  throw new BadRequestException('Validation Failed(answerIds)');
                } else {
                  industryAnswerIds.push(industryAnswer[0]);
                }
              }
            }
          }
        }

        if (specialClauseAnswerId == 18) {
          // 중대시민재해
          for (
            let civilIndex = 0;
            civilIndex < civilList.length;
            civilIndex++
          ) {
            const civilElement = civilList[civilIndex];
            let civilIds = [];

            for (
              let civilAnswerIndex = 0;
              civilAnswerIndex < civilElement.answerData.length;
              civilAnswerIndex++
            ) {
              const civilAnswerElement =
                civilElement.answerData[civilAnswerIndex];

              civilIds.push(civilAnswerElement.answerId);

              if (civilAnswerIndex == civilElement.answerData.length - 1) {
                let civilAnswer = answerIds.filter((item) =>
                  civilIds.includes(item),
                );
                if (civilAnswer.length != 1) {
                  throw new BadRequestException('Validation Failed(answerIds)');
                } else {
                  civilAnswerIds.push(civilAnswer[0]);
                }
              }
            }
          }
        }
      }
    }

    let beforeInsStockNo;
    if (ccaliJoinEntity?.beforeReferIdx != null) {
      const beforeCcaliiJoin = await this.ccaliJoinRepository.findOne({
        where: {
          referIdx: ccaliJoinEntity.beforeReferIdx,
        },
      });
      beforeInsStockNo = beforeCcaliiJoin?.insStockNo;
    }

    const insPlanType = insPlan.planType; //
    const insPlanNm = insPlan.planNm; //
    const insProdId = insPlan.insProdId;
    const insProdCd = insPlan.insProdCd; // ccali
    const insProdNm = insPlan.insProdNm; // 중대재해
    const insProdFullNm = insPlan.insProdFullNm; // 기업중대사고 배상책임보험
    const insComCd = insPlan.insComCd; // DB
    const insComNm = insPlan.insComNm; // DB손해보험
    const insComFullNm = insPlan.insComFullNm; // DB손해보험(주)
    let planNm = '';
    planNm = planNm + ' ' + insPlanNm;

    const insuredBizNoGbCd = this.commonService.getBizNoType(
      ccaliJoinEntity?.insuredBizNo,
    );
    let phBizNoGbCd = ccaliJoinEntity?.phBizNoGbCd;
    if (
      ccaliJoinEntity?.phBizNo != null &&
      ccaliJoinEntity?.phBizNo != '' &&
      ccaliJoinEntity?.phBizNo.length == 10
    ) {
      phBizNoGbCd = this.commonService.getBizNoType(ccaliJoinEntity?.phBizNo);
    }

    let ntsBizTypeCd = ccaliJoin.ntsBizTypeCd;
    let ntsBizTypeNm = ccaliJoin.ntsBizTypeNm;
    if (ntsBizTypeId != null) {
      const ntsBizTypeInfo = await this.ntsBizTypeRepository.findOne({
        where: {
          id: ntsBizTypeId,
        },
      });
      ntsBizTypeCd = ntsBizTypeInfo?.bizSubSubTypeCd;
      ntsBizTypeNm = ntsBizTypeInfo?.bizSubSubTypeNm;
    }

    let ccaliBizTypeCd = ccaliJoin.ccaliBizTypeCd;
    let ccaliBizTypeNm = ccaliJoin.ccaliBizTypeNm;
    if (ccaliBizTypeId != null) {
      const ccaliBizTypeInfo = await this.ccaliBizTypeRepository.findOne({
        where: {
          bizSmallTypeId: ccaliBizTypeId,
        },
      });
      ccaliBizTypeCd = ccaliBizTypeInfo?.bizSmallTypeCd;
      ccaliBizTypeNm = ccaliBizTypeInfo?.bizSmallTypeNm;

      if (
        ccaliBizTypeInfo?.bizLargeTypeNm == '제조업' &&
        ccaliJoinEntity?.productType == null
      ) {
        throw new BadRequestException('Validation Failed(productType)');
      } else if (
        ccaliBizTypeInfo?.bizLargeTypeNm == '제조업' &&
        ccaliJoinEntity?.highRiskProducts == null
      ) {
        throw new BadRequestException('Validation Failed(highRiskProducts)');
      } else if (
        ccaliBizTypeInfo?.bizLargeTypeNm == '제조업' &&
        JSON.parse(ccaliJoinEntity?.highRiskProducts)?.length > 0
      ) {
        const checkHighRiskProducts = [
          '항공기 및 관련 부품',
          '완성차 및 관련 부품',
          '타이어',
          '헬멧',
          '철도 및 철로용 신호장치',
          '농약 및 제초제',
          '담배',
          '의약품 및 체내이식형 의료기기',
          '혈액 및 인체추출 물질',
          '폭죽, 탄약, 화약 등 폭발 용도로 사용되는 제품',
        ];
        JSON.parse(ccaliJoinEntity?.highRiskProducts).map((value, index) => {
          if (!checkHighRiskProducts.includes(value)) {
            throw new BadRequestException(
              'Validation Failed(highRiskProducts)',
            );
          }
        });
      }
    }

    // 업종코드
    // const ntsBizType =
    //   await this.planService.selectOneNtsBizTypeByBizSmallTypeCd(
    //     ccaliJoinEntity?.ntsBizTypeCd,
    //   );
    // if (!ntsBizType) {
    //   // 검색 결과 없음
    //   statusCode = 200020;
    //   returnMsg = '유효하지 않은 국세청 업종코드';
    // }
    // if (statusCode != 200000) {
    //   let responseResult = {
    //     code: statusCode,
    //     message: returnMsg,
    //     result,
    //   };

    //   return responseResult;
    // }
    // console.log('ntsBizType', ntsBizType);
    // const ntsBizTypeNm = ntsBizType?.bizSubSubTypeNm;

    // const ccaliBizType =
    //   await this.planService.selectOneCcaliBizTypeByBizSmallTypeCd(
    //     ccaliJoinEntity?.ccaliBizTypeCd,
    //   );
    // if (!ccaliBizType) {
    //   // 검색 결과 없음
    //   statusCode = 200020;
    //   returnMsg = '유효하지 않은 중대재해 업종코드';
    // }
    // if (statusCode != 200000) {
    //   let responseResult = {
    //     code: statusCode,
    //     message: returnMsg,
    //     result,
    //   };

    //   return responseResult;
    // }
    // console.log('ccaliBizType', ccaliBizType);
    // const ccaliBizTypeNm = ccaliBizType?.bizSmallTypeNm;

    // 보상한도
    const coverageLimit = await this.planService.selectOneCoverageLimitById(
      ccaliJoinEntity?.coverageLimitId,
    );
    if (!coverageLimit) {
      // 검색 결과 없음
      statusCode = 200020;
      returnMsg = '유효하지 않은 보상한도 ID';
    }
    if (statusCode != 200000) {
      let responseResult = {
        code: statusCode,
        message: returnMsg,
        result,
      };

      return responseResult;
    }
    console.log('coverageLimit', coverageLimit);
    const perAccidentCoverageLimit = coverageLimit?.perAccidentCoverageLimit;
    const totCoverageLimit = coverageLimit?.totCoverageLimit;
    if (ccaliJoinEntity?.planId >= 3 && ccaliJoinEntity?.planId <= 4) {
      if (coverageLimitId == 1) {
        totCoverageLimitAnswerId = 164;
      } else if (coverageLimitId == 2) {
        totCoverageLimitAnswerId = 165;
      } else if (coverageLimitId == 3) {
        totCoverageLimitAnswerId = 166;
      } else if (coverageLimitId == 4) {
        totCoverageLimitAnswerId = 167;
      }
    } else if (ccaliJoinEntity?.planId == 5) {
      if (coverageLimitId == 2) {
        perAccidentCoverageLimitAnswerId = 34;
        totCoverageLimitAnswerId = 40;
      } else if (coverageLimitId == 3) {
        perAccidentCoverageLimitAnswerId = 35;
        totCoverageLimitAnswerId = 41;
      } else if (coverageLimitId == 4) {
        perAccidentCoverageLimitAnswerId = 36;
        totCoverageLimitAnswerId = 42;
      } else if (coverageLimitId == 5) {
        perAccidentCoverageLimitAnswerId = 37;
        totCoverageLimitAnswerId = 43;
      } else if (coverageLimitId == 6) {
        perAccidentCoverageLimitAnswerId = 38;
        totCoverageLimitAnswerId = 44;
      } else if (coverageLimitId == 7) {
        perAccidentCoverageLimitAnswerId = 39;
        totCoverageLimitAnswerId = 45;
      }
    }

    // 5. 약관동의 로그 체크 + 마케팅 동의 여부 조회
    let marketingAgreeYn = 'N';
    const ip =
      req?.get('x-forwarded-for') || req?.ip || req?.connection.remoteAddress;
    console.log('ip', ip);
    const marketingAgreeLog = await this.termsAgreeLogsRepository.findOne({
      where: {
        termsAgreeCd: 'ccali/marketing_personal_terms',
        ipAddress: ip,
        insuredBizNo: ccaliJoinEntity?.insuredBizNo,
        insuredFranNm: ccaliJoinEntity?.insuredFranNm,
      },
      order: { id: 'DESC' },
    });
    console.log('marketingAgreeLog', marketingAgreeLog);
    if (marketingAgreeLog?.agree == 1) {
      marketingAgreeYn = 'Y';
    }

    // 6. 필요한 정보 조회
    // 가입일 -> 오늘
    // const joinYmd = dayjs().toDate();
    // 보험 시작일시 -> 보험 시작일, 보험 시작 시간
    let insStartYmd = ccaliJoinEntity?.insStartYmd;
    let insStartTime = ccaliJoinEntity?.insStartTime;
    if (insStartDt != null) {
      insStartYmd = dayjs(dayjs(insStartDt).format('YYYY-MM-DD')).toDate();
      insStartTime = '00:00';
    }
    // 보험 종료일시 -> 보험 종료일, 보험 종료 시간
    let insEndYmd = ccaliJoinEntity?.insEndYmd;
    let insEndTime = ccaliJoinEntity?.insEndTime;
    if (insEndDt != null) {
      insEndYmd = dayjs(dayjs(insEndDt).format('YYYY-MM-DD')).toDate();
      insEndTime = '00:00';
    }

    ccaliJoinEntity = this.ccaliJoinRepository.create({
      ...ccaliJoinEntity,
      planNm: planNm.trim(),
      insuredBizNoGbCd,
      insComCd,
      phBizNoGbCd,
      // insuredFranNm,
      // insuredBizNo,
      // insuredCorpNo,
      // ntsBizTypeId,
      ntsBizTypeCd,
      ntsBizTypeNm,
      // ccaliBizTypeId,
      ccaliBizTypeCd,
      ccaliBizTypeNm,
      totEmployeeCnt,
      guaranteeDisaterCd:
        specialClauseAnswerId == 16
          ? 'indst'
          : specialClauseAnswerId == 17
            ? 'civil'
            : specialClauseAnswerId == 18
              ? 'all'
              : ccaliJoinEntity?.guaranteeDisaterCd,
      guaranteeRegionCd:
        guaranteeRegionAnswerId == 32
          ? 'D'
          : guaranteeRegionAnswerId == 33
            ? 'W'
            : ccaliJoinEntity?.guaranteeRegionCd,
      // subCompanyJoinYn,
      // coverageLimitId,
      perAccidentCoverageLimit,
      totCoverageLimit,
      // joinYmd,
      insStartYmd,
      insStartTime,
      insEndYmd,
      insEndTime,
      beforeInsStockNo: beforeInsStockNo != null ? beforeInsStockNo : null,
      marketingAgreeYn,
    });

    let answerIdArray = [];
    if (specialClauseAnswerId != 0) {
      answerIdArray.push(specialClauseAnswerId);
    }
    if (guaranteeRegionAnswerId != 0) {
      answerIdArray.push(guaranteeRegionAnswerId);
    }
    if (perAccidentCoverageLimitAnswerId != 0) {
      answerIdArray.push(perAccidentCoverageLimitAnswerId);
    }
    if (totCoverageLimitAnswerId != 0) {
      answerIdArray.push(totCoverageLimitAnswerId);
    }
    if (industryAnswerIds.length != 0) {
      answerIdArray.push(...industryAnswerIds);
    }
    if (civilAnswerIds.length != 0) {
      answerIdArray.push(...civilAnswerIds);
    }

    const updateResult =
      await this.updateJoinWithSubCompanyAndPayLosgTransaction(
        ccaliJoinEntity,
        answerIdArray,
        subCompanyList,
      );
    if (!updateResult.success) {
      statusCode = 200011;
      returnMsg = `저장 실패(${updateResult.message})`;
    } else {
      const ccaliJoinData = await this.ccaliJoinRepository.findOne({
        where: {
          id: joinId,
        },
      });
      result.join = ccaliJoinData;
    }

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  async updateJoinPayment(req, joinId: number, data: UpdateJoinPaymentReqDto) {
    let statusCode = 200000;
    let returnMsg = 'ok';
    let result = {
      join: {},
    };

    const { payNo, payInsCost, payStatusCd, payMethod, payLogsId } = data;

    const ccaliJoin = await this.selectJoinWithPayLogsByJoinId(joinId);
    console.log('ccaliJoin', ccaliJoin);
    if (!ccaliJoin) {
      statusCode = 200020;
      returnMsg = '검색 결과 없음';
    }

    if (statusCode == 200000) {
      if (ccaliJoin[0]?.payYn == 'N') {
        statusCode = 200011;
        returnMsg = `저장 실패(유료 상품이 아님)`;
      } else if (payStatusCd == 'C') {
        let updatePayStatusCd = payStatusCd;
        let updateJoinStatusCd = 'C';

        const ccaliJoinEntity = this.ccaliJoinRepository.create({
          ...ccaliJoin,
          id: joinId,
          payMethod,
          payStatusCd: updatePayStatusCd,
          payDt: null,
          payLogsId: payLogsId,
          joinStatusCd: updateJoinStatusCd,
        });
        const updateCcaliJoin =
          await this.updateJoinTransaction(ccaliJoinEntity);
        if (!updateCcaliJoin.success) {
          statusCode = 200011;
          returnMsg = `저장 실패(${updateCcaliJoin.message})`;
        }
      } else if (ccaliJoin[0]?.payStatusCd == 'Y' && payStatusCd != 'C') {
        statusCode = 200011;
        returnMsg = `저장 실패(이미 결제된 정보)`;
      } else if (
        ccaliJoin[0]?.instalmentNo == 1 &&
        ccaliJoin[0]?.totInsCost != payInsCost
      ) {
        statusCode = 200011;
        returnMsg = `저장 실패(결제 금액 다름)`;
      } else {
        const joinId = ccaliJoin[0].id;
        const joinPayLogId = ccaliJoin[0].joinPayLogs[payNo - 1].id;
        const notPayLogs = await this.ccaliJoinPayLogsRepository.find({
          where: {
            joinId: joinId,
            payDt: IsNull(),
          },
          order: {
            payNo: 'ASC',
          },
        });

        const payDt = dayjs().toDate();

        let updatePayStatusCd = payStatusCd;
        if (ccaliJoin[0]?.instalmentNo == 1 && payStatusCd == 'Y') {
          updatePayStatusCd = 'Y';
        } else if (
          ccaliJoin[0]?.instalmentNo > 1 &&
          payNo == ccaliJoin[0].joinPayLogs.length &&
          payStatusCd == 'Y'
        ) {
          updatePayStatusCd = 'Y';
        } else if (payStatusCd == 'Y') {
          updatePayStatusCd = 'I';
        } else if (payStatusCd == 'N') {
          updatePayStatusCd = 'F';
        }

        let updateJoinStatusCd = ccaliJoin[0]?.joinStatusCd;
        if (
          (ccaliJoin[0]?.joinStatusCd == null ||
            ccaliJoin[0]?.joinStatusCd != 'Y') &&
          payStatusCd == 'Y'
        ) {
          updateJoinStatusCd = 'Y';
        } else if (
          (ccaliJoin[0]?.joinStatusCd == null ||
            ccaliJoin[0]?.joinStatusCd != 'Y') &&
          payStatusCd == 'N' &&
          payMethod == 'DBANK'
        ) {
          updateJoinStatusCd = 'N';
        }
        const ccaliJoinEntity = this.ccaliJoinRepository.create({
          ...ccaliJoin[0],
          id: joinId,
          payNo,
          payMethod,
          payInsCost:
            payStatusCd != 'Y'
              ? Number(ccaliJoin[0]?.payInsCost)
              : ccaliJoin[0]?.planId <= 2
                ? Number(ccaliJoin[0]?.payInsCost)
                : Number(ccaliJoin[0]?.payInsCost) + Number(payInsCost),
          payStatusCd: updatePayStatusCd,
          payDt: ccaliJoin[0]?.payDt == null ? payDt : ccaliJoin[0]?.payDt,
          joinStatusCd: updateJoinStatusCd,
        });
        const ccaliJoinPayLogsEntity = this.ccaliJoinPayLogsRepository.create({
          id: joinPayLogId,
          payMethod,
          payLogsId,
          payDt,
        });
        const updateCcaliJoin = await this.updateJoinWithPayLogsTransaction(
          ccaliJoinEntity,
          ccaliJoinPayLogsEntity,
        );
        if (!updateCcaliJoin.success) {
          statusCode = 200011;
          returnMsg = `저장 실패(${updateCcaliJoin.message})`;
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

  async updateJoinCertPayMethod(req, joinId: number, data: UpdateJoinReqDto) {
    let statusCode = 200000;
    let returnMsg = 'ok';
    let result: any = {
      join: {},
    };

    const ccaliJoin = await this.selectJoinWithPayLogsByJoinId(joinId);
    console.log('ccaliJoin', ccaliJoin);
    if (!ccaliJoin) {
      statusCode = 200020;
      returnMsg = '검색 결과 없음';
    }

    if (statusCode == 200000) {
      const firstPayLogId = ccaliJoin[0].joinPayLogs[0].id;
      let updateJoinStatusCd = ccaliJoin[0]?.joinStatusCd;
      if (data?.payMethod != null && data?.payMethod == 'DBANK') {
        updateJoinStatusCd = 'N';
      }

      const ccaliJoinEntity = this.ccaliJoinRepository.create({
        id: joinId,
        joinStatusCd: updateJoinStatusCd,
        ...data,
      });
      const ccaliJoinPayLogsEntity = this.ccaliJoinPayLogsRepository.create({
        id: firstPayLogId,
        payMethod: data.payMethod,
      });
      const updateCcaliJoin = await this.updateJoinWithPayLogsTransaction(
        ccaliJoinEntity,
        ccaliJoinPayLogsEntity,
      );
      if (!updateCcaliJoin.success) {
        statusCode = 200011;
        returnMsg = `저장 실패(${updateCcaliJoin.message})`;
      }
    }

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  async createInsStockNo(req, joinId: number) {
    let statusCode = 201000;
    let returnMsg = 'ok';
    let result = {
      join: {},
    };

    const ccaliJoin = await this.ccaliJoinRepository.findOne({
      where: {
        id: joinId,
      },
    });
    if (!ccaliJoin) {
      statusCode = 201020;
      returnMsg = '검색 결과 없음';
    } else if (ccaliJoin.joinStatusCd != 'Y') {
      statusCode = 201012;
      returnMsg = '가입 완료되지 않음';
    }
    console.log('ccaliJoin', ccaliJoin);

    if (statusCode == 201000) {
      const updateJoin = await this.funCreateInsStockNo({
        insProdId: ccaliJoin.insProdId,
        planId: ccaliJoin.planId,
        joinId,
        joinYmd: dayjs().format('YYYY-MM-DD'),
      });
      if (updateJoin.responseCode == 20) {
        statusCode = 201020;
        returnMsg = updateJoin.responseMsg;
      } else if (updateJoin.responseCode == 11) {
        statusCode = 201011;
        returnMsg = updateJoin.responseMsg;
      } else {
        result.join = updateJoin.responseData?.insStockNo;
      }
    }

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  async funCreateInsStockNo({
    insProdId,
    planId,
    joinId,
    joinYmd,
  }: CreateCcaliJoinInsStockNoReqDto) {
    let responseCode = 0;
    let responseMsg = 'ok';
    let responseData: any = {};

    // 1. 보험 상품코드 조회
    const insProdInfo = await this.insProdRepository.findOne({
      where: {
        id: insProdId,
      },
    });
    if (!insProdInfo) {
      responseCode = 20;
      responseMsg = '검색 결과 없음(보험상품코드)';
    } else {
      const insProdCd = insProdInfo.insProdCd;
      const insComCd = insProdInfo.insComCd;

      // 2. 가입 ID 조회
      const ccaliJoin = await this.ccaliJoinRepository.findOne({
        where: {
          id: joinId,
        },
      });
      if (!ccaliJoin) {
        responseCode = 20;
        responseMsg = '검색 결과 없음(가입신청 정보)';
      }

      const insStockNoInfo = await this.masterInsStockNoRepository.find({
        where: {
          insProdId,
          planId,
          insComCd,
          startDt: LessThanOrEqual(dayjs(joinYmd).toDate()),
          endDt: MoreThan(dayjs(joinYmd).toDate()),
        },
        order: {
          id: 'DESC',
        },
        take: 1,
      });
      console.log('insStockNoInfo', insStockNoInfo);
      const insStockNo =
        insStockNoInfo.length == 0 ? '증권번호' : insStockNoInfo[0]?.insStockNo;

      // 3. 증권번호 저장
      const updateJoin = await this.ccaliJoinRepository.update(joinId, {
        insStockNo,
      });

      responseData = {
        insStockNo,
      };
    }

    return { responseCode, responseMsg, responseData };
  }

  async funCreateJoinConfrimNo({
    insProdId,
    joinId,
    joinYmd,
  }: CreateCcaliJoinInsStockNoReqDto) {
    let responseCode = 0;
    let responseMsg = 'ok';
    let responseData: any = {};

    // 1. 보험 상품코드 조회
    const insProdInfo = await this.insProdRepository.findOne({
      where: {
        id: insProdId,
      },
    });
    if (!insProdInfo) {
      responseCode = 20;
      responseMsg = '검색 결과 없음(보험상품코드)';
    } else {
      const insProdCd = insProdInfo.insProdCd;
      const insComCd = insProdInfo.insComCd;

      // 2. 순번 조회 -> 임시 증권번호 생성
      let orderNo = 1;
      const preInsStockNoInfo = await this.joinConfirmRepository.find({
        where: {
          insProdId,
          joinYmd: dayjs(joinYmd).toDate(),
        },
        order: {
          orderNo: 'DESC',
        },
        take: 1,
      });
      if (preInsStockNoInfo.length > 0) {
        orderNo = preInsStockNoInfo[0].orderNo + 1;
      }

      const insStockNo =
        insComCd +
        insProdCd.toUpperCase() +
        dayjs(joinYmd).format('YYYYMMDD') +
        String(orderNo).padStart(5, '0');

      // 3. 가입 ID 조회
      const ccaliJoin = await this.ccaliJoinRepository.findOne({
        where: {
          id: joinId,
        },
      });
      if (!ccaliJoin) {
        responseCode = 20;
        responseMsg = '검색 결과 없음(가입신청 정보)';
      }

      // 4. 임시 증권번호 저장
      // 임시 증권번호 보험사(2)+보험상품코드(2~3)+가입일(8)+순번(5) => 17~18자리
      const ccaliJoinEntity = this.ccaliJoinRepository.create({
        ...ccaliJoin,
        insStockNo,
      });
      const insStockNoEntity = this.joinConfirmRepository.create({
        insProdId,
        insProdCd,
        insComCd,
        joinYmd,
        orderNo,
        joinId,
        joinConfirmNo: insStockNo,
        purps: process.env.NODE_ENV.toLowerCase(),
      });
      const updateJoin = await this.updateJoinWithInsStockNo(
        ccaliJoinEntity,
        insStockNoEntity,
      );
      if (!updateJoin.success) {
        responseCode = 11;
        responseMsg = `저장 실패(${updateJoin.message})`;
      }

      responseData = {
        insStockNo,
      };
    }

    return { responseCode, responseMsg, responseData };
  }

  async uploadCcaliSmeCert(
    file: Express.Multer.File,
    path: string,
    joinId: number,
  ) {
    let statusCode = 201000;
    const joinDetail = await this.commonService.selectJoinListDetailByJoinId(
      joinId,
      '',
    );
    console.log('joinDetail', joinDetail);
    if (joinDetail.length == 0) {
      statusCode = 201020;
    } else if (joinDetail[0]?.wooricardPayYn == 'N') {
      statusCode = 201010;
    }

    return this.commonService.handleCcaliSmeCertFileUpload(
      file,
      path,
      joinId,
      statusCode,
    );
  }

  async createPdfFile(req, joinId: number, data: CreatePdfFileReqDto) {
    let statusCode = 200000;
    let returnMsg = 'ok';
    let result: any = {
      join: {},
    };

    const { fileType } = data;

    let insertPDFResult = '';
    const { responseCode, responseData, responseMsg } =
      await this.commonService.funCreateAcqsPdfFile(joinId, fileType);
    if (responseCode == 0) {
      insertPDFResult = responseData.fileName;
    }

    if (insertPDFResult != '') {
      result.join.path = `${process.env.HOST}/uploads/acqs/pdf/${insertPDFResult}.pdf`;
      result.join.filename = insertPDFResult;
    }

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  async selectJoinWithPayLogsByJoinId(joinId: number) {
    return await this.ccaliJoinRepository.find({
      where: {
        id: joinId,
      },
      relations: ['joinPayLogs'],
    });
  }

  async completeInsContract(
    req,
    joinId: number,
    data: CompleteInsContractReqDto,
  ) {
    let statusCode = 201000;
    let returnMsg = 'ok';
    let result = {
      join: {},
    };

    const { insProdCd, payDt } = data;

    /* 가입내역 조회 */
    let joinData = [];
    const preJoinData = await this.commonService.selectJoinDetailByJoinId(
      joinId,
      insProdCd,
    );
    if (preJoinData.length == 0) {
      statusCode = 201020;
      returnMsg = response.NOT_FOUND.responseMsg;

      let responseResult = {
        code: statusCode,
        message: returnMsg,
        result,
      };

      return responseResult;
    }
    const preJoinInfo = preJoinData[0];
    console.log('preJoinInfo', preJoinInfo);
    /* 가입내역 조회 */

    if (preJoinInfo.payStatus == 'Y' || preJoinInfo.joinCk == 'Y') {
      statusCode = 201012;
      returnMsg = response.ALREADY_DONE.responseMsg;
    } else if (
      preJoinInfo.payStatus == 'N' &&
      preJoinInfo.joinCk == 'N' &&
      preJoinInfo.payMethod == 'DBANK'
    ) {
      // 무통장입금 결제완료 상태변경
      if (insProdCd == 'dli') {
        await this.dliJoinRepository.update(
          {
            id: joinId,
          },
          {
            payStatusCd: 'Y',
            payDt: payDt == null ? dayjs().toDate() : dayjs(payDt).toDate(),
          },
        );
      } else if (insProdCd == 'mfli') {
        await this.mfliJoinRepository.update(
          {
            id: joinId,
          },
          {
            payStatusCd: 'Y',
            payDt: payDt == null ? dayjs().toDate() : dayjs(payDt).toDate(),
          },
        );
      }
    }

    if (statusCode != 201000) {
      let responseResult = {
        code: statusCode,
        message: returnMsg,
        result,
      };

      return responseResult;
    }

    if (insProdCd == 'dli' || insProdCd == 'mfli') {
      /* 보험사별 API 계약체결 데이터 유효성 검증 */
      const insComPremCmptLogData =
        await this.commonService.selectInsComDliMfliPremCmptLogByPrctrNo(
          preJoinInfo.prctrNo,
          preJoinInfo.insComCd,
        );
      if (insComPremCmptLogData.length == 0) {
        statusCode = 201020;
        returnMsg = '검색 결과 없음(계약정보)';
      }
      /* 보험사별 API 계약체결 데이터 유효성 검증 */

      /* 계약체결 & 상태변경 */
      const insStockResult = await this.funInsComApiDliMfliCtrtGrup({
        insProdCd,
        insComCd: preJoinInfo?.insComCd,
        prctrNo: preJoinInfo?.prctrNo,
        payMethod: preJoinInfo?.payMethod,
        applyCost: preJoinInfo?.applyCost,
        payDt: payDt == null ? dayjs().toDate() : dayjs(payDt).toDate(),
        url: preJoinInfo?.url,
        joinId: preJoinInfo?.id,
        bizMemberId: preJoinInfo?.bizMemberId,
        referId: preJoinInfo?.referId,
        insuratorYn: preJoinInfo?.insuratorYn,
        teamId: preJoinInfo?.teamId,
        jobPositionId: preJoinInfo?.jobPositionId,
      });
      console.log('insStockResult', insStockResult);
      result.join = insStockResult.responseData.insCost;
      if (insStockResult.responseCode != 0) {
        statusCode = Number(
          '201' + padStart(insStockResult.responseCode.toString(), 3, '0'),
        );
        returnMsg = insStockResult.responseMsg;
      }
      /* 계약체결 & 상태변경 */

      if (statusCode == 201000) {
        /* 가입확인서 생성 */
        joinData = await this.commonService.selectJoinDetailByJoinId(
          joinId,
          insProdCd,
        );

        result.join = {
          insProdFullNm: joinData[0]?.insProdFullNm,
          insComFullNm: joinData[0]?.insComFullNm,
          insStockNo: joinData[0]?.insStockNo,
          insStockUrl: joinData[0]?.insStockUrl,
        };
        /* 가입확인서 생성 */

        /* 알림톡 발송 */
        if (preJoinInfo?.insuratorYn == 'Y') {
          // 피보험자에게 발송
          const sendResult = await this.commonService.sendKakaoAlimtalk({
            receiver: joinData[0]?.insuredTelNo,
            reservedYn: 'N',
            sender: process.env.ALIGO_SENDER,
            insProdCd,
            joinId,
            messageType: 'JOIN_DBANK',
          });
          result.join = {
            ...result.join,
            send: sendResult,
          };
          // 설계사에게 발송
        } else {
          // 피보험자에게 발송
          const sendResult = await this.commonService.sendKakaoAlimtalk({
            receiver: joinData[0]?.insuredTelNo,
            reservedYn: 'N',
            sender: process.env.ALIGO_SENDER,
            insProdCd,
            joinId,
            messageType: 'JOIN_DBANK',
          });
          result.join = {
            ...result.join,
            send: sendResult,
          };
        }
        /* 알림톡 발송 */
      }
    } else if (insProdCd == 'ti' || insProdCd == 'oti' || insProdCd == 'otmi') {
    }

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  async funInsComApiDliMfliCtrtGrup(data: any) {
    const {
      insProdCd,
      insComCd,
      prctrNo,
      payMethod,
      applyCost,
      payDt,
      url,
      joinId,
      bizMemberId,
      referId,
      insuratorYn,
      teamId,
      jobPositionId,
    } = data;

    let responseCode = 0;
    let responseMsg = 'ok';
    let responseData: any = {};

    const today = dayjs();

    let postUrl = '';
    let reqData: any = {};
    let reqDt = dayjs();
    let reqLogId = 0;

    let resData: any = {};
    let resDt;
    const responseResult = [];
    if (insComCd == 'MR') {
      /* 토큰 조회 */
      const meritzTokenInfo = await this.commonService.getMeritzApiToken();
      console.log('meritzTokenInfo', meritzTokenInfo);
      /* 토큰 조회 */

      postUrl = process.env.MERITZ_API_URL + '/cli/requestGrupCtrCclu';

      reqData = {
        aflcoDivCd: 'NEXSOL', // 제휴사 구분코드
        pdCd: insProdCd == 'dli' ? '14541' : '14383', // 상품코드 (재난배상 : 14541, 다중이용 : 14383)
        prctrNo: prctrNo, // 가계약번호
        aplPrem: applyCost.toString(), // 적용보험료
        tokenType: meritzTokenInfo.tokenType,
        accessToken: meritzTokenInfo.accessToken,
      };

      const reqEncodingData = qs.stringify(reqData);

      // 요청 로그 저장
      reqData = {
        ...reqData,
        purps: meritzTokenInfo.purps,
        reqDt: reqDt.toDate(),
        referer: url,
      };
      const reqMeritzLogResult =
        await this.commonService.saveMeritzDliMfliGrupCtrCcluLog(reqData);
      console.log('reqMeritzLogResult', reqMeritzLogResult);
      reqLogId = reqMeritzLogResult?.id;

      await axios
        .post(postUrl, reqEncodingData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
        })
        .then(async (response) => {
          console.log('success');
          console.log('response.status', response.status);
          console.log('response.data', response.data);
          resDt = dayjs();
          // resData = {
          //     "errCd":"00001",
          //     "polNo":"14540-61323"
          // };
          resData = {
            ...response.data,
            resYn: 'Y',
            resJson: JSON.stringify(response.data),
            resDt: resDt.toDate(),
            // seqNo: reqLogId,
          };
        })
        .catch((error) => {
          console.log('fail');
          console.log('error', error);
          resDt = dayjs();
          resData = {
            resYn: 'N',
            resJson: null,
            resDt: resDt.toDate(),
            // seqNo: reqLogId,
          };
        });

      // 응답 로그 저장
      const resMeritzLogResult =
        await this.commonService.updateMeritzDliMfliGrupCtrCcluLog(
          reqLogId,
          resData,
        );
      resData = {
        ...resData,
        seqNo: reqLogId,
        insComCd: 'MR',
      };
      responseResult.push(resData);
    }

    let kbResult: any = {};
    if (insComCd == 'KB') {
      const kbGuid = this.commonService.getRandomId();
      const kbClientId = process.env.KB_API_CLIENT_ID;

      postUrl = process.env.KB_API_URL + '/api/v1/common/dli-mfli-prem-cmpt/kb';

      /* prctrNo 로 정보 조회 */
      const kbPremCmptLogData =
        await this.commonService.selectInsComDliMfliPremCmptLogByPrctrNo(
          prctrNo,
          insComCd,
        );
      if (kbPremCmptLogData.length == 0) {
      }
      const kbPremCmptLogInfo = kbPremCmptLogData[0];
      /* prctrNo 로 정보 조회 */

      let kbBodyData: any = {
        dataHeader: {},
        dataBody: {
          GiApiStndDesignInfoDTO: {
            coCd: kbPremCmptLogInfo?.coCd, // 제휴사 구분코드
            evntCd: 'S', // 일련번호 조회 : T, 보험료계산 : C, 보험계약 : S
            pdcd: kbPremCmptLogInfo?.pdCd, // 상품코드 (재난배상 : 14164, 다중이용 : 14150)
            groupContYn: kbPremCmptLogInfo?.groupContYn,
            apcDate: today.format('YYYY-MM-DD'),
            insBgDt: dayjs(kbPremCmptLogInfo?.insBgDt).format('YYYY-MM-DD'),
            insEndDt: dayjs(kbPremCmptLogInfo?.insEndDt).format('YYYY-MM-DD'),
            polhdNm: kbPremCmptLogInfo?.polhdNm,
            polhdBzrgno: kbPremCmptLogInfo?.polhdBzrgno,
            insdpsNm: kbPremCmptLogInfo?.insdpsNm, // 상호명
            insdpsIdno: kbPremCmptLogInfo?.insdpsIdno, // 피보험자 사업자번호
            ntrObjCd: kbPremCmptLogInfo?.ntrObjCd, // 가입물건코드
            rateCalcFndtnCnt: Number(kbPremCmptLogInfo?.rateCalcFndtnCnt),
            perpsLol: 150000000, // 대인인당보상한도액 (1인당 1.5억 고정)
            peraccLol: 1000000000, // 대물사고당보상한도액 (1사고당 10억 고정)
            bzplcCfcd: kbPremCmptLogInfo?.bzplcCfcd, // 사업장구분코드(01 : 세입자(임차인) 02 : 건물주(임대인))
            loctHnglNm: kbPremCmptLogInfo?.loctHnglNm, // 상호명
            korlgBsadr: kbPremCmptLogInfo?.korlgBsadr, // 주소
            korlgDtadr: kbPremCmptLogInfo?.korlgDtadr, // 상세주소
            loctPostNo1: kbPremCmptLogInfo?.loctPostNo1, // 우편번호 첫 3자리
            loctPostNo2: kbPremCmptLogInfo?.loctPostNo2, // 우편번호 뒤 2자리
            accYn: kbPremCmptLogInfo?.accYn, // 사업장 사고여부(사고존재시 : Y 무사고 : N)
            obgtInsSeq: kbPremCmptLogInfo?.obgtInsSeq, // 재난배상일련번호, 다중이용업소일련번호
            apcno: prctrNo, // 청약번호 (보험계약시 필수)
            // rnwlPcno: '', // 갱신계약 청약시 갱신 이전 증권번호
            // srdngBldgGapDist: '', // 주위건물이격거리(주유소 필수)
            pymnStmdCd: payMethod == 'DBANK' ? '11' : '15', // 납입결제방법코드(11 : 가상계좌 15 : 신용카드)
            // lstPymnDate: "", // 최종납일일자 (무통장입금 입금일시 (yyyy-MM-dd) 필수)
          },
        },
      };
      if (kbPremCmptLogInfo.rnwlPcno != null) {
        kbBodyData.dataBody.GiApiStndDesignInfoDTO.rnwlPcno =
          kbPremCmptLogInfo.rnwlPcno;
      }

      if (
        payMethod == 'DBANK' &&
        payDt != null &&
        dayjs(payDt) >= dayjs(kbPremCmptLogInfo?.insBgDt + ' 24:00')
      ) {
        responseCode = response.NOT_JOIN_INS_DT_AFTER.responseCode;
        responseMsg = response.NOT_JOIN_INS_DT_AFTER.responseMsg;

        return { responseCode, responseMsg, responseData };
      } else {
        kbBodyData.dataBody.GiApiStndDesignInfoDTO.lstPymnDate =
          dayjs(payDt).format('YYYY-MM-DD');
      }

      const kbHsKey = getKbAuthData(kbBodyData, kbClientId);
      let kbHeaderData = {
        guid: kbGuid,
        apikey: kbClientId,
        uuid: '',
        clientIp: '',
        hsKey: kbHsKey,
        'Content-Type': 'application/json; charset=UTF-8',
      };

      reqData = {
        ...reqData,
        // header: kbHeaderData,
        // body: kbBodyData,
        ...kbBodyData?.dataBody?.GiApiStndDesignInfoDTO,
        purps: process.env.NODE_ENV.toLowerCase(),
        reqDt: reqDt.toDate(),
        referer: url,
      };

      // 요청 로그 저장
      const reqKbLogResult =
        await this.commonService.saveKbDliMfliGrupCtrCcluLog(reqData);
      console.log('reqKbLogResult', reqKbLogResult);
      reqLogId = reqKbLogResult?.id;

      await axios
        .post(postUrl, { kbHeaderData, kbBodyData })
        .then(async (response) => {
          console.log('success');
          console.log('response.status', response.status);
          console.log('response.data', response.data);
          resData = {
            resYn: response.data.resYn,
            resJson: response.data.resJson,
            resDt: dayjs(response.data.resDt).toDate(),
            // seqNo: reqLogId,
          };
          if (response.status == 200 && response.data?.errMsg != null) {
            resData = {
              ...resData,
              errCd: response.data.err,
              errMsg: response.data.errMsg,
            };
          } else if (response.status == 200 && response.data.resYn == 'Y') {
            let dataHeader = response.data.resData?.dataHeader;
            let dataBody = response.data.resData.dataBody;
            if (dataHeader?.resultCode == '200') {
              // 조회 성공
              resData = {
                ...resData,
                successCd: dataHeader.successCode,
                errCd: dataHeader.resultCode,
                errMsg: dataHeader.resultMessage,
              };
              kbResult = {
                aplPrem: Number(dataBody.wctDifamtPrem),
                persAplPrem: Number(dataBody.bdyinjPrem),
                prdaAplPrem: Number(dataBody.ppdmPrem),
                prctrNo: dataBody.apcno,
                polNo: dataBody.pcno,
              };
            } else {
              resData = {
                ...resData,
                successCd: dataHeader.successCode,
                errCd: dataHeader.resultCode,
                errMsg: dataHeader.resultMessage,
              };
            }
          }
        })
        .catch((error) => {
          console.log('fail');
          console.log('error', error);
          resDt = dayjs();
          resData = {
            resYn: 'N',
            resJson: null,
            resDt: resDt.toDate(),
            // seqNo: reqLogId,
          };
        });

      // 응답 로그 저장
      const resKbLogResult =
        await this.commonService.updateKbDliMfliGrupCtrCcluLog(
          reqLogId,
          resData,
        );
      resData = {
        ...resData,
        seqNo: reqLogId,
        insComCd: 'KB',
        ...kbResult,
      };
      responseResult.push(resData);
    }

    // responseData.insCost = responseResult;
    for (let index = 0; index < responseResult.length; index++) {
      const element = responseResult[index];
      if (element?.resYn == null || element?.resYn != 'Y') {
        /* 가입신청 정보 테이블 & 사업자정보 통합테이블(가입보험체크) 테이블 update - joinCk "W" */
        if (insProdCd == 'dli') {
          const updateJoin = await this.dliJoinRepository.update(
            {
              id: joinId,
            },
            {
              joinStatusCd: 'W',
            },
          );
        } else if (insProdCd == 'mfli') {
          const updateJoin = await this.mfliJoinRepository.update(
            {
              id: joinId,
            },
            {
              joinStatusCd: 'W',
            },
          );
        }
        const updateTotalBizMember = await this.totalBizMemberRepository.update(
          {
            id: bizMemberId,
          },
          {
            joinStatusCd: 'W',
          },
        );
        /* 가입신청 정보 테이블 & 사업자정보 통합테이블(가입보험체크) 테이블 update - joinCk "W" */

        responseCode = response.HTTP_ERROR.responseCode;
        responseMsg = response.HTTP_ERROR.responseMsg;
        break;
      } else if (element?.errCd == '00001' || element?.errCd == '200') {
        // 성공

        /* 가입신청 정보 테이블 & 사업자정보 통합테이블(가입보험체크) 테이블 update - joinCk "Y" */
        if (insProdCd == 'dli') {
          const updateJoin = await this.dliJoinRepository.update(
            {
              id: joinId,
            },
            {
              joinStatusCd: 'Y',
              insStockNo: element?.polNo,
            },
          );
        } else if (insProdCd == 'mfli') {
          const updateJoin = await this.mfliJoinRepository.update(
            {
              id: joinId,
            },
            {
              joinStatusCd: 'Y',
              insStockNo: element?.polNo,
            },
          );
        }
        const updateTotalBizMember = await this.totalBizMemberRepository.update(
          {
            id: bizMemberId,
          },
          {
            joinStatusCd: 'Y',
          },
        );
        if (insuratorYn == 'Y') {
          const updateInsuratorJoin = await this.insuratorJoinRepository.update(
            {
              referId,
            },
            {
              planStatusCd: 'C',
              teamId,
              jobPositionId,
            },
          );
          const insuratorJoinData = await this.insuratorJoinRepository.find({
            where: {
              referId,
            },
          });
          const insuratorJoinId = insuratorJoinData[0]?.id;
          const originPlannerId = insuratorJoinData[0]?.plannerId;
          // 설계사별 수익분배
          const plannerFeeData = await this.commonService.startRawQuery(
            queries.User.selectParentUsersFeeByUserId,
            [originPlannerId, insuratorJoinId],
          );
          for (let index = 0; index < plannerFeeData.length; index++) {
            const element = plannerFeeData[index];
            // 수수료 저장내역 있는지 조회
            const preInsuratorJoinFeeData =
              await this.insuratorJoinFeeRepository.find({
                where: {
                  insuratorJoinId,
                  plannerId: element.userId,
                },
              });

            if (preInsuratorJoinFeeData.length == 0) {
              const insuratorJoinFeeEntity =
                this.insuratorJoinFeeRepository.create({
                  insuratorJoinId,
                  plannerId: element.userId,
                  gaId: element.gaId,
                  teamId: element.teamId,
                  depth: element.depth,
                  feeAmt: element.realFeeAmt,
                  feeUnit: element.sourceFeeUnit,
                });
              await this.insuratorJoinFeeRepository.save(
                insuratorJoinFeeEntity,
              );
            }
          }
        }
        /* 가입신청 정보 테이블 & 사업자정보 통합테이블(가입보험체크) 테이블 update - joinCk "Y" */

        responseCode = response.SUCCESS.responseCode;
        responseMsg = response.SUCCESS.responseMsg;
        break;
      } else {
        /* 가입신청 정보 테이블 & 사업자정보 통합테이블(가입보험체크) 테이블 update - joinCk "W" */
        if (insProdCd == 'dli') {
          const updateJoin = await this.dliJoinRepository.update(
            {
              id: joinId,
            },
            {
              joinStatusCd: 'W',
            },
          );
        } else if (insProdCd == 'mfli') {
          const updateJoin = await this.mfliJoinRepository.update(
            {
              id: joinId,
            },
            {
              joinStatusCd: 'W',
            },
          );
        }
        const updateTotalBizMember = await this.totalBizMemberRepository.update(
          {
            id: bizMemberId,
          },
          {
            joinStatusCd: 'W',
          },
        );
        /* 가입신청 정보 테이블 & 사업자정보 통합테이블(가입보험체크) 테이블 update - joinCk "W" */

        responseCode = response.FAIL.responseCode;
        responseMsg = response.FAIL.responseMsg;
        break;
      }
    }

    return { responseCode, responseMsg, responseData };
  }
}
