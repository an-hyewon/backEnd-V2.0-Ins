import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from './common/logger/logger.middleware';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from './common/pipe/validation.pipe';
import { TermsModule } from './terms/terms.module';
import { ClientLog } from './common/entities/client-log.entity';
import { LoggingInterceptor } from './common/interceptor/logging.interceptor';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PayModule } from './pay/pay.module';
import { CertModule } from './cert/cert.module';
import { SmsModule } from './sms/sms.module';
import { JoinModule } from './insurance/join/join.module';
import { PlanModule } from './insurance/plan/plan.module';
import { CommonModule } from './common/common.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ClaimModule } from './insurance/claim/claim.module';
import express from 'express';
import { FilesMiddleware } from './common/files/files.middleware';
import { MailModule } from './mail/mail.module';
import { CcaliJoin } from './insurance/join/entities/ccali-join.entity';

/**
 *  Life Cycle ( MiddleWare > Guard > Interceptor > pipe > [ Controller > Service ] > Interceptor > ExceptionFilter )
 **/
@Module({
  imports: [
    ServeStaticModule.forRoot(
      {
        rootPath: join(__dirname, '..', 'uploads'), // 정적 파일 경로 설정
        serveRoot: '/uploads', // 정적 파일을 제공할 경로 설정
      },
      {
        rootPath: join(__dirname, '..', 'uploads/sign'),
        serveRoot: '/uploads/sign',
      },
      {
        rootPath: join(__dirname, '..', 'uploads/sign/join'),
        serveRoot: '/uploads/sign/join',
      },
      {
        rootPath: join(__dirname, '..', 'html'),
        serveRoot: '/html',
      },
      {
        rootPath: join(__dirname, '..', 'public'),
        serveRoot: '/public',
      },
      {
        rootPath: join(__dirname, '..', 'public'),
      },
    ),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `src/common/config/env/.${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: true,
    }),
    TypeOrmModule.forFeature([ClientLog, CcaliJoin]),
    ScheduleModule.forRoot(),
    CommonModule,
    TasksModule,
    JoinModule,
    TermsModule,
    PayModule,
    CertModule,
    SmsModule,
    PlanModule,
    ClaimModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigService,
    // { provide: APP_PIPE, useClass: ValidationPipe },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  // 모듈안에 미들웨어 등록
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FilesMiddleware).forRoutes('/uploads/sign');
    consumer.apply(FilesMiddleware).forRoutes('/uploads/sign/join');
    // consumer
    //   .apply(express.static(join(__dirname, '..', 'public')))
    //   .forRoutes('*');
    /*
    // 여러개의 미들웨어 등록 예시
    consumer.apply(cors(), helmet(), logger).forRoutes(???);

    // 라우터 등록 패턴 예시
    .forRoutes('*'); // 전역에 등록
    .forRoutes('users'); // user 경로에만 등록
    .forRoutes(BuildingController); // 컨트롤러에만 등록( 컨트롤러는 콤마(,)로 여러개를 사용할 수 있습니다. )
    .forRoutes({ path: 'users', method: RequestMethod.GET }); // users 경로에서 GET 요청에만 등록
    .forRoutes({ path: 'ab*cd', method: RequestMethod.ALL }); // 패턴 기반 경로

    // 경로제외 예시
    .exclude(
        { path: 'user', method: RequestMethod.GET },
        { path: 'user', method: RequestMethod.POST },
        'user/(.*)',
     )

     // 등록된 모든 경로에 미들웨어를 한 번에 바인딩 예시
     const app = await NestFactory.create(AppModule);
     app.use(logger);
    */
    /** 요청과 응답 정보를 로그로 출력하는 Logger 미들웨어 **/
    // consumer.apply(LoggerMiddleware).forRoutes('*');
    /** 요청과 응답 정보를 로그로 출력하는 Logger 미들웨어 **/
  }
}
