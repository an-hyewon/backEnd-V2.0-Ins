import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class SavePhoneCertLogsResultReqDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '' })
  requestId?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '가입 UID' })
  insJoinUid?: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ description: '성공여부(0: False, 1: True)' })
  success: number;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ description: '포트원 인증 고유번호' })
  impUid: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiProperty({
    description:
      '가맹점 주문번호(결제 위변조 대사 작업시 주문번호를 이용하여 검증)',
  })
  merchantUid: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: 'PG사 본인인증결과 고유번호' })
  pgTid?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: 'PG사 구분코드' })
  pgProvider?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '이름' })
  name?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '성별' })
  gender?: string;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ description: '생년월일(UNIX timestamp)' })
  birth?: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '생년월일(YYYY-MM-DD)' })
  birthday?: string;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({
    description:
      '외국인 여부(다날 본인인증서비스 계약시 외국인 구분기능 추가/그 외 false)(0: False, 1: True)',
  })
  foreigner?: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '휴대폰번호' })
  phone?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '통신사' })
  carrier?: string;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ description: '인증성공여부(0: False, 1: True)' })
  certified?: number;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ description: '인증처리시각(UNIX timestamp)' })
  certifiedAt?: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '개인 고유구분 식별키' })
  uniqueKey?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '가맹점 내 개인 고유구분 식별키' })
  uniqueInSite?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '웹 페이지 URL' })
  origin?: string;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({
    description:
      '외국인 여부(다날 본인인증서비스 계약시 외국인 구분기능 추가/그 외 null)(0: False, 1: True)',
  })
  foreignerV2?: number;
}
