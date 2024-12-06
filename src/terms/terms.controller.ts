import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TermsService } from './terms.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateTermAgreeLogsDto,
  CreateTermAgreeLogsReqDto,
  CreateTermReqDto,
} from './dto/req.dto';
import { UserInfo } from 'src/common/decorator/user-info.decorator';
import { SaveAgreeLogsReqDto } from './dto/save-agree-logs-req.dto';
import { UrlReqDto } from 'src/common/dto/url-req.dto';

@Controller('terms')
@ApiTags('terms')
export class TermsController {
  constructor(private readonly termsService: TermsService) {}

  // @Get()
  // @ApiOperation({
  //   summary: '약관 동의 내용 조회',
  //   description: `
  //   응답코드
  //   - 200000 (성공)
  //   - 200020 (결과 없음)
  //   `,
  // })
  // getTermsAgreeContent(@Request() req, @Query() query: UrlReqDto) {
  //   return this.termsService.getTermsAgree(req, query);
  // }

  // @Post('logs')
  // @ApiBody({ type: SaveAgreeLogsReqDto })
  // @ApiOperation({
  //   summary: '약관 동의 로그 저장',
  //   description: `
  //   응답코드
  //   - 201000 (성공)
  //   - 400000 (유효성 체크 오류)
  //   `,
  // })
  // async saveTermsAgreeLogs(@Request() req, @Body() data: SaveAgreeLogsReqDto) {
  //   const userAgent = req.get('user-agent') || '';
  //   console.log('logs data', data);

  //   return await this.termsService.saveTermsAgreeLogs({
  //     ...data,
  //     userAgent: userAgent,
  //     ipAddress:
  //       req.get('x-forwarded-for') || req.ip || req.connection.remoteAddress,
  //     referer: req?.headers?.referer || data?.referer,
  //   });
  // }
}
