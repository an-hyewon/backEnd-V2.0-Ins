import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Render,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UrlReqDto } from './common/dto/url-req.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CommonService } from './common/common.service';
import { MailService } from './mail/mail.service';

@Controller()
@ApiTags('common')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    private readonly commonService: CommonService,
    private readonly mailService: MailService,
  ) {}

  // @Get('hello')
  // getHello(@Request() req): string {
  //   console.log('test2');
  //   console.log('ip', req.ip);
  //   console.log('ip remoteAddress', req.connection.remoteAddress);
  //   console.log('ip3', req.headers['x-forwarded-for']);
  //   console.log('ip4', req.get('x-forwarded-for'));
  //   const userAgent = req.get('user-agent') || '';
  //   console.log('userAgent', userAgent);
  //   console.log('session', req.session);
  //   console.log('params', req.params);
  //   console.log('body', req.body);
  //   console.log('query', req.query);
  //   console.log('headers', req.headers);
  //   console.log('referer', req?.headers?.referer);
  //   console.log('hosts', req.hostname);
  //   console.log('originalUrl', req.originalUrl);

  //   console.log('configService test ::::::', this.configService.get('DB_HOST'));
  //   return this.appService.getHello();
  // }

  // @Get('uid')
  // @ApiOperation({
  //   summary: 'UID 생성',
  //   description: `
  //   응답코드
  //   - 200000 (성공)
  //   `,
  // })
  // createUid(@Request() req) {
  //   return this.appService.createUid();
  // }

  // @Get('test')
  // @ApiOperation({
  //   summary: '',
  //   description: `
  //   응답코드
  //   - 200000 (성공)
  //   `,
  // })
  // test(@Request() req) {
  //   return this.appService.test();
  // }

  @Get('refer-idx')
  @ApiOperation({
    summary: 'referIdx 생성',
    description: `
    제일 처음 생성
    
    응답코드
    - 200000 (성공)
    `,
  })
  createReferIdx(@Request() req) {
    return this.appService.createReferIdx();
  }

  @Get('check-site')
  @ApiOperation({
    summary: '사이트 정보 조회',
    description: `
    응답코드
    - 200000 (성공)
    `,
  })
  findSiteInfo(@Request() req, @Query() query: UrlReqDto) {
    return this.appService.findSiteInfo(req, query);
  }

  // @Post('upload/excel')
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './uploads/excel', // 파일이 저장될 경로
  //       filename: (req, file, callback) => {
  //         const uniqueSuffix =
  //           Date.now() + '-' + Math.round(Math.random() * 1e9);
  //         const ext = extname(file.originalname);
  //         const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
  //         callback(null, filename);
  //       },
  //     }),
  //   }),
  // )
  // @ApiBody({
  //   required: true,
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       file: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //   },
  // })
  // @ApiOperation({
  //   summary: '엑셀 파일 등록 테스트',
  //   description: `
  //   응답코드
  //   `,
  // })
  // async uploadExcelTest(@UploadedFile() file: Express.Multer.File) {
  //   const filePath = file.path;
  //   console.log('filePath', filePath);
  //   const result = await this.commonService.readExcelFile(filePath);
  //   return { message: 'File processed successfully', result };
  // }

  // @Get('test/mail')
  // async readMailTest() {
  //   return await this.mailService.readMali();
  // }

  // @Get('test/excel-mail')
  // async sendExcelMailTest() {
  //   return await this.appService.sendExcelMailTest();
  // }

  @Get('send/ins-cost-notice/:joinId')
  @ApiParam({
    name: 'joinId',
    description: '가입 ID',
    required: true,
  })
  @ApiOperation({
    summary: '보험료 안내 알림톡 & 메일 발송',
    description: `
    응답코드
    - 200000 (성공)
    - 200020 (검색 결과 없음)
    - 400000 (유효성 체크 오류)
    `,
  })
  async sendPremCmptDoneNotice(@Param('joinId', ParseIntPipe) joinId: number) {
    return await this.appService.sendPremCmptDoneNotice(joinId);
  }
}
