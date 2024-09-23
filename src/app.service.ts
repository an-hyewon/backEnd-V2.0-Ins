import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as dayjs from 'dayjs';
import * as ExcelJS from 'exceljs';
import { join } from 'path';
import { ClientLog } from './common/entities/client-log.entity';
import {
  CreateClientLogReqDto,
  UpdateClientLogReqDto,
} from './common/dto/req.dto';
import { CommonService } from './common/common.service';
import { UrlReqDto } from './common/dto/url-req.dto';
import { MailService } from './mail/mail.service';
import { CcaliInsCostNotice } from './insurance/join/entities/ccali-ins-cost-notice.entity';
import { EmailSendLogs } from './mail/entities/email-send-logs.entity';
import { CcaliJoin } from './insurance/join/entities/ccali-join.entity';

@Injectable()
export class AppService {
  constructor(
    private readonly commonService: CommonService,
    private readonly mailService: MailService,
    @InjectRepository(ClientLog)
    private clientLogRepository: Repository<ClientLog>,
    @InjectRepository(CcaliJoin)
    private ccaliJoinRepository: Repository<CcaliJoin>,
  ) {}

  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    this.logger.debug('Logging...');
    return 'Hello World!';
  }

  test() {
    const referIdx = this.commonService.getRandomId();

    let responseResult = {
      code: 200000,
      message: 'ok',
      result: {
        referIdx,
      },
    };

    return responseResult;
  }

  async saveClientLog(data: CreateClientLogReqDto) {
    return this.clientLogRepository.save(data);
  }

  async updateClientLog(id: number, data: UpdateClientLogReqDto) {
    return this.clientLogRepository.update(id, data);
  }

  createUid() {
    const uid = this.commonService.getUuid();

    let responseResult = {
      code: 200000,
      message: 'ok',
      result: {
        uid,
      },
    };

    return responseResult;
  }

  createReferIdx() {
    const referIdx = this.commonService.getRandomId();

    let responseResult = {
      code: 200000,
      message: 'ok',
      result: {
        referIdx,
      },
    };

    return responseResult;
  }

  async findSiteInfo(req: any, data: UrlReqDto) {
    let statusCode = 200000;
    let returnMsg = 'ok';

    let result = {};

    const { locationHref } = data;
    const url = req?.headers?.referer || req?.hostname;
    const referer = this.commonService.getRefererStr(locationHref, url);
    const siteInfo = await this.commonService.getSiteInfo(referer);
    console.log('siteInfo', siteInfo);
    if (siteInfo.responseCode == 20) {
      statusCode = 200020;
      returnMsg = siteInfo.responseMsg;
    } else {
      result = siteInfo.responseData;
    }

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  async parseExcelFile(filePath: string) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1);

    const updates = [];

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber !== 1) {
        // Assuming first row is headers
        const data = {
          id: row.getCell(1).value,
          name: row.getCell(2).value,
          // other fields...
        };
        // updates.push(this.yourRepository.update(data.id, data));
      }
    });

    return Promise.all(updates);
  }

  async sendExcelMailTest() {
    let statusCode = 200000;
    let returnMsg = 'ok';
    let result = {};

    const joinId = 382;

    // 엑셀파일 생성
    const excelFileInfo = await this.commonService.exportExcelFileTest(
      'P',
      joinId,
    );

    const ccaliJoin = await this.commonService.selectJoinListDetailByJoinId(
      joinId,
      'JoinFile',
    );
    console.log('ccaliJoin', ccaliJoin);

    const insuredBizNo = ccaliJoin[0]?.insuredBizNo;
    const joinYmd = dayjs(ccaliJoin[0]?.joinYmd).format('YYYYMMDD');
    // const questionFileUrl =
    //   'http://localhost:20011/uploads/acqs/pdf/DB_1010150057_ccali_284_2_20240813171712.pdf';
    // const questionFilePath = join(
    //   __dirname,
    //   '../uploads/acqs/pdf/DB_1010150057_ccali_284_2_20240813171712.pdf',
    // );
    // console.log('questionFilePath', questionFilePath);
    // const rateQuotationFileUrl =
    //   'http://localhost:20011/uploads/acqs/pdf/DB_1010150057_ccali_284_3_20240813171741.pdf';

    const mailTo = '안혜원 선임 <hyewon.nexsol@gmail.com>';
    const mailSubject = `${process.env.NODE_ENV.toLowerCase() == 'dev' ? '(테스트)' : ''}[중대재해] 구득요청_${insuredBizNo}_${joinYmd}`;
    let mailText = '';
    //     let mailText = `
    // 질문서
    // ${questionFileUrl}

    // 요율구득요청서
    // ${rateQuotationFileUrl}`;

    // let mailCc = [
    //   '안혜원 선임 <hyewon.nexsol@gmail.com>',
    //   '테스트 <hyewon.an11@gmail.com>',
    // ];

    const sendMail = await this.mailService.sendMail({
      to: mailTo,
      subject: mailSubject,
      // cc: mailCc,
      text: mailText,
      attachments: [
        {
          filename: excelFileInfo?.fileName,
          path: excelFileInfo?.filePath, // 파일 경로
        },
        // {
        //   filename: '질문서.pdf',
        //   path: questionFilePath,
        // },
      ],
    });
    const { responseCode, responseMsg, responseData } = sendMail;
    if (responseCode == 0) {
      result = responseData;
    } else {
      statusCode = 200030;
      returnMsg = `메일 발송 실패`;
    }

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  async sendPremCmptDoneNotice(joinId: number) {
    let statusCode = 200000;
    let returnMsg = 'ok';
    let result = {};

    const premCmptJoinQuery = this.ccaliJoinRepository
      .createQueryBuilder('join')
      .select('join.id', 'id')
      .addSelect('join.plan_id', 'planId')
      .addSelect('join.insured_biz_no', 'insuerdBizNo')
      .addSelect('join.ph_phone_no', 'phPhoneNo')
      .addSelect('join.ph_eml', 'phEmail')
      .addSelect('join.join_account', 'joinAccount')
      .addSelect('join.join_path', 'joinPath')
      .addSelect('costNotice.eml_snd_logs_id', 'emailSendLogsId')
      .addSelect('costNotice.ph_biz_no', 'phBizno')
      .addSelect('costNotice.ph_fran_nm', 'phFranNm')
      .addSelect('costNotice.single_ins_cst', 'singleInsCost')
      .addSelect('costNotice.bianl_ins_cst', 'biannualInsCost')
      .addSelect('costNotice.quarter_ins_cst', 'quarterlyInsCost')
      .addSelect('costNotice.prem_cmpt_ymd', 'premCmptYmd')
      .addSelect('costNotice.grnte_4_join_cd', 'guarantee4JoinCd') // 1: 둘다, 2: 산업재해, 3: 시민재해
      .addSelect('costNotice.grnte_5_join_cd', 'guarantee5JoinCd') // 1: 위기관리1, 2: 위기관리2
      .addSelect('costNotice.per_acdnt_cvrg_limit', 'perAccidentCoverageLimit')
      .addSelect('costNotice.tot_cvrg_limit', 'totCoverageLimit')
      .addSelect(
        `CASE WHEN join.url LIKE "%localhost%" THEN "Y"
                WHEN join.url LIKE "https://dev%" THEN "Y"
                ELSE "N" END`,
        'devYn',
      )
      .innerJoin(
        (subQuery) => {
          return subQuery
            .select('cicn.*')
            .from(CcaliInsCostNotice, 'cicn')
            .where('cicn.eml_snd_logs_id IS NOT NULL')
            .andWhere('cicn.eml_rcv_logs_id IS NOT NULL');
        },
        'costNotice',
        'join.id = costNotice.join_id',
      )
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select('esl.id', 'id')
            .addSelect('esl.eml_from', 'eml_from')
            .addSelect('esl.eml_to', 'eml_to')
            .addSelect('esl.eml_subject', 'eml_subject')
            .addSelect('esl.eml_cc', 'eml_cc')
            .addSelect('esl.eml_text', 'eml_text')
            .addSelect('esl.eml_html', 'eml_html')
            .addSelect('esl.eml_attachments', 'eml_attachments')
            .addSelect('esl.rspns_data', 'rspns_data')
            .addSelect('esl.error_data', 'error_data')
            .addSelect('esl.message_id', 'message_id')
            .addSelect('esl.crt_dt', 'crt_dt')
            .addSelect('esl.updt_dt', 'updt_dt')
            .addSelect('esl.del_dt', 'del_dt')
            .addSelect(
              `SUBSTRING_INDEX(
                    SUBSTRING_INDEX(esl.eml_text, "history-detail?id=", -1),
                    "&", 
                    1
                )`,
              'id_value',
            )
            .from(EmailSendLogs, 'esl')
            .where('esl.eml_subject LIKE "%기업중대사고%"')
            .andWhere('esl.eml_subject LIKE "%배상책임보험%"')
            .andWhere('esl.eml_subject LIKE "%보험료 안내%"');
        },
        'sendMail',
        'join.ph_eml = sendMail.eml_to AND sendMail.id_value = join.id',
      )
      .where('join.del_yn = :delYn', { delYn: 'N' });
    // .where('join.del_yn = :delYn', { delYn: 'N' })
    // .andWhere('join.join_stts_cd = "P"')
    // .andWhere('join.id = :joinId', { joinId })
    // .andWhere('sendMail.id IS NULL');

    premCmptJoinQuery.orderBy('join.id', 'ASC');

    const premCmptJoin = await premCmptJoinQuery.getRawMany();
    console.log('premCmptJoin', premCmptJoin);

    throw new BadRequestException('test');

    if (premCmptJoin.length == 0) {
      statusCode = 200020;
      returnMsg = '검색 결과 없음';

      let responseResult = {
        code: statusCode,
        message: returnMsg,
        result,
      };

      return responseResult;
    }

    const element = premCmptJoin[0];
    const planId = element.planId;

    // 가입 가능 처리
    await this.ccaliJoinRepository.update(joinId, {
      joinStatusCd: 'A',
      totInsCost: element?.singleInsCost,
      premCmptDt: dayjs(element?.premCmptYmd).toDate(),
      guaranteeDisaterCd:
        element?.guarantee4JoinCd == '2'
          ? 'indst'
          : element?.guarantee4JoinCd == '3'
            ? 'civil'
            : 'all',
      perAccidentCoverageLimit: element?.perAccidentCoverageLimit,
      totCoverageLimit: element?.totCoverageLimit,
    });

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
    const insCostNoticeResult = this.commonService.funInsCostNotice(
      joinId,
      planId,
    );

    // 알림톡 발송
    const sendAlimtalk = await this.commonService.sendKakaoAlimtalk({
      receivers: element?.phPhoneNo,
      reservedYn: 'N',
      sender: '15229323',
      joinId,
      messageType: 'NOTICE_PREM',
    });

    if (element?.phEmail != null) {
      // 메일 발송
      const mailTo = element?.phEmail;
      let mailSubject = `(테스트)[기업중대사고 배상책임보험 보험료 안내]`;
      if (element?.devYn == 'N') {
        mailSubject = `[기업중대사고 배상책임보험 보험료 안내]`;
      }
      let premCmptUrl = '';
      if (element?.devYn == 'N' && element?.joinAccount == 'SK엠앤서비스') {
        premCmptUrl = `https://ccali.skmnservice-mall.insboon.com/history/history-detail?id=${joinId}&phPhoneNo=${element?.phPhoneNo}`;
      } else if (element?.joinAccount == 'SK엠앤서비스') {
        premCmptUrl = `https://dev-ccali.skmnservice-mall.insboon1.com/history/history-detail?id=${joinId}&phPhoneNo=${element?.phPhoneNo}`;
      } else if (
        element?.devYn == 'N' &&
        element?.joinAccount == '우리카드' &&
        element?.joinPath == '마린슈'
      ) {
        premCmptUrl = `https://ccali.wooricard-marinshu-mall.insboon.com/history/history-detail?id=${joinId}&phPhoneNo=${element?.phPhoneNo}`;
      } else if (
        element?.joinAccount == '우리카드' &&
        element?.joinPath == '마린슈'
      ) {
        premCmptUrl = `https://dev-ccali.wooricard-marinshu-mall.insboon1.com/history/history-detail?id=${joinId}&phPhoneNo=${element?.phPhoneNo}`;
      } else if (element?.devYn == 'N' && element?.joinAccount == '우리카드') {
        premCmptUrl = `https://wooricard.insboon.com/history/history-detail?id=${joinId}&phPhoneNo=${element?.phPhoneNo}`;
      } else if (element?.joinAccount == '우리카드') {
        premCmptUrl = `https://dev-ccali.mall.insboon1.com/history/history-detail?id=${joinId}&phPhoneNo=${element?.phPhoneNo}`;
      }
      let mailText = `안녕하세요. ${element?.phFranNm}님
기업중대사고 배상책임보험
보험료 확인이 완료되었습니다.

아래 링크를 통해 보험료를 확인해 주세요.
보험료 확인 후 가입까지 진행 가능합니다.

보험료 확인하기
${premCmptUrl}

기타 문의 사항은 아래 연락처로 문의 바랍니다.

※문의처
보온 기업중대사고배상책임보험
전용고객센터 : 1522-9323 (평일 9:00~18:00 / 점심시간 12:00~13:00)`;
      const excelAttachments = [];
      excelAttachments.push({
        filename: '일시납 보험료.pdf',
        path: singleCostNoticeFilePath,
      });
      if (planId == 5) {
        if (biannualCostNoticeFilePath != '') {
          excelAttachments.push({
            filename: '2회납 보험료.pdf',
            path: biannualCostNoticeFilePath,
          });
        }
        if (quarterlyCostNoticeFilePath != '') {
          excelAttachments.push({
            filename: '4회납 보험료.pdf',
            path: quarterlyCostNoticeFilePath,
          });
        }
      }
      const sendMail = await this.mailService.sendMail({
        to: mailTo,
        subject: mailSubject,
        text: mailText,
        attachments: excelAttachments,
      });
      const { responseCode, responseMsg, responseData } = sendMail;
      if (responseCode == 0) {
        result = responseData;
      } else {
        statusCode = 200030;
        returnMsg = `메일 발송 실패`;
      }
    }

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }
}
