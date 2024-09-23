import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { v4 } from 'uuid';
import axios from 'axios';
import * as fs from 'fs';
import * as pdf from 'html-pdf';
import { join } from 'path';
import * as qs from 'qs';
import * as ExcelJS from 'exceljs';
import { totalJoiningDeed } from 'html/totalJoiningDeed';
import { totalFile } from 'html/totalFile';
import { writeToFile } from 'src/common/utils/fs-utils';
import * as puppeteer from 'puppeteer';
import { InsCom } from './entities/ins-com.entity';
import { InsProd } from './entities/ins-prod.entity';
import { SiteInfo } from './entities/site-info.entity';
import { InsComRatioInfo } from './entities/ins-com-ratio-info.entity';
import { CcaliUploads } from './entities/ccali-uploads.entity';
import { CcaliJoin } from 'src/insurance/join/entities/ccali-join.entity';
import { UrlReqDto } from './dto/url-req.dto';
import { CreateCcaliUploadsResultReqDto } from './dto/create-ccali-uploads-result-req.dto';
import { AlimtalkTemplateButton } from 'src/sms/entities/alimtalk-template-button.entity';
import { AlimtalkTemplate } from 'src/sms/entities/alimtalk-template.entity';
import { SendSmsReqDto } from 'src/sms/dto/send-sms-req.dto';
import { SmsSendLogs } from 'src/sms/entities/sms-send-logs.entity';
import { SendAlimtalkReqDto } from 'src/sms/dto/send-alimtalk-req.dto';
import { costFormatter } from './utils/formatter-utils';
import { JoinStatus } from './entities/join-stts-cd.entity';
import { PayStatus } from './entities/pay-stts-cd.entity';
import { InsProdTerms } from './entities/ins-prod-terms.entity';
import { CcaliClaim } from 'src/insurance/claim/entities/ccali-claim.entity';
import { PayNicepayLogs } from 'src/pay/entities/pay-nicepay-logs.entity';
import { NtsBizType } from 'src/insurance/plan/entities/nts-biz-type.entity';
import { CcaliBizTypeView } from 'src/insurance/plan/entities/ccali-biz-type-view.entity';
import { SelectJoinPlanGuaranteeDto } from 'src/insurance/plan/dto/select-join-plan-guarantee.dto';
import { PlanGuaranteeContent } from 'src/insurance/plan/entities/plan-guarantee-content.entity';
import { CcaliPlan } from 'src/insurance/plan/entities/ccali-plan.entity';
import { PlanGuarantee } from 'src/insurance/plan/entities/plan-guarantee.entity';
import { CcaliAnswerResponse } from 'src/insurance/plan/entities/ccali-answer-response.entity';
import { CcaliQuestion } from 'src/insurance/plan/entities/ccali-question.entity';
import { CcaliQuestionPlanGuaranteeContentMap } from 'src/insurance/plan/entities/ccali-question-plan-guarantee-content-map.entity';
import { CcaliJoinSubCompany } from 'src/insurance/join/entities/ccali-join-sub-company.entity';
import { CcaliJoinPayLogs } from 'src/insurance/join/entities/ccali-join-pay-logs.entity';
import { CcaliQuestionAnswerTemplate } from 'src/insurance/plan/entities/ccali-question-answer-template.entity';
import { CcaliInsCostNotice } from 'src/insurance/join/entities/ccali-ins-cost-notice.entity';
import { MasterInsStockNo } from 'src/insurance/join/entities/master-ins-stock-no.entity';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(InsCom)
    private insComRepository: Repository<InsCom>,
    @InjectRepository(InsProd)
    private insProdRepository: Repository<InsProd>,
    @InjectRepository(SiteInfo)
    private siteInfoRepository: Repository<SiteInfo>,
    @InjectRepository(InsComRatioInfo)
    private insComRatioInfoRepository: Repository<InsComRatioInfo>,
    @InjectRepository(CcaliUploads)
    private ccaliUploadsRepository: Repository<CcaliUploads>,
    @InjectRepository(AlimtalkTemplate)
    private alimtalkTemplateRepository: Repository<AlimtalkTemplate>,
    @InjectRepository(SmsSendLogs)
    private smsSendLogsRepository: Repository<SmsSendLogs>,
    @InjectRepository(CcaliJoin)
    private ccaliJoinRepository: Repository<CcaliJoin>,
    @InjectRepository(NtsBizType)
    private ntsBizTypeRepository: Repository<NtsBizType>,
    @InjectRepository(CcaliBizTypeView)
    private ccaliBizTypeRepository: Repository<CcaliBizTypeView>,
    @InjectRepository(PlanGuaranteeContent)
    private planGuaranteeContentRepository: Repository<PlanGuaranteeContent>,
    @InjectRepository(CcaliJoinSubCompany)
    private ccaliJoinSubCompanyRepository: Repository<CcaliJoinSubCompany>,
    @InjectRepository(CcaliClaim)
    private ccaliClaimRepository: Repository<CcaliClaim>,
    @InjectRepository(CcaliAnswerResponse)
    private ccaliAnswerResponseRepository: Repository<CcaliAnswerResponse>,
    @InjectRepository(CcaliInsCostNotice)
    private ccaliInsCostNoticeRepository: Repository<CcaliInsCostNotice>,
    @InjectRepository(MasterInsStockNo)
    private masterInsStockNoRepository: Repository<MasterInsStockNo>,
  ) {}

  storage = diskStorage({
    destination: './uploads/profile', // 파일이 저장될 경로
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
      callback(null, filename);
    },
  });

  getStorage() {
    return diskStorage({
      destination: './uploads/profile', // 파일이 저장될 경로
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
        callback(null, filename);
      },
    });
  }

  async handleCcaliSmeCertFileUpload(
    file: Express.Multer.File,
    path: string,
    joinId: number,
    statusCd?: number,
  ) {
    let statusCode = 201000;
    let returnMsg = 'ok';
    let result = {
      join: {},
    };

    if (statusCd == 201010) {
      statusCode = 201010;
      returnMsg = '업로드 대상 아님';

      fs.unlinkSync(file.path);
    } else if (statusCd == 201020) {
      statusCode = 201020;
      returnMsg = '가입 내역 없음';

      fs.unlinkSync(file.path);
    } else {
      console.log(file); // 업로드된 파일의 정보 로그 출력
      console.log('joinId', joinId);
      console.log('host', process.env.HOST);
      console.log('file', file);

      const ccaliUploads = await this.createCcaliUploads({
        joinId,
        originalFileNm: file.originalname,
        fileNm: file.filename,
        filePath: path,
        fileUrl: `${process.env.HOST}/uploads/${path}/${file.filename}`,
        fileSize: file.size,
        mimeType: file.mimetype,
      });

      result.join = ccaliUploads;
    }

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  async createCcaliUploads({
    joinId,
    originalFileNm,
    fileNm,
    filePath,
    fileUrl,
    fileSize,
    mimeType,
  }: CreateCcaliUploadsResultReqDto) {
    const ccaliUploadsEntity = this.ccaliUploadsRepository.create({
      joinId,
      originalFileNm,
      fileNm,
      filePath,
      fileUrl,
      fileSize,
      mimeType,
    });
    return await this.ccaliUploadsRepository.save(ccaliUploadsEntity);
  }

  async selectInsProdByUrl(url: string) {
    return await this.insProdRepository.findOne({
      where: {
        id: 1,
      },
    });
  }

  async selectInsComByInsComCd(insComCd: string) {
    return await this.insComRepository.findOne({
      where: {
        insComCd,
      },
    });
  }

  // 만 나이 계산
  calculateWesternAge(birthday: string | Date, baseDt?: string | Date | null) {
    let baseDay = dayjs();
    if (baseDt != null) {
      baseDay = dayjs(baseDt);
    }
    let birthDay = dayjs(birthday);
    let age = baseDay.get('year') - birthDay.get('year');

    let baseDayMonth = baseDay.get('month') + 1;
    let birthMonth = birthDay.get('month') + 1;

    if (
      (age != 0 && birthMonth > baseDayMonth) ||
      (age != 0 &&
        birthMonth === baseDayMonth &&
        birthDay.get('date') >= baseDay.get('date'))
    ) {
      age--;
    }
    return age;
  }

  calculatePeriod(referDt: string | Date, unit: string) {
    let periodDuration = dayjs.duration(dayjs(referDt).diff(dayjs()));
    if (dayjs(referDt) < dayjs()) {
      periodDuration = dayjs.duration(dayjs().diff(dayjs(referDt)));
    }
    let period = 0;

    switch (unit) {
      case 'd':
        period = Math.floor(periodDuration.as('days'));
        break;
      case 'h':
      default:
        period = periodDuration.as('hours');
        break;
    }

    return period;
  }

  getUuid() {
    const tokens = v4().split('-');
    return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4];
  }

  getRandomId() {
    return `${dayjs().format('YYYYMMDDHHmmss')}${Math.random().toString(36).substring(2, 6)}`;
  }

  // 금액형식
  costFomatter(num: string | number) {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '';
  }

  // 사업자번호 자리수 검증
  checkBizNoValid(bizNo: string) {
    if (bizNo.length != 10) {
      return false;
    }

    let chkBizNo = 0;
    chkBizNo += parseInt(bizNo.substring(0, 1), 10);
    chkBizNo += (parseInt(bizNo.substring(1, 2), 10) * 3) % 10;
    chkBizNo += (parseInt(bizNo.substring(2, 3), 10) * 7) % 10;
    chkBizNo += (parseInt(bizNo.substring(3, 4), 10) * 1) % 10;
    chkBizNo += (parseInt(bizNo.substring(4, 5), 10) * 3) % 10;
    chkBizNo += (parseInt(bizNo.substring(5, 6), 10) * 7) % 10;
    chkBizNo += (parseInt(bizNo.substring(6, 7), 10) * 1) % 10;
    chkBizNo += (parseInt(bizNo.substring(7, 8), 10) * 3) % 10;
    chkBizNo += (parseInt(bizNo.substring(8, 9), 10) * 5) % 10;
    chkBizNo += Math.floor((parseInt(bizNo.substring(8, 9), 10) * 5) / 10);
    chkBizNo += parseInt(bizNo.substring(9, 10), 10);

    if (chkBizNo % 10 != 0) {
      return false;
    } else {
      return true;
    }
  }

  // 법인등록번호 자리수 검증(검증 안되는 번호 있어서 사용X)
  checkCorpNoValid(corpNo: string) {
    if (corpNo.length != 13) {
      return false;
    }

    const sum = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
    let chkCorpNo = 0;
    for (let index = 0; index < sum.length; index++) {
      const number = sum[index];
      chkCorpNo += parseInt(corpNo.substring(index, index + 1), 10) * number;
    }

    if (
      (10 - (chkCorpNo % 10)) % 10 !=
      parseInt(corpNo.substring(12, 13), 10)
    ) {
      return false;
    } else {
      return true;
    }
  }

  // 사업자번호 개인/법인 구분
  getBizNoType(bizNo: string) {
    let bizType = '';
    if (bizNo == null) {
      bizType = 'N';
    } else {
      const corpList = ['81', '82', '83', '84', '85', '86', '87', '88'];
      const gbCd = bizNo.substring(3, 5);
      // console.log('gbCd', gbCd)
      if (corpList.includes(gbCd)) {
        bizType = 'C';
      } else {
        bizType = 'P';
      }
    }

    return bizType;
  }

  getRefererStr(locationHref: string | null, referer: string | null) {
    let result = '';
    let refererStr = '';
    if (locationHref == null) {
      refererStr = referer;
    } else {
      refererStr = locationHref;
    }
    if (refererStr?.indexOf('https://') > -1) {
      const firstStr = 'https://';
      let lastStr = 'insboon.com/';
      if (refererStr?.indexOf(lastStr) == -1) {
        lastStr = 'insboon1.com/';
      }
      result = refererStr.substring(
        refererStr?.indexOf(firstStr) + firstStr.length,
        refererStr?.indexOf(lastStr) + lastStr.length,
      );
    } else if (refererStr?.indexOf('http://') > -1) {
      // localhost
      const firstStr = 'http://';
      result = refererStr.substring(
        refererStr?.indexOf(firstStr) + firstStr.length,
      );
    } else {
      result = refererStr;
    }
    return result;
  }

  // 사업자등록 상태조회(휴폐업 검증)
  async getBizNoStatus(bizNo: string) {
    // 사업자정보 통합테이블 - 사업자상태 먼저 조회

    // 결과 없으면 공공api
    const keyvalue =
      'Z0h%2FhWvk6XU2SfGLtIfUh7fH783bV2eI52ehloVFwGCeGK4ILQhQX8ESD8HOvRJmyTrc6MyG7Try%2BXjmGLS%2BPA%3D%3D'; // 공공데이터 api 키값
    const korTime = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS');

    let result: any = {
      msg: '',
      success: false,
      data: {},
    };

    if (bizNo.length < 10 || bizNo.length > 10) {
      console.log(korTime + ' : 사업자등록번호 10자리를 맞춰주세요!');
      result.msg = '사업자등록번호 10자리를 맞춰주세요!';
    } else if (bizNo.length == 10) {
      const checkValid = this.checkBizNoValid(bizNo);
      if (!checkValid) {
        console.log(korTime + ' : 올바른 사업자 번호를 입력해주세요.');
        result.msg = '올바른 사업자 번호를 입력해주세요.';
      } else {
        console.log(korTime + ' : 올바른 사업자 번호입니다.');

        let bodyData = {
          b_no: [bizNo], // 사업자번호 "xxxxxxx" 로 조회 시,
        };

        const postUrl =
          'http://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=' +
          keyvalue +
          '&returnType=JSON';

        // 국세청 사업자등록번호 조회 api
        await axios
          .post(postUrl, JSON.stringify(bodyData), {
            headers: { 'Content-Type': 'application/json' },
          })
          .then((res) => {
            if (res.status == 200) {
              const { status_code, match_cnt, request_cnt, data } = res.data;

              // console.log('status_code',status_code);
              // console.log('request_cnt',request_cnt);
              // console.log('match_cnt',match_cnt);

              if (status_code == 'OK') {
                console.log('b_no:', data[0].b_no); // 사업자등록번호
                console.log('b_stt:', data[0].b_stt); // 납세자상태(명칭) -> 01: 계속사업자, 02: 휴업자, 03: 폐업자
                console.log('b_stt_cd:', data[0].b_stt_cd); // 납세자상태(코드) -> 01: 계속사업자, 02: 휴업자, 03: 폐업자
                console.log('tax_type:', data[0].tax_type); // 과세유형메세지(명칭) -> 01: 부가가치세 일반과세자, 02: 부가가치세 간이과세자, 03: 부가가치세 과세특례자, 04: 부가가치세 면세사업자, 05: 수익사업을 영위하지 않는 비영리법인이거나 고유번호가 부여된 단체, 국가기관 등, 06: 고유번호가 부여된 단체, 07: 부가가치세 간이과세자(세금계산서 발급사업자), 등록되지 않았거나 삭제된 경우: 국세청에 등록되지 않은 사업자등록번호입니다
                console.log('tax_type_cd:', data[0].tax_type_cd); // 과세유형메세지(코드) -> 01: 부가가치세 일반과세자, 02: 부가가치세 간이과세자, 03: 부가가치세 과세특례자, 04: 부가가치세 면세사업자, 05: 수익사업을 영위하지 않는 비영리법인이거나 고유번호가 부여된 단체, 국가기관 등, 06: 고유번호가 부여된 단체, 07: 부가가치세 간이과세자(세금계산서 발급사업자), 등록되지 않았거나 삭제된 경우: 국세청에 등록되지 않은 사업자등록번호입니다
                console.log('end_dt:', data[0].end_dt); // 폐업일 (YYYYMMDD 포맷)
                console.log('utcc_yn:', data[0].utcc_yn); // 단위과세전환폐업여부(Y, N)
                console.log('tax_type_change_dt:', data[0].tax_type_change_dt); // 최근과세유형전환일자(YYYYMMDD 포맷)
                console.log('invoice_apply_dt:', data[0].invoice_apply_dt); // 세금계산서적용일자

                result.data.bStt = data[0].b_stt;
                result.data.bSttCd = data[0].b_stt_cd;
                result.data.taxType = data[0].tax_type;
                result.data.taxTypeCd = data[0].tax_type_cd;
                result.data.endDt = data[0].end_dt;
                result.data.utccYn = data[0].utcc_yn;
                result.data.taxTypeChangeDt = data[0].tax_type_change_dt;
                result.data.invoiceApplyDt = data[0].invoice_apply_dt;

                if (data[0].b_stt_cd == '01') {
                  console.log(korTime + ' : 계속사업자입니다.');
                  result.msg = '등록가능한 사업자 번호 입니다.';
                  result.success = true;
                } else {
                  console.log(
                    korTime +
                      ' : 휴/폐업자는 가입할수없습니다. 사업자번호를 확인해주세요.',
                  );
                  result.msg = '휴/폐업자는 가입할 수 없습니다.';
                }
              } else {
                result.msg =
                  '사업자등록 상태조회에 실패하였습니다. 잠시 후 다시 시도해주세요.';
              }
            } else if (res.status == 400) {
              // JSON 포맷에 적합하지 않는 요청
              console.log(korTime + ' : BAD_JSON_REQUEST');
              result.msg =
                '사업자등록 상태조회에 실패하였습니다. 잠시 후 다시 시도해주세요.';
            } else if (res.status == 404) {
              // Not Found Service
              console.log(korTime + ' : Not Found Service');
              result.msg =
                '사업자등록 상태조회에 실패하였습니다. 잠시 후 다시 시도해주세요.';
            } else if (res.status == 411) {
              // 필수 요청 파라미터 누락
              console.log(korTime + ' : REQUEST_DATA_MALFORMED');
              result.msg =
                '사업자등록 상태조회에 실패하였습니다. 잠시 후 다시 시도해주세요.';
            } else if (res.status == 413) {
              // 요청 사업자번호 100개 초과
              console.log(korTime + ' : TOO_LARGE_REQUEST');
              result.msg =
                '사업자등록 상태조회에 실패하였습니다. 잠시 후 다시 시도해주세요.';
            } else if (res.status == 500) {
              // Internal Server Error
              console.log(korTime + ' : Internal Server Error');
              result.msg =
                '사업자등록 상태조회에 실패하였습니다. 잠시 후 다시 시도해주세요.';
            }
          })
          .catch((err) => {
            console.log(err.response.data);
          });
      }
    }
    return result;
  }

  async selectSiteInfoByReferer(referer: string) {
    const query = this.siteInfoRepository
      .createQueryBuilder('site')
      .select('site.referer', 'referer')
      .addSelect('site.join_account', 'joinAccount')
      .addSelect('site.join_path', 'joinPath')
      .addSelect('site.pay_yn', 'payYn')
      .addSelect('site.dsf_two_sell_yn', 'dsfTwoSellYn')
      .addSelect('site.dsf_three_sell_yn', 'dsfThreeSellYn')
      .addSelect('site.dsf_six_sell_yn', 'dsfSixSellYn')
      .addSelect('site.dli_sell_yn', 'dliSellYn')
      .addSelect('site.mfli_sell_yn', 'mfliSellYn')
      .addSelect('site.pip_two_sell_yn', 'pipTwoSellYn')
      .addSelect('site.tlc_sell_yn', 'tlcSellYn')
      .addSelect('site.pli_sell_yn', 'pliSellYn')
      .addSelect('site.ti_sell_yn', 'tiSellYn')
      .addSelect('site.oti_sell_yn', 'otiSellYn')
      .addSelect('site.otmi_sell_yn', 'otmiSellYn')
      .addSelect('site.mbi_sell_yn', 'mbiSellYn')
      .addSelect('site.ccali_sell_yn', 'ccaliSellYn')
      .addSelect('site.site_ver', 'siteVer')
      .addSelect('site.page_gb_cd', 'pageGbCd')
      .addSelect('site.page_sub_gb_cd', 'pageSubGbCd')
      .addSelect('site.primary_color', 'primaryColor')
      .addSelect('site.secondary_color', 'secondaryColor')
      .addSelect('site.disabled_color', 'disabledColor')
      .addSelect('site.background_color', 'backgroundColor')
      .addSelect('site.notice_yn', 'noticeYn')
      .addSelect('site.font_title', 'fontTitle')
      .addSelect('site.font', 'font')
      .addSelect(
        `CASE WHEN site.page_gb_cd IN (0, 2) AND dsf_two_sell_yn = "Y" THEN "풍수해2"
                         WHEN site.page_gb_cd IN (0, 2) AND dsf_three_sell_yn = "Y" THEN "풍수해3"
                         WHEN site.page_gb_cd IN (0, 2) AND dsf_six_sell_yn = "Y" THEN "풍수해6"
                         WHEN site.page_gb_cd IN (0, 2) AND dli_sell_yn = "Y" THEN "재난배상"
                         WHEN site.page_gb_cd IN (0, 2) AND mfli_sell_yn = "Y" THEN "다중이용"
                         WHEN site.page_gb_cd IN (0, 2) AND pip_two_sell_yn = "Y" THEN "개인정보보호"
                         WHEN site.page_gb_cd IN (0, 2) AND tlc_sell_yn = "Y" THEN "기술보호"
                         WHEN site.page_gb_cd IN (0, 2) AND pli_sell_yn = "Y" THEN "생산물배상"
                         WHEN site.page_gb_cd IN (0, 2) AND ti_sell_yn = "Y" THEN "국내여행자"
                         WHEN site.page_gb_cd IN (0, 2) AND oti_sell_yn = "Y" THEN "해외여행자"
                         WHEN site.page_gb_cd IN (0, 2) AND otmi_sell_yn = "Y" THEN "해외여행자실손"
                         WHEN site.page_gb_cd IN (0, 2) AND mbi_sell_yn = "Y" THEN "다태아"
                         WHEN site.page_gb_cd IN (0, 2) AND ccali_sell_yn = "Y" THEN "중대재해"
                         END`,
        'insProdNm',
      )
      .addSelect(
        `CASE WHEN site.page_gb_cd IN (0, 2) AND dsf_two_sell_yn = "Y" THEN "dsf2"
                         WHEN site.page_gb_cd IN (0, 2) AND dsf_three_sell_yn = "Y" THEN "dsf3"
                         WHEN site.page_gb_cd IN (0, 2) AND dsf_six_sell_yn = "Y" THEN "dsf6"
                         WHEN site.page_gb_cd IN (0, 2) AND dli_sell_yn = "Y" THEN "dli"
                         WHEN site.page_gb_cd IN (0, 2) AND mfli_sell_yn = "Y" THEN "mfli"
                         WHEN site.page_gb_cd IN (0, 2) AND pip_two_sell_yn = "Y" THEN "pip2"
                         WHEN site.page_gb_cd IN (0, 2) AND tlc_sell_yn = "Y" THEN "tlc"
                         WHEN site.page_gb_cd IN (0, 2) AND pli_sell_yn = "Y" THEN "pli"
                         WHEN site.page_gb_cd IN (0, 2) AND ti_sell_yn = "Y" THEN "ti"
                         WHEN site.page_gb_cd IN (0, 2) AND oti_sell_yn = "Y" THEN "oti"
                         WHEN site.page_gb_cd IN (0, 2) AND otmi_sell_yn = "Y" THEN "otmi"
                         WHEN site.page_gb_cd IN (0, 2) AND mbi_sell_yn = "Y" THEN "mbi"
                         WHEN site.page_gb_cd IN (0, 2) AND ccali_sell_yn = "Y" THEN "ccali"
                         END`,
        'insProdCd',
      )
      .where('site.referer = :referer', { referer });

    const result = await query.getRawOne();
    const formattedResult = {
      ...result,
      siteVer: result?.siteVer == null ? null : parseFloat(result?.siteVer),
      pageGbCd: result?.pageGbCd == null ? null : parseInt(result?.pageGbCd),
      pageSubGbCd:
        result?.pageSubGbCd == null ? null : parseInt(result?.pageSubGbCd),
    };

    return formattedResult;
  }

  async selectInsComInfoByReferer({
    joinAccount,
    joinPath,
    payYn,
    insProdCd,
  }: any) {
    const query = this.insComRatioInfoRepository
      .createQueryBuilder('ins_com')
      .select('ins_com.join_account', 'joinAccount')
      .addSelect('ins_com.join_path', 'joinPath')
      .addSelect('ins_com.ins_prod_cd', 'insProdCd')
      .addSelect('ins_com.ins_prod_nm', 'insProdNm')
      .addSelect('ins_com.pay_yn', 'payYn')
      .addSelect('ins_com.meritz_yn', 'meritzYn')
      .addSelect('ins_com.meritz_join_type', 'meritzJoinType')
      .addSelect('ins_com.meritz_ratio', 'meritzRatio')
      .addSelect('ins_com.db_yn', 'dbYn')
      .addSelect('ins_com.db_join_type', 'dbJoinType')
      .addSelect('ins_com.db_ratio', 'dbRatio')
      .addSelect('ins_com.kb_yn', 'kbYn')
      .addSelect('ins_com.kb_join_type', 'kbJoinType')
      .addSelect('ins_com.kb_ratio', 'kbRatio')
      .addSelect('ins_com.hyundai_yn', 'hyundaiYn')
      .addSelect('ins_com.hyundai_join_type', 'hyundaiJoinType')
      .addSelect('ins_com.hyundai_ratio', 'hyundaiRatio')
      .addSelect('ins_com.samsung_yn', 'samsungYn')
      .addSelect('ins_com.samsung_join_type', 'samsungJoinType')
      .addSelect('ins_com.samsung_ratio', 'samsungRatio')
      .addSelect('ins_com.start_dt', 'startDt')
      .where('ins_com.join_account = :joinAccount', { joinAccount })
      .andWhere('ins_com.join_path = :joinPath', { joinPath })
      .andWhere('ins_com.pay_yn = :payYn', { payYn })
      .andWhere('ins_com.ins_prod_cd = :insProdCd', { insProdCd });

    const result = await query.getRawOne();
    const formattedResult = {
      ...result,
      meritzRatio: parseFloat(result.meritzRatio),
      dbRatio: parseFloat(result.dbRatio),
      kbRatio: parseFloat(result.kbRatio),
      hyundaiRatio: parseFloat(result.hyundaiRatio),
      samsungRatio: parseFloat(result.samsungRatio),
    };

    return formattedResult;
  }

  async getSiteInfo(referer: string) {
    let responseCode = 0;
    let responseMsg = 'ok';
    let responseData: any = {};

    const siteInfo = await this.selectSiteInfoByReferer(referer);
    if (!siteInfo) {
      responseCode = 20;
      responseMsg = '검색 결과 없음';
    } else {
      responseData = siteInfo;
      if (siteInfo.pageGbCd == 2) {
        // 개별상품
        const joinAccount = siteInfo.joinAccount;
        const joinPath = siteInfo.joinPath;
        const payYn = siteInfo.payYn;
        const insProdCd = siteInfo.insProdCd;

        const insComInfo = await this.selectInsComInfoByReferer({
          joinAccount,
          joinPath,
          payYn,
          insProdCd,
        });
        if (!insComInfo) {
          responseCode = 20;
          responseMsg = '검색 결과 없음';
        } else {
          let insComArr = [];
          if (insComInfo.meritzYn == 'Y') {
            insComArr.push('메리츠');
            responseData.meritzJoinType = insComInfo.meritzJoinType;
          }
          if (insComInfo.dbYn == 'Y') {
            insComArr.push('DB손해보험');
            responseData.dbJoinType = insComInfo.dbJoinType;
          }
          if (insComInfo.kbYn == 'Y') {
            insComArr.push('KB손해보험');
            responseData.kbJoinType = insComInfo.kbJoinType;
          }
          if (insComInfo.hyundaiYn == 'Y') {
            insComArr.push('현대해상');
            responseData.hyundaiJoinType = insComInfo.hyundaiJoinType;
          }
          if (insComInfo.samsungYn == 'Y') {
            insComArr.push('삼성화재');
            responseData.samsungJoinType = insComInfo.samsungJoinType;
          }
          if (insComArr.length == 1) {
            responseData.insCom = insComArr[0];
          }
          responseData.insComArr = insComArr;
        }
      } else if (siteInfo.pageGbCd == 1 || siteInfo.pageGbCd == 3) {
        // 1: 몰, 3: 상품결합
        let insProdCdArr = [];
        if (siteInfo.dsfTwoSellYn == 'Y') {
          insProdCdArr.push('dsf2');
        }
        if (siteInfo.dsfThreeSellYn == 'Y') {
          insProdCdArr.push('dsf3');
        }
        if (siteInfo.dsfSixSellYn == 'Y') {
          insProdCdArr.push('dsf6');
        }
        if (siteInfo.dliSellYn == 'Y') {
          insProdCdArr.push('dli');
        }
        if (siteInfo.mfliSellYn == 'Y') {
          insProdCdArr.push('mfli');
        }
        if (siteInfo.pipTwoSellYn == 'Y') {
          insProdCdArr.push('pip2');
        }
        if (siteInfo.tlcSellYn == 'Y') {
          insProdCdArr.push('tlc');
        }
        if (siteInfo.pliSellYn == 'Y') {
          insProdCdArr.push('pli');
        }
        if (siteInfo.tiSellYn == 'Y') {
          insProdCdArr.push('ti');
        }
        if (siteInfo.otiSellYn == 'Y') {
          insProdCdArr.push('oti');
        }
        if (siteInfo.otmiSellYn == 'Y') {
          insProdCdArr.push('otmi');
        }
        if (siteInfo.mbiSellYn == 'Y') {
          insProdCdArr.push('mbi');
        }
        if (siteInfo.ccaliSellYn == 'Y') {
          insProdCdArr.push('ccali');
        }
        responseData.insProdCdArr = insProdCdArr;
      }
    }

    return { responseCode, responseMsg, responseData };
  }

  async searchAddrApi(targetAddress: string) {
    let addrInfo = {};
    let naverAddrInfo = {};

    if (targetAddress != null && targetAddress != '') {
      // 주소검색 카카오 api
      addrInfo = await this.searchAddrKakaoApi(targetAddress);
      console.log('kakao addr', addrInfo);
    }

    return addrInfo;
  }

  async searchAddrKakaoApi(targetAddress: string) {
    const KAKAO_REST_API_KEY = '34ca49f8efde98a9d944f8bf347ee552';

    let addressInfo = {};
    const {
      data: {
        documents: documents,
        meta: { total_count: total_count },
      },
    } = await axios.get('https://dapi.kakao.com/v2/local/search/address.json', {
      params: {
        query: targetAddress,
      },
      headers: {
        Authorization: 'KakaoAK ' + KAKAO_REST_API_KEY,
      },
    });
    console.log('targetAddress', targetAddress);
    console.log(documents);

    if (total_count > 0 && documents[0].address != null) {
      let address = documents[0].address;
      let roadAddress = documents[0].road_address;
      let addressName = documents[0].address_name;
      let addressType = documents[0].address_type;

      let sigunguCd = address.b_code.slice(0, 5);
      let bjdongCd = address.b_code.slice(5, 10);
      let bun =
        address.main_address_no.length == 4
          ? address.main_address_no
          : address.main_address_no.length == 3
            ? '0' + address.main_address_no
            : address.main_address_no.length == 2
              ? '00' + address.main_address_no
              : address.main_address_no.length == 1
                ? '000' + address.main_address_no
                : '0000';
      let ji =
        address.sub_address_no.length == 4
          ? address.sub_address_no
          : address.sub_address_no.length == 3
            ? '0' + address.sub_address_no
            : address.sub_address_no.length == 2
              ? '00' + address.sub_address_no
              : address.sub_address_no.length == 1
                ? '000' + address.sub_address_no
                : '0000';

      let addressDetail = '';
      let addrArr = addressName.split(' ');
      let arr = targetAddress.split(' ');

      for (let i = addrArr.length; i < arr.length; i++) {
        if (i == addrArr.length) {
          addressDetail += arr[i];
        } else {
          addressDetail += ' ' + arr[i];
        }
      }

      if (address.mountain_yn == 'Y') {
        let pnu = sigunguCd + bjdongCd + '1' + bun + ji;

        addressInfo = {
          query: targetAddress,
          addressType,
          addressName: address.address_name,
          roadAddressName: roadAddress?.address_name,
          addressDetail,
          sigunguCd,
          bjdongCd,
          bun: bun,
          ji: ji,
          sido: address.region_1depth_name,
          sigungu: address.region_2depth_name,
          zonecode: roadAddress?.zone_no,
          pnu,
          addressX: address?.x,
          addressY: address?.y,
          roadAddressX: roadAddress?.x,
          roadAddressY: roadAddress?.y,
        };
      } else {
        let pnu = sigunguCd + bjdongCd + '0' + bun + ji;

        addressInfo = {
          query: targetAddress,
          addressType,
          addressName: address.address_name,
          roadAddressName: roadAddress?.address_name,
          addressDetail,
          sigunguCd,
          bjdongCd,
          bun,
          ji,
          sido: address.region_1depth_name,
          sigungu: address.region_2depth_name,
          zonecode: roadAddress?.zone_no,
          pnu,
          addressX: address?.x,
          addressY: address?.y,
          roadAaddressX: roadAddress?.x,
          roadAddressY: roadAddress?.y,
        };
      }
    }

    return addressInfo;
  }

  async generatePdf(
    html: string,
    options: puppeteer.PDFOptions = {},
  ): Promise<Buffer> {
    console.log('generatePdf');
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        timeout: 60000, // 타임아웃 시간 (단위: 밀리초)
      });
      const page = await browser.newPage();

      await page.setRequestInterception(true);
      page.on('request', (interceptedRequest) => {
        console.log(interceptedRequest.url());
        interceptedRequest.continue();
      });
      page.on('requestfailed', (interceptedRequest) => {
        console.log(
          `Failed request: ${interceptedRequest.url()} ${interceptedRequest.failure().errorText}`,
        );
      });

      // // 네트워크 요청 로깅
      // page.on('request', (request) => {
      //   console.log('Request:', request.url());
      // });

      // // 이미지 로드 실패 로깅
      // page.on('requestfailed', (request) => {
      //   console.log(
      //     'Failed request:',
      //     request.url(),
      //     request.failure().errorText,
      //   );
      // });

      // await page.setExtraHTTPHeaders({
      //   Accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
      //   'Accept-Encoding': 'gzip, deflate, br',
      //   'Accept-Language': 'en-US,en;q=0.9',
      //   'User-Agent':
      //     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
      //   'Access-Control-Allow-Origin': '*',
      // });

      await page.setContent(html, {
        waitUntil: 'networkidle0',
        timeout: 60000,
      });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true, // CSS 페이지 크기 설정 사용
        ...options,
      });

      return pdfBuffer;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  async selectAlimtalkTemplateByTemplateCode(templateCode: string) {
    const query = this.alimtalkTemplateRepository
      .createQueryBuilder('template')
      .select('template.id', 'templateId')
      .addSelect('template.sender_key', 'senderKey')
      .addSelect('template.templt_code', 'templtCode')
      .addSelect('template.templt_name', 'templtName')
      .addSelect('template.templt_content', 'templtContent')
      .addSelect('template.template_type', 'templateType')
      .addSelect('template.template_em_type', 'templateEmType')
      .addSelect('template.template_extra', 'templateExtra')
      .addSelect('template.template_advert', 'templateAdvert')
      .addSelect('template.templt_title', 'templtTitle')
      .addSelect('template.templt_subtitle', 'templtSubtitle')
      .addSelect('template.templt_image_name', 'templtImageName')
      .addSelect('template.templt_image_url', 'templtImageUrl')
      .addSelect('template.block', 'block')
      .addSelect('template.dormant', 'dormant')
      .addSelect('template.security_flag', 'securityFlag')
      .addSelect('template.status', 'status')
      .addSelect('template.insp_status', 'inspStatus')
      .addSelect('template.cdate', 'cdate')
      .addSelect('template.comments', 'comments')
      .addSelect('buttons.id', 'buttonsId')
      .addSelect('buttons.ordering', 'buttonsOrdering')
      .addSelect('buttons.name', 'buttonsName')
      .addSelect('buttons.link_type', 'buttonsLinkType')
      .addSelect('buttons.link_type_name', 'buttonsLinkTypeName')
      .addSelect('buttons.link_mo', 'buttonsLinkMo')
      .addSelect('buttons.link_pc', 'buttonsLinkPc')
      .addSelect('buttons.link_ios', 'buttonsLinkIos')
      .addSelect('buttons.link_and', 'buttonsLinkAnd')
      .leftJoin(
        (subQuery) => {
          return subQuery.select('atb.*').from(AlimtalkTemplateButton, 'atb');
        },
        'buttons',
        'template.id = buttons.templt_id',
      )
      .where('template.templt_code = :templateCode', { templateCode });

    query.orderBy('template.id', 'ASC').addOrderBy('buttons.id', 'ASC');

    const results = await query.getRawMany();
    let formattedResults = [];
    for (let index = 0; index < results.length; index++) {
      const element = results[index];
      const {
        templateId,
        senderKey,
        templtCode,
        templtName,
        templtContent,
        templateType,
        templateEmType,
        templateExtra,
        templateAdvert,
        templtTitle,
        templtSubtitle,
        templtImageName,
        templtImageUrl,
        block,
        dormant,
        securityFlag,
        status,
        inspStatus,
        cdate,
        comments,
        buttonsId,
        buttonsOrdering,
        buttonsName,
        buttonsLinkType,
        buttonsLinkTypeName,
        buttonsLinkMo,
        buttonsLinkPc,
        buttonsLinkIos,
        buttonsLinkAnd,
      } = element;

      let tmpTemplate: any = {};
      let tmpButtons: any = {};

      if (index == 0) {
        tmpButtons = {
          ordering: buttonsOrdering,
          name: buttonsName,
          linkType: buttonsLinkType,
          linkTypeName: buttonsLinkTypeName,
          linkMo: buttonsLinkMo,
          linkPc: buttonsLinkPc,
          linkIos: buttonsLinkIos,
          linkAnd: buttonsLinkAnd,
        };
        tmpTemplate = {
          id: parseInt(templateId),
          senderKey,
          templtCode,
          templtName,
          templtContent,
          templateType,
          templateEmType,
          templateExtra,
          templateAdvert,
          templtTitle,
          templtSubtitle,
          templtImageName,
          templtImageUrl,
          block,
          dormant,
          securityFlag,
          status,
          inspStatus,
          cdate,
          comments: JSON.parse(comments),
          buttons: [tmpButtons],
        };
        formattedResults.push(tmpTemplate);
      } else {
        tmpButtons = {
          ordering: buttonsOrdering,
          name: buttonsName,
          linkType: buttonsLinkType,
          linkTypeName: buttonsLinkTypeName,
          linkMo: buttonsLinkMo,
          linkPc: buttonsLinkPc,
          linkIos: buttonsLinkIos,
          linkAnd: buttonsLinkAnd,
        };
        formattedResults[formattedResults.length - 1].buttons.push(tmpButtons);
      }
    }

    return formattedResults;
  }

  async sendSms(data: SendSmsReqDto) {
    let statusCode = 201000;
    let returnMsg = 'ok';
    let result = {
      sms: {},
    };

    const {
      receivers,
      message,
      reservedYn,
      reservedDate,
      reservedTime,
      sender,
      referIdx,
      // messageType,
    } = data;

    const send = await this.funSendSms(data);
    if (send.responseYn == 'N') {
      statusCode = 201001;
      returnMsg = '전송실패';
    }
    result.sms = send;

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  async funSendSms({
    sender,
    receivers,
    message,
    reservedYn,
    reservedDate,
    reservedTime,
    referIdx,
    messageType,
  }: any) {
    const apiKey = process.env.ALIGO_API_KEY;
    const userId = process.env.ALIGO_USER_ID;
    const postUrl = process.env.ALIGO_SMS_HOST + '/send/';
    let sendNo = '15226545';
    if (sender != null) {
      sendNo = sender;
    }

    const reservedDt = dayjs(reservedDate + ' ' + reservedTime);
    const params = {
      key: apiKey,
      user_id: userId,
      sender,
      // receiver: receivers.join(','),
      receiver: receivers,
      msg: message,
      // 테스트모드
      testmode_yn: 'N',
      rdate: reservedYn == 'Y' ? reservedDate : null,
      rtime: reservedYn == 'Y' ? reservedTime.replace(':', '') : null,
    };

    let msgContentCd = messageType;
    if (messageType == null) {
      if (
        message?.indexOf('기업중대사고 배상책임보험 정상 가입되었습니다.') > -1
      ) {
        msgContentCd = 'JOIN';
      }
    }

    let responseData;
    await axios
      .post(postUrl, null, {
        params: params,
      })
      .then(async (response) => {
        console.log('response', response.data);
        const responseDt = dayjs().toDate();
        if (response.data.result_code == '1') {
          responseData = {
            responseYn: 'Y',
            responseCode: response.status,
            responseDt: responseDt,
            ...response.data,
          };
        } else {
          responseData = {
            responseYn: 'N',
            responseCode: response.status,
            responseDt: responseDt,
            ...response.data,
          };
        }

        await this.saveSendSmsLogs({
          referIdx,
          sender: params.sender,
          receivers: params.receiver,
          msgData: params.msg,
          resultCode: response.data.result_code,
          message: response.data.message,
          msgId: response.data.msg_id,
          successCnt: response.data.success_cnt,
          errorCnt: response.data.error_cnt,
          msgType: response.data.msg_type,
          sendDt:
            reservedYn == 'Y' ? dayjs(reservedDt).toDate() : dayjs().toDate(),
          msgContentCd: msgContentCd,
        });
      })
      .catch((error) => {
        console.log('err', error);
        const responseDt = dayjs().toDate();
        responseData = {
          responseYn: 'N',
          responseCode: error.response.status,
          responseDt: responseDt,
          message: error.response.data.resultMsg,
          ...error.response.data,
        };
      });

    return responseData;
  }

  async saveSendSmsLogs(data: Partial<SmsSendLogs>) {
    const entity = this.smsSendLogsRepository.create(data);
    return await this.smsSendLogsRepository.save(entity);
  }

  async sendKakaoAlimtalk(data: SendAlimtalkReqDto) {
    let statusCode = 201000;
    let returnMsg = 'ok';
    let result = {
      sms: {},
    };

    const {
      receivers,
      reservedYn,
      reservedDate,
      reservedTime,
      sender,
      joinId,
      messageType,
    } = data;

    const ccaliJoin = await this.selectJoinListDetailByJoinId(
      joinId,
      'JoinFile',
    );
    console.log('ccaliJoin', ccaliJoin);
    const ccaliInsJoinFileUrl = await this.funCreateInsJoinFileCcali(joinId);
    console.log('ccaliInsJoinFileUrl', ccaliInsJoinFileUrl);
    let insertPDFResult = '';
    if (ccaliInsJoinFileUrl.responseCode == 0) {
      insertPDFResult = ccaliInsJoinFileUrl.responseData.fileName;
    }

    let template: any = {};
    if (messageType == 'JOIN') {
      // 가입 완료 후(가입확인서)
      const templateData =
        await this.selectAlimtalkTemplateByTemplateCode('TT_7927');
      template = templateData[0];
    } else if (messageType == 'APPLY_DBANK') {
      // 무통장입금 신청 후
      const templateData =
        await this.selectAlimtalkTemplateByTemplateCode('TT_7207');
      template = templateData[0];
    } else if (messageType == 'JOIN_DBANK') {
      // 무통장입금 확인 후(가입확인서)
      const templateData =
        await this.selectAlimtalkTemplateByTemplateCode('TT_7931');
      template = templateData[0];
    } else if (messageType == 'CNCL') {
      // 유료 계약 유효건 계약 해지(가입확인서)
      const templateData =
        await this.selectAlimtalkTemplateByTemplateCode('TT_7210');
      template = templateData[0];
    } else if (messageType == 'JOIN_PDF') {
      // 유료 가입확인서 요청
      const templateData =
        await this.selectAlimtalkTemplateByTemplateCode('TT_7948');
      template = templateData[0];
    } else if (messageType == 'APPLY_PREM') {
      // 보험료 조회 신청 완료
      const templateData =
        await this.selectAlimtalkTemplateByTemplateCode('TU_1812');
      template = templateData[0];
    } else if (messageType == 'NOTICE_PREM') {
      // 보험료 안내
      const templateData =
        await this.selectAlimtalkTemplateByTemplateCode('TU_1814');
      template = templateData[0];
    }
    // else if (messageType == 'CHG_INS_DT') { // 유료 계약 유효건 배서 완료(가입확인서)
    //   const templateData =
    //     await this.selectAlimtalkTemplateByTemplateCode('TT_7211');
    //   template = templateData[0];
    // }
    console.log('template', template);

    let templateCode = '';
    let templtName = '';
    let sendMessage = '';
    let sendButtons: any = {};
    let failMessageYn = 'Y';
    let failSubject = '';
    let failMessage = '';
    if (messageType == 'JOIN') {
      templateCode = template.templtCode;
      templtName = template.templtName;
      sendMessage = template.templtContent;
      sendMessage = sendMessage.replace('#{상호명}', ccaliJoin[0]?.phNm);
      sendMessage = sendMessage.replace(
        '#{상품명}',
        ccaliJoin[0]?.insProdFullNm,
      );
      sendMessage = sendMessage.replace(
        '#{증권번호}',
        ccaliJoin[0]?.insStockNo,
      );
      sendMessage = sendMessage.replace('#{중간내용}', '');
      sendMessage = sendMessage.replace('#{고객센터 이름}', '㈜넥솔 고객센터');
      sendMessage = sendMessage.replace('#{고객센터 번호}', '1522-9323');
      sendMessage = sendMessage.replace(
        '#{고객센터 운영시간}',
        '(평일 9시~18시/점심시간 12시~13시, 공휴일 제외)',
      );

      sendButtons = {
        button: template.buttons,
      };
      sendButtons.button[1].linkMo = `${process.env.HOST}/uploads/join/ccali/pdf/${insertPDFResult}.pdf`;
      sendButtons.button[1].linkPc = `${process.env.HOST}/uploads/join/ccali/pdf/${insertPDFResult}.pdf`;
      sendButtons.button[2].linkMo = ccaliJoin[0]?.insProdTermsUrl;
      sendButtons.button[2].linkPc = ccaliJoin[0]?.insProdTermsUrl;

      failSubject = '가입 완료';
      failMessage = template.templtContent;
      failMessage = failMessage.replace('#{상호명}', ccaliJoin[0]?.phNm);
      failMessage = failMessage.replace(
        '#{상품명}',
        ccaliJoin[0]?.insProdFullNm,
      );
      failMessage = failMessage.replace(
        '#{증권번호}',
        ccaliJoin[0]?.insStockNo,
      );
      failMessage = failMessage.replace(
        '#{중간내용}',
        `${process.env.HOST}/uploads/join/ccali/pdf/${insertPDFResult}.pdf

약관보기
${ccaliJoin[0]?.insProdTermsUrl}
`,
      );
      failMessage = failMessage.replace('#{고객센터 이름}', '㈜넥솔 고객센터');
      failMessage = failMessage.replace('#{고객센터 번호}', '1522-9323');
      failMessage = failMessage.replace(
        '#{고객센터 운영시간}',
        '(평일 9시~18시/점심시간 12시~13시, 공휴일 제외)',
      );
    } else if (messageType == 'APPLY_DBANK') {
      templateCode = template.templtCode;
      templtName = template.templtName;
      sendMessage = template.templtContent;
      sendMessage = sendMessage.replace(
        '#{상호명}',
        ccaliJoin[0]?.insuredFranNm,
      );
      sendMessage = sendMessage.replace(
        '#{상품명}',
        ccaliJoin[0]?.insProdFullNm,
      );
      // sendMessage = sendMessage.replace('#{은행명}', '');
      // sendMessage = sendMessage.replace('#{계좌번호}', '');
      // sendMessage = sendMessage.replace('#{예금주}', '');
      sendMessage = sendMessage.replace(
        '#{입금액}',
        costFormatter(ccaliJoin[0]?.totInsCost) + '원',
      );
      sendMessage = sendMessage.replace('#{고객센터 이름}', '㈜넥솔 고객센터');
      sendMessage = sendMessage.replace('#{고객센터 번호}', '1522-9323');
      sendMessage = sendMessage.replace(
        '#{고객센터 운영시간}',
        '(평일 9시~18시/점심시간 12시~13시, 공휴일 제외)',
      );

      sendButtons = {
        button: template.buttons,
      };

      failSubject = '무통장입금 신청';
      failMessage = template.templtContent;
      failMessage = failMessage.replace(
        '#{상호명}',
        ccaliJoin[0]?.insuredFranNm,
      );
      failMessage = failMessage.replace(
        '#{상품명}',
        ccaliJoin[0]?.insProdFullNm,
      );
      // failMessage = failMessage.replace('#{은행명}', '');
      // failMessage = failMessage.replace('#{계좌번호}', '');
      // failMessage = failMessage.replace('#{예금주}', '');
      failMessage = failMessage.replace(
        '#{입금액}',
        costFormatter(ccaliJoin[0]?.totInsCost) + '원',
      );
      failMessage = failMessage.replace('#{고객센터 이름}', '㈜넥솔 고객센터');
      failMessage = failMessage.replace('#{고객센터 번호}', '1522-9323');
      failMessage = failMessage.replace(
        '#{고객센터 운영시간}',
        '(평일 9시~18시/점심시간 12시~13시, 공휴일 제외)',
      );
    } else if (messageType == 'JOIN_DBANK') {
      templateCode = template.templtCode;
      templtName = template.templtName;
      sendMessage = template.templtContent;
      sendMessage = sendMessage.replace(
        '#{상호명}',
        ccaliJoin[0]?.insuredFranNm,
      );
      sendMessage = sendMessage.replace(
        '#{상품명}',
        ccaliJoin[0]?.insProdFullNm,
      );
      sendMessage = sendMessage.replace(
        '#{보험료}',
        costFormatter(ccaliJoin[0]?.totInsCost) + '원',
      );
      sendMessage = sendMessage.replace(
        '#{증권번호}',
        ccaliJoin[0]?.insStockNo,
      );
      sendMessage = sendMessage.replace('#{중간내용}', '');
      sendMessage = sendMessage.replace('#{고객센터 이름}', '㈜넥솔 고객센터');
      sendMessage = sendMessage.replace('#{고객센터 번호}', '1522-9323');
      sendMessage = sendMessage.replace(
        '#{고객센터 운영시간}',
        '(평일 9시~18시/점심시간 12시~13시, 공휴일 제외)',
      );

      sendButtons = {
        button: template.buttons,
      };
      sendButtons.button[1].linkMo = `${process.env.HOST}/uploads/join/ccali/pdf/${insertPDFResult}.pdf`;
      sendButtons.button[1].linkPc = `${process.env.HOST}/uploads/join/ccali/pdf/${insertPDFResult}.pdf`;
      sendButtons.button[2].linkMo = ccaliJoin[0]?.insProdTermsUrl;
      sendButtons.button[2].linkPc = ccaliJoin[0]?.insProdTermsUrl;

      failSubject = '무통장입금 확인';
      failMessage = template.templtContent;
      failMessage = failMessage.replace(
        '#{상호명}',
        ccaliJoin[0]?.insuredFranNm,
      );
      failMessage = failMessage.replace(
        '#{상품명}',
        ccaliJoin[0]?.insProdFullNm,
      );
      failMessage = failMessage.replace(
        '#{보험료}',
        costFormatter(ccaliJoin[0]?.totInsCost) + '원',
      );
      failMessage = failMessage.replace(
        '#{증권번호}',
        ccaliJoin[0]?.insStockNo,
      );
      failMessage = failMessage.replace(
        '#{중간내용}',
        `${process.env.HOST}/uploads/join/ccali/pdf/${insertPDFResult}.pdf

약관보기
${ccaliJoin[0]?.insProdTermsUrl}
`,
      );
      failMessage = failMessage.replace('#{고객센터 이름}', '㈜넥솔 고객센터');
      failMessage = failMessage.replace('#{고객센터 번호}', '1522-9323');
      failMessage = failMessage.replace(
        '#{고객센터 운영시간}',
        '(평일 9시~18시/점심시간 12시~13시, 공휴일 제외)',
      );
    } else if (messageType == 'CNCL') {
      templateCode = template.templtCode;
      templtName = template.templtName;
      sendMessage = template.templtContent;
      sendMessage = sendMessage.replace(
        '#{상호명}',
        ccaliJoin[0]?.insuredFranNm,
      );
      sendMessage = sendMessage.replace(
        '#{상품명}',
        ccaliJoin[0]?.insProdFullNm,
      );
      sendMessage = sendMessage.replace(
        '#{증권번호}',
        ccaliJoin[0]?.insStockNo,
      );
      // sendMessage = sendMessage.replace('#{환급 금액}', '');
      sendMessage = sendMessage.replace('#{고객센터 이름}', '㈜넥솔 고객센터');
      sendMessage = sendMessage.replace('#{고객센터 번호}', '1522-9323');
      sendMessage = sendMessage.replace(
        '#{고객센터 운영시간}',
        '(평일 9시~18시/점심시간 12시~13시, 공휴일 제외)',
      );

      sendButtons = {
        button: template.buttons,
      };

      failSubject = '계약 해지';
      failMessage = template.templtContent;
      failMessage = failMessage.replace(
        '#{상호명}',
        ccaliJoin[0]?.insuredFranNm,
      );
      failMessage = failMessage.replace(
        '#{상품명}',
        ccaliJoin[0]?.insProdFullNm,
      );
      failMessage = failMessage.replace(
        '#{증권번호}',
        ccaliJoin[0]?.insStockNo,
      );
      // failMessage = failMessage.replace('#{환급 금액}', '');
      failMessage = failMessage.replace('#{고객센터 이름}', '㈜넥솔 고객센터');
      failMessage = failMessage.replace('#{고객센터 번호}', '1522-9323');
      failMessage = failMessage.replace(
        '#{고객센터 운영시간}',
        '(평일 9시~18시/점심시간 12시~13시, 공휴일 제외)',
      );
    } else if (messageType == 'JOIN_PDF') {
      templateCode = template.templtCode;
      templtName = template.templtName;
      sendMessage = template.templtContent;
      sendMessage = sendMessage.replace(
        '#{상호명}',
        ccaliJoin[0]?.insuredFranNm,
      );
      sendMessage = sendMessage.replace(
        '#{신청일}',
        dayjs(ccaliJoin[0]?.joinYmd).format('YYYY년 MM월 DD일'),
      );
      sendMessage = sendMessage.replace('#{제휴처}', ccaliJoin[0]?.joinAccount);
      sendMessage = sendMessage.replace(
        '#{상품명}',
        ccaliJoin[0]?.insProdFullNm,
      );
      sendMessage = sendMessage.replace(
        '#{증권번호}',
        ccaliJoin[0]?.insStockNo,
      );
      sendMessage = sendMessage.replace('#{중간내용}', '');
      sendMessage = sendMessage.replace('#{고객센터 이름}', '㈜넥솔 고객센터');
      sendMessage = sendMessage.replace('#{고객센터 번호}', '1522-9323');
      sendMessage = sendMessage.replace(
        '#{고객센터 운영시간}',
        '(평일 9시~18시/점심시간 12시~13시, 공휴일 제외)',
      );

      sendButtons = {
        button: template.buttons,
      };
      sendButtons.button[1].linkMo = `${process.env.HOST}/uploads/join/ccali/pdf/${insertPDFResult}.pdf`;
      sendButtons.button[1].linkPc = `${process.env.HOST}/uploads/join/ccali/pdf/${insertPDFResult}.pdf`;
      sendButtons.button[2].linkMo = ccaliJoin[0]?.insProdTermsUrl;
      sendButtons.button[2].linkPc = ccaliJoin[0]?.insProdTermsUrl;

      failSubject = '가입확인서 발송';
      failMessage = template.templtContent;
      failMessage = failMessage.replace(
        '#{상호명}',
        ccaliJoin[0]?.insuredFranNm,
      );
      failMessage = failMessage.replace(
        '#{신청일}',
        dayjs(ccaliJoin[0]?.joinYmd).format('YYYY년 MM월 DD일'),
      );
      failMessage = failMessage.replace('#{제휴처}', ccaliJoin[0]?.joinAccount);
      failMessage = failMessage.replace(
        '#{상품명}',
        ccaliJoin[0]?.insProdFullNm,
      );
      failMessage = failMessage.replace(
        '#{증권번호}',
        ccaliJoin[0]?.insStockNo,
      );
      failMessage = failMessage.replace(
        '#{중간내용}',
        `${process.env.HOST}/uploads/join/ccali/pdf/${insertPDFResult}.pdf

약관보기
${ccaliJoin[0]?.insProdTermsUrl}
`,
      );
      failMessage = failMessage.replace('#{고객센터 이름}', '㈜넥솔 고객센터');
      failMessage = failMessage.replace('#{고객센터 번호}', '1522-9323');
      failMessage = failMessage.replace(
        '#{고객센터 운영시간}',
        '(평일 9시~18시/점심시간 12시~13시, 공휴일 제외)',
      );
    } else if (messageType == 'APPLY_PREM') {
      templateCode = template.templtCode;
      templtName = template.templtName;
      sendMessage = template.templtContent;
      sendMessage = sendMessage.replace(
        '#{상품명}',
        ccaliJoin[0]?.insProdFullNm,
      );
      sendMessage = sendMessage.replace('#{계약자}', ccaliJoin[0]?.phNm);
      sendMessage = sendMessage.replace(
        '#{상품명}',
        ccaliJoin[0]?.insProdFullNm,
      );
      sendMessage = sendMessage.replace('#{중간내용}', '');
      sendMessage = sendMessage.replace('#{고객센터 이름}', '㈜넥솔 고객센터');
      sendMessage = sendMessage.replace('#{고객센터 번호}', '1522-9323');
      sendMessage = sendMessage.replace(
        '#{고객센터 운영시간}',
        '(평일 9시~18시/점심시간 12시~13시, 공휴일 제외)',
      );

      sendButtons = {
        button: template.buttons,
      };
      if (
        ccaliJoin[0]?.devYn == 'N' &&
        ccaliJoin[0]?.joinAccount == 'SK엠앤서비스'
      ) {
        sendButtons.button[1].linkMo = `https://ccali.skmnservice-mall.insboon.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}`;
        sendButtons.button[1].linkPc = `https://ccali.skmnservice-mall.insboon.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}`;
      } else if (ccaliJoin[0]?.joinAccount == 'SK엠앤서비스') {
        sendButtons.button[1].linkMo = `https://dev-ccali.skmnservice-mall.insboon1.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}`;
        sendButtons.button[1].linkPc = `https://dev-ccali.skmnservice-mall.insboon1.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}`;
      } else if (
        ccaliJoin[0]?.devYn == 'N' &&
        ccaliJoin[0]?.joinAccount == '우리카드' &&
        ccaliJoin[0]?.joinPath == '마린슈'
      ) {
        sendButtons.button[1].linkMo = `https://ccali.wooricard-marinshu-mall.insboon.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}`;
        sendButtons.button[1].linkPc = `https://ccali.wooricard-marinshu-mall.insboon.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}`;
      } else if (
        ccaliJoin[0]?.joinAccount == '우리카드' &&
        ccaliJoin[0]?.joinPath == '마린슈'
      ) {
        sendButtons.button[1].linkMo = `https://dev-ccali.wooricard-marinshu-mall.insboon1.com//history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}`;
        sendButtons.button[1].linkPc = `https://dev-ccali.wooricard-marinshu-mall.insboon1.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}`;
      } else if (
        ccaliJoin[0]?.devYn == 'N' &&
        ccaliJoin[0]?.joinAccount == '우리카드'
      ) {
        sendButtons.button[1].linkMo = `https://wooricard.insboon.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}`;
        sendButtons.button[1].linkPc = `https://wooricard.insboon.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}`;
      } else if (ccaliJoin[0]?.joinAccount == '우리카드') {
        sendButtons.button[1].linkMo = `https://dev-ccali.mall.insboon1.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}`;
        sendButtons.button[1].linkPc = `https://dev-ccali.mall.insboon1.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}`;
      }

      failSubject = '보험료 조회 신청 완료';
      failMessage = template.templtContent;
      failMessage = failMessage.replace(
        '#{상품명}',
        ccaliJoin[0]?.insProdFullNm,
      );
      failMessage = failMessage.replace('#{계약자}', ccaliJoin[0]?.phNm);
      failMessage = failMessage.replace(
        '#{상품명}',
        ccaliJoin[0]?.insProdFullNm,
      );
      if (
        ccaliJoin[0]?.devYn == 'N' &&
        ccaliJoin[0]?.joinAccount == 'SK엠앤서비스'
      ) {
        failMessage = failMessage.replace(
          '#{중간내용}',
          `
보험료 확인하기
https://ccali.skmnservice-mall.insboon.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}
`,
        );
      } else if (ccaliJoin[0]?.joinAccount == 'SK엠앤서비스') {
        failMessage = failMessage.replace(
          '#{중간내용}',
          `
보험료 확인하기
https://dev-ccali.skmnservice-mall.insboon1.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}
`,
        );
      } else if (
        ccaliJoin[0]?.devYn == 'N' &&
        ccaliJoin[0]?.joinAccount == '우리카드' &&
        ccaliJoin[0]?.joinPath == '마린슈'
      ) {
        failMessage = failMessage.replace(
          '#{중간내용}',
          `
보험료 확인하기
https://ccali.wooricard-marinshu-mall.insboon.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}
`,
        );
      } else if (
        ccaliJoin[0]?.joinAccount == '우리카드' &&
        ccaliJoin[0]?.joinPath == '마린슈'
      ) {
        failMessage = failMessage.replace(
          '#{중간내용}',
          `
보험료 확인하기
https://dev-ccali.wooricard-marinshu-mall.insboon1.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}
`,
        );
      } else if (
        ccaliJoin[0]?.devYn == 'N' &&
        ccaliJoin[0]?.joinAccount == '우리카드'
      ) {
        failMessage = failMessage.replace(
          '#{중간내용}',
          `
보험료 확인하기
https://wooricard.insboon.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}
`,
        );
      } else if (ccaliJoin[0]?.joinAccount == '우리카드') {
        failMessage = failMessage.replace(
          '#{중간내용}',
          `
보험료 확인하기
https://dev-ccali.mall.insboon1.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}
`,
        );
      }
      failMessage = failMessage.replace('#{고객센터 이름}', '㈜넥솔 고객센터');
      failMessage = failMessage.replace('#{고객센터 번호}', '1522-9323');
      failMessage = failMessage.replace(
        '#{고객센터 운영시간}',
        '(평일 9시~18시/점심시간 12시~13시, 공휴일 제외)',
      );
    } else if (messageType == 'NOTICE_PREM') {
      templateCode = template.templtCode;
      templtName = template.templtName;
      sendMessage = template.templtContent;
      sendMessage = sendMessage.replace(
        '#{상품명}',
        ccaliJoin[0]?.insProdFullNm,
      );
      sendMessage = sendMessage.replace('#{계약자}', ccaliJoin[0]?.phNm);
      sendMessage = sendMessage.replace(
        '#{상품명}',
        ccaliJoin[0]?.insProdFullNm,
      );
      sendMessage = sendMessage.replace('#{중간내용}', '');
      sendMessage = sendMessage.replace('#{고객센터 이름}', '㈜넥솔 고객센터');
      sendMessage = sendMessage.replace('#{고객센터 번호}', '1522-9323');
      sendMessage = sendMessage.replace(
        '#{고객센터 운영시간}',
        '(평일 9시~18시/점심시간 12시~13시, 공휴일 제외)',
      );

      sendButtons = {
        button: template.buttons,
      };
      if (
        ccaliJoin[0]?.devYn == 'N' &&
        ccaliJoin[0]?.joinAccount == 'SK엠앤서비스'
      ) {
        sendButtons.button[1].linkMo = `https://ccali.skmnservice-mall.insboon.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}`;
        sendButtons.button[1].linkPc = `https://ccali.skmnservice-mall.insboon.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}`;
      } else if (ccaliJoin[0]?.joinAccount == 'SK엠앤서비스') {
        sendButtons.button[1].linkMo = `https://dev-ccali.skmnservice-mall.insboon1.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}`;
        sendButtons.button[1].linkPc = `https://dev-ccali.skmnservice-mall.insboon1.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}`;
      } else if (
        ccaliJoin[0]?.devYn == 'N' &&
        ccaliJoin[0]?.joinAccount == '우리카드' &&
        ccaliJoin[0]?.joinPath == '마린슈'
      ) {
        sendButtons.button[1].linkMo = `https://ccali.wooricard-marinshu-mall.insboon.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}`;
        sendButtons.button[1].linkPc = `https://ccali.wooricard-marinshu-mall.insboon.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}`;
      } else if (
        ccaliJoin[0]?.joinAccount == '우리카드' &&
        ccaliJoin[0]?.joinPath == '마린슈'
      ) {
        sendButtons.button[1].linkMo = `https://dev-ccali.wooricard-marinshu-mall.insboon1.com//history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}`;
        sendButtons.button[1].linkPc = `https://dev-ccali.wooricard-marinshu-mall.insboon1.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}`;
      } else if (
        ccaliJoin[0]?.devYn == 'N' &&
        ccaliJoin[0]?.joinAccount == '우리카드'
      ) {
        sendButtons.button[1].linkMo = `https://wooricard.insboon.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}`;
        sendButtons.button[1].linkPc = `https://wooricard.insboon.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}`;
      } else if (ccaliJoin[0]?.joinAccount == '우리카드') {
        sendButtons.button[1].linkMo = `https://dev-ccali.mall.insboon1.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}`;
        sendButtons.button[1].linkPc = `https://dev-ccali.mall.insboon1.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}`;
      }

      failSubject = '보험료 안내';
      failMessage = template.templtContent;
      failMessage = failMessage.replace(
        '#{상품명}',
        ccaliJoin[0]?.insProdFullNm,
      );
      failMessage = failMessage.replace('#{계약자}', ccaliJoin[0]?.phNm);
      failMessage = failMessage.replace(
        '#{상품명}',
        ccaliJoin[0]?.insProdFullNm,
      );
      if (
        ccaliJoin[0]?.devYn == 'N' &&
        ccaliJoin[0]?.joinAccount == 'SK엠앤서비스'
      ) {
        failMessage = failMessage.replace(
          '#{중간내용}',
          `
보험료 확인하기
https://ccali.skmnservice-mall.insboon.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}
`,
        );
      } else if (ccaliJoin[0]?.joinAccount == 'SK엠앤서비스') {
        failMessage = failMessage.replace(
          '#{중간내용}',
          `
보험료 확인하기
https://dev-ccali.skmnservice-mall.insboon1.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}
`,
        );
      } else if (
        ccaliJoin[0]?.devYn == 'N' &&
        ccaliJoin[0]?.joinAccount == '우리카드' &&
        ccaliJoin[0]?.joinPath == '마린슈'
      ) {
        failMessage = failMessage.replace(
          '#{중간내용}',
          `
보험료 확인하기
https://ccali.wooricard-marinshu-mall.insboon.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}
`,
        );
      } else if (
        ccaliJoin[0]?.joinAccount == '우리카드' &&
        ccaliJoin[0]?.joinPath == '마린슈'
      ) {
        failMessage = failMessage.replace(
          '#{중간내용}',
          `
보험료 확인하기
https://dev-ccali.wooricard-marinshu-mall.insboon1.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}
`,
        );
      } else if (
        ccaliJoin[0]?.devYn == 'N' &&
        ccaliJoin[0]?.joinAccount == '우리카드'
      ) {
        failMessage = failMessage.replace(
          '#{중간내용}',
          `
보험료 확인하기
https://wooricard.insboon.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}
`,
        );
      } else if (ccaliJoin[0]?.joinAccount == '우리카드') {
        failMessage = failMessage.replace(
          '#{중간내용}',
          `
보험료 확인하기
https://dev-ccali.mall.insboon1.com/history/history-detail?id=${joinId}&phPhoneNo=${ccaliJoin[0]?.phPhoneNo}
`,
        );
      }
      failMessage = failMessage.replace('#{고객센터 이름}', '㈜넥솔 고객센터');
      failMessage = failMessage.replace('#{고객센터 번호}', '1522-9323');
      failMessage = failMessage.replace(
        '#{고객센터 운영시간}',
        '(평일 9시~18시/점심시간 12시~13시, 공휴일 제외)',
      );
    }

    const send = await this.funKakaoSendAlimtalk({
      senderKey: template.senderKey,
      templateCode: templateCode,
      sender,
      receiver: receivers,
      subject: templtName,
      message: sendMessage,
      button: sendButtons,
      reservedYn,
      reservedDate,
      reservedTime,
      referIdx: ccaliJoin[0]?.referIdx,
      messageType,
      failMessageYn,
      failSubject,
      failMessage,
    });
    if (send.responseYn == 'N') {
      statusCode = 201001;
      returnMsg = '실패';
    }
    result.sms = { send };

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  async funKakaoSendAlimtalk({
    senderKey,
    templateCode,
    sender,
    receiver,
    subject,
    message,
    button,
    reservedYn,
    reservedDate,
    reservedTime,
    referIdx,
    messageType,
    failMessageYn,
    failSubject,
    failMessage,
  }: any) {
    const apiKey = process.env.ALIGO_API_KEY;
    const userId = process.env.ALIGO_USER_ID;
    const postUrl = process.env.ALIGO_KAKAO_HOST + '/alimtalk/send/';

    /*
     * curl -X POST "https://kakaoapi.aligo.in/akv10/alimtalk/send/" \
     * --data-urlencode "apikey=xxxxx" \
     * --data-urlencode "userid=xxxxx" \
     * --data-urlencode "senderkey=xxxxxxxxxx" \
     * --data-urlencode "tpl_code=TXXXXXXXX" \
     * --data-urlencode "sender=xxxxxxxxx" \
     * --data-urlencode "senddate=20240603095300" \
     * --data-urlencode "receiver_1=010xxxxxxxx" \
     * --data-urlencode "recvname_1=홍길동1" \
     * --data-urlencode "subject_1=제목1" \
     * --data-urlencode "message_1=내용1" \
     * --data-urlencode "button_1: {
     *                               button: [{
     *                                 "name" : 버튼명
     *                                 "linkType" : AC, DS, WL, AL, BK, MD 중에서 1개
     *                                 "linkTypeName" : 채널 추가, 배송조회, 웹링크, 앱링크, 봇키워드, 메시지전달 중에서 1개
     *                                 "linkMo" : 설정한 모바일 링크
     *                                 "linkPc" : 설정한 PC 링크
     *                                 "linkIos" : 설정한 IOS Scheme
     *                                 "linkAnd" : 설정한 Android Scheme
     *                               }]
     *                  }" \
     * --data-urlencode "failover=Y" \
     * --data-urlencode "fsubject_1=문자제목1" \
     * --data-urlencode "fmessage_1=문자내용1"
     */

    const reservedDt = dayjs(reservedDate + ' ' + reservedTime);
    const params: any = {
      apikey: apiKey, // 인증용 API Key(필수)
      userid: userId, // 사용자id(필수)
      senderkey: senderKey, // 발신프로파일 키(필수)
      tpl_code: templateCode, // 템플릿 코드(필수)
      sender: sender, // 발신자 연락처(필수)
      senddate:
        reservedYn == 'Y' ? dayjs(reservedDt).format('YYYYMMDDHHmmss') : null, // 예약일
      receiver_1: receiver, // 수신자 연락처(1~500)(필수)
      // recvname_1: '', // 수신자 이름(1~500)
      subject_1: subject, // 알림톡 제목(1~500)(필수)
      message_1: message, // 알림톡 내용(1~500)(필수)
      // emtitle_1: '', // 강조표기형의 타이틀(1~500)
      button_1: JSON.stringify(button), // 버튼 정보(1~500) (JSON 타입)
      failover: failMessageYn == null ? 'N' : failMessageYn, // 실패시 대체문자 전송기능(Y/N)
      fsubject_1: failSubject == null || failSubject == '' ? null : failSubject, // 실패시 대체문자 제목(1~500)
      fmessage_1: failMessage == null || failMessage == '' ? null : failMessage, // 실패시 대체문자 내용(1~500)
      testMode: 'N', // 테스트 모드 적용여부 (Y or N)
    };
    console.log('params', params);
    const reqEncoding = qs.stringify(params);

    let msgContentCd = messageType;
    if (messageType == null) {
      if (message?.indexOf('보험료 납입이 정상 처리되었습니다') > -1) {
        msgContentCd = 'JOIN';
      }
    }

    let responseData;
    await axios
      .post(postUrl, reqEncoding, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      })
      .then(async (response) => {
        console.log('response', response.data);
        const responseDt = dayjs().toDate();
        if (response.data.code == 0) {
          /*
           * {
           *   "code": 0
           *   "message": "성공적으로 전송요청 하였습니다."
           *   "info" : {
           *           "type": "AT",
           *           "mid": "XXXXXXXX",
           *           "current": 0,
           *           "unit": 0,
           *           "total": 0,
           *           "scnt": 0,
           *           "fcnt": 0
           *           }
           * }
           */
          responseData = {
            responseYn: 'Y',
            responseCode: response.status,
            responseDt: responseDt,
            ...response.data,
          };
        } else {
          /*
           * {
           *   "code": -99
           *   "message": "포인트가 부족합니다."
           * }
           */
          responseData = {
            responseYn: 'N',
            responseCode: response.status,
            responseDt: responseDt,
            ...response.data,
          };
        }

        await this.saveSendSmsLogs({
          referIdx,
          tplCode: params?.tpl_code,
          sender: params?.sender,
          senddate: params?.senddate,
          receivers: params?.receiver_1,
          receiver1: params?.receiver_1,
          recvname1: params?.recvname_1,
          subject1: params?.subject_1,
          message1: params?.message_1,
          emtitle1: params?.emtitle_1,
          button1: params?.button_1,
          failover: params?.failover,
          fsubject1: params?.fsubject_1,
          fmessage1: params?.fmessage_1,
          resultCode: response.data.code.toString(),
          message: response.data.message,
          msgId: response.data?.info?.mid,
          current: response.data?.info?.current,
          unit: response.data?.info?.unit,
          total: response.data?.info?.total,
          scnt: response.data?.info?.scnt,
          fcnt: response.data?.info?.fcnt,
          msgType: response.data?.info?.type,
          sendDt:
            reservedYn == 'Y' ? dayjs(reservedDt).toDate() : dayjs().toDate(),
          msgContentCd: msgContentCd,
        });
      })
      .catch((error) => {
        console.log('err', error);
        const responseDt = dayjs().toDate();
        responseData = {
          responseYn: 'N',
          responseCode: error.response.status,
          responseDt: responseDt,
          message: error.response.data.resultMsg,
          ...error.response.data,
        };
      });

    return responseData;
  }

  async selectJoinListDetailByJoinId(joinId: number, type?: string) {
    const query = this.ccaliJoinRepository
      .createQueryBuilder('join')
      .select('join.id', 'id')
      .addSelect('prod.ins_prod_cd', 'insProdCd')
      .addSelect('prod.ins_prod_full_nm', 'insProdFullNm')
      .addSelect('join.plan_id', 'planId')
      .addSelect('terms.trms_short_url', 'insProdTermsUrl')
      .addSelect('""', 'insJoinFileUrl')
      .addSelect('join.ins_stock_no', 'insStockNo')
      .addSelect('join.ins_com_cd', 'insComCd')
      .addSelect('com.ins_com_nm', 'insComNm')
      .addSelect('com.ins_com_full_nm', 'insComFullNm')
      .addSelect('join.ph_phone_no', 'phPhoneNo')
      .addSelect('join.corp_mngr_nm', 'corpManagerNm')
      .addSelect('join.corp_mngr_phone_no', 'corpManagerPhoneNo')
      .addSelect('join.insured_fran_nm', 'insuredFranNm')
      .addSelect('join.insured_biz_no', 'insuredBizNo')
      .addSelect('join.insured_corp_no', 'insuredCorpNo')
      .addSelect('join.insured_corp_ntnlty', 'insuredCorpNationality')
      .addSelect('join.insured_corp_fndn_ymd', 'insuredCorpFoundationYmd')
      .addSelect('join.insured_phone_no', 'insuredPhoneNo')
      .addSelect('join.insured_eml', 'insuredEmail')
      .addSelect('join.insured_road_addr', 'insuredRoadAddress')
      .addSelect('join.insured_jibun_addr', 'insuredJibunAddress')
      .addSelect(
        `CASE WHEN join.insured_road_addr IS NOT NULL AND join.insured_road_addr != "" THEN join.insured_road_addr
              ELSE insured_jibun_addr END`,
        'insuredAddress',
      )
      .addSelect('join.insured_zip_cd', 'insuredZipCd')
      .addSelect('join.nts_biz_type_cd', 'ntsBizTypeCd')
      .addSelect('join.nts_biz_type_nm', 'ntsBizTypeNm')
      .addSelect('join.ccali_biz_type_cd', 'ccaliBizTypeCd')
      .addSelect('join.ccali_biz_type_nm', 'ccaliBizTypeNm')
      .addSelect('join.sales_cst', 'salesCost')
      .addSelect('join.reg_emp_cnt', 'regularEmployeeCnt')
      .addSelect('join.dspt_emp_cnt', 'dispatchedEmployeeCnt')
      .addSelect('join.sbctr_emp_cnt', 'subcontractEmployeeCnt')
      .addSelect('join.tot_emp_cnt', 'totEmployeeCnt')
      .addSelect('join.tot_anl_wgs', 'totAnnualWages')
      .addSelect('join.opened_current_year_yn', 'openedCurrentYearYn')
      .addSelect('join.referral_hstry_yn', 'referralHistoryYn')
      .addSelect('join.grnte_dstr_cd', 'guaranteeDisaterCd')
      .addSelect(
        `CASE WHEN join.grnte_dstr_cd = "indst" THEN "중대산업재해"
                         WHEN join.grnte_dstr_cd = "civil" THEN "중대시민재해"
                         WHEN join.grnte_dstr_cd = "all" THEN "중대산업재해 + 중대시민재해"
              ELSE "중대산업재해 + 중대시민재해" END`,
        'guaranteeDisaterNm',
      )
      .addSelect('join.grnte_rgn_cd', 'guaranteeRegionCd')
      .addSelect(
        `CASE WHEN join.grnte_rgn_cd = "D" THEN "국내"
                         WHEN join.grnte_rgn_cd = "W" THEN "전세계(북미제외)"
              ELSE null END`,
        'guaranteeRegionNm',
      )
      .addSelect('join.sub_com_join_yn', 'subCompanyJoinYn')
      .addSelect('join.join_stts_cd', 'joinStatusCd')
      .addSelect('joinStatus.join_stts_nm', 'joinStatusNm')
      .addSelect('join.pay_stts_cd', 'payStatusCd')
      .addSelect('payStatus.pay_stts_nm', 'payStatusNm')
      .addSelect('join.pay_dt', 'payDt')
      .addSelect(
        'CONCAT(join.ins_strt_ymd, " ", join.ins_strt_tm)',
        'insStartDt',
      )
      .addSelect('CONCAT(join.ins_end_ymd, " ", join.ins_end_tm)', 'insEndDt')
      .addSelect('join.join_renew_no', 'joinRenewNo')
      .addSelect('join.per_acdnt_cvrg_limit', 'perAccidentCoverageLimit')
      .addSelect('join.tot_cvrg_limit', 'totCoverageLimit')
      .addSelect('join.deductible_ins_cst', 'deductibleInsCost')
      .addSelect('join.tot_ins_cst', 'totInsCost')
      .addSelect('join.pay_no', 'payNo')
      .addSelect(
        `CASE WHEN join.pay_stts_cd = "I" 
                              AND DATE_SUB(nextPayLogs.pay_schdl_dt, INTERVAL 7 day) <= NOW() 
                              AND nextPayLogs.pay_du_dt >= NOW() THEN "Y"
                         ELSE "N" END`,
        'payAvailableYn',
      )
      .addSelect('join.prem_cmpt_dt', 'premCmptDt')
      .addSelect('join.join_account', 'joinAccount')
      .addSelect('join.join_path', 'joinPath')
      .addSelect('join.prdt_type', 'productType')
      .addSelect('join.high_risk_prdt', 'highRiskProducts')
      // .addSelect(
      //   `CASE WHEN join.pay_mthd = "CARD" AND payLogs.card_name = "우리" THEN "Y"
      //         ELSE "N" END`,
      //   'wooricardPayYn',
      // );
      .addSelect('payLogs.pay_no', 'logsPayNo')
      .addSelect('payLogs.pay_mthd', 'logsPayMethod')
      .addSelect(
        `CASE WHEN payLogs.pay_mthd = "CARD" THEN "카드결제"
                         WHEN payLogs.pay_mthd = "BANK" THEN "실시간이체"
                         WHEN payLogs.pay_mthd = "DBANK" THEN "무통장입금"
                         ELSE NULL END`,
        'logsPayMethod',
      )
      .addSelect('payLogs.pay_ins_cst', 'logsPayInsCost')
      .addSelect('payLogs.pay_schdl_dt', 'logsPayScheduledDt')
      .addSelect('payLogs.pay_du_dt', 'logsPayDueDt')
      .addSelect('payLogs.pay_dt', 'logsPayDt');

    if (type == 'JoinFile') {
      query
        .addSelect('join.ins_prod_id', 'insProdId')
        .addSelect('join.refer_idx', 'referIdx')
        .addSelect('join.join_ymd', 'joinYmd')
        .addSelect(
          `CASE WHEN join.ph_fran_nm IS NOT NULL AND join.ph_fran_nm != "" THEN join.ph_fran_nm
                ELSE ph_nm END`,
          'phNm',
        )
        .addSelect('join.ph_biz_no', 'phBizNo')
        // .addSelect('LEFT(join.ph_rr_no, 6)', 'phBirthYmd')
        .addSelect('join.ph_eml', 'phEmail')
        .addSelect(
          `CASE WHEN join.url LIKE "%localhost%" THEN "Y"
                WHEN join.url LIKE "https://dev%" THEN "Y"
                ELSE "N" END`,
          'devYn',
        );
      // .addSelect(
      //   `CASE WHEN join.ph_road_addr IS NOT NULL AND join.ph_road_addr != "" THEN join.ph_road_addr
      //         ELSE ph_jibun_addr END`,
      //   'phAddress',
      // )
      // .addSelect('join.ph_zip_cd', 'phZipCd');
    }
    query
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select('cjpl.*')
            .addSelect('pgPayLogs.card_name')
            .from(CcaliJoinPayLogs, 'cjpl')
            .leftJoin(
              (subQuery) => {
                return subQuery.select('tnpl.*').from(PayNicepayLogs, 'tnpl');
              },
              'pgPayLogs',
              'cjpl.pay_logs_id = pgPayLogs.seq_no',
            );
        },
        'payLogs',
        'join.id = payLogs.join_id',
      )
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select('outer_tb.*')
            .from(CcaliJoinPayLogs, 'outer_tb')
            .innerJoin(
              (subQuery) => {
                return subQuery
                  .select('cjpl.join_id', 'join_id')
                  .addSelect(' MIN(cjpl.pay_no)', 'min_pay_no')
                  .from(CcaliJoinPayLogs, 'cjpl')
                  .where('cjpl.pay_dt IS NULL')
                  .groupBy('cjpl.join_id');
              },
              'inner_tb',
              'outer_tb.join_id = inner_tb.join_id AND outer_tb.pay_no = inner_tb.min_pay_no',
            );
        },
        'nextPayLogs',
        'join.id = nextPayLogs.join_id',
      )
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
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select('ins_prod_trms.*')
            .from(InsProdTerms, 'ins_prod_trms');
        },
        'terms',
        'prod.id = terms.ins_prod_id AND join.crt_dt >= terms.strt_dt AND join.crt_dt < terms.end_dt',
      )
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select('ccali_claim.*')
            .from(CcaliClaim, 'ccali_claim');
        },
        'claim',
        'join.id = claim.join_id',
      )
      .where('join.id = :joinId', { joinId })
      .andWhere('join.join_stts_cd NOT IN ("W", "C")')
      .andWhere('join.del_yn = "N"');

    const results = await query.getRawMany();

    let formattedResults = [];
    for (let index = 0; index < results.length; index++) {
      const element = results[index];
      const {
        logsPayNo,
        logsPayMethod,
        logsPayInsCost,
        logsPayScheduledDt,
        logsPayDueDt,
        logsPayDt,
        planId,
        insuredCorpFoundationYmd,
        salesCost,
        regularEmployeeCnt,
        dispatchedEmployeeCnt,
        subcontractEmployeeCnt,
        totEmployeeCnt,
        totAnnualWages,
        joinRenewNo,
        perAccidentCoverageLimit,
        totCoverageLimit,
        deductibleInsCost,
        totInsCost,
        highRiskProducts,
        ...rest
      } = element;

      const ntsBizLargeTypeInfo = await this.ntsBizTypeRepository.findOne({
        where: {
          bizSubSubTypeCd: element.ntsBizTypeCd,
        },
      });

      const ccaliBizLargeTypeInfo = await this.ccaliBizTypeRepository.findOne({
        where: {
          bizSmallTypeCd: element.ccaliBizTypeCd,
        },
      });

      let tmpJoinInfo: any = {};
      let tmpPayLogsInfo: any = {};

      tmpPayLogsInfo = {
        payNo: parseInt(logsPayNo),
        payMethod: logsPayMethod,
        payInsCost: parseInt(logsPayInsCost),
        payScheduledYmd:
          logsPayScheduledDt == null
            ? null
            : dayjs(logsPayScheduledDt).format('YYYY.MM.DD'),
        payScheduledMonth:
          logsPayScheduledDt == null
            ? null
            : dayjs(logsPayScheduledDt).format('YYYY.MM'),
        payDueYmd:
          logsPayDueDt == null
            ? null
            : dayjs(logsPayDueDt).format('YYYY.MM.DD'),
        payDt:
          logsPayDt == null
            ? null
            : dayjs(logsPayDt).format('YYYY.MM.DD HH:mm:ss'),
      };
      if (index == 0) {
        tmpJoinInfo = {
          ...rest,
          planId: parseInt(planId),
          insuredCorpFoundationYmd:
            insuredCorpFoundationYmd == null
              ? null
              : dayjs(insuredCorpFoundationYmd).format('YYYY.MM.DD'),
          salesCost: parseInt(salesCost),
          regularEmployeeCnt: parseInt(regularEmployeeCnt),
          dispatchedEmployeeCnt: parseInt(dispatchedEmployeeCnt),
          subcontractEmployeeCnt: parseInt(subcontractEmployeeCnt),
          totEmployeeCnt: parseInt(totEmployeeCnt),
          totAnnualWages: parseInt(totAnnualWages),
          joinRenewNo: parseInt(joinRenewNo),
          perAccidentCoverageLimit: parseInt(perAccidentCoverageLimit),
          totCoverageLimit: parseInt(totCoverageLimit),
          deductibleInsCost: parseInt(deductibleInsCost),
          totInsCost: parseInt(totInsCost),
          claimYn: 'N',
          claimData: [],
          ntsBizLargeTypeCd: ntsBizLargeTypeInfo.bizLargeTypeCd,
          ntsBizLargeTypeNm: ntsBizLargeTypeInfo.bizLargeTypeNm,
          ccaliBizLargeTypeCd: ccaliBizLargeTypeInfo.bizLargeTypeCd,
          ccaliBizLargeTypeNm: ccaliBizLargeTypeInfo.bizLargeTypeNm,
          payLogsData: [tmpPayLogsInfo],
          subCompanyList: [],
          responseList: [],
          highRiskProducts:
            highRiskProducts == null ? [] : JSON.parse(highRiskProducts),
          insCostNoticeData: [],
        };

        formattedResults.push(tmpJoinInfo);
      } else {
        formattedResults[formattedResults.length - 1].payLogsData.push(
          tmpPayLogsInfo,
        );
      }

      if (index == results.length - 1) {
        // 사고접수 조회
        const claimResults = await this.ccaliClaimRepository
          .createQueryBuilder('claim')
          .select(
            'CONCAT(claim.acdnt_ymd, " ", claim.acdnt_tm)',
            'claimAccidentDt',
          )
          .addSelect('claim.acdnt_cn', 'claimAccidentContent')
          .addSelect('claim.claim_stts_cd', 'claimStatusCd')
          .addSelect(
            `CASE WHEN claim.claim_stts_cd = "A" THEN "사고접수 완료"
                ELSE NULL END`,
            'claimStatusNm',
          )
          .addSelect('claim.crt_dt', 'claimDt')
          .where('claim.join_id = :joinId', { joinId })
          .getRawMany();

        let claimFormattedResults = [];
        for (
          let claimIndex = 0;
          claimIndex < claimResults.length;
          claimIndex++
        ) {
          const claimElement = claimResults[claimIndex];
          const {
            claimAccidentDt,
            claimAccidentContent,
            claimStatusCd,
            claimStatusNm,
            claimDt,
          } = claimElement;

          let tmpClaimInfo = {
            claimAccidentDt:
              claimAccidentDt == null
                ? null
                : dayjs(claimAccidentDt).format('YYYY년 MM월 DD일 H시경'),
            claimAccidentContent,
            claimStatusCd,
            claimStatusNm,
            claimDt:
              claimDt == null
                ? null
                : dayjs(claimDt).format('YYYY년 MM월 DD일 HH:mm'),
          };
          claimFormattedResults.push(tmpClaimInfo);

          if (claimIndex == claimResults.length - 1) {
            if (claimFormattedResults.length > 0) {
              formattedResults[formattedResults.length - 1].claimYn = 'Y';
              formattedResults[formattedResults.length - 1].claimData = [
                ...claimFormattedResults,
              ];
            }
          }
        }
      }

      if (index == results.length - 1 && element.subCompanyJoinYn == 'Y') {
        console.log('formattedResults', formattedResults);
        const subCompanyResult = await this.ccaliJoinSubCompanyRepository
          .createQueryBuilder('sub')
          .select('sub.sub_com_biz_no', 'subCompanyBizNo')
          .addSelect('sub.sub_com_biz_no_gb_cd', 'subCompanyBizNoGbCd')
          .addSelect('sub.sub_com_fran_nm', 'subCompanyFranNm')
          .addSelect('sub.sub_com_jibun_addr', 'subCompanyJibunAddress')
          .addSelect('sub.sub_com_road_addr', 'subCompanyRoadAddress')
          .addSelect(
            `CASE WHEN sub.sub_com_road_addr IS NOT NULL AND sub.sub_com_road_addr != "" THEN sub.sub_com_road_addr
              ELSE sub_com_jibun_addr END`,
            'subCompanyAddress',
          )
          .addSelect('sub.sub_com_zip_cd', 'subCompanyZipCd')
          .addSelect('sub.nts_biz_type_id', 'ntsBizTypeId')
          .addSelect('sub.nts_biz_type_cd', 'ntsBizTypeCd')
          .addSelect('sub.nts_biz_type_nm', 'ntsBizTypeNm')
          .addSelect('sub.ccali_biz_type_id', 'ccaliBizTypeId')
          .addSelect('sub.ccali_biz_type_cd', 'ccaliBizTypeCd')
          .addSelect('sub.ccali_biz_type_nm', 'ccaliBizTypeNm')
          .addSelect('sub.sales_cst', 'salesCost')
          .addSelect('sub.emp_cnt', 'employeeCnt')
          .addSelect('sub.ext_emp_cnt', 'externalEmployeeCnt')
          .addSelect('sub.tot_emp_cnt', 'totEmployeeCnt')
          .addSelect('sub.tot_anl_wgs', 'totAnnualWages')
          .where('sub.join_id = :joinId', { joinId })
          .orderBy('sub.id', 'ASC')
          .getRawMany();

        let subFormattedResults = [];
        for (let subIndex = 0; subIndex < subCompanyResult.length; subIndex++) {
          const subElement = subCompanyResult[subIndex];
          const {
            // subCompanyBizNo,
            // subCompanyBizNoGbCd,
            // subCompanyFranNm,
            subCompanyJibunAddress,
            subCompanyRoadAddress,
            // subCompanyAddress,
            // subCompanyZipCd,
            ntsBizTypeId,
            // ntsBizTypeCd,
            // ntsBizTypeNm,
            ccaliBizTypeId,
            // ccaliBizTypeCd,
            // ccaliBizTypeNm,
            salesCost,
            employeeCnt,
            externalEmployeeCnt,
            totEmployeeCnt,
            totAnnualWages,
            ...rest
          } = subElement;

          const subNtsBizLargeTypeInfo =
            await this.ntsBizTypeRepository.findOne({
              where: {
                id: ntsBizTypeId,
              },
            });

          const subCcaliBizLargeTypeInfo =
            await this.ccaliBizTypeRepository.findOne({
              where: {
                bizSmallTypeId: ccaliBizTypeId,
              },
            });

          let tmpSubCompanyInfo = {
            ...rest,
            salesCost: parseInt(salesCost),
            employeeCnt: parseInt(employeeCnt),
            externalEmployeeCnt: parseInt(externalEmployeeCnt),
            totEmployeeCnt: parseInt(totEmployeeCnt),
            totAnnualWages: parseInt(totAnnualWages),
            ntsBizLargeTypeCd: subNtsBizLargeTypeInfo.bizLargeTypeCd,
            ntsBizLargeTypeNm: subNtsBizLargeTypeInfo.bizLargeTypeNm,
            ccaliBizLargeTypeCd: subCcaliBizLargeTypeInfo.bizLargeTypeCd,
            ccaliBizLargeTypeNm: subCcaliBizLargeTypeInfo.bizLargeTypeNm,
          };
          subFormattedResults.push(tmpSubCompanyInfo);

          if (subIndex == subCompanyResult.length - 1) {
            console.log('subFormattedResults', subFormattedResults);
            formattedResults[0]?.subCompanyList.push(...subFormattedResults);
          }
        }
      }

      if (
        index == results.length - 1 &&
        type == 'JoinFile' &&
        formattedResults[0]?.planId >= 3
      ) {
        const answerResults = await this.ccaliAnswerResponseRepository.find({
          where: {
            joinId,
          },
        });

        formattedResults[0]?.responseList.push(...answerResults);

        const insStockNoInfo = await this.masterInsStockNoRepository.find({
          where: {
            insProdId: element?.insProdId,
            planId,
            insComCd: element?.insComCd,
            startDt: LessThanOrEqual(dayjs(element?.joinYmd).toDate()),
            endDt: MoreThan(dayjs(element?.joinYmd).toDate()),
          },
          order: {
            id: 'DESC',
          },
          take: 1,
        });
        console.log('insStockNoInfo', insStockNoInfo);
        formattedResults[0].tempInsStockNo =
          insStockNoInfo.length == 0
            ? '증권번호'
            : insStockNoInfo[0]?.insStockNo;
      }

      if (
        index == results.length - 1 &&
        (formattedResults[0]?.joinStatusCd == 'A' ||
          formattedResults[0]?.joinStatusCd == 'P')
      ) {
        // 보험료 안내 정보 조회
        const insCostNotice = await this.ccaliInsCostNoticeRepository.findOne({
          where: {
            joinId,
          },
        });
        formattedResults[0]?.insCostNoticeData.push(insCostNotice);
      }
    }

    if (formattedResults.length > 0) {
      // 보장내용 조회
      const planGuarantee = await this.selectCcaliPlanGuaranteeByJoinId({
        joinId,
        planId: formattedResults[0].planId,
      });
      formattedResults[0].planGuarantee = planGuarantee;
    }

    return formattedResults;
  }

  async funCreateInsJoinFileCcali(joinId: number) {
    let responseCode = 0;
    let responseMsg = 'ok';
    let responseData: any = {};

    const ccaliJoin = await this.selectJoinListDetailByJoinId(
      joinId,
      'JoinFile',
    );
    if (ccaliJoin.length == 0) {
      responseCode = 20;
      responseMsg = '검색 결과 없음(가입신청 정보)';
    }
    const body = ccaliJoin[0];
    // 보장내역 조회

    const insComCd = body.insComCd;

    const insComInfo = await this.selectInsComByInsComCd(insComCd);

    let writeFileName = '';
    let fileIns = insComCd;
    let result = '';
    let insProdCd = 'ccali';
    let insuredBizNo = body.insuredBizNo;
    let updatedDt;
    if (body.updatedDt != null) {
      updatedDt = dayjs(body.updatedDt).format('YYYYMMDDHHmmss');
    } else {
      const now = dayjs().format('YYYYMMDDHHmmss');
      updatedDt = now;
    }
    writeFileName = totalJoiningDeed({
      ...body,
    });

    // 새파일이름
    // 보험사+사업자번호+보험상품코드+seq_no+pdatedAt
    let fileName = '';
    fileName =
      fileIns +
      '_' +
      insuredBizNo +
      '_' +
      insProdCd +
      '_' +
      joinId.toString() +
      '_' +
      updatedDt;
    console.log('fileName', fileName);
    const pdfFilePath = join(
      __dirname,
      '..',
      '..',
      'uploads',
      'join',
      insProdCd,
      'pdf',
      fileName,
    );
    const htmlFilePath = join(
      __dirname,
      '..',
      '..',
      'uploads',
      'join',
      insProdCd,
      'html',
      fileName,
    );

    if (fs.existsSync(`${pdfFilePath}.pdf`)) {
      console.log('fileExists!');
      result = fileName;
    } else {
      const writeResult = await writeToFile(
        `${htmlFilePath}.html`,
        writeFileName,
      );
      if (writeResult?.success) {
        // temp/tmp 폴더에 .html을 임시저장 tmp폴더는 crontab으로 일정주기로 삭제
        let html = fs.readFileSync(`${htmlFilePath}.html`, 'utf8');

        const pdfBuffer = await this.generatePdf(html, {
          path: `${pdfFilePath}.pdf`,
        });
      } else {
        responseCode = 10;
        responseMsg = '파일생성 실패';
      }
      result = fileName;
    }
    responseData.fileName = fileName;

    return { responseCode, responseMsg, responseData };
  }

  async selectCcaliPlanGuaranteeByJoinId({
    joinId,
    planId,
  }: SelectJoinPlanGuaranteeDto) {
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
      .addSelect('questionGuaranteeContentMap.qstn_id', 'questionId')
      .addSelect('questionGuaranteeContentMap.file_id', 'questionFileId')
      .addSelect('questionGuaranteeContentMap.ctgry_id', 'questionCategoryId')
      .addSelect('questionGuaranteeContentMap.qstn_text', 'questionText')
      .addSelect(
        'questionGuaranteeContentMap.site_qstn_text',
        'siteQuestionText',
      )
      .addSelect(
        'questionGuaranteeContentMap.site_qstn_expln',
        'siteQuestionExplain',
      )
      .addSelect('questionGuaranteeContentMap.sort_seq', 'questionSortSeq')
      .addSelect(
        'questionGuaranteeContentMap.site_sort_seq',
        'siteQuestionSortSeq',
      )
      .addSelect('questionGuaranteeContentMap.ans_id', 'answerId')
      .addSelect('questionGuaranteeContentMap.ans_value', 'answerValue')
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
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select('map.qstn_id')
            .addSelect('map.grnte_cn_id')
            .addSelect('question.file_id')
            .addSelect('question.ctgry_id')
            .addSelect('question.qstn_text')
            .addSelect('question.site_qstn_text')
            .addSelect('question.site_qstn_expln')
            .addSelect('question.sort_seq')
            .addSelect('question.site_sort_seq')
            .addSelect('response.ans_id')
            .addSelect('response.ans_value')
            .from(CcaliAnswerResponse, 'response')
            .innerJoin(
              (subQuery) => {
                return subQuery.select('qstn.*').from(CcaliQuestion, 'qstn');
              },
              'question',
              'response.qstn_id = question.id',
            )
            .innerJoin(
              (subQuery) => {
                return subQuery
                  .select('cqpgcm.*')
                  .from(CcaliQuestionPlanGuaranteeContentMap, 'cqpgcm');
              },
              'map',
              'map.qstn_id = question.id',
            )
            .where('response.join_id = :joinId', { joinId });
        },
        'questionGuaranteeContentMap',
        'guaranteeContent.id = questionGuaranteeContentMap.grnte_cn_id',
      )
      // .leftJoin(
      //   (subQuery) => {
      //     return subQuery.select('cn.*').from(PlanGuaranteeContent, 'cn');
      //   },
      //   'guaranteeContent',
      //   'plan.id = guaranteeContent.plan_id AND guarantee.id = guaranteeContent.grnte_id',
      // )
      .where('guaranteeContent.plan_id = :planId', { planId });

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
        questionId,
        questionFileId,
        questionCategoryId,
        questionText,
        siteQuestionText,
        siteQuestionExplain,
        questionSortSeq,
        siteQuestionSortSeq,
        answerId,
        answerValue,
      } = element;

      let tmpPlanInfo: any = {};
      let tmpGuaranteeInfo = {
        guaranteeId: parseInt(guaranteeId),
        guaranteeNm,
        guaranteeContent,
        guaranteeExplain,
        // requiredYn,
        // questionId,
        // questionFileId,
        // questionCategoryId,
        // questionText,
        // siteQuestionText,
        // siteQuestionExplain,
        // questionSortSeq,
        // siteQuestionSortSeq,
        // answerId,
        // answerValue,
      };

      if (index == 0) {
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
          if (
            answerValue == null ||
            answerValue == '필수가입' ||
            answerValue == '가입' ||
            answerValue == '예'
          ) {
            formattedResults[formattedResults.length - 1].guaranteeData.push(
              tmpGuaranteeInfo,
            );
          }
        } else {
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

  async readExcelFile(filePath: string): Promise<any[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1); // 첫 번째 시트
    let results = [];

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      console.log(`Row ${rowNumber} = ${JSON.stringify(row.values)}`);
      if (rowNumber >= 3) {
        results.push(row.values);
      }
    });

    return results;
  }

  async exportExcelFile(
    type: string,
    joinId?: number,
  ): Promise<{ filePath: string; fileName: string }> {
    console.log('exportExcelFile start');
    const workbook = new ExcelJS.Workbook();

    if (type == 'P' || type == 'A') {
      let filePath = `uploads/excel/보험료안내자료_layout_V1.3_240905.xlsx`;
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.getWorksheet('Sheet1');
      // 전체 셀을 기본적으로 잠그지 않고 시작 - 기본 레이아웃 자료에 셀 잠금 해제함

      const columnOne = worksheet.getRow(1).values;
      const columnTwoe = worksheet.getRow(2).values;

      worksheet.getColumn(6).numFmt = '#,##0_ ';
      worksheet.getColumn(7).numFmt = '#,##0_ ';
      worksheet.getColumn(8).numFmt = '#,##0_ ';
      worksheet.getColumn(22).numFmt = '#,##0_ ';
      worksheet.getColumn(23).numFmt = '#,##0_ ';
      worksheet.getColumn(24).numFmt = '#,##0_ ';
      worksheet.getColumn(25).numFmt = '#,##0_ ';
      worksheet.getColumn(26).numFmt = '#,##0_ ';

      const ccaliJoin = await this.selectJoinListDetailByJoinId(
        joinId,
        'JoinFile',
      );
      console.log('ccaliJoin', ccaliJoin);

      /*
       * 엑셀파일 생성
       * 보험료 조회 요청 일자
       * 개별계약자 사업자번호
       * 개별계약자 상호명
       * 산재가입 업종명
       * 매출액
       * 근로자수
       * 연임금 총액
       * 자회사 담보(1: Y, 2: N)
       */
      const insuredBizNo = ccaliJoin[0]?.insuredBizNo;
      const joinYmd = dayjs(ccaliJoin[0]?.joinYmd).format('YYYYMMDD');
      const phBizNo = ccaliJoin[0]?.phBizNo;
      const phNm = ccaliJoin[0]?.phNm;
      const ccaliBizLargeTypeNm = ccaliJoin[0]?.ccaliBizLargeTypeNm;
      const ccaliBizTypeNm = ccaliJoin[0]?.ccaliBizTypeNm;
      const salesCost = ccaliJoin[0]?.salesCost;
      const totEmployeeCnt = ccaliJoin[0]?.totEmployeeCnt;
      const totAnnualWages = ccaliJoin[0]?.totAnnualWages;
      const subCompanyJoinYn =
        ccaliJoin[0]?.subCompanyJoinYn == 'Y' ? '1' : '2';

      // 약관
      const planId = ccaliJoin[0]?.planId;
      const responseArray = [];
      for (
        let responseIndex = 0;
        responseIndex < ccaliJoin[0]?.responseList.length;
        responseIndex++
      ) {
        const responseElement = ccaliJoin[0]?.responseList[responseIndex];
        responseArray.push(responseElement.answerId);
      }
      let guarantee1JoinCd = '1';
      let guarantee2JoinCd = '1';
      let guarantee3JoinCd = '2';
      let guarantee4JoinCd = '1';
      let guarantee5JoinCd = '1';
      let guarantee6JoinCd = '2';
      let guarantee7JoinCd = '1';
      let guarantee8JoinCd = '1';
      let guarantee9JoinCd = '1';
      let guarantee10JoinCd = '1';
      let guarantee11JoinCd = '1';
      let guarantee12JoinCd = '1';
      const perAccidentCoverageLimit = ccaliJoin[0]?.perAccidentCoverageLimit;
      const totCoverageLimit = ccaliJoin[0]?.totCoverageLimit;
      const singleInsCost = 700000;
      const biannualInsCost = 720000;
      const quarterlyInsCost = 740000;
      if (planId == 5) {
        for (
          let index = 0;
          index < ccaliJoin[0]?.planGuarantee[0].guaranteeData.length;
          index++
        ) {
          const element = ccaliJoin[0]?.planGuarantee[0].guaranteeData[index];

          if (
            element.guaranteeNm.includes('중대사고 형사방어비용 (특별약관)')
          ) {
            guarantee3JoinCd = '1';
          }
          if (ccaliJoin[0]?.guaranteeDisaterCd == 'indst') {
            guarantee4JoinCd = '2';
          } else if (ccaliJoin[0]?.guaranteeDisaterCd == 'civil') {
            guarantee4JoinCd = '3';
          }
          if (
            element.guaranteeNm.includes('중대사고 위기관리실행비용Ⅰ(특별약관)')
          ) {
            guarantee5JoinCd = '1';
          } else if (
            element.guaranteeNm.includes('중대사고 위기관리실행비용Ⅱ(특별약관)')
          ) {
            guarantee5JoinCd = '2';
          }
          if (
            element.guaranteeNm.includes('민사상 배상책임 부담보 (특별약관)')
          ) {
            guarantee6JoinCd = '1';
          }
        }
      } else {
        if (ccaliJoin[0]?.guaranteeDisaterCd == 'indst') {
          guarantee4JoinCd = '2';
        } else if (ccaliJoin[0]?.guaranteeDisaterCd == 'civil') {
          guarantee4JoinCd = '3';
        }

        if (responseArray.includes(22)) {
          guarantee5JoinCd = '1';
        } else if (responseArray.includes(171)) {
          guarantee5JoinCd = '2';
        }
      }

      const data = [
        joinYmd,
        insuredBizNo,
        phBizNo,
        phNm,
        ccaliBizTypeNm,
        salesCost,
        totEmployeeCnt,
        totAnnualWages,
        subCompanyJoinYn,
        guarantee1JoinCd,
        guarantee2JoinCd,
        guarantee3JoinCd,
        guarantee4JoinCd,
        guarantee5JoinCd,
        guarantee6JoinCd,
        guarantee7JoinCd,
        guarantee8JoinCd,
        guarantee9JoinCd,
        guarantee10JoinCd,
        guarantee11JoinCd,
        guarantee12JoinCd,
        perAccidentCoverageLimit,
        totCoverageLimit,
      ];

      if (type == 'A') {
        data.push(singleInsCost);
        if (planId == 5) {
          data.push(biannualInsCost, quarterlyInsCost);
        }
      }

      // 데이터 삽입
      worksheet.insertRow(3, data);

      // A3:H3 범위의 셀만 잠금 설정
      const startColumn = 'A';
      const endColumn = 'I';
      const rowNumber = 3;
      for (
        let col = startColumn;
        col <= endColumn;
        col = String.fromCharCode(col.charCodeAt(0) + 1)
      ) {
        const cellAddress = `${col}${rowNumber}`;
        const cell = worksheet.getCell(cellAddress);
        cell.protection = {
          locked: true,
        };
      }

      // 워크시트 보호 활성화
      const worksheetPassword = '2222';
      worksheet.protect(worksheetPassword, {
        selectLockedCells: true,
        selectUnlockedCells: true,
      });

      // 엑셀 파일 저장 경로 설정
      const saveFileName = `보험료조회요청_${insuredBizNo}_${joinYmd}.xlsx`;
      const saveFilePath = join(__dirname, '../../uploads/excel', saveFileName);
      console.log('saveFilePath', saveFilePath);

      // 파일로 저장
      await workbook.xlsx.writeFile(saveFilePath);

      // 저장된 파일의 경로 반환
      return { filePath: saveFilePath, fileName: saveFileName };
    } else {
      const worksheet = workbook.addWorksheet('Data Sheet');

      // 열 제목 설정
      worksheet.columns = [
        { header: 'Column1', key: 'column1', width: 10 },
        { header: 'Column2', key: 'column2', width: 30 },
        // 추가적인 컬럼 설정
      ];

      // 데이터 삽입
      worksheet.addRow({
        column1: '1',
        column2: '2',
        // 해당 엔티티의 다른 필드
      });

      // 엑셀 파일 저장 경로 설정
      const saveFileName = `DataExport-test-${Date.now()}.xlsx`;
      const saveFilePath = join(__dirname, '../../uploads/excel', saveFileName);
      console.log('saveFilePath', saveFilePath);

      // 파일로 저장
      await workbook.xlsx.writeFile(saveFilePath);

      // 저장된 파일의 경로 반환
      return { filePath: saveFilePath, fileName: saveFileName };
    }
  }

  async exportExcelFileTest(
    type: string,
    joinId?: number,
  ): Promise<{ filePath: string; fileName: string }> {
    console.log('exportExcelFileTest start');
    const workbook = new ExcelJS.Workbook();

    if (type == 'P') {
      let filePath = `uploads/excel/보험료안내자료_layout_V1.2_240904.xlsx`;
      // let filePath = `uploads/excel/보험료안내자료_layout_V1.1_240814.xlsx`;
      await workbook.xlsx.readFile(filePath);

      const worksheet = workbook.getWorksheet('Sheet1');

      // 전체 셀을 기본적으로 잠그지 않고 시작
      // worksheet.eachRow(function (row) {
      //   row.eachCell(function (cell) {
      //     cell.protection = {
      //       locked: false,
      //     };
      //   });
      // });

      const columnOne = worksheet.getRow(1).values;
      const columnTwoe = worksheet.getRow(2).values;

      worksheet.getColumn(5).numFmt = '#,##0_ ';
      worksheet.getColumn(6).numFmt = '#,##0_ ';
      worksheet.getColumn(7).numFmt = '#,##0_ ';
      worksheet.getColumn(21).numFmt = '#,##0_ ';
      worksheet.getColumn(22).numFmt = '#,##0_ ';
      worksheet.getColumn(23).numFmt = '#,##0_ ';
      worksheet.getColumn(24).numFmt = '#,##0_ ';
      worksheet.getColumn(25).numFmt = '#,##0_ ';

      const ccaliJoin = await this.selectJoinListDetailByJoinId(
        joinId,
        'JoinFile',
      );
      console.log('ccaliJoin', ccaliJoin);

      /*
       * 엑셀파일 생성
       * date
       * 개별계약자 사업자번호
       * 개별계약자 상호명
       * 산재가입 업종명
       * 매출액
       * 근로자수
       * 연임금 총액
       * 자회사 담보(1: Y, 2: N)
       */
      const insuredBizNo = ccaliJoin[0]?.insuredBizNo;
      const joinYmd = dayjs(ccaliJoin[0]?.joinYmd).format('YYYYMMDD');
      const phBizNo = ccaliJoin[0]?.phBizNo;
      const phNm = ccaliJoin[0]?.phNm;
      const ccaliBizLargeTypeNm = ccaliJoin[0]?.ccaliBizLargeTypeNm;
      const ccaliBizTypeNm = ccaliJoin[0]?.ccaliBizTypeNm;
      const salesCost = ccaliJoin[0]?.salesCost;
      const totEmployeeCnt = ccaliJoin[0]?.totEmployeeCnt;
      const totAnnualWages = ccaliJoin[0]?.totAnnualWages;
      const subCompanyJoinYn =
        ccaliJoin[0]?.subCompanyJoinYn == 'Y' ? '1' : '2';
      const data = [
        joinYmd,
        phBizNo,
        phNm,
        ccaliBizTypeNm,
        salesCost,
        totEmployeeCnt,
        totAnnualWages,
        subCompanyJoinYn,
      ];

      // 데이터 삽입
      worksheet.insertRow(3, data);

      // A3:H3 범위의 셀만 잠금 설정
      const startColumn = 'A';
      const endColumn = 'H';
      const rowNumber = 3;

      for (
        let col = startColumn;
        col <= endColumn;
        col = String.fromCharCode(col.charCodeAt(0) + 1)
      ) {
        const cellAddress = `${col}${rowNumber}`;
        const cell = worksheet.getCell(cellAddress);
        cell.protection = {
          locked: true,
        };
      }

      // 워크시트 보호 활성화
      worksheet.protect('2222', {
        selectLockedCells: true,
        selectUnlockedCells: true,
      });

      // 엑셀 파일 저장 경로 설정
      const saveFileName = `보험료조회요청_${insuredBizNo}_${joinYmd}.xlsx`;
      const saveFilePath = join(__dirname, '../../uploads/excel', saveFileName);
      console.log('saveFilePath', saveFilePath);

      // 파일로 저장
      await workbook.xlsx.writeFile(saveFilePath);

      // 저장된 파일의 경로 반환
      return { filePath: saveFilePath, fileName: saveFileName };
    } else if (type == 'A') {
      let filePath = `uploads/excel/보험료안내자료_layout_V1.1_240814.xlsx`;
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.getWorksheet(1);

      const columnOne = worksheet.getRow(1).values;
      const columnTwoe = worksheet.getRow(2).values;

      worksheet.getColumn(5).numFmt = '#,##0_ ';
      worksheet.getColumn(6).numFmt = '#,##0_ ';
      worksheet.getColumn(7).numFmt = '#,##0_ ';
      worksheet.getColumn(21).numFmt = '#,##0_ ';
      worksheet.getColumn(22).numFmt = '#,##0_ ';
      worksheet.getColumn(23).numFmt = '#,##0_ ';
      worksheet.getColumn(24).numFmt = '#,##0_ ';
      worksheet.getColumn(25).numFmt = '#,##0_ ';

      const ccaliJoin = await this.selectJoinListDetailByJoinId(
        joinId,
        'JoinFile',
      );
      console.log('ccaliJoin', ccaliJoin);

      /*
       * 엑셀파일 생성
       * date
       * 개별계약자 사업자번호
       * 개별계약자 상호명
       * 산재가입 업종명
       * 매출액
       * 근로자수
       * 연임금 총액
       * 자회사 담보(1: Y, 2: N)
       */
      const insuredBizNo = ccaliJoin[0]?.insuredBizNo;
      const joinYmd = dayjs(ccaliJoin[0]?.joinYmd).format('YYYYMMDD');
      const phBizNo = ccaliJoin[0]?.phBizNo;
      const phNm = ccaliJoin[0]?.phNm;
      const ccaliBizLargeTypeNm = ccaliJoin[0]?.ccaliBizLargeTypeNm;
      const ccaliBizTypeNm = ccaliJoin[0]?.ccaliBizTypeNm;
      const salesCost = ccaliJoin[0]?.salesCost;
      const totEmployeeCnt = ccaliJoin[0]?.totEmployeeCnt;
      const totAnnualWages = ccaliJoin[0]?.totAnnualWages;
      const subCompanyJoinYn =
        ccaliJoin[0]?.subCompanyJoinYn == 'Y' ? '1' : '2';

      // 약관
      const planId = ccaliJoin[0]?.planId;
      const responseArray = [];
      for (
        let responseIndex = 0;
        responseIndex < ccaliJoin[0]?.responseList.length;
        responseIndex++
      ) {
        const responseElement = ccaliJoin[0]?.responseList[responseIndex];
        responseArray.push(responseElement.answerId);
      }
      let guarantee1JoinCd = '1';
      let guarantee2JoinCd = '1';
      let guarantee3JoinCd = '2';
      let guarantee4JoinCd = '1';
      let guarantee5JoinCd = '1';
      let guarantee6JoinCd = '2';
      let guarantee7JoinCd = '1';
      let guarantee8JoinCd = '1';
      let guarantee9JoinCd = '1';
      let guarantee10JoinCd = '1';
      let guarantee11JoinCd = '1';
      let guarantee12JoinCd = '1';
      const perAccidentCoverageLimit = ccaliJoin[0]?.perAccidentCoverageLimit;
      const totCoverageLimit = ccaliJoin[0]?.totCoverageLimit;
      const singleInsCost = 700000;
      const biannualInsCost = 720000;
      const quarterlyInsCost = 740000;
      if (planId == 5) {
        for (
          let index = 0;
          index < ccaliJoin[0]?.planGuarantee[0].guaranteeData.length;
          index++
        ) {
          const element = ccaliJoin[0]?.planGuarantee[0].guaranteeData[index];

          if (
            element.guaranteeNm.includes('중대사고 형사방어비용 (특별약관)')
          ) {
            guarantee3JoinCd = '1';
          }
          if (ccaliJoin[0]?.guaranteeDisaterCd == 'indst') {
            guarantee4JoinCd = '2';
          }
          if (
            element.guaranteeNm.includes('중대사고 위기관리실행비용Ⅰ(특별약관)')
          ) {
            guarantee5JoinCd = '1';
          } else if (
            element.guaranteeNm.includes('중대사고 위기관리실행비용Ⅱ(특별약관)')
          ) {
            guarantee5JoinCd = '2';
          }
          if (
            element.guaranteeNm.includes('민사상 배상책임 부담보 (특별약관)')
          ) {
            guarantee6JoinCd = '1';
          }
        }
      } else {
        if (ccaliJoin[0]?.guaranteeDisaterCd == 'indst') {
          guarantee4JoinCd = '2';
        } else if (ccaliJoin[0]?.guaranteeDisaterCd == 'civil') {
          guarantee4JoinCd = '3';
        }

        if (responseArray.includes(22)) {
          guarantee5JoinCd = '1';
        } else if (responseArray.includes(171)) {
          guarantee5JoinCd = '2';
        }
      }

      const data = [
        joinYmd,
        phBizNo,
        phNm,
        ccaliBizTypeNm,
        salesCost,
        totEmployeeCnt,
        totAnnualWages,
        subCompanyJoinYn,
        guarantee1JoinCd,
        guarantee2JoinCd,
        guarantee3JoinCd,
        guarantee4JoinCd,
        guarantee5JoinCd,
        guarantee6JoinCd,
        guarantee7JoinCd,
        guarantee8JoinCd,
        guarantee9JoinCd,
        guarantee10JoinCd,
        guarantee11JoinCd,
        guarantee12JoinCd,
        perAccidentCoverageLimit,
        totCoverageLimit,
        singleInsCost,
      ];
      if (planId == 5) {
        data.push(biannualInsCost, quarterlyInsCost);
      }

      // 데이터 삽입
      worksheet.insertRow(3, data);

      // 엑셀 파일 저장 경로 설정
      const saveFileName = `보험료조회요청_${insuredBizNo}_${joinYmd}.xlsx`;
      const saveFilePath = join(__dirname, '../../uploads/test', saveFileName);
      console.log('saveFilePath', saveFilePath);

      // 파일로 저장
      await workbook.xlsx.writeFile(saveFilePath);

      // 저장된 파일의 경로 반환
      return { filePath: saveFilePath, fileName: saveFileName };
    } else {
      const worksheet = workbook.addWorksheet('Data Sheet');

      // 열 제목 설정
      worksheet.columns = [
        { header: 'Column1', key: 'column1', width: 10 },
        { header: 'Column2', key: 'column2', width: 30 },
        // 추가적인 컬럼 설정
      ];

      // 데이터 삽입
      worksheet.addRow({
        column1: '1',
        column2: '2',
        // 해당 엔티티의 다른 필드
      });

      // 엑셀 파일 저장 경로 설정
      const saveFileName = `DataExport-test-${Date.now()}.xlsx`;
      const saveFilePath = join(__dirname, '../../uploads/excel', saveFileName);
      console.log('saveFilePath', saveFilePath);

      // 파일로 저장
      await workbook.xlsx.writeFile(saveFilePath);

      // 저장된 파일의 경로 반환
      return { filePath: saveFilePath, fileName: saveFileName };
    }
  }

  async funCreateAcqsPdfFile(
    joinId: number,
    fileType: string,
    instalmentNo?: number,
  ) {
    let responseCode = 0;
    let responseMsg = 'ok';
    let responseData: any = {};

    const ccaliJoin = await this.selectJoinListDetailByJoinId(
      joinId,
      'JoinFile',
    );
    if (ccaliJoin.length == 0) {
      responseCode = 20;
      responseMsg = '검색 결과 없음(가입신청 정보)';
    }
    const body = ccaliJoin[0];
    // 보장내역 조회

    const insComCd = body.insComCd;

    const insComInfo = await this.selectInsComByInsComCd(insComCd);

    let writeFileName = '';
    let fileIns = insComCd;
    let result = '';
    let insProdCd = 'ccali';
    let insuredBizNo = body.insuredBizNo;
    let updatedDt;
    if (body.updatedDt != null) {
      updatedDt = dayjs(body.updatedDt).format('YYYYMMDDHHmmss');
    } else {
      const now = dayjs().format('YYYYMMDDHHmmss');
      updatedDt = now;
    }
    // updatedDt = dayjs(body.updatedDt).format('YYYYMMDDHHmmss');
    writeFileName = totalFile({
      ...body,
      fileType,
      instalmentNo: fileType != 'costNotice' ? null : instalmentNo,
    });

    let fileCd = '';
    if (fileType == 'questionUnder') {
      fileCd = 'qu';
    } else if (fileType == 'questionOver') {
      fileCd = 'qo';
    } else if (fileType == 'rateQuotation') {
      fileCd = 'rq';
    } else if (fileType == 'costNotice') {
      if (instalmentNo == 1) {
        fileCd = 'cn1';
      } else if (instalmentNo == 2) {
        if (body?.insCostNoticeData[0]?.biannualInsCost == 0) {
          responseCode = 20;
          responseMsg = '보험료 없음';
        }
        fileCd = 'cn2';
      } else if (instalmentNo == 4) {
        if (body?.insCostNoticeData[0]?.quarterlyInsCost == 0) {
          responseCode = 20;
          responseMsg = '보험료 없음';
        }
        fileCd = 'cn3';
      }
    } else if (fileType == 'safeUnder') {
      fileCd = 'su';
    } else if (fileType == 'safeOver') {
      fileCd = 'so';
    }

    if (responseCode != 0) {
      return { responseCode, responseMsg, responseData };
    }

    // 새파일이름
    // 보험사+사업자번호+보험상품코드+seq_no+pdatedAt
    let fileName = '';
    fileName =
      fileIns +
      '_' +
      insuredBizNo +
      '_' +
      insProdCd +
      '_' +
      joinId.toString() +
      '_' +
      fileCd;
    // '_' +
    // updatedDt;
    console.log('fileName', fileName);
    const pdfFilePath = join(
      __dirname,
      '..',
      '..',
      'uploads',
      'acqs',
      'pdf',
      fileName,
    );
    const htmlFilePath = join(
      __dirname,
      '..',
      '..',
      'uploads',
      'acqs',
      'html',
      fileName,
    );

    if (fs.existsSync(`${pdfFilePath}.pdf`)) {
      console.log('fileExists!');
      result = fileName;
    } else {
      const writeResult = await writeToFile(
        `${htmlFilePath}.html`,
        writeFileName,
      );
      if (writeResult?.success) {
        // temp/tmp 폴더에 .html을 임시저장 tmp폴더는 crontab으로 일정주기로 삭제
        let html = fs.readFileSync(`${htmlFilePath}.html`, 'utf8');

        const pdfBuffer = await this.generatePdf(html, {
          path: `${pdfFilePath}.pdf`,
        });
      } else {
        responseCode = 10;
        responseMsg = '파일생성 실패';
      }
      result = fileName;
    }
    responseData.fileName = fileName;

    return { responseCode, responseMsg, responseData };
  }

  async funInsCostNotice(joinId: number, planId: number) {
    let responseCode = 0;
    let responseMsg = 'ok';
    let responseData: any = {};

    // 보험료 안내문 생성
    let singleCostNoticeFileName = '';
    let singleCostNoticeFileUrl = '';
    let singleCostNoticeFilePath = '';
    let biannualCostNoticeFileName = '';
    let biannualCostNoticeFileUrl = '';
    let biannualCostNoticeFilePath = '';
    let quarterlyCostNoticeFileName = '';
    let quarterlyCostNoticeFileUrl = '';
    let quarterlyCostNoticeFilePath = '';
    const singleCostNoticeFileInfo = await this.funCreateAcqsPdfFile(
      joinId,
      'costNotice',
      1,
    );
    if (singleCostNoticeFileInfo.responseCode == 0) {
      singleCostNoticeFileName = singleCostNoticeFileInfo.responseData.fileName;
      singleCostNoticeFileUrl = `${process.env.HOST}/uploads/acqs/pdf/${singleCostNoticeFileName}.pdf`;
      singleCostNoticeFilePath = join(
        __dirname,
        `../../uploads/acqs/pdf/${singleCostNoticeFileName}.pdf`,
      );
    } else {
      responseCode = 10;
      responseMsg = '보험료 안내문 생성 실패';
    }
    if (planId == 5) {
      const biannualCostNoticeFileInfo = await this.funCreateAcqsPdfFile(
        joinId,
        'costNotice',
        2,
      );
      const quarterlyCostNoticeFileInfo = await this.funCreateAcqsPdfFile(
        joinId,
        'costNotice',
        4,
      );
      if (biannualCostNoticeFileInfo.responseCode == 0) {
        biannualCostNoticeFileName =
          biannualCostNoticeFileInfo.responseData.fileName;
        (biannualCostNoticeFileUrl = `${process.env.HOST}/uploads/acqs/pdf/${biannualCostNoticeFileName}.pdf`),
          (biannualCostNoticeFilePath = join(
            __dirname,
            `../../uploads/acqs/pdf/${biannualCostNoticeFileName}.pdf`,
          ));
      }
      if (quarterlyCostNoticeFileInfo.responseCode == 0) {
        quarterlyCostNoticeFileName =
          quarterlyCostNoticeFileInfo.responseData.fileName;
        quarterlyCostNoticeFileUrl = `${process.env.HOST}/uploads/acqs/pdf/${quarterlyCostNoticeFileName}.pdf`;
        quarterlyCostNoticeFilePath = join(
          __dirname,
          `../../uploads/acqs/pdf/${quarterlyCostNoticeFileName}.pdf`,
        );
      }
    }

    responseData = {
      singleCostNoticeFileName,
      singleCostNoticeFileUrl,
      singleCostNoticeFilePath,
      biannualCostNoticeFileName,
      biannualCostNoticeFileUrl,
      biannualCostNoticeFilePath,
      quarterlyCostNoticeFileName,
      quarterlyCostNoticeFileUrl,
      quarterlyCostNoticeFilePath,
    };

    return { responseCode, responseMsg, responseData };
  }

  funExtractFileExtension(url) {
    // 정규 표현식을 사용하여 파일 확장자 추출
    const regex = /\.([0-9a-z]+)(?:[\?#]|$)/i;
    const matches = url.match(regex);
    return matches ? matches[1] : null;
  }

  async selectInsCostNoticeByBizNoAndPhNm(
    insuredBizNo: string,
    phBizNo: string,
    phNm: string,
  ) {
    const query = this.ccaliJoinRepository
      .createQueryBuilder('join')
      .select('join.id', 'id')
      .addSelect('join.insured_biz_no', 'insuerdBizNo')
      .addSelect('costNotice.id', 'costNoticeId')
      .addSelect('costNotice.eml_snd_logs_id', 'emailSendLogsId')
      .addSelect('costNotice.ph_biz_no', 'phBizno')
      .addSelect('costNotice.ph_fran_nm', 'phFranNm')
      .innerJoin(
        (subQuery) => {
          return subQuery.select('cicn.*').from(CcaliInsCostNotice, 'cicn');
        },
        'costNotice',
        'join.id = costNotice.join_id',
      )
      .where('join.del_yn = :delYn', { delYn: 'N' })
      .andWhere('join.join_stts_cd = :joinStatusCd', { joinStatusCd: 'P' })
      .andWhere('costNotice.eml_snd_logs_id IS NOT NULL')
      .andWhere('costNotice.eml_rcv_logs_id IS NULL')
      .andWhere('join.insured_biz_no = :insuredBizNo', { insuredBizNo })
      .andWhere('costNotice.ph_biz_no = :phBizNo', { phBizNo })
      .andWhere('costNotice.ph_fran_nm = :phNm', { phNm })
      .orderBy('join.id', 'ASC');

    const results = await query.getRawMany();
    const formattedResults = results.map((result) => ({
      ...result,
      id: parseInt(result.id),
      costNoticeId: parseInt(result.costNoticeId),
      emailSendLogsId: parseInt(result.emailSendLogsId),
    }));

    return formattedResults;
  }
}
