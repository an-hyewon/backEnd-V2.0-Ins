import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTermAgreeLogsDto, CreateTermReqDto } from './dto/req.dto';
import * as dayjs from 'dayjs';
import { TermsAgreeLogs } from './entities/terms-agree-logs.entity';
import { TermsAgreeMap } from './entities/terms-agree-map.entity';
import { TermsAgreeCdInfo } from './entities/terms-agree-cd-info.entity';
import { InsProd } from 'src/common/entities/ins-prod.entity';
import { SaveAgreeLogsReqDto } from './dto/save-agree-logs-req.dto';
import { SaveAgreeLogsDto } from './dto/save-agree-logs.dto';
import { UrlReqDto } from 'src/common/dto/url-req.dto';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class TermsService {
  constructor(
    private readonly commonService: CommonService,
    @InjectRepository(TermsAgreeLogs)
    private termsAgreeLogsRepository: Repository<TermsAgreeLogs>,
    @InjectRepository(TermsAgreeMap)
    private termsAgreeMapRepository: Repository<TermsAgreeMap>,
  ) {}

  async getTermsAgree(req, data: UrlReqDto) {
    let statusCode = 200000;
    let returnMsg = 'ok';
    let result = {
      terms: {},
    };

    const { locationHref } = data;
    const url = req?.headers?.referer || req?.hostname;
    const referer = this.commonService.getRefererStr(locationHref, url);
    const siteInfo = await this.commonService.getSiteInfo(referer);
    console.log('siteInfo', siteInfo);
    if (siteInfo?.responseCode != 0) {
      throw new BadRequestException('Validation Failed(url)');
    }

    const insProdCd = siteInfo?.responseData?.insProdCd;
    const payYn = siteInfo?.responseData?.payYn;
    const joinAccount = siteInfo?.responseData?.joinAccount;
    const joinPath = siteInfo?.responseData?.joinPath;
    const insCom = siteInfo?.responseData?.insCom;
    const termsAgreeContent = await this.selectTermsAgree({
      insProdCd,
      payYn,
      joinAccount,
      joinPath,
      insCom,
    });
    if (termsAgreeContent.length == 0) {
      statusCode = 200020;
      returnMsg = '조회 결과 없음';
    } else {
      result.terms = termsAgreeContent;
    }

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  async selectTermsAgree({
    insProdCd,
    payYn,
    joinAccount,
    joinPath,
    insCom,
  }: any) {
    const query = this.termsAgreeMapRepository
      .createQueryBuilder('map')
      .select('map.terms_agree_position', 'termsAgreePosition')
      .addSelect('map.terms_agree_type', 'termsAgreeType')
      .addSelect('termsAgree.terms_agree_cd', 'termsAgreeCd')
      .addSelect('termsAgree.terms_agree_nm', 'termsAgreeNm')
      .addSelect('termsAgree.terms_agree_cont_full', 'termsAgreeContFull')
      .addSelect('termsAgree.terms_agree_cont', 'termsAgreeCont')
      .innerJoin(
        (subQuery) => {
          return subQuery
            .select('trms_agre.*')
            .from(TermsAgreeCdInfo, 'trms_agre');
        },
        'termsAgree',
        'map.terms_agree_cd_seq_no = termsAgree.seq_no',
      )
      .where('map.ins_prod_cd = :insProdCd', { insProdCd })
      .andWhere('map.pay_yn = :payYn', { payYn })
      .andWhere('map.join_account = :joinAccount', { joinAccount })
      .andWhere('map.join_path = :joinPath', { joinPath })
      .andWhere('map.ins_com = :insCom', { insCom })
      .andWhere('map.deleted_dt IS NULL');

    query.orderBy('map.order_no', 'ASC');

    const results = await query.getRawMany();

    let formattedResults = [];
    for (let index = 0; index < results.length; index++) {
      const element = results[index];
      const {
        termsAgreePosition,
        termsAgreeType,
        termsAgreeCd,
        termsAgreeNm,
        termsAgreeContFull,
        termsAgreeCont,
      } = element;

      let tmpTermsAgreeInfo = {};
      let tmpTermsAgreeTypeInfo = {};
      let tmpTermsAgreePositionInfo = {};
      if (index == 0) {
        tmpTermsAgreeInfo = {
          termsAgreeCd: insProdCd + '/' + termsAgreeCd,
          termsAgreeNm,
          termsAgreeCont:
            termsAgreeCont != null
              ? termsAgreeCont
              : termsAgreeContFull != null
                ? JSON.stringify([
                    {
                      type: 'full',
                      no: null,
                      cont: termsAgreeContFull,
                    },
                  ])
                : null,
        };
        tmpTermsAgreeTypeInfo = {
          termsAgreeType,
          termsAgrees: [tmpTermsAgreeInfo],
        };
        tmpTermsAgreePositionInfo = {
          termsAgreePosition,
          termsAgreeTypes: [tmpTermsAgreeTypeInfo],
        };
        formattedResults.push(tmpTermsAgreePositionInfo);
      } else if (
        formattedResults[formattedResults.length - 1].termsAgreePosition ==
          termsAgreePosition &&
        formattedResults[formattedResults.length - 1].termsAgreeTypes[
          formattedResults[formattedResults.length - 1].termsAgreeTypes.length -
            1
        ].termsAgreeType == termsAgreeType
      ) {
        tmpTermsAgreeInfo = {
          termsAgreeCd: insProdCd + '/' + termsAgreeCd,
          termsAgreeNm,
          termsAgreeCont:
            termsAgreeCont != null
              ? termsAgreeCont
              : termsAgreeContFull != null
                ? JSON.stringify([
                    {
                      type: 'full',
                      no: null,
                      cont: termsAgreeContFull,
                    },
                  ])
                : null,
        };

        formattedResults[formattedResults.length - 1].termsAgreeTypes[
          formattedResults[formattedResults.length - 1].termsAgreeTypes.length -
            1
        ].termsAgrees.push(tmpTermsAgreeInfo);
      } else if (
        formattedResults[formattedResults.length - 1].termsAgreePosition ==
          termsAgreePosition &&
        formattedResults[formattedResults.length - 1].termsAgreeTypes[
          formattedResults[formattedResults.length - 1].termsAgreeTypes.length -
            1
        ].termsAgreeType != termsAgreeType
      ) {
        tmpTermsAgreeInfo = {
          termsAgreeCd: insProdCd + '/' + termsAgreeCd,
          termsAgreeNm,
          termsAgreeCont:
            termsAgreeCont != null
              ? termsAgreeCont
              : termsAgreeContFull != null
                ? JSON.stringify([
                    {
                      type: 'full',
                      no: null,
                      cont: termsAgreeContFull,
                    },
                  ])
                : null,
        };
        tmpTermsAgreeTypeInfo = {
          termsAgreeType,
          termsAgrees: [tmpTermsAgreeInfo],
        };
        formattedResults[formattedResults.length - 1].termsAgreeTypes.push(
          tmpTermsAgreeTypeInfo,
        );
      } else {
        tmpTermsAgreeInfo = {
          termsAgreeCd: insProdCd + '/' + termsAgreeCd,
          termsAgreeNm,
          termsAgreeCont:
            termsAgreeCont != null
              ? termsAgreeCont
              : termsAgreeContFull != null
                ? JSON.stringify([
                    {
                      type: 'full',
                      no: null,
                      cont: termsAgreeContFull,
                    },
                  ])
                : null,
        };
        tmpTermsAgreeTypeInfo = {
          termsAgreeType,
          termsAgrees: [tmpTermsAgreeInfo],
        };
        tmpTermsAgreePositionInfo = {
          termsAgreePosition,
          termsAgreeTypes: [tmpTermsAgreeTypeInfo],
        };
        formattedResults.push(tmpTermsAgreePositionInfo);
      }
    }

    return formattedResults;
  }

  async saveTermsAgreeLogs(data: SaveAgreeLogsDto) {
    console.log('data', data);
    const { agreeCd, agreeYn, ...rest } = data;

    const logs = await this.termsAgreeLogsRepository.save({
      ...data,
      termsAgreeCd: agreeCd,
      agree: agreeYn == 'Y' ? 1 : 0,
      userCreatedDt:
        dayjs(data.userCreatedDt).format('YYYYMMDD') == 'Invalid Date'
          ? dayjs().format('YYYY-MM-DD HH:mm:ss')
          : dayjs(data.userCreatedDt).format('YYYY-MM-DD HH:mm:ss'),
    });
    console.log('logs', logs);

    let result = {
      terms: logs,
    };

    let responseResult = {
      code: 201000,
      message: 'ok',
      result,
    };

    return responseResult;
  }
}
