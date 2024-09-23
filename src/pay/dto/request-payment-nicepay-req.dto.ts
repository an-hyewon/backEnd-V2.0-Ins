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
  MaxLength,
} from 'class-validator';

export class RequestPaymentNicepayReqDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsIn(['CARD', 'BANK', 'DBANK', 'VBANK'])
  @ApiProperty({
    description:
      '결제수단(CARD:신용카드, BANK:계좌이체, VBANK: 가상계좌, DBANK: 무통장입금)',
  })
  payMethod?: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ description: '상점주문번호' })
  payMoid: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiProperty({
    description: '계약자 명',
  })
  phNm: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(20)
  @ApiProperty({ description: '계약자 휴대폰번호' })
  phPhoneNo: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: '결제 금액' })
  applyCost: number;
}
