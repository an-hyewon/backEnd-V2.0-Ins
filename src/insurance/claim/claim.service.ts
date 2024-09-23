import { BadRequestException, Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { CommonService } from 'src/common/common.service';
import { JoinService } from '../join/join.service';
import { CcaliJoin } from '../join/entities/ccali-join.entity';
import { ClaimAvailableCheckReqDto } from './dto/claim-available-check-req.dto';
import { createCcaliClaimReqDto } from './dto/create-ccali-claim-req.dto';
import { CcaliClaim } from './entities/ccali-claim.entity';

@Injectable()
export class ClaimService {
  constructor(
    private readonly commonService: CommonService,
    private readonly joinService: JoinService,
    private readonly connection: Connection,
    @InjectRepository(CcaliJoin)
    private ccaliJoinRepository: Repository<CcaliJoin>,
    @InjectRepository(CcaliClaim)
    private ccaliClaimRepository: Repository<CcaliClaim>,
  ) {}

  async checkAvailableClaim(data: ClaimAvailableCheckReqDto) {
    let statusCode = 200000;
    let returnMsg = 'ok';
    let result: any = {
      claim: {},
    };

    const { insuredBizNo, insuredPhoneNo } = data;
    const ccaliJoin = await this.ccaliJoinRepository.findOne({
      where: {
        insuredBizNo,
        joinStatusCd: 'Y',
      },
      order: {
        id: 'DESC',
      },
    });
    if (!ccaliJoin) {
      statusCode = 201020;
      returnMsg = `가입 정보가 없습니다.\n다시 한번 확인해 주세요.`;
    } else if (ccaliJoin.insuredPhoneNo !== insuredPhoneNo) {
      statusCode = 201010;
      returnMsg = `가입 시 입력한 정보와 일치하지 않습니다.\n다시 한번 확인해 주세요.`;
    } else {
      result.claim.joinId = ccaliJoin.id;
    }

    if (statusCode == 200000) {
      const joinId = ccaliJoin.id;
      const joinDetail = await this.commonService.selectJoinListDetailByJoinId(
        joinId,
        '',
      );
      console.log('joinDetail', joinDetail);
      if (joinDetail.length == 0) {
        statusCode = 201020;
        returnMsg = `가입 정보가 없습니다.\n다시 한번 확인해 주세요.`;
      } else if (insuredPhoneNo != joinDetail[0].insuredPhoneNo) {
        statusCode = 201010;
        returnMsg = `가입 시 입력한 정보와 일치하지 않습니다.\n다시 한번 확인해 주세요.`;
      }

      if (statusCode == 200000) {
        let joinInfo = joinDetail[0];
        if (joinInfo?.joinStatusCd != 'Y' && joinInfo?.joinStatusCd != 'X') {
          statusCode = 201020;
          returnMsg = `가입 완료된 정보가 없습니다.\n다시 한번 확인해 주세요.`;
        } else if (joinInfo?.claimYn == 'Y') {
          result.claim = {
            ...result.claim,
            claimInfo: joinInfo.claimData[0],
          };

          statusCode = 200001;
          returnMsg = `사고 접수 완료`;
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

  async createClaim(req, data: createCcaliClaimReqDto) {
    let statusCode = 201000;
    let returnMsg = 'ok';
    let result = {
      claim: {},
    };

    const url = req?.headers?.referer || req.hostname;
    const { locationHref, joinId, accidentDt, accidentContent } = data;

    const joinDetail = await this.commonService.selectJoinListDetailByJoinId(
      joinId,
      '',
    );
    console.log('joinDetail', joinDetail);
    if (joinDetail.length == 0) {
      statusCode = 201020;
      returnMsg = `가입 정보가 없습니다.\n다시 한번 확인해 주세요.`;
    } else {
      let joinInfo = joinDetail[0];
      if (joinInfo?.joinStatusCd != 'Y' && joinInfo?.joinStatusCd != 'X') {
        statusCode = 201020;
        returnMsg = `가입 완료된 정보가 없습니다.\n다시 한번 확인해 주세요.`;
      } else if (joinInfo?.claimYn == 'Y') {
        statusCode = 200001;
        returnMsg = `사고 접수 완료`;
      }
    }

    if (statusCode == 201000) {
      if (dayjs(accidentDt).format('YYYY-MM-DD') == 'Invaild Date') {
        throw new BadRequestException('Validation Failed(accidentDt)');
      } else {
        const accidentYmd = dayjs(accidentDt).format('YYYY-MM-DD');
        const accidentTime = dayjs(accidentDt).format('HH:mm');
        const createClaim = await this.ccaliClaimRepository.save({
          joinId,
          accidentYmd,
          accidentTime,
          accidentContent,
          claimStatusCd: 'A',
        });
        result.claim = createClaim;
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
