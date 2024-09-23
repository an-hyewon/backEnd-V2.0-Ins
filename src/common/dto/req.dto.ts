import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PageReqDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @ApiPropertyOptional({ description: '페이지. Default = 1' })
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @ApiPropertyOptional({ description: '페이지당 데이터 갯수. Default = 50' })
  size: number = 50;
}

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

export class UpdateClientLogReqDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'resJson' })
  resJson: string;
}
