import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Min,
} from 'class-validator';
import * as dayjs from 'dayjs';

export class UpdateJoinReqDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(255)
  @ApiPropertyOptional({ description: 'URL' })
  locationHref?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(500)
  @ApiPropertyOptional({ description: '계약자 본인인증 unique key' })
  phUniqueKey?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ description: '계약자 본인인증 로그 ID' })
  phCertLogsId?: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsIn(['CARD', 'BANK', 'DBANK', 'VBANK'])
  @ApiPropertyOptional({
    description:
      '결제수단(CARD:신용카드, BANK:계좌이체, VBANK: 가상계좌, DBANK: 무통장입금)',
  })
  payMethod?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(100)
  @ApiPropertyOptional({ description: '담당자 명(법인)' })
  corpManagerNm?: string;

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(20)
  @ApiPropertyOptional({ description: '담당자 휴대폰번호(법인)' })
  corpManagerPhoneNo?: string;
}
