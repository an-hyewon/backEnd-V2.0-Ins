import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const error = exception.getResponse() as
      | string
      | { error: string; status: number; message: string | string[] };
    console.log(
      `[${new Date().toLocaleString()}] :::: HttpException >>> ${status}`,
    );
    const responseStatusCode = status + '000';
    let responseResult = request.body;
    if (request.method === 'GET') {
      responseResult = request.query;
    }

    let path = '';
    if (request.originalUrl.indexOf('user') > -1) {
      path = 'user';
    } else if (
      request.originalUrl.indexOf('gc') > -1 &&
      request.originalUrl.indexOf('plan') > -1
    ) {
      path = 'plan';
    } else if (request.originalUrl.indexOf('gc') > -1) {
      path = 'gc';
    } else if (request.originalUrl.indexOf('reservation') > -1) {
      path = 'reservation';
    } else if (request.originalUrl.indexOf('board') > -1) {
      path = 'board';
    } else if (request.originalUrl.indexOf('terms') > -1) {
      path = 'terms';
    } else if (request.originalUrl.indexOf('admin') > -1) {
      path = 'admin';
    }

    // console.log('req', request)
    // console.log('method', request.method)
    // console.log('body', request.body)
    // console.log('query', request.query)
    console.log('originalUrl', request.originalUrl);

    if (typeof error === 'string') {
      response.status(status).json({
        code: parseInt(responseStatusCode),
        message: error,
        result: {
          [`${path}`]: responseResult,
        },
      });
      // response.status(status).json({
      //   success: false,
      //   statusCode: status,
      //   timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      //   path: request.url,
      //   error,
      // });
    } else {
      response.status(status).json({
        code: parseInt(responseStatusCode),
        message: JSON.stringify(error),
        result: {
          [`${path}`]: responseResult,
        },
      });
      // response.status(status).json({
      //   success: false,
      //   timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      //   ...error,
      // });
    }
  }
}
