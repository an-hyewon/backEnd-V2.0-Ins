import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Request,
  BadRequestException,
  ParseIntPipe,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JoinService } from './join.service';
import { CommonService } from 'src/common/common.service';
import { UpdateJoinReqDto } from './dto/update-join-req.dto';
import { UpdateJoinPaymentReqDto } from './dto/update-join-payment-req.dto';
import { SelectJoinListReqDto } from './dto/select-join-list-req.dto';
import { SelectJoinListDetailReqDto } from './dto/select-join-list-detail-req.dto';
import { CreateCcaliJoinReqDto } from './dto/create-ccali-join-req.dto';
import { UpdateCcaliJoinReqDto } from './dto/update-ccali-join-req.dto';
import { UploadSmeCertReqDto } from './dto/upload-ccali-sme-cert-req.dto';
import { CreatePdfFileReqDto } from './dto/create-pdf-file-req.dto';

@Controller('join')
@ApiTags('ins/join')
export class JoinController {
  constructor(
    private readonly joinService: JoinService,
    private readonly commonService: CommonService,
  ) {}

  @Get('file/:joinId')
  @ApiParam({
    name: 'joinId',
    description: '가입 ID',
    required: true,
  })
  @ApiOperation({
    summary: 'pdf파일 생성(질문서, RQ, 보험료 안내문)',
    description: `
    응답코드
    - 200000 (성공)
    - 200020 (검색 결과 없음)
    - 200011 (생성 실패)
    - 400000 (유효성 체크 오류)
    `,
  })
  createPdfFileTest(
    @Request() req,
    @Param('joinId', ParseIntPipe) joinId: number,
    @Query() query: CreatePdfFileReqDto,
  ) {
    return this.joinService.createPdfFile(req, joinId, query);
  }

  @Get('ins-join-file/:joinId')
  @ApiParam({
    name: 'joinId',
    description: '가입 ID',
    required: true,
  })
  @ApiOperation({
    summary: '가입확인서 생성',
    description: `
    응답코드
    - 200000 (성공)
    - 200020 (검색 결과 없음)
    - 200011 (생성 실패)
    - 400000 (유효성 체크 오류)
    `,
  })
  createInsJoinFile(
    @Request() req,
    @Param('joinId', ParseIntPipe) joinId: number,
  ) {
    return this.joinService.createInsJoinFile(req, joinId, null);
  }

  @Post('ins-stock-no/:joinId')
  @ApiParam({
    name: 'joinId',
    description: '가입 ID',
    required: true,
  })
  @ApiOperation({
    summary: '증권번호 발급',
    description: `
    응답코드
    - 201000 (성공)
    - 201020 (검색 결과 없음)
    - 201011 (발급 실패)
    - 201012 (가입 완료 되지 않음)
    - 400000 (유효성 체크 오류)
    `,
  })
  createInsStockNoAndMemberCd(
    @Request() req,
    @Param('joinId', ParseIntPipe) joinId: number,
  ) {
    return this.joinService.createInsStockNo(req, joinId);
  }

  @Post('list')
  @ApiOperation({
    summary: '가입 보험 내역 조회',
    description: `
    응답코드
    - 201000 (성공)
    - 201020 (검색 결과 없음)
    - 400000 (유효성 체크 오류)
    `,
  })
  getInsJoinList(@Request() req, @Body() body: SelectJoinListReqDto) {
    return this.joinService.getInsJoinList(req, body);
  }

  @Post('list/:joinId')
  @ApiParam({
    name: 'joinId',
    description: '가입 ID',
    required: true,
  })
  @ApiOperation({
    summary: '가입 보험 상세내역 조회',
    description: `
    응답코드
    - 201000 (성공)
    - 201010 (본인 정보가 아님)
    - 201020 (검색 결과 없음)
    - 400000 (유효성 체크 오류)
    `,
  })
  getInsJoinListDetail(
    @Request() req,
    @Param('joinId', ParseIntPipe) joinId: number,
    @Body() body: SelectJoinListDetailReqDto,
  ) {
    return this.joinService.getInsJoinListDetail(req, joinId, body);
  }

  @Post('upload/sme-cert')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/sme-cert', // 파일이 저장될 경로
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        joinId: {
          type: 'number',
        },
      },
    },
  })
  @ApiOperation({
    summary: '소기업 확인서 등록',
    description: `
    응답코드
    - 201000 (성공)
    - 201010 (업로드 대상 아님 - 우리카드 결제X)
    - 201020 (가입 내역 없음)
    - 400000 (유효성 체크 오류)
    `,
  })
  uploadCcaliSmeCert(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadSmeCertReqDto,
  ) {
    return this.joinService.uploadCcaliSmeCert(file, 'sme-cert', body.joinId);
  }

  @Post('')
  @ApiOperation({
    summary: '가입신청 정보 저장',
    description: `
    피보험자/계약자 정보 입력 페이지에서 "다음" 버튼 클릭 시 요청

    응답코드
    - 201000 (성공)
    - 201010 (가입 불가)
    - 201011 (저장 실패)
    - 201012 (중복 가입)
    - 201020 (검색 결과 없음)
    - 400000 (유효성 체크 오류)
    `,
  })
  createJoin(@Request() req, @Body() body: CreateCcaliJoinReqDto) {
    return this.joinService.createJoin(req, body);
  }

  @Put('/:joinId')
  @ApiParam({
    name: 'joinId',
    description: '가입 ID',
    required: true,
  })
  @ApiOperation({
    summary: '가입신청 정보 수정',
    description: `
    응답코드
    - 200000 (성공)
    - 200011 (저장 실패)
    - 200020 (검색 결과 없음)
    - 400000 (유효성 체크 오류)
    `,
  })
  updateJoin(
    @Request() req,
    @Param('joinId', ParseIntPipe) joinId: number,
    @Body() body: UpdateCcaliJoinReqDto,
  ) {
    return this.joinService.updateJoin(req, joinId, body);
  }

  @Patch('payment/:joinId')
  @ApiParam({
    name: 'joinId',
    description: '가입 ID',
    required: true,
  })
  @ApiOperation({
    summary: '가입신청 정보 업데이트(결제 결과)',
    description: `
    응답코드
    - 200000 (성공)
    - 200011 (저장 실패)
    - 200020 (검색 결과 없음)
    - 400000 (유효성 체크 오류)
    `,
  })
  updateJoinPayment(
    @Request() req,
    @Param('joinId', ParseIntPipe) joinId: number,
    @Body() body: UpdateJoinPaymentReqDto,
  ) {
    return this.joinService.updateJoinPayment(req, joinId, body);
  }

  @Patch(':joinId')
  @ApiParam({
    name: 'joinId',
    description: '가입 ID',
    required: true,
  })
  @ApiOperation({
    summary: '가입신청 정보 업데이트(본인인증 결과, 결제 수단)',
    description: `
    응답코드
    - 200000 (성공)
    - 200011 (저장 실패)
    - 200020 (검색 결과 없음)
    - 400000 (유효성 체크 오류)
    `,
  })
  updateJoinCertPayMethod(
    @Request() req,
    @Param('joinId', ParseIntPipe) joinId: number,
    @Body() body: UpdateJoinReqDto,
  ) {
    if (
      body.payMethod == null &&
      body.phCertLogsId == null &&
      body.phUniqueKey == null
    ) {
      throw new BadRequestException('Validation Failed(body)');
    } else if (body.phCertLogsId == null && body.phUniqueKey != null) {
      throw new BadRequestException('Validation Failed(phCertLogsId)');
    } else if (body.phCertLogsId != null && body.phUniqueKey == null) {
      throw new BadRequestException('Validation Failed(phUniqueKey)');
    }
    return this.joinService.updateJoinCertPayMethod(req, joinId, body);
  }
}
