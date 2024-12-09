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
      // 프로모션
      // 1.5ver
      'https://zeropay.insboon.com',
      'https://zerokakao.insboon.com',
      'https://zeroapp.insboon.com',
      'https://zeropaytm.insboon.com',
      'https://hanacard.insboon.com',
      'https://hanacard-zero.insboon.com',
      'https://hanacard-zerotm.insboon.com',
      'https://hanacard-semas.insboon.com',
      'https://niceinfo.insboon.com',
      'https://region.niceinfo.insboon.com',
      'https://ksnet.insboon.com',
      'https://ulsan.insboon.com',
      'https://dsf3.ulsan.insboon.com',
      'https://dsf6.ulsan.insboon.com',
      'https://dsf2.ulsan.insboon.com',
      'https://hwaseong.insboon.com',
      'https://dsf3.hwaseong.insboon.com',
      'https://dsf2.hwaseong.insboon.com',
      'https://dsf6.hwaseong.insboon.com',
      'https://uljin.insboon.com',
      'https://dsf2.uljin.insboon.com',
      'https://dsf6.uljin.insboon.com',
      'https://ikfa.insboon.com',
      'https://skplanet.insboon.com',
      'https://kfme.insboon.com',
      'https://cafe24.insboon.com',
      'https://pip2.cafe24.insboon.com',
      'https://tlc.cafe24.insboon.com',
      'https://pli.cafe24.insboon.com',
      'https://kakaopay.insboon.com',
      'https://accident.kakaopay.insboon.com',
      'https://dsf6.ryan.insboon.com',
      'https://dsf6.ryan-zero.insboon.com',
      'https://dsf6.ryan-ikfa.insboon.com',
      'https://dsf6.ryan-kfme.insboon.com',
      'https://dsf6.ryan-boon.insboon.com',
      'https://accident.ryan.insboon.com',
      'https://payco.insboon.com',

      // 2.0ver
      'https://intro.insboon.com',

      'https://admin2.insboon.com',

      'https://cert.insboon.com',
      'https://insboon.com',
      'https://www.insboon.com',
      'https://main.insboon.com',
      'https://mall.insboon.com',
      'https://dsf6.insboon.com',
      'https://dli.insboon.com',
      'https://mfli.insboon.com',
      'https://dsf3.insboon.com',
      'https://dsf2.insboon.com',
      'https://dsf6.www.insboon.com',
      'https://dli.www.insboon.com',
      'https://mfli.www.insboon.com',
      'https://dsf3.www.insboon.com',
      'https://dsf2.www.insboon.com',
      'https://dsf6.main.insboon.com',
      'https://dli.main.insboon.com',
      'https://mfli.main.insboon.com',
      'https://dsf3.main.insboon.com',
      'https://dsf2.main.insboon.com',

      // 인슈에이터
      'https://insuator-mall.insboon.com',
      'https://dsf3.insuator-mall.insboon.com',
      'https://dli.insuator-mall.insboon.com',
      'https://mfli.insuator-mall.insboon.com',
      'https://insuator-mall.insboon1.com',
      'https://dsf3.insuator-mall.insboon1.com',

      // 보온
      'https://dsf6.mall.insboon.com',
      'https://dli.mall.insboon.com',
      'https://mfli.mall.insboon.com',
      'https://dsf2.mall.insboon.com',
      'https://tlc.mall.insboon.com',
      'https://pip2.mall.insboon.com',
      'https://oti.mall.insboon.com',
      'https://otmi.mall.insboon.com',
      'https://dsf3.calc-mall.insboon.com',
      'https://dsf3.mall.insboon.com',
      'https://eali.mall.insboon.com',
      'https://ccali.mall.insboon.com',

      // 제로페이
      'https://zeropay-mall.insboon.com',
      'https://dsf6.zeropay-mall.insboon.com',
      'https://dli.zeropay-mall.insboon.com',
      'https://mfli.zeropay-mall.insboon.com',
      'https://oti.zeropay-mall.insboon.com',
      'https://otmi.zeropay-mall.insboon.com',
      'https://dsf3.zeropay-mall.insboon.com',
      'https://ccali.zeropay-mall.insboon.com',
      // 제로페이-제로페이앱
      'https://dsf6.zeropay-app-mall.insboon.com',

      // 소상공인연합회
      'https://kfme-mall.insboon.com',
      'https://dsf6.kfme-mall.insboon.com',
      'https://dli.kfme-mall.insboon.com',
      'https://mfli.kfme-mall.insboon.com',
      'https://oti.kfme-mall.insboon.com',
      'https://otmi.kfme-mall.insboon.com',
      'https://dsf3.kfme-mall.insboon.com',
      // 소상공인연합회-에이전시
      'https://kfme-agency-mall.insboon.com',
      'https://dsf6.kfme-agency-mall.insboon.com',
      'https://dli.kfme-agency-mall.insboon.com',
      'https://mfli.kfme-agency-mall.insboon.com',
      'https://oti.kfme-agency-mall.insboon.com',
      'https://otmi.kfme-agency-mall.insboon.com',
      'https://dsf3.kfme-agency-mall.insboon.com',

      // 전국아파트연합회
      'https://jay-mall.insboon.com',
      'https://dsf6.jay-mall.insboon.com',
      'https://dli.jay-mall.insboon.com',
      'https://mfli.jay-mall.insboon.com',
      'https://oti.jay-mall.insboon.com',
      'https://otmi.jay-mall.insboon.com',
      'https://dsf3.jay-mall.insboon.com',

      // 프랜차이즈협회
      'https://ikfa-mall.insboon.com',
      'https://dsf6.ikfa-mall.insboon.com',
      'https://dli.ikfa-mall.insboon.com',
      'https://mfli.ikfa-mall.insboon.com',
      'https://oti.ikfa-mall.insboon.com',
      'https://otmi.ikfa-mall.insboon.com',
      'https://dsf3.ikfa-mall.insboon.com',

      // 부산직능연합회
      'https://bpf-mall.insboon.com',
      'https://dsf6.bpf-mall.insboon.com',
      'https://dli.bpf-mall.insboon.com',
      'https://mfli.bpf-mall.insboon.com',
      'https://oti.bpf-mall.insboon.com',
      'https://otmi.bpf-mall.insboon.com',
      'https://dsf3.bpf-mall.insboon.com',

      // 보온-행정안전부
      'https://mois-mall.insboon.com',
      'https://dsf6.mois-mall.insboon.com',
      'https://dli.mois-mall.insboon.com',
      'https://mfli.mois-mall.insboon.com',
      'https://oti.mois-mall.insboon.com',
      'https://otmi.mois-mall.insboon.com',
      'https://dsf3.mois-mall.insboon.com',
      'https://ccali.mois-mall.insboon.com',

      // 보온-스페이스팟
      'https://spacepod-mall.insboon.com',
      'https://dsf6.spacepod-mall.insboon.com',
      'https://dli.spacepod-mall.insboon.com',
      'https://mfli.spacepod-mall.insboon.com',
      'https://oti.spacepod-mall.insboon.com',
      'https://otmi.spacepod-mall.insboon.com',
      'https://dsf3.spacepod-mall.insboon.com',
      'https://ccali.spacepod-mall.insboon.com',

      // 상상시장?
      'https://semas-mall.insboon.com',
      'https://dsf6.semas-mall.insboon.com',
      'https://dli.semas-mall.insboon.com',
      'https://mfli.semas-mall.insboon.com',
      'https://oti.semas-mall.insboon.com',
      'https://otmi.semas-mall.insboon.com',
      'https://dsf3.semas-mall.insboon.com',

      // 술오더
      'https://sulorder-mall.insboon.com',
      'https://dsf6.sulorder-mall.insboon.com',
      'https://dli.sulorder-mall.insboon.com',
      'https://mfli.sulorder-mall.insboon.com',
      'https://oti.sulorder-mall.insboon.com',
      'https://otmi.sulorder-mall.insboon.com',
      'https://dsf3.sulorder-mall.insboon.com',

      // 하나카드
      'https://hanacard-mall.insboon.com',
      'https://dsf6.hanacard-mall.insboon.com',
      'https://dli.hanacard-mall.insboon.com',
      'https://mfli.hanacard-mall.insboon.com',
      'https://oti.hanacard-mall.insboon.com',
      'https://otmi.hanacard-mall.insboon.com',
      'https://dsf3.hanacard-mall.insboon.com',

      // 부산은행
      'https://busanbank-mall.insboon.com',
      'https://dsf6.busanbank-mall.insboon.com',
      'https://dli.busanbank-mall.insboon.com',
      'https://mfli.busanbank-mall.insboon.com',
      'https://oti.busanbank-mall.insboon.com',
      'https://otmi.busanbank-mall.insboon.com',
      'https://dsf3.busanbank-mall.insboon.com',

      // 파란우산공제
      'https://insbiz-mall.insboon.com',
      'https://dsf6.insbiz-mall.insboon.com',
      'https://dli.insbiz-mall.insboon.com',
      'https://mfli.insbiz-mall.insboon.com',
      'https://kbiz-mall.insboon.com',
      'https://dsf6.kbiz-mall.insboon.com',
      'https://dli.kbiz-mall.insboon.com',
      'https://mfli.kbiz-mall.insboon.com',

      // 마린슈
      'https://marinshu-mall.insboon.com',
      'https://dsf6.marinshu-mall.insboon.com',
      'https://dli.marinshu-mall.insboon.com',
      'https://mfli.marinshu-mall.insboon.com',
      'https://oti.marinshu-mall.insboon.com',
      'https://otmi.marinshu-mall.insboon.com',
      'https://dsf3.marinshu-mall.insboon.com',
      'https://ccali.marinshu-mall.insboon.com',
      // 우리카드-마린슈
      'https://ccali.wooricard-marinshu-mall.insboon.com',

      // 기계건설설비공제회
      'https://dsf6.cig-main.insboon.com',
      'https://dsf6.cig-mall.insboon.com',
      // 전기공제조합
      'https://dsf6.ecfc-main.insboon.com',
      'https://dsf6.ecfc-mall.insboon.com',
      // 페이코
      'https://dsf6.payco-mall.insboon.com',
      // 정보통신공제조합
      'https://dsf6.icfc-mall.insboon.com',
      // 한국경비협회
      'https://dsf6.ksan-mall.insboon.com',
      // 차이나스토리
      'https://otmi.chinastory.insboon1.com',
      'https://oti.chinastory.insboon1.com',

      // 주택금융공사
      'https://hf.insboon.com',
      'https://dsf6.hf.insboon.com',
      'https://dsf2.hf.insboon.com',
      'https://hfesg.insboon.com',
      'https://dsf6.hfesg.insboon.com',
      'https://dsf2.hfesg.insboon.com',
      'https://hfesg-zero.insboon.com',
      'https://dsf6.hfesg-zero.insboon.com',
      'https://dsf2.hfesg-zero.insboon.com',
      'https://off-dsf2.hfesg.insboon.com',

      // 희망브리지
      'https://hope.insboon.com',
      'https://dsf2.hope.insboon.com',
      'https://dsf6.hope.insboon.com',
      'https://hope-zero.insboon.com',
      'https://dsf2.hope-zero.insboon.com',
      'https://dsf6.hope-zero.insboon.com',
      'https://dsf2.hope-boon.insboon.com',
      'https://dsf6.hope-boon.insboon.com',
      'https://dsf2.hope-hanacard.insboon.com',
      'https://dsf2.hope-agency.insboon.com',
      'https://dsf6.hope-agency.insboon.com',
      'https://dsf6.hope-hanacard.insboon.com',
      'https://off-dsf2.hope.insboon.com',

      // 제로페이-UIB
      'https://zeropay-uibbusan.insboon.com',
      'https://dsf6.zeropay-uibbusan.insboon.com',
      'https://dsf2.zeropay-uibbusan.insboon.com',
      'https://off-dsf2.zeropay-uibbusan.insboon1.com',
      'https://dsf6.zerokakao-uibbusan.insboon.com',
      'https://dsf2.zerokakao-uibbusan.insboon.com',

      // 행정안전부
      'https://dsf2.mois.insboon.com',

      // 한패스 여행자
      'https://ti.hanpass.insboon.com',
      // 롯데면세점 여행자
      'https://ti.lotte.insboon.com',
      // 펫(무료)
      'https://pi.pet.insboon.com',
      // 다태아 서울시
      'https://mbi.seoul.insboon.com',

      // myinsu
      'https://dsf6.myinsu-mall.insboon.com',
      'https://dsf3.myinsu-mall.insboon.com',
      'https://mfli.myinsu-mall.insboon.com',
      'https://dli.myinsu-mall.insboon.com',
      'https://otmi.myinsu-mall.insboon.com',
      'https://pip2.myinsu-mall.insboon.com',
      'https://tlc.myinsu-mall.insboon.com',

      // 우리카드
      'https://ccali.wooricard-mall.insboon.com',
      'https://wooricard.insboon.com',

      // SK M&S
      'https://skmnservice-mall.insboon.com',
      'https://dsf6.skmnservice-mall.insboon.com',
      'https://dli.skmnservice-mall.insboon.com',
      'https://mfli.skmnservice-mall.insboon.com',
      'https://tlc.skmnservice-mall.insboon.com',
      'https://pip2.skmnservice-mall.insboon.com',
      'https://oti.skmnservice-mall.insboon.com',
      'https://otmi.skmnservice-mall.insboon.com',
      'https://dsf3.skmnservice-mall.insboon.com',
      'https://ccali.skmnservice-mall.insboon.com',
      'https://pi-skmnservice.pet-together.co.kr',

      // 한국인슈하우징
      'https://kih-mall.insboon.com',
      'https://dsf3.kih-mall.insboon.com',
      'https://dli.kih-mall.insboon.com',
      'https://ccali.kih-mall.insboon.com',

      // 테스트
      // 1.5ver
      'https://frontend-nexsol-test-v1-5.web.app',
      'https://v15-frontend.firebaseapp.com',
      'http://v15-frontend.firebaseapp.com',
      'http://dev.15.insboon.com',
      'https://dev.15.insboon.com',
      'https://dev.16.insboon.com',
      'https://buildtest.insboon.com',
      'https://dev.zeropay.insboon.com',
      'https://dev.insboon.com',
      'https://dev.server.insboon.com',
      'https://test.test.insboon.com',
      'https://dev.front.insboon.com',
      'https://dev.zerokakao.insboon.com',
      'https://dev.dsf6-hwaseong.insboon.com',
      'https://dev.kfme.insboon.com',
      'https://dev.niceinfo.insboon.com',
      'https://dev.dsf6-ulsan.insboon.com',
      'https://dev.ikfa.insboon.com',
      'https://dev.skplanet.insboon.com',
      'https://dev.pip-cafe24.insboon.com',
      'https://dev.dsf2-hwaseong.insboon.com',
      'https://dev.dsf2-ulsan.insboon.com',
      'https://dev.kakaopay.insboon.com',
      'https://dev-pip2.cafe24.insboon.com',
      'https://dev2.kakaopay.insboon.com',
      'https://payment.zeropay.insboon.com',
      'https://dev.insboon.co.kr',
      'https://main2.insboon.com',
      'https://dev-kakaopay.insboon.com',
      'https://dev-dsf6.ryan.insboon.com',
      'https://dev-dsf6.ryan-zero.insboon.com',
      'https://dev-dsf6.ryan-ikfa.insboon.com',
      'https://dev-dsf6.ryan-kfme.insboon.com',
      'https://dev-dsf6.ryan-boon.insboon.com',
      'https://dev-accident.ryan.insboon.com',

      // 2.0ver
      'https://dev-insboon.com',
      'https://dev-www.insboon.com',
      'https://dev-main.insboon.com',
      'https://dev-mall.insboon.com',
      'https://dev-dsf6.insboon.com',
      'https://dev-dli.insboon.com',
      'https://dev-mfli.insboon.com',
      'https://dev-dsf3.insboon.com',
      'https://dev-dsf2.insboon.com',
      'https://dev-dsf6.www.insboon.com',
      'https://dev-dli.www.insboon.com',
      'https://dev-mfli.www.insboon.com',
      'https://dev-dsf3.www.insboon.com',
      'https://dev-dsf2.www.insboon.com',
      'https://dev-dsf6.main.insboon.com',
      'https://dev-dli.main.insboon.com',
      'https://dev-mfli.main.insboon.com',
      'https://dev-dsf3.main.insboon.com',
      'https://dev-dsf2.main.insboon.com',

      // 인슈에이터
      'https://dev-insuator-mall.insboon.com',
      'https://dev-dsf3.insuator-mall.insboon.com',
      'https://dev-dli.insuator-mall.insboon.com',
      'https://dev-mfli.insuator-mall.insboon.com',
      'https://dev.insuator-mall.insboon1.com',
      'https://dev-dsf3.insuator-mall.insboon1.com',

      // 보온
      'https://dev-dsf6.mall.insboon.com',
      'https://dev-dli.mall.insboon.com',
      'https://dev-mfli.mall.insboon.com',
      'https://dev-dsf2.mall.insboon.com',
      'https://dev-tlc.mall.insboon.com',
      'https://dev-pip2.mall.insboon.com',
      'https://dev-oti.mall.insboon.com',
      'https://dev-otmi.mall.insboon.com',
      'https://dev-dsf3.calc-mall.insboon.com',
      'https://dev-dsf3.mall.insboon1.com',
      'https://dev-eali.mall.insboon.com',
      'https://dev-ccali.mall.insboon1.com',

      // 제로페이
      'https://dev-zeropay-mall.insboon.com',
      'https://dev-dsf6.zeropay-mall.insboon.com',
      'https://dev-dli.zeropay-mall.insboon.com',
      'https://dev-mfli.zeropay-mall.insboon.com',
      'https://dev-oti.zeropay-mall.insboon.com',
      'https://dev-otmi.zeropay-mall.insboon.com',
      'https://dev-dsf3.zeropay-mall.insboon1.com',
      'https://dev-ccali.zeropay-mall.insboon1.com',
      // 제로페이-제로페이앱
      'https://dev-dsf6.zeropay-app-mall.insboon1.com',

      // 소상공인연합회
      'https://dev-kfme-mall.insboon.com',
      'https://dev-dsf6.kfme-mall.insboon.com',
      'https://dev-dli.kfme-mall.insboon.com',
      'https://dev-mfli.kfme-mall.insboon.com',
      'https://dev-oti.kfme-mall.insboon.com',
      'https://dev-otmi.kfme-mall.insboon1.com',
      'https://dev-dsf3.kfme-mall.insboon1.com',
      // 소상공인연합회-에이전시
      'https://dev-kfme-agency-mall.insboon.com',
      'https://dev-dsf6.kfme-agency-mall.insboon.com',
      'https://dev-dli.kfme-agency-mall.insboon.com',
      'https://dev-mfli.kfme-agency-mall.insboon.com',
      'https://dev-oti.kfme-agency-mall.insboon.com',
      'https://dev-otmi.kfme-agency-mall.insboon1.com',
      'https://dev-dsf3.kfme-agency-mall.insboon1.com',

      // 전국아파트연합회
      'https://dev-jay-mall.insboon.com',
      'https://dev-dsf6.jay-mall.insboon.com',
      'https://dev-dli.jay-mall.insboon.com',
      'https://dev-mfli.jay-mall.insboon.com',
      'https://dev-oti.jay-mall.insboon.com',
      'https://dev-otmi.jay-mall.insboon1.com',
      'https://dev-dsf3.jay-mall.insboon1.com',

      // 프랜차이즈협회
      'https://dev-ikfa-mall.insboon.com',
      'https://dev-dsf6.ikfa-mall.insboon.com',
      'https://dev-dli.ikfa-mall.insboon.com',
      'https://dev-mfli.ikfa-mall.insboon.com',
      'https://dev-oti.ikfa-mall.insboon.com',
      'https://dev-otmi.ikfa-mall.insboon.com',
      'https://dev-dsf3.ikfa-mall.insboon1.com',

      // 부산직능연합회
      'https://dev-bpf-mall.insboon.com',
      'https://dev-dsf6.bpf-mall.insboon.com',
      'https://dev-dli.bpf-mall.insboon.com',
      'https://dev-mfli.bpf-mall.insboon.com',
      'https://dev-oti.bpf-mall.insboon.com',
      'https://dev-otmi.bpf-mall.insboon1.com',
      'https://dev-dsf3.bpf-mall.insboon1.com',

      // 보온-행정안전부
      'https://dev-mois-mall.insboon.com',
      'https://dev-dsf6.mois-mall.insboon.com',
      'https://dev-dli.mois-mall.insboon.com',
      'https://dev-mfli.mois-mall.insboon.com',
      'https://dev-oti.mois-mall.insboon.com',
      'https://dev-otmi.mois-mall.insboon1.com',
      'https://dev-dsf3.mois-mall.insboon1.com',
      'https://dev-ccali.mois-mall.insboon1.com',

      // 보온-스페이스팟
      'https://dev-spacepod-mall.insboon1.com',
      'https://dev-dsf6.spacepod-mall.insboon1.com',
      'https://dev-dli.spacepod-mall.insboon1.com',
      'https://dev-mfli.spacepod-mall.insboon1.com',
      'https://dev-oti.spacepod-mall.insboon1.com',
      'https://dev-otmi.spacepod-mall.insboon1.com',
      'https://dev-dsf3.spacepod-mall.insboon1.com',
      'https://dev-ccali.spacepod-mall.insboon1.com',

      // 상상시장?
      'https://dev-semas-mall.insboon.com',
      'https://dev-dsf6.semas-mall.insboon.com',
      'https://dev-dli.semas-mall.insboon.com',
      'https://dev-mfli.semas-mall.insboon.com',
      'https://dev-oti.semas-mall.insboon.com',
      'https://dev-otmi.semas-mall.insboon.com',
      'https://dev-dsf3.semas-mall.insboon1.com',

      // 술오더
      'https://dev-sulorder-mall.insboon.com',
      'https://dev-dsf6.sulorder-mall.insboon.com',
      'https://dev-dli.sulorder-mall.insboon.com',
      'https://dev-mfli.sulorder-mall.insboon.com',
      'https://dev-oti.sulorder-mall.insboon.com',
      'https://dev-otmi.sulorder-mall.insboon.com',
      'https://dev-dsf3.sulorder-mall.insboon1.com',

      // 하나카드
      'https://dev-hanacard-mall.insboon.com',
      'https://dev-dsf6.hanacard-mall.insboon.com',
      'https://dev-dli.hanacard-mall.insboon.com',
      'https://dev-mfli.hanacard-mall.insboon.com',
      'https://dev-oti.hanacard-mall.insboon.com',
      'https://dev-otmi.hanacard-mall.insboon.com',
      'https://dev-dsf3.hanacard-mall.insboon1.com',

      // 부산은행
      'https://dev-busanbank-mall.insboon.com',
      'https://dev-dsf6.busanbank-mall.insboon.com',
      'https://dev-dli.busanbank-mall.insboon.com',
      'https://dev-mfli.busanbank-mall.insboon.com',
      'https://dev-oti.busanbank-mall.insboon.com',
      'https://dev-otmi.busanbank-mall.insboon.com',
      'https://dev-dsf3.busanbank-mall.insboon1.com',

      // 파란우산공제
      'https://dev-insbiz-mall.insboon.com',
      'https://dev-dsf6.insbiz-mall.insboon.com',
      'https://dev-dli.insbiz-mall.insboon.com',
      'https://dev-mfli.insbiz-mall.insboon.com',
      'https://dev-kbiz-mall.insboon.com',
      'https://dev-dsf6.kbiz-mall.insboon.com',
      'https://dev-dli.kbiz-mall.insboon.com',
      'https://dev-mfli.kbiz-mall.insboon.com',
      'https://dev-dsf6.kbiz-mall.insboon1.com',
      'https://dev2-dsf6.kbiz-mall.insboon1.com',

      // 마린슈
      'https://dev-marinshu-mall.insboon1.com',
      'https://dev-dsf6.marinshu-mall.insboon1.com',
      'https://dev-dli.marinshu-mall.insboon1.com',
      'https://dev-mfli.marinshu-mall.insboon1.com',
      'https://dev-oti.marinshu-mall.insboon1.com',
      'https://dev-otmi.marinshu-mall.insboon1.com',
      'https://dev-dsf3.marinshu-mall.insboon1.com',
      'https://dev-ccali.marinshu-mall.insboon1.com',
      // 우리카드-마린슈
      'https://dev-ccali.wooricard-marinshu-mall.insboon1.com',

      // 기계건설설비공제회
      'https://dev-dsf6.cig-main.insboon.com',
      'https://dev-dsf6.cig-mall.insboon.com',
      // 전기공제조합
      'https://dev-dsf6.ecfc-main.insboon.com',
      'https://dev-dsf6.ecfc-mall.insboon.com',
      // 페이코
      'https://dev-dsf6.payco-mall.insboon.com',
      // 정보통신공제조합
      'https://dev-dsf6.icfc-mall.insboon.com',
      // 한국경비협회
      'https://dev-dsf6.ksan-mall.insboon.com',
      // 차이나스토리
      'https://dev-otmi.chinastory.insboon1.com',
      'https://dev-oti.chinastory.insboon1.com',

      // 주택금융공사
      'https://dev-hf.insboon.com',
      'https://dev-dsf6.hf.insboon.com',
      'https://dev-dsf2.hf.insboon.com',
      'https://dev-hfesg.insboon.com',
      'https://dev-dsf6.hfesg.insboon.com',
      'https://dev-dsf2.hfesg.insboon.com',
      'https://dev-hfesg-zero.insboon.com',
      'https://dev-dsf6.hfesg-zero.insboon.com',
      'https://dev-dsf2.hfesg-zero.insboon.com',
      'https://dev-off-dsf2.hfesg.insboon.com',

      // 희망브리지
      'https://dev-hope.insboon.com',
      'https://dev-dsf2.hope.insboon.com',
      'https://dev-dsf6.hope.insboon.com',
      'https://dev-hope-zero.insboon.com',
      'https://dev-dsf2.hope-zero.insboon.com',
      'https://dev-dsf6.hope-zero.insboon.com',
      'https://dev-dsf2.hope-boon.insboon.com',
      'https://dev-dsf6.hope-boon.insboon.com',
      'https://dev-dsf2.hope-hanacard.insboon.com',
      'https://dev-dsf2.hope-agency.insboon.com',
      'https://dev-dsf6.hope-agency.insboon.com',
      'https://dev-off-dsf2.hope.insboon.com',

      // 제로페이-UIB
      'https://dev.zeropay-uibbusan.insboon1.com',
      'https://dev-dsf6.zeropay-uibbusan.insboon1.com',
      'https://dev-dsf2.zeropay-uibbusan.insboon1.com',
      'https://dev-dsf6.zerokakao-uibbusan.insboon1.com',
      'https://dev-dsf2.zerokakao-uibbusan.insboon1.com',

      // 행정안전부
      'https://dev-dsf2.mois.insboon1.com',

      // 한패스 여행자
      'https://dev-ti.hanpass.insboon.com',
      // 롯데면세점 여행자
      'https://dev-ti.lotte.insboon.com',
      // 펫(무료)
      'https://dev-pi.pet.insboon.com',
      // 다태아 서울시
      'https://dev-mbi.seoul.insboon.com',

      // myinsu
      'https://dev-dsf6.myinsu-mall.insboon1.com',
      'https://dev-dsf3.myinsu-mall.insboon1.com',
      'https://dev-mfli.myinsu-mall.insboon1.com',
      'https://dev-dli.myinsu-mall.insboon1.com',
      'https://dev-otmi.myinsu-mall.insboon1.com',
      'https://dev-pip2.myinsu-mall.insboon1.com',
      'https://dev-tlc.myinsu-mall.insboon1.com',

      // 우리카드
      'https://dev-wooricard.insboon1.com',

      // SK M&S
      'https://dev-skmnservice-mall.insboon1.com',
      'https://dev-dsf6.skmnservice-mall.insboon1.com',
      'https://dev-dli.skmnservice-mall.insboon1.com',
      'https://dev-mfli.skmnservice-mall.insboon1.com',
      'https://dev-tlc.skmnservice-mall.insboon1.com',
      'https://dev-pip2.skmnservice-mall.insboon1.com',
      'https://dev-oti.skmnservice-mall.insboon1.com',
      'https://dev-otmi.skmnservice-mall.insboon1.com',
      'https://dev-dsf3.skmnservice-mall.insboon1.com',
      'https://dev-ccali.skmnservice-mall.insboon1.com',
      'https://dev-pi-skmnservice.pet-together.co.kr',

      // 한국인슈하우징
      'https://dev-kih-mall.insboon1.com',
      'https://dev-dsf3.kih-mall.insboon1.com',
      'https://dev-dli.kih-mall.insboon1.com',
      'https://dev-ccali.kih-mall.insboon1.com',

      // kspay
      'https://kspay.ksnet.to',
      'http://kspay.ksnet.to',

      // insboon.nexsol.ai
      'https://insboon.nexsol.ai',
      'http://insboon.nexsol.ai',

      // 로컬
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
      'http://localhost:5500',
      'http://localhost:8888',
      'http://localhost:21014',

      'https://localhost:3000',
      'https://localhost:3001',
      'https://map.nexsol.ai',
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
