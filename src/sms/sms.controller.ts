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
} from '@nestjs/common';
import { SmsService } from './sms.service';
import { SendSmsReqDto } from './dto/send-sms-req.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SelectSmsContentReqDto } from './dto/select-sms-content-req.dto';
import { SendAlimtalkReqDto } from './dto/send-alimtalk-req.dto';
import { SendSmsCodeReqDto } from './dto/send-sms-code-req.dto';
import { CommonService } from 'src/common/common.service';

@Controller('sms')
@ApiTags('sms')
export class SmsController {
  constructor(
    private readonly smsService: SmsService,
    private readonly commonService: CommonService,
  ) {}

  @Post('send/alimtalk/boon')
  @ApiOperation({
    summary: '보온 알림톡 발송',
    description: `
    응답코드
    - 201000 (성공)
    - 201010 (발송 실패)
    - 400000 (유효성 체크 오류)
    `,
  })
  async sendKakaoAlimtalk(@Request() req, @Body() body: SendAlimtalkReqDto) {
    return this.commonService.sendKakaoAlimtalk(body);
  }

  // @Post('send-code')
  // @ApiOperation({
  //   summary: '문자 인증번호 발송',
  //   description: `
  //   응답코드
  //   - 201000 (성공)
  //   - 201010 (발송 실패)
  //   - 400000 (유효성 체크 오류)
  //   `,
  // })
  // async sendSmsCode(@Request() req, @Body() body: SendSmsCodeReqDto) {
  //   return this.smsService.sendSmsCode(body);
  // }

  // @Post('send')
  // @ApiOperation({
  //   summary: '문자 발송',
  //   description: `
  //   응답코드
  //   - 201000 (성공)
  //   - 201010 (발송 실패)
  //   - 400000 (유효성 체크 오류)
  //   `,
  // })
  // async sendSms(@Request() req, @Body() body: SendSmsReqDto) {
  //   return this.commonService.sendSms(body);
  // }

  // @Post('alimtalk-template')
  // @ApiOperation({
  //   summary: '알림톡 템플릿 업데이트',
  //   description: `
  //   응답코드
  //   - 201000 (성공)
  //   - 400000 (유효성 체크 오류)
  //   `,
  // })
  // async updateAlimtalkTemplate(@Request() req) {
  //   return this.smsService.updateAlimtalkTemplate();
  // }

  // @Post('kakao-test')
  // @ApiOperation({
  //   summary: '테스트 발송',
  //   description: `
  //   응답코드
  //   - 201000 (성공)
  //   - 201010 (발송 실패)
  //   - 400000 (유효성 체크 오류)
  //   `,
  // })
  // async sendSmsTest(@Request() req, @Body() body: any) {
  //   return this.smsService.sendSmsTest(body);
  // }
}
