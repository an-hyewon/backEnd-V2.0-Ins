import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateClientLogReqDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'session id' })
  sessionId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'user agent' })
  userAgent: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'user ip' })
  userIp: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: '백엔드 서버 host' })
  serverHost: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'path' })
  path: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'url' })
  url: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'request method' })
  reqMethod: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'params' })
  reqParams: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'query' })
  reqQuery: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'body' })
  reqBody: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: '아이디' })
  username: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: '아이디 권한(admin, user)' })
  userRole: string;
}
