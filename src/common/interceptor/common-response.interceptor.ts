import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IResponse } from './response.interface';

@Injectable()
export class CommonResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse();

    return next.handle().pipe(
      map((data) => {
        const statusCode = response.statusCode
          ? response.statusCode
          : HttpStatus.OK;
        const responseCode = statusCode + '000';
        let responseMsg = 'ok';
        if (statusCode === HttpStatus.NOT_FOUND) {
          responseMsg = 'NOT_FOUND';
        } else if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
          responseMsg = 'INTERNAL_SERVER_ERROR';
        } else if (statusCode === HttpStatus.UNAUTHORIZED) {
          responseMsg = 'UNAUTHORIZED';
        }
        return {
          code: parseInt(responseCode),
          message: responseMsg,
          result: data,
        };
      }),
    );
  }
}
