import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
} from 'class-validator';

export class CancelPaymentNicepayReqDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  @ApiProperty({
    description: '주문번호 (부분 취소 시 중복취소 방지를 위해 설정)',
  })
  Moid: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsIn(['Y', 'N'])
  @ApiProperty({ description: '부분취소 여부(N:전체 취소, Y:부분 취소)' })
  PartialCancelYn: string = 'N';

  @IsOptional()
  @IsNumber()
  // @MaxLength(12)
  @ApiPropertyOptional({ description: '취소금액(부분취소시 필수)' })
  CancelAmt?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiPropertyOptional({ description: '취소사유 (euc-kr)' })
  CancelMsg?: string;
}
