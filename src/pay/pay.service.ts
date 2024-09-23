import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { IsNull, MoreThanOrEqual, Repository } from 'typeorm';
import * as dayjs from 'dayjs';
import { PayNicepayLogs } from './entities/pay-nicepay-logs.entity';
import { hashAes256Cbc, hashSHA256 } from 'src/common/utils/crypto-utils';
import axios from 'axios';
import * as qs from 'qs';
import * as iconv from 'iconv-lite';
import * as request from 'request-promise-native';
import * as fs from 'fs';
import * as ejs from 'ejs';
import { join } from 'path';
import { RequestPaymentNicepayReqDto } from './dto/request-payment-nicepay-req.dto';
import { AuthPaymentNicepayReqDto } from './dto/auth-payment-nicepay-req.dto';
import { CancelPaymentNicepayReqDto } from './dto/cancel-payment-nicepay-req.dto';
import { SaveNicepayLogsResultReqDto } from './dto/save-nicepay-logs-result-req.dto';
import { CardBinNoKicc } from './entities/card-bin-no-kicc.entity';

@Injectable()
export class PayService {
  constructor(
    private readonly commonService: CommonService,
    @InjectRepository(PayNicepayLogs)
    private payNicepayLogsRepository: Repository<PayNicepayLogs>,
    @InjectRepository(CardBinNoKicc)
    private cardBinNoKiccRepository: Repository<CardBinNoKicc>,
  ) {}

  async readEjsFile(filename: string) {
    try {
      const filePath = join(__dirname, '..', 'views', filename);
      console.log('filePath', filePath);
      return fs.readFileSync(filePath, 'utf8');
    } catch (err) {
      console.error(`Error reading file ${filename}:`, err);
      throw err;
    }
  }

  async reqNicepayPayment(req, data: RequestPaymentNicepayReqDto, res) {
    let statusCode = 201000;
    let returnMsg = 'ok';
    let result: any = {
      pay: {},
    };

    try {
      const { payMethod, payMoid, phNm, phPhoneNo, applyCost } = data;

      const MID = process.env.NICEPAY_MID; // Neoinsu01m // nictest04m
      const MerchantKey = process.env.NICEPAY_V2_KEY;

      const ReturnURL = '/api/v1/register/nicepay-req';
      const EdiDate = dayjs().format('YYYYMMDDHHmmss');
      const Amt = payMethod == 'BANK' ? '1000' : '100';
      const SignData = hashSHA256(EdiDate + MID + Amt + MerchantKey);
      const goodsName = '';

      console.log('asdf', {
        MID: MID,
        MerchantKey: MerchantKey,
        ReturnURL: ReturnURL,
        EdiDate: EdiDate,
        Amt: Amt,
        SignData: SignData,
        goodsName: goodsName,
      });

      // ejs payment File

      const filePath = join(__dirname, '..', 'views', 'nicepay-v2-request.ejs');
      const payRequest = fs.readFileSync(filePath, 'utf-8');

      console.log('payReqSuccess');

      const index = ejs.render(payRequest, {
        goodsName: goodsName,
        amt: applyCost,
        moid: payMoid,
        buyerName: phNm,
        buyerEmail: '',
        buyerTel: phPhoneNo,
        merchantID: MID,
        ediDate: EdiDate,
        hashString: SignData,
        returnURL: ReturnURL,
      });

      console.log('index');

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.write(index);
      res.end();
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Failed');
    }
  }

  async getNicepayPayLogs(moid: string) {
    let statusCode = 200000;
    let returnMsg = 'ok';
    let result = {
      pay: {},
    };

    const nicepayLogs = await this.funGetNicepayPayLogs(moid);
    if (nicepayLogs.length == 0) {
      statusCode = 200010;
      returnMsg = '결과 없음';
    } else {
      result.pay = nicepayLogs;
    }

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  // 나이스페이 결제승인 요청 API
  async requestAuthPaymentNicepay(req, data: AuthPaymentNicepayReqDto) {
    let statusCode = 201000;
    let returnMsg = 'ok';
    let result: any = {
      pay: {},
    };

    const originReferer =
      data?.ReqReserved ??
      req?.headers?.referer ??
      req.hostname ??
      'https://main.insboon.com';
    console.log('originReferer', originReferer);

    try {
      const ediDate = dayjs().format('YYYYMMDDHHmmss');
      const merchantKey = process.env.NICEPAY_V2_KEY;

      const authResultCode = data.AuthResultCode;
      const authResultMsg = data.AuthResultMsg;
      const txTid = data.TxTid;
      const authToken = data.AuthToken;
      const payMethod = data.PayMethod;
      const mid = data.MID;
      const moid = data.Moid;
      const amt = data.Amt;
      const reqReserved = data.ReqReserved;
      const nextAppURL = data.NextAppURL; // 승인 API URL
      const netCancelURL = data.NetCancelURL; // API 응답이 없는 경우 망취소 API 호출
      // let authSignature = data.Signature; //Nicepay에서 내려준 응답값의 무결성 검증 Data
      //인증 응답 Signature = hex(sha256(AuthToken + MID + Amt + MerchantKey)
      // let authComparisonSignature = hashSHA256(data.AuthToken + data.MID + data.Amt + merchantKey);
      const signData = hashSHA256(
        authToken + mid + amt + ediDate + merchantKey,
      );

      const options = {
        url: nextAppURL,
        method: 'POST',
        headers: {
          'User-Agent': 'Super Agent/0.0.1',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        encoding: null,
        form: {
          TID: txTid,
          AuthToken: authToken,
          Amt: amt,
          MID: mid,
          SignData: signData,
          EdiDate: ediDate,
        },
      };

      let resultBody;
      await request(options, async function (error, response, body) {
        // console.log('error', error)
        // console.log('response', response)
        // console.log('body', body)

        if (!error && response.statusCode == 200) {
          let strContents = Buffer.from(body);
          let returnObj = JSON.parse(
            iconv.decode(strContents, 'EUC-KR').toString(),
          );
          // let Signature = JSON.parse(strContents).Signature.toString();
          let Signature = returnObj.Signature.toString();
          console.log('returnObj', returnObj);
          const ResultCode = returnObj.ResultCode;
          const resultMsg = returnObj.ReturnMsg;
          resultBody = returnObj;

          //가맹점은 승인응답으로 전달된 TID, Amt 값을 활용하여 위변조 대조 해쉬값을 생성하여 전달받은 Signature 값과 대조를 진행합니다. 대조가 일치할 경우 정상승인을 진행합니다.
          if (
            options.url ===
            'https://webapi.nicepay.co.kr/webapi/pay_process.jsp'
          ) {
            // let paySignature = hashSHA256(
            //   JSON.parse(strContents).TID.toString() +
            //     JSON.parse(strContents).MID.toString() +
            //     JSON.parse(strContents).Amt.toString() +
            //     merchantKey,
            // );
            let paySignature = hashSHA256(
              returnObj.TID.toString() +
                returnObj.MID.toString() +
                returnObj.Amt.toString() +
                merchantKey,
            );
            console.log('certObj', returnObj);
            if (Signature === paySignature) {
              console.log('Signature : ' + Signature);
            } else {
              console.log('Signature : ' + Signature);
              console.log('paySignature : ' + paySignature);
            }
          } else {
            //취소 응답 시 위변조 대조 해쉬값을 생성하여 전달받은 Signature 값과 대조를 진행합니다. 대조가 일치할 경우 취소를 진행합니다.
            // let cancelSignature = hashSHA256(
            //   JSON.parse(strContents).TID.toString() +
            //     JSON.parse(strContents).MID.toString() +
            //     JSON.parse(strContents).CancelAmt.toString() +
            //     merchantKey,
            // );
            let cancelSignature = hashSHA256(
              returnObj.TID.toString() +
                returnObj.MID.toString() +
                returnObj.CancelAmt.toString() +
                merchantKey,
            );
            console.log('failObj', returnObj);
            if (Signature === cancelSignature) {
              console.log('Signature : ' + Signature);
              console.log('U must cancel');
            } else {
              console.log('Signature : ' + Signature);
              console.log('cancelSignature : ' + cancelSignature);
            }
          }

          // PC
          // return res
          //   .status(200)
          //   .send(
          //     `${originReferer}/payment/nicepayResult?authResultCode=${authResultCode}&ResultCode=${ResultCode}&moid=${moid}&resultMsg=${resultMsg}`,
          //   );
          result.pay = `${originReferer}/payment/nicepayResult?authResultCode=${authResultCode}&ResultCode=${ResultCode}&moid=${moid}&resultMsg=${resultMsg}`;

          // 모바일
          // return res.redirect(`${originReferer}/payment/nicepayResult?authResultCode=${authResultCode}&ResultCode=${ResultCode}&moid=${moid}&resultMsg=${resultMsg}`)
          if (req?.originalUrl?.indexOf('/mobile') > -1) {
            result.pay = `${originReferer}/join/payment?authResultCode=${authResultCode}&ResultCode=${ResultCode}&moid=${moid}&resultMsg=${resultMsg}`;
          }
        } else {
          statusCode = 201010;
          returnMsg = '결제 실패';
          result.pay = `${originReferer}/cancel`;
        }
      });

      const saveLogsReqData = {
        ResultCode: resultBody?.ResultCode,
        ResultMsg: resultBody?.ResultMsg,
        MsgSource: resultBody?.MsgSource,
        Amt: resultBody?.Amt,
        MID: resultBody?.MID,
        Moid: resultBody?.Moid,
        BuyerEmail: resultBody?.BuyerEmail,
        BuyerTel: resultBody?.BuyerTel,
        BuyerName: resultBody?.BuyerName,
        GoodsName: resultBody?.GoodsName,
        TID: resultBody?.TID,
        AuthCode: resultBody?.AuthCode,
        AuthDate: resultBody?.AuthDate,
        PayMethod: resultBody?.PayMethod,
        CartData: resultBody?.CartData,
        Signature: resultBody?.Signature,
        MallReserved: resultBody?.MallReserved,
        CardCode: resultBody?.CardCode,
        CardName: resultBody?.CardName,
        CardNo: resultBody?.CardNo,
        CardQuota: resultBody?.CardQuota,
        CardInterest: resultBody?.CardInterest,
        AcquCardCode: resultBody?.AcquCardCode,
        AcquCardName: resultBody?.AcquCardName,
        CardCl: resultBody?.CardCl,
        CcPartCl: resultBody?.CcPartCl,
        CouponAmt: resultBody?.CouponAmt,
        CouponMinAmt: resultBody?.CouponMinAmt,
        PointAppAmt: resultBody?.PointAppAmt,
        ClickpayCl: resultBody?.ClickpayCl,
        MultiCl: resultBody?.MultiCl,
        MultiCardAcquAmt: resultBody?.MultiCardAcquAmt,
        MultiPointAmt: resultBody?.MultiPointAmt,
        MultiCouponAmt: resultBody?.MultiCouponAmt,
        RcptType: resultBody?.RcptType,
        RcptTID: resultBody?.RcptTID,
        RcptAuthCode: resultBody?.RcptAuthCode,
        CardType: resultBody?.CardType,
        BankCode: resultBody?.BankCode,
        BankName: resultBody?.BankName,
        // MultiDiscountAmt: resultBody?.MultiDiscountAmt,
        // ApproveCardQuota: resultBody?.ApproveCardQuota,
        // PointCl: resultBody?.PointCl,
      };
      console.log('saveLogsReqData', saveLogsReqData);

      await this.saveNicepayLogs(saveLogsReqData);

      let responseResult = {
        code: statusCode,
        message: returnMsg,
        result,
      };

      return responseResult;
    } catch (error) {
      console.log(error);
      statusCode = 201010;
      returnMsg = '결제 실패';
      result.pay = `${originReferer}/cancel`;

      let responseResult = {
        code: statusCode,
        message: returnMsg,
        result,
      };
      return responseResult;
    }
  }

  // 나이스페이 결제취소 요청 API
  async requestCancelPaymentNicepay(req, data: CancelPaymentNicepayReqDto) {
    let statusCode = 201000;
    let returnMsg = 'ok';
    let result: any = {
      pay: {},
    };

    try {
      const { Moid, PartialCancelYn, CancelAmt, CancelMsg } = data;

      const nicepayLogs = await this.funGetNicepayPayLogs(Moid);
      if (nicepayLogs.length == 0) {
        statusCode = 201000;
        returnMsg = '결과 없음';

        let responseResult = {
          code: statusCode,
          message: returnMsg,
          result,
        };

        return responseResult;
      }

      const tid = nicepayLogs[0].TID;
      const merchantID = nicepayLogs[0].MID;
      let cancelCost = Number(nicepayLogs[0].Amt).toString();
      if (
        PartialCancelYn == 'Y' &&
        CancelAmt != 0 &&
        nicepayLogs[0].CcPartCl == '1'
      ) {
        cancelCost = Number(CancelAmt).toString();
      }
      let CancelMessage = '고객요청';
      if (CancelMsg != null && CancelMsg.length > 0) {
        CancelMessage = CancelMsg;
      }
      const partialCancelCode = PartialCancelYn == 'Y' ? '1' : '0';
      const ediDate = dayjs().format('YYYYMMDDHHmmss');
      const merchantKey = process.env.NICEPAY_V2_KEY;
      const signData = hashSHA256(
        merchantID + cancelCost + ediDate + merchantKey,
      );

      console.log('cancelAmt', cancelCost);

      const options = {
        url: 'https://webapi.nicepay.co.kr/webapi/cancel_process.jsp',
        method: 'POST',
        headers: {
          'User-Agent': 'Super Agent/0.0.1',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        encoding: null,
        form: {
          TID: tid,
          MID: merchantID,
          Moid: Moid,
          CancelAmt: cancelCost,
          CancelMsg: CancelMessage,
          PartialCancelCode: partialCancelCode,
          EdiDate: ediDate,
          SignData: signData,
        },
      };

      let resultBody;
      await request(options, async function (error, response, body) {
        // console.log('error', error)
        // console.log('response', response)
        // console.log('body', body)

        if (!error && response.statusCode == 200) {
          let strContents = Buffer.from(body);
          let returnObj = JSON.parse(
            iconv.decode(strContents, 'EUC-KR').toString(),
          );
          resultBody = returnObj;
          // let Signature = JSON.parse(strContents).Signature.toString();
          let Signature = returnObj.Signature.toString();
          console.log('returnObj', returnObj);
        } else {
          statusCode = 201010;
          returnMsg = '결제취소 실패';
          result.pay = body;
        }
      });

      const saveLogsReqData = {
        Amt: nicepayLogs[0]?.Amt,
        GoodsName: nicepayLogs[0]?.GoodsName,
        AuthCode: nicepayLogs[0]?.AuthCode,
        AuthDate: nicepayLogs[0]?.AuthDate,
        BuyerEmail: nicepayLogs[0]?.BuyerEmail,
        BuyerTel: nicepayLogs[0]?.BuyerTel,
        BuyerName: nicepayLogs[0]?.BuyerName,
        CardCode: nicepayLogs[0]?.CardCode,
        CardName: nicepayLogs[0]?.CardName,
        CardNo: nicepayLogs[0]?.CardNo,
        CardQuota: nicepayLogs[0]?.CardQuota,
        CardInterest: nicepayLogs[0]?.CardInterest,
        AcquCardCode: nicepayLogs[0]?.AcquCardCode,
        AcquCardName: nicepayLogs[0]?.AcquCardName,
        CardType: nicepayLogs[0]?.CardType,
        ResultCode: resultBody?.ResultCode,
        ResultMsg: resultBody?.ResultMsg,
        CancelCd: resultBody?.ErrorCD,
        CancelMsg: resultBody?.ErrorMsg,
        MsgSource: resultBody?.MsgSource,
        CancelAmt: resultBody?.CancelAmt,
        MID: resultBody?.MID,
        Moid: resultBody?.Moid,
        PayMethod: resultBody?.PayMethod,
        TID: resultBody?.TID,
        CancelDate: resultBody?.CancelDate,
        CancelTime: resultBody?.CancelTime,
        CancelNum: resultBody?.CancelNum,
        RemainAmt: resultBody?.RemainAmt,
        Signature: resultBody?.Signature,
        MallReserved: resultBody?.MallReserved,
        CouponAmt: resultBody?.CouponAmt,
        ClickpayCl: resultBody?.ClickpayCl,
        MultiCardAcquAmt: resultBody?.MultiCardAcquAmt,
        MultiPointAmt: resultBody?.MultiPointAmt,
        MultiCouponAmt: resultBody?.MultiCouponAmt,
      };
      console.log('saveLogsReqData', saveLogsReqData);

      await this.saveNicepayLogs(saveLogsReqData);

      let responseResult = {
        code: statusCode,
        message: returnMsg,
        result,
      };

      return responseResult;
    } catch (error) {
      console.log(error);
      statusCode = 201010;
      returnMsg = '결제취소 실패';
      result.pay = error;

      let responseResult = {
        code: statusCode,
        message: returnMsg,
        result,
      };
      return responseResult;
    }
  }

  async getNicepayToken() {
    let statusCode = 200000;
    let returnMsg = 'ok';
    let result = {
      pay: {},
    };

    const accessToken = await this.funGetNicepayAccessToken();
    console.log('accessToken', accessToken);
    const { responseYn, responseCode, responseDt, message, ...rest } =
      accessToken;
    if (responseYn == 'N') {
      statusCode = parseInt(responseCode + '000');
      returnMsg = accessToken.message;
    } else {
      result.pay = {
        ...accessToken,
      };
    }

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  async saveNicepayLogs(data: SaveNicepayLogsResultReqDto) {
    const entity = this.payNicepayLogsRepository.create(data);
    return await this.payNicepayLogsRepository.save(entity);
  }

  // 나이스페이 결제 로그 조회
  async funGetNicepayPayLogs(moid: string) {
    const nicepayLogs = await this.payNicepayLogsRepository.find({
      where: {
        Moid: moid,
        CancelCd: IsNull(),
      },
      order: {
        id: 'DESC',
      },
      take: 1,
    });

    return nicepayLogs;
  }

  // 나이스페이 인증 토큰 발급
  async funGetNicepayAccessToken() {
    const url = process.env.NICEPAY_V1_HOST + '/v1/access-token';
    const clientKey = process.env.NICEPAY_V1_SERVER_CLIENT_KEY;
    const secretKey = process.env.NICEPAY_V1_SERVER_SECRET_KEY;
    const bodyData = {
      imp_key: clientKey,
      imp_secret: secretKey,
    };

    let responseData;
    const getToken = await axios
      .post(url)
      .then(async (response) => {
        console.log('response', response.data);
        responseData = {
          ...response.data,
          responseCode: response.status,
          responseYn: response.data.code == 0 ? 'Y' : 'N',
          responseDt: dayjs().toDate(),
        };
      })
      .catch(async (error) => {
        console.log('error', error.message);
        responseData = {
          responseYn: 'N',
          responseCode: error.response.status,
          message: error.data.message,
          responseDt: dayjs().toDate(),
        };
      });

    return responseData;
  }
}
