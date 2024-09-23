import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class SaveSecukitOneCertLogsReqDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(255)
  @ApiPropertyOptional({ description: 'URL' })
  locationHref?: string;

  @IsNotEmpty()
  @IsNumberString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(10)
  @ApiProperty({ description: '사업자번호' })
  insuredBizNo: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(100)
  @ApiProperty({
    description: '주문번호(결제 위변조 대사 작업시 주문번호를 이용하여 검증)',
  })
  athNo: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '' })
  certBase64?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '' })
  certHex?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(100)
  @ApiPropertyOptional({ description: '' })
  cn?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(200)
  @ApiPropertyOptional({ description: '' })
  issueDn?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(100)
  @ApiPropertyOptional({ description: '' })
  issuer?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(100)
  @ApiPropertyOptional({ description: '' })
  issuerToName?: string;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ description: '' })
  keySize?: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(100)
  @ApiPropertyOptional({ description: '' })
  oid?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(100)
  @ApiPropertyOptional({ description: '' })
  policy?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '' })
  publicKey?: string;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ description: '' })
  serial?: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(100)
  @ApiPropertyOptional({ description: '' })
  signatureAlgorithmId?: string;

  @IsOptional()
  @IsDate()
  @ApiPropertyOptional({ description: '' })
  todate?: Date;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(10)
  @ApiPropertyOptional({ description: '' })
  usageToName?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(200)
  @ApiPropertyOptional({ description: '' })
  userDn?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(200)
  @ApiPropertyOptional({ description: '' })
  username?: string;

  @IsOptional()
  @IsDate()
  @ApiPropertyOptional({ description: '' })
  validateFrom?: Date;

  @IsOptional()
  @IsDate()
  @ApiPropertyOptional({ description: '' })
  validateTo?: Date;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(10)
  @ApiPropertyOptional({ description: '' })
  version?: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ description: '' })
  signData: string;
}
