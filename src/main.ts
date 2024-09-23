import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { join } from 'path';
import helmet from 'helmet';
import * as dayjs from 'dayjs';
import * as express from 'express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exception/http-exception.filter';
import { AllExceptionFilter } from './common/exception/all-exeption.filter';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { VersionRedirectMiddleware } from './common/version/version-redirect.middleware';
import { PlanModule } from './insurance/plan/plan.module';

declare const module: any; // Hot Reload

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  app.setGlobalPrefix('api'); // 전역 경로 접두어

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // 한국 타임존으로 기본셋팅
  const timezone = require('dayjs/plugin/timezone');
  const utc = require('dayjs/plugin/utc');
  const duration = require('dayjs/plugin/duration');
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(duration);

  // app.useStaticAssets(join(__dirname, '..', 'public')); // 정적파일 기본경로를 설정
  // app.setBaseViewsDir(join(__dirname, '..', './views')); // 뷰 파일 기본경로 설정
  // app.setViewEngine('hbs'); // 뷰 엔진  -- hbs, ejs..

  // EJS 설정
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  /** swagger **/
  const swaggerOptionsV1 = new DocumentBuilder()
    .setTitle('보온 중대재해 API 명세서')
    // .setDescription(
    //   `
    //   2024-06-25 수정사항
    //   - GET /api/plan/coverage-limit-default 매출액 대비 보상한도 기본값 추가
    //   - GET /api/plan/cost 보상한도별 보험료 조회 추가
    //   - GET /api/cert/iamport/:impUid 아임포트 본인인증 결과 조회 추가
    //   - GET /api/cert/iamport/logs/:merchantUid 아임포트 본인인증 로그 조회 추가
    //   - POST /api/cert/iamport/logs 아임포트 본인인증 로그 저장 추가

    //   2024-06-26 수정사항
    //   - POST /api/join 가입신청 정보 저장 추가
    //   - GET /api/refer-idx referIdx 생성 추가

    //   2024-06-27 수정사항
    //   - PATCH /api/join/:joinId 가입신청 정보 업데이트(본인인증 결과, 결제 수단) 추가
    //   - PATCH /api/join/payment/:joinId 가입신청 정보 업데이트(결제 결과) 추가
    //   - GET /api/pay/nicepay/logs/:moid 나이스페이 결제 결과 로그 조회 추가
    //   - POST /api/pay/nicepay/mobile 나이스페이 결제 승인(모바일) 추가
    //   - POST /api/pay/nicepay/pc 나이스페이 결제 승인(PC) 추가
    //   - POST /api/cert/secukit-one/logs 공동인증 로그 저장 추가
    //   - POST /api/join/ins-stock-no/:joinId 증권번호 발급 추가
    //   - POST /api/join/list 가입 보험 내역 조회 추가
    //   - POST /api/join/ins-join-file/:joinId 가입확인서 생성 추가
    //   - GET /api/claim/check/:joinId 사고접수 가능 여부 체크 추가
    //   - POST /api/claim 사고접수 정보 저장 추가

    //   2024-06-28 수정사항
    //   - PUT /api/join/:joinId 가입신청 정보 수정 추가
    //   - GET /api/claim/check 사고접수 가능 여부 체크 수정
    //     - 파라미터 수정
    //   - GET /api/check-site 사이트 정보 조회 추가
    //   - POST /api/sms/send 문자 발송 추가
    //   - GET /api/plan/biz-type/list 업종 전체 목록 추가
    //   - GET /api/plan/biz-type 업종 매칭 추가

    //   2024-07-01 수정사항
    //   - GET /api/plan/check-biz-no 사업자정보 조회 추가
    //   - GET /api/plan/check-biz-type 업종 가입 가능 여부 체크 추가
    //   - GET /api/terms 약관 동의 내용 조회 추가
    //   - POST /api/terms/logs 약관 동의 로그 저장 추가
    //   - GET /api/plan/cost 보상한도별 보험료 조회 수정
    //     - 보장내용 조회 추가

    //   2024-07-05 수정사항
    //   - POST /api/join/upload/sme-cert 소기업 확인서 등록 추가

    //   2024-07-08 수정사항
    //   - POST /api/sms/send/alimtalk 알림톡 발송 추가
    //   - POST /api/sms/send-code 문자 인증번호 발송 추가

    //   2024-07-09 수정사항
    //   - GET /api/cert/secukit-one/logs/:athNo 공동인증 로그 조회 추가

    //   2024-07-10 수정사항
    //   - POST /api/pay/nicepay/cancel 나이스페이 결제 취소 추가

    //   2024-07-29 수정사항
    //   - api url version 추가
    //   - GET /api/v1/pay/check-biz-type 업종 가입 가능 여부 체크 수정
    //     - 요청 총 근로자수(선택), 연간매출액(선택) 추가
    //     - 응답 수정

    //   2024-07-30 수정사항
    //   - GET /api/v1/plan/question/list 질문서 내용 조회 추가
    //   - GET /api/v1/plan/cost 보상한도별 보험료 조회 및 보장내용 조회 수정
    //     - 요청 플랜ID 추가
    //     - 응답코드 추가
    //   - POST /api/v1/join 가입신청 정보 저장, PUT /api/v1/join/:joinId 가입신청 정보 수정 수정
    //     - 요청 피보험자 법인등록번호, 국적, 설립일, 연인금 총액 추가
    //     - 요청 매출액 1000억원 제한 삭제
    //     - 요청 근로자수 49인 이하 제한 삭제
    //     - 요청 보험시작일시, 보험만료일시 필수 -> 선택

    //   2024-07-31 수정사항
    //   - GET /api/v1/pay/check-biz-type 업종 가입 가능 여부 체크 수정
    //     - 응답 보상한도 수정
    //   - POST /api/v1/join 가입신청 정보 저장, PUT /api/v1/join/:joinId 가입신청 정보 수정 수정
    //     - 요청 질문서 답변 추가
    //     - 요청 자회사 가입여부, 자회사 담보 목록 추가
    // `,
    // )
    .setDescription(
      `
      2024-08-20 수정사항
      - GET /api/v1/plan/cost 보상한도별 보험료 조회 및 보장내용 조회 수정
        - 요청 연간매출액 추가
    `,
    )
    .setVersion('1.0.0')
    //JWT 토큰 설정
    // .addBearerAuth(
    //   {
    //     type: 'http',
    //     scheme: 'bearer',
    //     name: 'JWT',
    //     in: 'header',
    //   },
    //   'accessToken',
    // )
    // .addBearerAuth(
    //   {
    //     type: 'http',
    //     scheme: 'bearer',
    //     name: 'JWT',
    //     in: 'header',
    //   },
    //   'refreshToken',
    // )
    .addTag('ins/plan', '보험 플랜')
    .addTag('ins/join', '보험 가입')
    .addTag('ins/claim', '보험 사고접수')
    .addTag('cert', '인증')
    .addTag('pay', '결제')
    .addTag('terms', '약관')
    .addTag('sms', '문자')
    .addTag('common', '공통')
    .build();

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      defaultModelsExpandDepth: -1, // Schemas disable
    },
  };
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptionsV1);
  SwaggerModule.setup('api-docs', app, swaggerDocument, customOptions);
  /** swagger **/

  /** app 보안 **/
  app.use(
    helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }),
  );
  app.enableCors({
    origin: [
      // 운영계
      'https://ccali.mall.insboon.com',

      // 우리카드
      'https://ccali.wooricard-mall.insboon.com',
      'https://wooricard.insboon.com',
      // 우리카드-마린슈
      'https://ccali.wooricard-marinshu-mall.insboon.com',

      // SK M&S
      'https://ccali.skmnservice-mall.insboon.com',

      // 개발계
      'https://dev-ccali.mall.insboon1.com',

      // 우리카드
      'https://dev-wooricard.insboon.com',
      // 우리카드-마린슈
      'https://dev-ccali.wooricard-marinshu-mall.insboon1.com',

      // SK M&S
      'https://dev-ccali.skmnservice-mall.insboon1.com',

      'http://127.0.0.1:5173',
      'http://127.0.0.1:4173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:3004',
      'http://localhost:3005',
      'http://localhost:3006',
      'http://localhost:3007',
      'http://localhost:3080',
      'http://localhost:3101',
      'http://localhost:4320',
      'http://localhost:5173',
      'https://localhost:3000',
      'https://localhost:3001',
      'http://localhost:5500',
      'http://localhost:20011',

      // 어드민
    ], // 특정 오리진만 허용
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // 허용할 HTTP 메소드
    credentials: true, // Credential 정보를 포함한 요청 허용
  }); // CORS(Cross-Origin Resource Sharing)는 다른 도메인에서 리소스를 요청
  /** app 보안 **/

  app.useBodyParser('json', { limit: '100mb' });

  app.useGlobalFilters(new HttpExceptionFilter()); // http 예외필터 전역 등록

  // const httpAdapter = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new AllExceptionFilter(httpAdapter)); // 전체 예외필터 전역등록

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 객체를 DTO 인스턴스로 변환
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true, // 클래스 변환기 옵션 활성화
      },
    }),
  );

  app.set('trust proxy', true); // 프록시 홉 수에 따라 숫자를 설정

  // main.ts에서 전역적으로 사용 설정
  app.useGlobalInterceptors(new TransformInterceptor());
  app.use(new VersionRedirectMiddleware().use); // 버전 누락된 경우 v1로 자동 변경

  dayjs();

  const configService = app.get<ConfigService>(ConfigService);

  const PORT = configService.get<number>('PORT');
  const HOST = configService.get<string>('HOST');
  await app.listen(PORT); // application 기본 포트 설정
  console.log(`Server is running on ${PORT} (${HOST})`);

  /** Hot Reload **/
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  /** Hot Reload **/
}
bootstrap();
