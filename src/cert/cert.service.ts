import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhoneCertLogs } from './entities/phone-cert-logs.entity';
import axios from 'axios';
import * as dayjs from 'dayjs';
import { toCamelCase } from 'src/common/utils/case-utils';
import { SavePhoneCertLogsResultReqDto } from './dto/save-phone-cert-logs-result-req.dto';
import { SecukitOneCertLogs } from './entities/secukit-one-cert-logs.entity';
import { SaveSecukitOneCertLogsReqDto } from './dto/save-secukit-one-cert-logs-req.dto';

@Injectable()
export class CertService {
  constructor(
    @InjectRepository(PhoneCertLogs, 'default')
    private phoneCertLogsRepository: Repository<PhoneCertLogs>,
    @InjectRepository(SecukitOneCertLogs, 'default')
    private secukitOneCertLogsRepository: Repository<SecukitOneCertLogs>,
  ) {}

  async getIamportToken() {
    let statusCode = 200000;
    let returnMsg = 'ok';
    let result = {
      cert: {},
    };

    const iamportToken = await this.funGetIamportToken();
    const { responseYn, responseCode, responseDt, code, message, response } =
      iamportToken;
    if (responseYn == 'N') {
      statusCode = 404000;
      returnMsg = message;
    } else {
      result.cert = {
        code,
        message,
        response,
      };
    }

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  async getIamportCert(impUid: string) {
    let statusCode = 200000;
    let returnMsg = 'ok';
    let result = {
      cert: {},
    };

    const iamportCert = await this.funGetIamportCert(impUid);
    console.log('iamportCert', iamportCert);
    const { responseYn, responseCode, responseDt, code, message, response } =
      iamportCert;
    if (responseYn == 'N') {
      statusCode = parseInt(responseCode + '000');
      returnMsg = iamportCert.message;
    } else {
      result.cert = {
        code,
        message,
        response,
      };
    }

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  async getIamportCertLogs(merchantUid: string) {
    let statusCode = 200000;
    let returnMsg = 'ok';
    let result = {
      cert: {},
    };

    const iamportLogs = await this.funGetIamportLogs(merchantUid);
    if (!iamportLogs) {
      statusCode = 200010;
      returnMsg = '결과 없음';
    } else {
      result.cert = iamportLogs;
    }

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  async createIamportCertLogs(data: any) {
    let statusCode = 200000;
    let returnMsg = 'ok';
    let result = {
      cert: {},
    };

    const { insuredBizNo, referIdx, impUid, requestId } = data;
    console.log('data', data);
    // 조회한 인증 정보 로그 저장

    const iamportCert = await this.funGetIamportCert(impUid);
    console.log('iamportCert', iamportCert);
    const { responseYn, responseCode, responseDt, code, message, response } =
      iamportCert;
    if (responseYn == 'N') {
      statusCode = parseInt(responseCode + '000');
      returnMsg = iamportCert.message;
    } else {
      const phoneCertLogs = await this.savePhoneCertLogs({
        ...response,
        insuredBizNo,
        referIdx,
        requestId,
        success: code == 0 ? 1 : 0,
      });
      result.cert = {
        code,
        message,
        response,
        phoneCertLogs,
      };
    }

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  async getSecukitOneCertLogs(athNo: string) {
    let statusCode = 200000;
    let returnMsg = 'ok';
    let result = {
      cert: {},
    };

    const secukitOneLogs = await this.funGetSecukitOneLogs(athNo);
    if (!secukitOneLogs) {
      statusCode = 200010;
      returnMsg = '결과 없음';
    } else {
      result.cert = secukitOneLogs;
    }

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  async createSecukitOneCertLogs(data: any) {
    let statusCode = 200000;
    let returnMsg = 'ok';
    let result = {
      cert: {},
    };

    const certLogs = await this.saveSecukitOneCertLogs(data);
    result.cert = certLogs;

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  async savePhoneCertLogs(data: SavePhoneCertLogsResultReqDto) {
    const certLogsEntity = this.phoneCertLogsRepository.create(data);
    return await this.phoneCertLogsRepository.save(certLogsEntity);
  }

  async saveSecukitOneCertLogs(data: SaveSecukitOneCertLogsReqDto) {
    const certLogsEntity = this.secukitOneCertLogsRepository.create(data);
    return await this.secukitOneCertLogsRepository.save(certLogsEntity);
  }

  // 아임포트 인증 토큰 발급
  async funGetIamportToken() {
    const url = process.env.IAMPORT_HOST + '/users/getToken';
    const impKey = process.env.IAMPORT_KEY;
    const impSecret = process.env.IAMPORT_SECRET_KEY;
    const bodyData = {
      imp_key: impKey,
      imp_secret: impSecret,
    };

    let responseData;
    const getToken = await axios
      .post(url, bodyData)
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

  // 아임포트 본인인증 정보 조회
  async funGetIamportCert(impUid: string) {
    const url = process.env.IAMPORT_HOST + '/certifications/' + impUid;

    // 아임포트 토큰 발급
    const iamportToken = await this.funGetIamportToken();
    if (iamportToken.responseYn == 'N') {
      // 토큰 발급 실패
    }
    const accessToken = iamportToken.response.access_token;

    let responseData;
    const getCert = await axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      .then(async (response) => {
        console.log('response', response.data);
        let responseDataCamel = {};
        if (response.data.code == 0) {
          Object.entries(response.data.response).map(([key, value]) => {
            let camelKey = toCamelCase(key);
            responseDataCamel[camelKey] = value;
          });
        }

        responseData = {
          code: response.data.code,
          message: response.data.message,
          response: responseDataCamel,
          responseCode: response.status,
          responseYn: response.data.code == 0 ? 'Y' : 'N',
          responseDt: dayjs().toDate(),
        };
      })
      .catch(async (error) => {
        console.log('error', error);
        responseData = {
          responseYn: 'N',
          responseCode: error.response.status,
          code: error.response.data.code,
          message: error.response.data.message,
          responseDt: dayjs().toDate(),
        };
      });

    return responseData;
  }

  // 아임포트 본인인증 로그 조회
  async funGetIamportLogs(merchantUid: string) {
    const iamportLogs = await this.phoneCertLogsRepository.findOne({
      where: {
        merchantUid,
      },
    });

    return iamportLogs;
  }

  // 공동인증 로그 조회
  async funGetSecukitOneLogs(athNo: string) {
    const secukitOneLogs = await this.secukitOneCertLogsRepository.findOne({
      where: {
        athNo,
      },
      order: {
        id: 'DESC',
      },
    });

    return secukitOneLogs;
  }
}
