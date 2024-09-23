import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import {
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Raw,
  Repository,
} from 'typeorm';
import * as dayjs from 'dayjs';
import { join } from 'path';
import { SmsService } from 'src/sms/sms.service';
import { SmsSendLogs } from 'src/sms/entities/sms-send-logs.entity';
import { CommonService } from 'src/common/common.service';
import { CcaliJoin } from 'src/insurance/join/entities/ccali-join.entity';
import { CcaliInsCostNotice } from 'src/insurance/join/entities/ccali-ins-cost-notice.entity';
import { MailService } from 'src/mail/mail.service';
import { EmailSendLogs } from 'src/mail/entities/email-send-logs.entity';

@Injectable()
export class TasksService {
  constructor(
    private readonly commonService: CommonService,
    private readonly smsService: SmsService,
    private readonly mailService: MailService,
    @InjectRepository(SmsSendLogs)
    private smsSendLogsRepository: Repository<SmsSendLogs>,
    @InjectRepository(CcaliJoin)
    private ccaliJoinRepository: Repository<CcaliJoin>,
    @InjectRepository(CcaliInsCostNotice)
    private ccaliInsCostNoticeRepository: Repository<CcaliInsCostNotice>,
  ) {}

  // 보험료 조회 신청 메일 발송
  @Cron('0 * * * * *') // 1분마다
  async checkPremCmptJoinSendMail() {
    if (process.env.NODE_ENV.toLowerCase() == 'prod') {
      console.log(
        `
---------------------------------
checkPremCmptJoinSendMail start ${dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')}
---------------------------------`,
      );
      let totalCnt = 0;
      let successCnt = 0;
      let failCnt = 0;
      let failData = [];

      const premCmptJoin = await this.ccaliJoinRepository
        .createQueryBuilder('join')
        .select('join.id', 'id')
        .leftJoin(
          (subQuery) => {
            return subQuery.select('cicn.*').from(CcaliInsCostNotice, 'cicn');
          },
          'costNotice',
          'join.id = costNotice.join_id',
        )
        .where('join.del_yn = :delYn', { delYn: 'N' })
        .andWhere('join.join_stts_cd = :joinStatusCd', { joinStatusCd: 'P' })
        .andWhere('costNotice.eml_snd_logs_id IS NULL')
        .andWhere('costNotice.id IS NULL')
        .orderBy('join.id', 'ASC')
        .limit(1)
        .getRawMany();

      totalCnt = premCmptJoin.length;

      for (let index = 0; index < premCmptJoin.length; index++) {
        const element = premCmptJoin[index];
        const ccaliJoinData =
          await this.commonService.selectJoinListDetailByJoinId(
            element.id,
            'JoinFile',
          );
        const ccaliJoin = ccaliJoinData[0];
        const joinId = ccaliJoin?.id;
        const planId = ccaliJoin?.planId;
        const insuredBizNo = ccaliJoin?.insuredBizNo;
        const joinYmd = dayjs(ccaliJoin?.joinYmd).format('YYYYMMDD');
        const responseArray = [];
        for (
          let responseIndex = 0;
          responseIndex < ccaliJoin?.responseList.length;
          responseIndex++
        ) {
          const responseElement = ccaliJoin?.responseList[responseIndex];
          responseArray.push(responseElement.answerId);
        }

        // ccaliInsCostNotice에 저장
        const insCostNoticeEntity = this.ccaliInsCostNoticeRepository.create({
          joinId: ccaliJoin?.id,
          phBizNo: ccaliJoin?.phBizNo,
          phFranNm: ccaliJoin?.phNm,
          ccaliBizTypeNm: ccaliJoin?.ccaliBizTypeNm,
          totEmployeeCnt: ccaliJoin?.totEmployeeCnt,
          totAnnualWages: ccaliJoin?.totAnnualWages,
          subCompanyJoinCd: ccaliJoin?.subCompanyJoinYn == 'Y' ? '1' : '2',
          bfGuarantee1JoinCd: '1', // 1)기업중대사고 배상책임보험 보통약관
          bfGuarantee2JoinCd: '1', // 2)징벌적 손해배상책임 특별약관
          bfGuarantee3JoinCd:
            planId == 5 && responseArray.includes(21) ? '2' : '1', // 3)중대사고 형사방어비용 특별약관 - 5 선택
          bfGuarantee4JoinCd:
            ccaliJoin?.guaranteeDisaterCd == 'indst' ? '2' : '1', // 4)중대()재해만을 위한 보장 특별약관 - 1: 둘다, 2: 산업재해, 3: 시민재해 - 3이상 선택
          bfGuarantee5JoinCd:
            planId == 5 && responseArray.includes(171) ? '2' : '1', // 5)기업 중대사고 위기관리실행비용 특별약관 - 1: 위기1, 2: 위기2 - 3이상 선택
          bfGuarantee6JoinCd:
            planId == 5 && responseArray.includes(25) ? '2' : '1', // 6)민사상 손해배상책임 부담보 특별약관 - 5 선택
          bfGuarantee7JoinCd: '1', // 7)날짜인식오류 보상제외 특별약관
          bfGuarantee8JoinCd: '1', // 8)제재위반 부보장특별약관
          bfGuarantee9JoinCd: '1', // 9)테러행위 면책 특별약관
          bfGuarantee10JoinCd: '1', // 10)정보기술 특별약관
          bfGuarantee11JoinCd: '1', // 11)날짜인식오류 부보장 추가약관
          bfGuarantee12JoinCd: '1', // 12)[LMA5399]전염병 면택 특별약관 Ⅱ
          bfPerAccidentCoverageLimit: ccaliJoin?.perAccidentCoverageLimit,
          bfTotCoverageLimit: ccaliJoin?.totCoverageLimit,
        });
        const insCostNotice =
          await this.ccaliInsCostNoticeRepository.save(insCostNoticeEntity);

        // 보험료 요청 xlsx 생성
        const excelFileInfo = await this.commonService.exportExcelFile(
          'P',
          joinId,
        );

        // 질문서 pdf 생성
        let questionFileNm = `질문서_${insuredBizNo}_${joinYmd}.pdf`;
        if (ccaliJoin?.insComCd == 'MR') {
          questionFileNm = `설문서_${insuredBizNo}_${joinYmd}.pdf`;
        }
        let questionFileUrl = '';
        let questionFilePath = '';
        // 질문서 생성
        if (ccaliJoin.planId == 5) {
          const questionFileInfo =
            await this.commonService.funCreateAcqsPdfFile(
              joinId,
              'questionOver',
            );
          if (questionFileInfo.responseCode == 0) {
            const questionFileName = questionFileInfo.responseData.fileName;
            questionFileUrl = `${process.env.HOST}/uploads/acqs/pdf/${questionFileName}.pdf`;
            questionFilePath = join(
              __dirname,
              `../../uploads/acqs/pdf/${questionFileName}.pdf`,
            );
          }
        } else {
          const questionFileInfo =
            await this.commonService.funCreateAcqsPdfFile(
              joinId,
              'questionUnder',
            );
          if (questionFileInfo.responseCode == 0) {
            const questionFileName = questionFileInfo.responseData.fileName;
            questionFileUrl = `${process.env.HOST}/uploads/acqs/pdf/${questionFileName}.pdf`;
            questionFilePath = join(
              __dirname,
              `../../uploads/acqs/pdf/${questionFileName}.pdf`,
            );
          }
        }

        // RQ pdf 생성
        let rateQuotationFileNm = `요율구득요청서_${insuredBizNo}_${joinYmd}.pdf`;
        let rateQuotationFileUrl = '';
        let rateQuotationFilePath = '';
        const rateQuotationFileInfo =
          await this.commonService.funCreateAcqsPdfFile(
            joinId,
            'rateQuotation',
          );
        if (rateQuotationFileInfo.responseCode == 0) {
          const rateQuotationFileName =
            rateQuotationFileInfo.responseData.fileName;
          rateQuotationFileUrl = `${process.env.HOST}/uploads/acqs/pdf/${rateQuotationFileName}.pdf`;
          rateQuotationFilePath = join(
            __dirname,
            `../../uploads/acqs/pdf/${rateQuotationFileName}.pdf`,
          );
        }
        if (questionFileUrl != '' && rateQuotationFileUrl != '') {
          // 메일 발송
          let mailTo = process.env.MAIL_NEXSOL_DEFAULT_USERNAME;
          let mailCc = [
            '안혜원 선임 <hyewon.nexsol@gmail.com>',
            'marinshu22@gmail.com',
          ];
          let mailSubject = `(테스트)[넥솔] ${ccaliJoin?.joinAccount} 기업중대사고배상책임보험 구득 요청_${ccaliJoin?.insuredBizNo}`;
          if (ccaliJoin?.devYn == 'N' && ccaliJoin?.joinAccount == '우리카드') {
            mailTo = process.env.MAIL_DB_PREM_CMPT_USERNAME;
            mailCc = [
              '최문규 수석 <11800745@dbins.co.kr>',
              '이주현 주임 <2zoo@dbins.co.kr>',
              process.env.MAIL_NEXSOL_DEFAULT_USERNAME,
              '안혜원 선임 <hyewon.nexsol@gmail.com>',
              'marinshu22@gmail.com',
            ];
            mailSubject = `[넥솔] ${ccaliJoin?.joinAccount} 기업중대사고배상책임보험 구득 요청_${ccaliJoin?.insuredBizNo}`;
          }
          let mailText = `안녕하세요

해당 건 보험료는
각각 일시납, 2회분납, 4회분납
조건으로 확인 부탁드립니다.

감사합니다.`;
          const sendMail = await this.mailService.sendMail({
            to: mailTo,
            subject: mailSubject,
            cc: mailCc,
            text: mailText,
            attachments: [
              {
                filename: excelFileInfo?.fileName,
                path: excelFileInfo?.filePath, // 파일 경로
              },
              {
                filename: questionFileNm,
                path: questionFilePath,
              },
              {
                filename: rateQuotationFileNm,
                path: rateQuotationFilePath,
              },
            ],
          });
          const { responseCode, responseMsg, responseData } = sendMail;
          if (responseCode == 0) {
            const updateSendMailLogsId =
              await this.ccaliInsCostNoticeRepository.update(
                insCostNotice?.id,
                {
                  emailSendLogsId: responseData?.sendMailLogsId,
                },
              );
            // 성공
            successCnt += 1;

            if (
              ccaliJoin?.devYn == 'Y' ||
              ccaliJoin?.joinAccount == 'SK엠앤서비스'
            ) {
              // 보험료 요청 xlsx 생성
              const excelFileInfo2 = await this.commonService.exportExcelFile(
                'A',
                joinId,
              );

              const sendMailTest = await this.mailService.sendMail({
                to: 'help.nexsol@gmail.com',
                subject: mailSubject,
                cc: mailCc,
                text: '',
                attachments: [
                  {
                    filename: excelFileInfo2?.fileName,
                    path: excelFileInfo2?.filePath, // 파일 경로
                  },
                ],
              });
            }
          } else {
            // 실패
            failCnt += 1;
            failData.push(joinId);
          }
        } else {
          // 슬랙 알림
        }
      }
      console.log(
        `
---------------------------------
checkPremCmptJoinSendMail done ${dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')}
totalCnt: ${totalCnt}
successCnt: ${successCnt}
failCnt: ${failCnt}
failData: ${JSON.stringify(failData)}
---------------------------------`,
      );
    }
  }

  // 보험료 안내 메일 수신
  @Cron('30 * * * * *')
  async checkInsCostNoticeReceiveMail() {
    if (process.env.NODE_ENV.toLowerCase() == 'prod') {
      console.log(
        `
---------------------------------
checkInsCostNoticeReceiveMail start ${dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')}
---------------------------------`,
      );
      let totalCnt = 0;
      let successCnt = 0;
      let failCnt = 0;
      let failData = [];

      // 메일 수신
      const readMail = await this.mailService.readMali();
      console.log('readMail', readMail);

      const premCmptJoin = await this.ccaliJoinRepository
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
        .addSelect(
          'costNotice.per_acdnt_cvrg_limit',
          'perAccidentCoverageLimit',
        )
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
        .leftJoin(
          (subQuery) => {
            return subQuery
              .select('esl2.id', 'id')
              .addSelect('esl2.eml_from', 'eml_from')
              .addSelect('esl2.eml_to', 'eml_to')
              .addSelect('esl2.eml_subject', 'eml_subject')
              .addSelect('esl2.eml_cc', 'eml_cc')
              .addSelect('esl2.eml_text', 'eml_text')
              .addSelect('esl2.eml_html', 'eml_html')
              .addSelect('esl2.eml_attachments', 'eml_attachments')
              .addSelect('esl2.rspns_data', 'rspns_data')
              .addSelect('esl2.error_data', 'error_data')
              .addSelect('esl2.message_id', 'message_id')
              .addSelect('esl2.crt_dt', 'crt_dt')
              .addSelect('esl2.updt_dt', 'updt_dt')
              .addSelect('esl2.del_dt', 'del_dt')
              .addSelect(
                `SUBSTRING_INDEX(
                    SUBSTRING_INDEX(esl2.eml_text, "history-detail?id=", -1),
                    "&", 
                    1
                )`,
                'id_value',
              )
              .from(EmailSendLogs, 'esl2')
              .where('esl2.eml_subject LIKE "%기업중대사고%"')
              .andWhere('esl2.eml_subject LIKE "%배상책임보험%"')
              .andWhere('esl2.eml_subject LIKE "%보험료 안내%"');
          },
          'sendMail2',
          'sendMail2.id_value = join.id',
        )
        .where('join.del_yn = "N"')
        .andWhere('join.join_stts_cd = "P"')
        .andWhere('sendMail.id IS NULL')
        .andWhere('sendMail2.id IS NULL')
        .orderBy('join.id', 'ASC')
        .getRawMany();

      console.log('premCmptJoin', premCmptJoin);

      totalCnt = premCmptJoin.length;
      for (let index = 0; index < premCmptJoin.length; index++) {
        const element = premCmptJoin[index];
        const joinId = element.id;
        const planId = element.planId;

        if (element?.devYn == 'N' && element?.joinAccount == '우리카드') {
          // 가입 가능 처리
          await this.ccaliJoinRepository.update(joinId, {
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
        } else {
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
        }
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
        const singleCostNoticeFileInfo =
          await this.commonService.funCreateAcqsPdfFile(
            joinId,
            'costNotice',
            1,
          );
        if (singleCostNoticeFileInfo.responseCode == 0) {
          singleCostNoticeFileName =
            singleCostNoticeFileInfo.responseData.fileName;
          singleCostNoticeFileUrl = `${process.env.HOST}/uploads/acqs/pdf/${singleCostNoticeFileName}.pdf`;
          singleCostNoticeFilePath = join(
            __dirname,
            `../../uploads/acqs/pdf/${singleCostNoticeFileName}.pdf`,
          );
        }
        if (planId == 5) {
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

        // 개발계 or SK엠앤서비스 자동
        if (element?.devYn == 'N' && element?.joinAccount == '우리카드') {
          // 메일 발송
          let mailTo = process.env.MAIL_NEXSOL_DEFAULT_USERNAME;
          let mailCc = '안혜원 선임 <hyewon.nexsol@gmail.com>';

          let mailSubject = `(확인)[기업중대사고 배상책임보험 보험료 안내]`;

          let premCmptUrl = '';
          if (element?.joinPath == '마린슈') {
            premCmptUrl = `https://ccali.wooricard-marinshu-mall.insboon.com/history/history-detail?id=${joinId}&phPhoneNo=${element?.phPhoneNo}`;
          } else {
            premCmptUrl = `https://wooricard.insboon.com/history/history-detail?id=${joinId}&phPhoneNo=${element?.phPhoneNo}`;
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
            cc: mailCc,
            text: mailText,
            attachments: excelAttachments,
          });
          const { responseCode, responseMsg, responseData } = sendMail;
          if (responseCode == 0) {
            // 성공
            successCnt += 1;
          } else {
            // 실패
            failCnt += 1;
            failData.push(joinId);
          }
        } else {
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
            if (
              element?.devYn == 'N' &&
              element?.joinAccount == 'SK엠앤서비스'
            ) {
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
            } else if (
              element?.devYn == 'N' &&
              element?.joinAccount == '우리카드'
            ) {
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
              // 성공
              successCnt += 1;
            } else {
              // 실패
              failCnt += 1;
              failData.push(joinId);
            }
          }
        }
      }
      console.log(
        `
---------------------------------
checkInsCostNoticeReceiveMail done ${dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')}
---------------------------------`,
      );
    }
  }

  // 결제전 상태 2일 후 결제 알림 문자 발송
  @Cron(CronExpression.EVERY_MINUTE)
  async checkNotPaySendSms() {
    // console.log('NODE_ENV', process.env.NODE_ENV);
    // if (process.env.NODE_ENV.toLowerCase() == 'prod') {
    //   const join = await this.ccaliJoinRepository
    //     .createQueryBuilder('join')
    //     .select('*')
    //     .where('join.del_yn = :delYn', { delYn: 'N' })
    //     .andWhere('join.join_stts_cd = :joinStatusCd', { joinStatusCd: 'W' })
    //     .andWhere('DATE(join.crt_dt) = :baseDt', {
    //       baseDt: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
    //     })
    //     .getRawMany();
    //   console.log('checkNotPaySendSms', join.length);
    //   const totalCnt = join.length;
    //   let successCnt = 0;
    //   let failCnt = 0;
    //   for (let index = 0; index < join.length; index++) {
    //     const element = join[index];
    //     const joinId = element.id;
    //     let phNm = element.phNm;
    //     if (element.phFranNm != null && element.phFranNm != '') {
    //       phNm = element.phFranNm;
    //     }
    //     // 문자내용 조회
    //     const messageContent = `[가입 안내]
    // 안녕하세요? ${phNm}님
    // ㈜넥솔 bo:on입니다.
    // ${dayjs(element.joinYmd).format('YYYY년 MM월 DD일')} 조회하신 기업중대사고 배상책임보험
    // 가입이 완료되지 않았습니다.
    // 지금 바로 아래 링크를 눌러 간편하게 가입해 보세요.
    // https://ccali.wooricard-mall.insboon.com/
    // 기타 문의 사항은 아래 연락처로 문의 바랍니다.
    // ※문의처
    // ㈜넥솔 고객센터 1522-9323
    // (평일 9시~18시/점심시간 12시~13시, 공휴일 제외)
    // `;
    //     // 문자 발송
    //     const sendSms = await this.commonService.funSendSms({
    //       sender: '15229323',
    //       receivers: element.phPhoneNo,
    //       message: messageContent,
    //       reservedYn: 'Y',
    //       reservedDate: dayjs().format('YYYY-MM-DD'),
    //       reservedTime: '15:00',
    //       referIdx: element.referIdx,
    //       messageType: 'UNPAID_NOTI',
    //     });
    //     if (sendSms.responseYn == 'Y') {
    //       const updateCommentTxt = `미결제 삭제(${dayjs().format('YYYY.MM.DD 개발')})`;
    //       await this.ccaliJoinRepository.update(joinId, {
    //         comments:
    //           element.comments == null
    //             ? updateCommentTxt
    //             : element.comments + '/' + updateCommentTxt,
    //         deletedYn: 'Y',
    //         deletedDt: dayjs().toDate(),
    //       });
    //       successCnt += 1;
    //     } else {
    //       failCnt += 1;
    //     }
    //   }
    //   console.log(
    //     `---------------------------------
    // checkNotPaySendSms done ${dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')}
    // totalCnt: ${totalCnt}
    // successCnt: ${successCnt}
    // failCnt: ${failCnt}
    // ---------------------------------`,
    //   );
    // }
  }
}
