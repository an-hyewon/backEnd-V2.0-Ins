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
import { CertService } from './cert.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { SaveIamportPhoneCertLogsReqDto } from './dto/save-iamport-phone-cert-logs-req.dto';
import { SaveSecukitOneCertLogsReqDto } from './dto/save-secukit-one-cert-logs-req.dto';

@Controller('cert')
@ApiTags('cert')
export class CertController {
  constructor(private readonly certService: CertService) {}

  // @Get('iamport/get-token')
  // @ApiOperation({
  //   summary: '아임포트 토큰 발급',
  //   description: `
  //   응답코드
  //   - 200000 (성공)
  //   `,
  // })
  // getIamportToken(@Request() req) {
  //   return this.certService.getIamportToken();
  // }

  @Get('iamport/:impUid')
  @ApiParam({
    name: 'impUid',
    description: '포트원 인증 고유번호',
    required: true,
  })
  @ApiOperation({
    summary: '아임포트 본인인증 결과 조회',
    description: `
    응답코드
    - 200000 (성공)
    - 400000 (유효성 체크 오류)
    `,
  })
  getIamportCert(@Request() req, @Param('impUid') impUid: string) {
    return this.certService.getIamportCert(impUid.trim());
  }

  @Get('iamport/logs/:merchantUid')
  @ApiParam({
    name: 'merchantUid',
    description:
      '가맹점 주문번호(결제 위변조 대사 작업시 주문번호를 이용하여 검증)',
    required: true,
  })
  @ApiOperation({
    summary: '아임포트 본인인증 로그 조회',
    description: `
    응답코드
    - 200000 (성공)
    - 200010 (결과 없음)
    - 400000 (유효성 체크 오류)
    `,
  })
  getIamportCertLog(@Request() req, @Param('merchantUid') merchantUid: string) {
    return this.certService.getIamportCertLogs(merchantUid.trim());
  }

  @Post('iamport/logs')
  @ApiOperation({
    summary: '아임포트 본인인증 로그 저장',
    description: `
    응답코드
    - 200100 (성공)
    - 400000 (유효성 체크 오류)
    `,
  })
  createIamportCertLogs(
    @Request() req,
    @Body() body: SaveIamportPhoneCertLogsReqDto,
  ) {
    return this.certService.createIamportCertLogs(body);
  }

  @Get('secukit-one/logs/:athNo')
  @ApiParam({
    name: 'athNo',
    description:
      '가맹점 주문번호(결제 위변조 대사 작업시 주문번호를 이용하여 검증)',
    required: true,
  })
  @ApiOperation({
    summary: '공동인증 로그 조회',
    description: `
    응답코드
    - 200000 (성공)
    - 200010 (결과 없음)
    - 400000 (유효성 체크 오류)
    `,
  })
  getSecukitOneCertLog(@Request() req, @Param('athNo') athNo: string) {
    return this.certService.getSecukitOneCertLogs(athNo.trim());
  }

  @Post('secukit-one/logs')
  @ApiOperation({
    summary: '공동인증 로그 저장',
    description: `
    응답코드
    - 200100 (성공)
    - 400000 (유효성 체크 오류)
    `,
  })
  createSecukitOneCertLogs(
    @Request() req,
    @Body() body: SaveSecukitOneCertLogsReqDto,
  ) {
    return this.certService.createSecukitOneCertLogs(body);
  }
}
