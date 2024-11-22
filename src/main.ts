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
    .setTitle('보험 API 명세서')
    // .setDescription(
    //   `
    //   2024-08-20 수정사항
    //   - GET /api/v1/plan/cost 보상한도별 보험료 조회 및 보장내용 조회 수정
    //     - 요청 연간매출액 추가
    // `,
    // )
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
    .addTag('building', '건물')
    .addTag('ins/dsf-six', '풍수해6')
    // .addTag('ins/plan', '보험 플랜')
    // .addTag('ins/join', '보험 가입')
    // .addTag('ins/claim', '보험 사고접수')
    // .addTag('cert', '인증')
    // .addTag('pay', '결제')
    // .addTag('terms', '약관')
    // .addTag('sms', '문자')
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
