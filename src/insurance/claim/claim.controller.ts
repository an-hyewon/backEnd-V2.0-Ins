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
  ParseIntPipe,
} from '@nestjs/common';
import { ClaimService } from './claim.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ClaimAvailableCheckReqDto } from './dto/claim-available-check-req.dto';
import { createCcaliClaimReqDto } from './dto/create-ccali-claim-req.dto';

@Controller('claim')
@ApiTags('ins/claim')
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}

  @Get('/check')
  @ApiOperation({
    summary: '사고접수 가능 여부 체크',
    description: `
    사고접수 내역 있으면 사고접수 내용 응답

    응답코드
    - 200000 (성공)
    - 200001 (사고접수 내역 있음)
    - 200010 (사고접수 불가)
    - 200020 (검색 결과 없음)
    - 400000 (유효성 체크 오류)
    `,
  })
  checkAvailableClaim(
    @Request() req,
    @Query() query: ClaimAvailableCheckReqDto,
  ) {
    return this.claimService.checkAvailableClaim(query);
  }

  @Post('')
  @ApiOperation({
    summary: '사고접수 정보 저장',
    description: `
    응답코드
    - 201000 (성공)
    - 201011 (저장 실패)
    - 400000 (유효성 체크 오류)
    `,
  })
  createClaim(@Request() req, @Body() body: createCcaliClaimReqDto) {
    return this.claimService.createClaim(req, body);
  }
}
