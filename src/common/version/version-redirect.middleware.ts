import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class VersionRedirectMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('version redirect', req.url);

    // API 경로에서 /api 이후의 부분 추출
    const apiPath = req.url.slice(4); // '/api' 다음 문자열부터 시작

    // API 버전 접두사가 이미 포함되어 있는지 확인
    const hasVersionPrefix = /^\/v\d+/.test(apiPath);

    // 버전 접두사가 없으면 기본 버전 (v1)을 URL에 추가
    if (req.url.indexOf('/api') > -1 && !hasVersionPrefix) {
      req.url = `/api/v1${apiPath}`;
    }
    next();
  }
}
