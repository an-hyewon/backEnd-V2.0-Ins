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
  Res,
  Render,
  HttpStatus,
} from '@nestjs/common';
import { PayService } from './pay.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { RequestPaymentNicepayReqDto } from './dto/request-payment-nicepay-req.dto';
import { AuthPaymentNicepayReqDto } from './dto/auth-payment-nicepay-req.dto';
import { CancelPaymentNicepayReqDto } from './dto/cancel-payment-nicepay-req.dto';
import { FindCardBinReqDto } from './dto/find-card-bin-req.dto';

@Controller('pay')
@ApiTags('pay')
export class PayController {
  constructor(private readonly payService: PayService) {}

  // @Get('nicepay/get-token')
  // @ApiOperation({
  //   summary: '나이스페이 토큰 발급',
  //   description: `
  //   응답코드
  //   - 200000 (성공)
  //   `,
  // })
  // getNicepayToken(@Request() req) {
  //   return this.payService.getNicepayToken();
  // }

  @Get('nicepay/logs/:moid')
  @ApiParam({
    name: 'moid',
    description: '상점주문번호',
    required: true,
  })
  @ApiOperation({
    summary: '나이스페이 결제 결과 로그 조회',
    description: `
    응답코드
    - 200000 (성공)
    - 200010 (결과 없음)
    - 400000 (유효성 체크 오류)
    `,
  })
  async getNicepayPayLogs(@Request() req, @Param('moid') moid: string) {
    return await this.payService.getNicepayPayLogs(moid.trim());
  }

  @Post('nicepay/cancel')
  @ApiOperation({
    summary: '나이스페이 결제 취소',
    description: `
    응답코드
    - 201000 (성공)
    - 201010 (결제 실패)
    - 400000 (유효성 체크 오류)
    `,
  })
  async requestPaymentCancelNicepay(
    @Request() req,
    @Body() body: CancelPaymentNicepayReqDto,
  ) {
    return await this.payService.requestCancelPaymentNicepay(req, body);
  }

  @Post('nicepay/mobile')
  @ApiOperation({
    summary: '나이스페이 결제 승인(모바일)',
    description: `
    응답코드
    - 201000 (성공)
    - 201010 (결제 실패)
    - 400000 (유효성 체크 오류)
    `,
  })
  async requestAuthPaymentNicepayMobile(
    @Request() req,
    @Body() body: AuthPaymentNicepayReqDto,
    @Res() res: Response,
  ) {
    const nicepay = await this.payService.requestAuthPaymentNicepay(req, body);
    console.log('nicepay mobile', nicepay);
    const url = nicepay.result.pay;
    // return res.redirect(HttpStatus.PERMANENT_REDIRECT, url);
    return res.redirect(HttpStatus.FOUND, url);
  }

  @Post('nicepay/pc')
  @ApiOperation({
    summary: '나이스페이 결제 승인(PC)',
    description: `
    응답코드
    - 201000 (성공)
    - 201010 (결제 실패)
    - 400000 (유효성 체크 오류)
    `,
  })
  async requestAuthPaymentNicepayPc(
    @Request() req,
    @Body() body: AuthPaymentNicepayReqDto,
  ) {
    return await this.payService.requestAuthPaymentNicepay(req, body);
  }

  // @Post('nicepay/request')
  // @Render('pay-request')
  // @ApiOperation({
  //   summary: '결제요청 ejs',
  //   description: `
  //   응답코드
  //   - 201000 (성공)
  //   - 201010 (요청 실패)
  //   - 400000 (유효성 체크 오류)
  //   `,
  // })
  // async reqNicepayPayment(
  //   @Request() req,
  //   @Body() body: RequestPaymentNicepayReqDto,
  //   @Res() res: Response,
  // ) {
  //   return await this.payService.reqNicepayPayment(req, body, res);
  // }

  // @Get('ejs/test')
  // @ApiOperation({
  //   summary: '결제요청 ejs',
  //   description: `
  //   응답코드
  //   - 201000 (성공)
  //   - 201010 (요청 실패)
  //   - 400000 (유효성 체크 오류)
  //   `,
  // })
  // async readEjsFile(@Query('filename') filename: string) {
  //   return await this.payService.readEjsFile(filename);
  // }
}
