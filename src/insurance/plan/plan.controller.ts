import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
  ValidationPipe,
  Version,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { KeywordReqDto } from 'src/common/dto/keyword-req.dto';
import { CheckBizNoReqDto } from './dto/check-biz-no-req.dto';
import { SelectBizTypeReqDto } from './dto/select-biz-type-req.dto';
import { SelectDefaultCoverageLimitReqDto } from './dto/select-default-coverage-limit-req.dto';
import { SelectInsCostReqDto } from './dto/select-ins-cost-req.dto';
import { CheckBizTypeReqDto } from './dto/check-biz-type-req.dto';
import { SelectQuestionReqDto } from './dto/select-question-req.dto';

@Controller('plan')
@ApiTags('ins/plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Get('biz-type/list')
  @ApiOperation({
    summary: '업종 전체 목록',
    description: `
    응답코드
    - 200000 (성공)
    - 400000 (유효성 체크 오류)
    `,
  })
  findBizTypeList(@Request() req) {
    return this.planService.findBizTypeList();
  }

  @Get('biz-type')
  @ApiOperation({
    summary: '업종 매칭',
    description: `
    응답코드
    - 200000 (성공)
    - 200020 (검색 결과 없음)
    - 400000 (유효성 체크 오류)
    `,
  })
  findBizType(@Request() req, @Query() query: SelectBizTypeReqDto) {
    return this.planService.findBizType(query);
  }

  @Get('check-biz-no')
  @ApiOperation({
    summary: '사업자정보 조회',
    description: `
    사업자정보 조회 위치 orgin
    - 1: kodata
    - 2: kodatacorp(kodata법인)
    - 3: zeropay(제로페이)
    - 4: insured(기가입자)
    - 5: finpccorp(글로벌핀테크)
    - 6: kodatacorp2(kodata법인2)
    - 0: 없음

    응답코드
    - 200000 (성공)
    - 200010 (가입 불가)
    - 200020 (검색 결과 없음)
    - 400000 (유효성 체크 오류)
    `,
  })
  checkBizNo(@Request() req, @Query() query: CheckBizNoReqDto) {
    return this.planService.checkBizNo(req, query);
  }

  @Get('check-biz-type')
  @ApiOperation({
    summary: '업종 가입 가능 여부 체크',
    description: `
    근로자수 입력한 후에 호출

    planId
    - 1 : 5~49인 온라인 가입대상(기존)
    - 2 : 1~4인 온라인 가입대상
    - 3 : 50인미만 온라인가입불가 업종
    - 4 : 50인미만 온라인가입불가(매출액 1000억 초과)
    - 5 : 50인 이상

    응답코드
    - 200000 (성공)
    - 200020 (검색 결과 없음)
    - 200030 (온라인 가입대상 아님)
    - 400000 (유효성 체크 오류)
    `,
  })
  checkBizType(@Request() req, @Query() query: CheckBizTypeReqDto) {
    return this.planService.checkBizType(query);
  }

  @Get('coverage-limit-default')
  @ApiOperation({
    summary: '매출액 대비 보상한도 기본값',
    description: `
    응답코드
    - 200000 (성공)
    - 200020 (검색 결과 없음)
    - 200030 (온라인 가입대상 아님)
    - 400000 (유효성 체크 오류)
    `,
  })
  findDefaultCoverageLimit(
    @Request() req,
    @Query(new ValidationPipe()) query: SelectDefaultCoverageLimitReqDto,
  ) {
    return this.planService.findDefaultCoverageLimit(query?.salesCost);
  }

  @Get('cost')
  @ApiOperation({
    summary: '보상한도별 보험료 조회 및 보장내용 조회',
    description: `
    응답코드
    - 200000 (성공)
    - 200010 (가입 불가)
    - 200020 (검색 결과 없음)
    - 200021 (보험료 계산 불가 플랜)
    - 400000 (유효성 체크 오류)
    `,
  })
  calculateInsCostGuarantee(
    @Request() req,
    @Query() query: SelectInsCostReqDto,
  ) {
    return this.planService.calculateInsCostGuarantee(query);
  }

  @Get('question/list')
  @ApiOperation({
    summary: '질문서 내용 조회',
    description: `
    planId
    - 1 : 5~49인 온라인 가입대상(기존)
    - 2 : 1~4인 온라인 가입대상
    - 3 : 50인미만 온라인가입불가 업종
    - 4 : 50인미만 온라인가입불가(매출액 1000억 초과)
    - 5 : 50인 이상

    응답코드
    - 200000 (성공)
    - 200020 (검색 결과 없음)
    - 200030 (온라인 가입대상 아님)
    - 400000 (유효성 체크 오류)
    `,
  })
  findQuestionList(@Request() req, @Query() query: SelectQuestionReqDto) {
    return this.planService.findQuestionList(query);
  }
}
