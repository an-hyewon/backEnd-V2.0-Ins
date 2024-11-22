import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
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
import { DsfSixGruopJoinUpload } from './insurance/join/entities/dsf-six-group-join-upload.entity';

@Injectable()
export class AppService {
  constructor(
    private readonly commonService: CommonService,
    private readonly mailService: MailService,
    private readonly connection: Connection,
    @InjectRepository(CcaliJoin)
    private ccaliJoinRepository: Repository<CcaliJoin>,
    @InjectRepository(DsfSixGruopJoinUpload)
    private dsfSixGruopJoinUploadRepository: Repository<DsfSixGruopJoinUpload>,
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

  async updateBizStatus() {
    let statusCode = 200000;
    let returnMsg = 'ok';

    let result = {};

    const data = await this.selectDsfSixGruopJoinUploads();
    for (let index = 0; index < data.length; index++) {
      const element = data[index];

      let bizStatusCd = 200000;
      let bizStatusMsg = '';
      let bizStatusCk = 'Y';
      const bizStatus = await this.commonService.getBizNoStatus(
        element.insuredBizNo.trim(),
      );
      console.log('index: ', index, ' bizStatus', bizStatus);
      if (
        !bizStatus.success &&
        bizStatus.msg == '휴/폐업자는 가입할 수 없습니다.'
      ) {
        bizStatusCd = 200010;
        bizStatusMsg = '휴/폐업자는 가입할 수 없습니다.';
        bizStatusCk = 'F';
      } else if (!bizStatus.success) {
        bizStatusCk = 'N';
      }

      if (bizStatusCd == 200010) {
        await this.dsfSixGruopJoinUploadRepository.update(
          {
            id: element.id,
          },
          {
            biznumStatusCk: bizStatusCk,
            errCd: bizStatusCd.toString(),
            errMsg: bizStatusMsg,
          },
        );
      } else {
        await this.dsfSixGruopJoinUploadRepository.update(
          {
            id: element.id,
          },
          {
            biznumStatusCk: bizStatusCk,
          },
        );
      }
    }

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  async selectDsfSixGruopJoinUploads() {
    return await this.dsfSixGruopJoinUploadRepository.find({
      where: {
        biznumStatusCk: 'F',
      },
    });
  }
}
