import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger();
  /*
   * 미들웨어에서 이후 코드를 실행하려면 next(), 실행하지 않는다면 return을 합니다.
   * 미들웨어에서 프론트로 응답을 하고 싶다면 express처럼 res.json, res.send 를 사용합니다.
   */
  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl, headers } = req;
    const startTime = Date.now();

    const userAgent = req.get('user-agent') || ''; // header에서 가져옴

    console.log(`==================================================`);
    this.logger.log(`요청 [${method}] URI: ( ${originalUrl} )`);
    this.logger.log(`ip: ${ip}`);
    this.logger.log(`userAgent: ${userAgent}`);
    this.logger.log(`authorization: ${headers?.authorization}`);

    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - startTime;

      this.logger.log(
        `응답 [${method}] URI: ( ${originalUrl} ) ${statusCode} - ${responseTime}ms`,
      );
      console.log(`==================================================`);
    });

    next();
  }
}

/**
 미들웨어는 class, function 둘다 사용가능하다
 **/
