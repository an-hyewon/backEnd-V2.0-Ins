import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const ClientInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const clientInfo = {
      sessionId: request.sessionId || '',
      userAgent: request.get('user-agent') || '',
      userIp:
        request.get('x-forwarded-for') ||
        request.ip ||
        request.connection.remoteAddress,
      path: request.originalUrl,
      url: request.headers.referer,
      reqMethod: request.method,
      reqParams: request.params,
      reqQuery: request.query,
      reqBody: request.body,
      user: request.user,
    };
    return clientInfo;
  },
);
