import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import * as dayjs from 'dayjs';

export class CreateTermReqDto {}

export class UpdateTermReqDto extends PartialType(CreateTermReqDto) {}

export class CreateTermAgreeLogsReqDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(100)
  @ApiProperty({
    description: '약관동의 항목 코드',
    example: 'collection_use_personal',
  })
  termsAgreeCd: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(1)
  @IsIn(['Y', 'N'])
  @ApiProperty({ description: '동의 여부(Y/N)' })
  agreeYn: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: '입력받은 모든값', example: '{}' })
  dataJson: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  @ApiPropertyOptional({
    description: '파라메터 / 현재주소값',
    example: 'http://localhost:3000/pay/',
  })
  referer: string;

  @IsNotEmpty()
  @IsDateString()
  @MaxLength(100)
  @ApiProperty({
    description: '생성일시(사용자기준)',
    example: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  })
  userCreatedDT: string;
}

export class CreateTermAgreeLogsDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty({
    description: '약관동의 항목 코드',
    example: 'collection_use_personal',
  })
  termsAgreeCd: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsIn(['Y', 'N'])
  @ApiProperty({ description: '동의 여부(Y/N)' })
  agreeYn: string;

  @IsOptional()
  @IsString()
  @Length(32, 32)
  @ApiPropertyOptional({ description: '가입 UID' })
  insJoinUid: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: '입력받은 모든값', example: '{}' })
  dataJson: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: '유저에이전트', example: '' })
  userAgent: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  @ApiPropertyOptional({ description: 'IP 주소', example: '127.0.0.1' })
  ipAddr: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  @ApiProperty({
    description: '파라메터 / 현재주소값',
    example: 'http://localhost:3000/pay/',
  })
  referer: string;

  @IsNotEmpty()
  @IsDateString()
  @MaxLength(100)
  @ApiProperty({
    description: '생성일시(사용자기준)',
    example: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  })
  userCreatedDt: string;
}
