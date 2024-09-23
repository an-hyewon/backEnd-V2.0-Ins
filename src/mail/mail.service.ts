import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as Imap from 'imap';
import { simpleParser } from 'mailparser';
import * as dayjs from 'dayjs';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import { EmailReceiveLogs } from './entities/email-receive-logs.entity';
import { EmailSendLogs } from './entities/email-send-logs.entity';
import { CommonService } from 'src/common/common.service';
import { CcaliInsCostNotice } from 'src/insurance/join/entities/ccali-ins-cost-notice.entity';
import { CcaliJoin } from 'src/insurance/join/entities/ccali-join.entity';

@Injectable()
export class MailService {
  private imap; // IMAP 이메일 수신
  private transporter: nodemailer.Transporter; // SMTP 이메일 발송

  constructor(
    private readonly commonService: CommonService,
    @InjectRepository(EmailReceiveLogs)
    private emailReceiveLogsRepository: Repository<EmailReceiveLogs>,
    @InjectRepository(EmailSendLogs)
    private emailSendLogsRepository: Repository<EmailSendLogs>,
    @InjectRepository(CcaliInsCostNotice)
    private ccaliInsCostNoticeRepository: Repository<CcaliInsCostNotice>,
    @InjectRepository(CcaliJoin)
    private ccaliJoinRepository: Repository<CcaliJoin>,
  ) {
    this.imap = new Imap({
      user: process.env.GMAIL_USERNAME,
      password: process.env.GMAIL_APP_PASSWORD, // 앱 비밀번호 사용
      host: 'imap.gmail.com',
      port: Number(process.env.GMAIL_PORT),
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
    });

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  async openInbox(cb) {
    await this.imap.openBox('INBOX', false, cb); // 변경: false는 읽기 전용으로 설정
  }

  async parseMail() {
    const preMails = await this.getMailSeqNos();
    const excludeSeqNos = [];
    for (let index = 0; index < preMails.length; index++) {
      const element = preMails[index];
      excludeSeqNos.push(element.messageSeqNo);
    }

    return new Promise((resolve, reject) => {
      this.imap.once('ready', () => {
        console.log('IMAP ready, opening inbox...');

        this.openInbox((err, box) => {
          if (err) {
            console.error('Failed to open inbox:', err);
            reject(err);
            return;
          }

          // 특정 수신자의 이메일 검색
          this.imap.search(
            [
              // ['FROM', process.env.MAIL_DB_PREM_CMPT_USERNAME],
              // ['FROM', 'db'],
              ['SUBJECT', '기업중대사고배상책임보험'],
            ],
            (err, results) => {
              if (err) {
                reject(err);
                return;
              }

              // 검색 결과가 없는 경우
              if (!results || results.length === 0) {
                console.log('No messages found!');
                resolve([]);
                return;
              }

              // 결과에 대한 fetch 실행
              const fetch = this.imap.fetch(results, {
                bodies: '',
                struct: true,
              });
              const parsePromises = [];
              fetch.on('message', (msg, seqno) => {
                // 특정 seqno 제외
                if (!excludeSeqNos.includes(seqno)) {
                  console.log(`Fetching message ${seqno}...`);

                  msg.on('body', (stream) => {
                    let mailBody = '';
                    stream.on('data', (chunk) => {
                      mailBody += chunk.toString('utf8');
                    });

                    stream.once('end', async () => {
                      console.log(`Received all data for message ${seqno}`);
                      const parsePromise = simpleParser(mailBody).then(
                        (mail) => {
                          const attachmentFilePaths = [];
                          if (mail.attachments) {
                            mail.attachments.forEach((attachment) => {
                              const attachmentFilePath =
                                this.downloadAttachment(attachment, seqno);
                              attachmentFilePaths.push(attachmentFilePath);
                            });
                          }
                          console.log(`Message ${seqno} parsed successfully`);
                          return { ...mail, seqno, attachmentFilePaths }; // 파싱된 메일 객체를 반환
                        },
                      );
                      parsePromises.push(parsePromise);
                    });
                  });
                } else {
                  console.log(`exclude message ${seqno}...`);
                }
              });

              fetch.once('error', (err) => {
                console.error('Fetch error:', err);
                reject(err);
              });

              fetch.once('end', () => {
                console.log('Done fetching all messages. Parsing emails...');
                Promise.all(parsePromises)
                  .then((parsedEmails) => {
                    console.log('All emails parsed successfully');
                    this.imap.end();
                    resolve(parsedEmails); // 모든 파싱된 이메일을 반환
                  })
                  .catch((err) => {
                    reject(err);
                  });
              });
            },
          );
        });
      });

      this.imap.once('error', (err) => {
        console.log('Connection error: ' + err);
        reject(err);
      });

      this.imap.once('end', () => {
        console.log('Connection ended');
      });

      this.imap.connect();
    });
  }

  async getMailSeqNos() {
    return await this.emailReceiveLogsRepository
      .createQueryBuilder('rec')
      .select('rec.message_seq_no', 'messageSeqNo')
      .where('rec.message_seq_no IS NOT NULL')
      .groupBy('rec.message_seq_no')
      .getRawMany();
  }

  async readMali() {
    let mails: any = await this.parseMail();
    // console.log('mails', mails);

    for (let mailIndex = 0; mailIndex < mails?.length; mailIndex++) {
      const mailElement = mails[mailIndex];
      const emailSubject = mailElement?.subject;
      console.log('emailSubject', emailSubject);

      const emailReceiveEntity = this.emailReceiveLogsRepository.create({
        emailSubject: emailSubject,
        emailFrom: mailElement?.from?.value?.[0]?.address,
        emailTo: mailElement?.to?.value?.[0]?.address,
        emailDate:
          dayjs(mailElement?.date).format('YYYYMMDD') == 'Invalid date'
            ? null
            : dayjs(mailElement?.date).toDate(),
        messageId: mailElement?.messageId,
        emailHeaders: JSON.stringify(mailElement?.headers),
        emailInReplyTo: mailElement?.inReplyTo,
        emailReplyTo: mailElement?.replyTo?.value?.[0]?.address,
        // emailReferences: mailElement?.references,
        emailHtml: mailElement?.html,
        emailText: mailElement?.text,
        emailTextAsHtml: mailElement?.textAsHtml,
        emailAttachments: JSON.stringify(mailElement?.attachmentFilePaths),
        messageSeqNo: mailElement?.seqno,
      });
      console.log(mailIndex, 'mailElement', mailElement);
      const emailReceive =
        await this.emailReceiveLogsRepository.save(emailReceiveEntity);

      // 엑셀파일 파싱
      if (mailElement?.attachmentFilePaths?.length > 0) {
        for (
          let attachIndex = 0;
          attachIndex < mailElement?.attachmentFilePaths.length;
          attachIndex++
        ) {
          const attachElement = mailElement?.attachmentFilePaths[attachIndex];
          const attachFileName = attachElement.replace(
            process.env.HOST + '/uploads/attachments/',
            '',
          );
          if (
            this.commonService.funExtractFileExtension(attachElement) == 'xlsx'
          ) {
            //https://dev-ccali.server.nexsol.ai/uploads/attachments/2814_보험료조회요청_2251202629_20240808.xlsx
            const realFilePath = path.join(
              __dirname,
              '..',
              '..',
              'uploads/attachments',
              attachFileName,
            );

            const excelData =
              await this.commonService.readExcelFile(realFilePath);
            console.log('excelData', excelData);

            for (let rowIndex = 0; rowIndex < excelData.length; rowIndex++) {
              const rowElement = excelData[rowIndex];
              const insuredBizNo = rowElement[2];
              console.log('insuredBizNo', insuredBizNo);
              const phBizNo = rowElement[3];
              console.log('phBizNo', phBizNo);
              const phFranNm = rowElement[4];
              console.log('phFranNm', phFranNm);
              const isnCostNoticeData =
                await this.commonService.selectInsCostNoticeByBizNoAndPhNm(
                  insuredBizNo,
                  phBizNo,
                  phFranNm,
                );
              console.log('isnCostNoticeData', isnCostNoticeData);
              if (isnCostNoticeData.length > 0) {
                const insCostNoticeInfo = isnCostNoticeData[0];
                const insCostNoticeUpdate =
                  await this.ccaliInsCostNoticeRepository.update(
                    {
                      id: insCostNoticeInfo?.costNoticeId,
                    },
                    {
                      emailReceiveLogsId: emailReceive?.id,
                      guarantee1JoinCd: rowElement[10],
                      guarantee2JoinCd: rowElement[11],
                      guarantee3JoinCd: rowElement[12],
                      guarantee4JoinCd: rowElement[13],
                      guarantee5JoinCd: rowElement[14],
                      guarantee6JoinCd: rowElement[15],
                      guarantee7JoinCd: rowElement[16],
                      guarantee8JoinCd: rowElement[17],
                      guarantee9JoinCd: rowElement[18],
                      guarantee10JoinCd: rowElement[19],
                      guarantee11JoinCd: rowElement[20],
                      guarantee12JoinCd: rowElement[21],
                      perAccidentCoverageLimit: rowElement[22],
                      totCoverageLimit: rowElement[23],
                      singleInsCost: rowElement[24],
                      biannualInsCost:
                        rowElement[25] == '-' ? 0 : rowElement[25],
                      quarterlyInsCost:
                        rowElement[26] == '-' ? 0 : rowElement[26],
                      premCmptYmd: dayjs().toDate(),
                    },
                  );
              }
            }
          }
        }
      }
    }

    return mails;
  }

  async sendMail(options: nodemailer.SendMailOptions) {
    let responseCode = 0;
    let responseMsg = 'ok';
    let responseData: any = {};

    const { to, subject, cc, text, html, attachments } = options;
    console.log('sendMail', options);

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.GMAIL_USERNAME,
      to: typeof to === 'string' ? to : to.join(','),
      subject,
      text,
      html,
    };

    if (cc != null && cc != '') {
      mailOptions.cc = typeof cc === 'string' ? cc : cc.join(',');
    }

    if (attachments?.length > 0) {
      mailOptions.attachments = attachments;
    }

    const sendMailReqEntity = this.emailSendLogsRepository.create({
      emailFrom: mailOptions?.from,
      emailTo: mailOptions?.to,
      emailSubject: mailOptions?.subject,
      emailCc: mailOptions?.cc,
      emailText: mailOptions?.text,
      emailHtml: mailOptions?.html,
      emailAttachments:
        attachments?.length > 0
          ? JSON.stringify(mailOptions?.attachments)
          : null,
    });
    const sendMailReq =
      await this.emailSendLogsRepository.save(sendMailReqEntity);

    responseData = {
      sendMailLogsId: sendMailReq?.id,
    };
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.response);
      responseData = {
        ...responseData,
        info,
      };

      const sendMailResEntity = this.emailSendLogsRepository.create({
        ...sendMailReq,
        messageId: info.messageId,
        responseData: JSON.stringify(info),
      });
      await this.emailSendLogsRepository.save(sendMailResEntity);
    } catch (error) {
      console.error('Error occurred while sending email:', error.message);
      responseCode = 10;
      responseMsg = error.message;

      const sendMailResEntity = this.emailSendLogsRepository.create({
        ...sendMailReq,
        errorData: JSON.stringify(error),
      });
      await this.emailSendLogsRepository.save(sendMailResEntity);
    } finally {
      return { responseCode, responseMsg, responseData };
    }
  }

  private downloadAttachment(attachment, messageSeqNo?: number) {
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'uploads',
      'attachments',
      messageSeqNo + '_' + attachment.filename,
    );
    const writeStream = fs.createWriteStream(filePath);
    writeStream.write(attachment.content);
    writeStream.end();
    console.log(`Attachment saved to ${filePath}`);

    return `${process.env.HOST}/uploads/attachments/${messageSeqNo}_${attachment.filename}`;
  }
}
