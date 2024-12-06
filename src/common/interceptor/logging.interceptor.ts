import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonService } from '../common.service';

@Injectable()
export class LoggingInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private readonly commonService: CommonService) {}

  private readonly logger = new Logger();

  async intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const response = httpContext.getResponse();

    const {
      method,
      originalUrl,
      params,
      query,
      body,
      headers,
      user,
      hostname,
    } = request;
    const userAgent = request.get('user-agent') || '';
    const ip =
      request.get('x-forwarded-for') ||
      request.ip ||
      request.connection.remoteAddress;
    const startTime = Date.now();
    const url = headers?.referer || hostname;

    console.log(`==================================================`);
    this.logger.log(`요청 [${method}] URI: ( ${originalUrl} )`);
    this.logger.log(`sessionId: ${headers?.sessionId}`);
    this.logger.log(`userAgent: ${userAgent}`);
    this.logger.log(`ip: ${ip}`);
    this.logger.log(`url: ${headers?.referer}`);
    this.logger.log(`params: ${JSON.stringify(params)}`);
    this.logger.log(`query: ${JSON.stringify(query)}`);
    this.logger.log(`body: ${JSON.stringify(body)}`);
    this.logger.log(`user: ${user}`);
    this.logger.log(`host: ${headers?.host}`);

    const clientLog = await this.commonService.saveClientLog({
      sessionId: headers?.sessionId,
      userAgent,
      userIp: ip,
      serverHost: headers?.host,
      path: originalUrl,
      url,
      reqMethod: method,
      reqParams: JSON.stringify(params),
      reqQuery: JSON.stringify(query),
      reqBody: JSON.stringify(body),
      username: user?.username,
      userRole: user?.username == null ? null : 'user',
    });

    return next.handle().pipe(
      map(async (data: any) => {
        const { statusCode } = response;
        const responseTime = Date.now() - startTime;

        this.logger.log(
          `응답 [${method}] URI: ( ${originalUrl} ) ${statusCode} - ${responseTime}ms`,
        );

        if (data?.code != null) {
          const { code, message, result } = data;
          await this.commonService.updateClientLog(clientLog?.id, {
            resJson:
              code == null
                ? JSON.stringify(result)
                : JSON.stringify({
                    code,
                    message,
                  }),
          });
        }

        console.log(`==================================================`);
        return data;
      }),
    );
  }
}
