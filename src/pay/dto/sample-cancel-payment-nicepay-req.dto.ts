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

export class SampleCancelPaymentNicepayReqDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @ApiProperty({ description: '거래 ID' })
  TID: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @ApiProperty({ description: '상점 ID' })
  MID: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  @ApiProperty({
    description: '주문번호 (부분 취소 시 중복취소 방지를 위해 설정)',
  })
  Moid: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(12)
  @ApiProperty({ description: '취소금액' })
  CancelAmt: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ description: '취소사유 (euc-kr)' })
  CancelMsg: string;

  @IsNotEmpty()
  @IsIn(['0', '1'])
  @ApiProperty({ description: '0:전체 취소, 1:부분 취소' })
  PartialCancelCode: string = '0';

  @IsNotEmpty()
  @IsString()
  @MaxLength(14)
  @ApiProperty({ description: '요청 시간 (YYYYMMDDHHMMSS)' })
  EdiDate: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(256)
  @ApiProperty({
    description: 'hex(sha256(MID + CancelAmt + EdiDate + MerchantKey))',
  })
  SignData: string;

  @IsOptional()
  @IsIn(['euc-kr', 'utf-8'])
  @MaxLength(10)
  @ApiPropertyOptional({ description: '인증 응답 인코딩 (euc-kr / utf-8)' })
  CharSet?: string;

  @IsOptional()
  @IsIn(['JSON', 'KV'])
  @MaxLength(10)
  @ApiPropertyOptional({
    description: '응답전문 유형 (JSON / KV) *KV:Key=value',
  })
  EdiType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiPropertyOptional({ description: '가맹점 여분 필드' })
  MallReserved?: string;

  @IsOptional()
  @IsString()
  @MaxLength(16)
  @ApiPropertyOptional({
    description: '환불계좌번호 (숫자만)(가상계좌, 휴대폰 익월 환불 Only)',
  })
  RefundAcctNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(3)
  @ApiPropertyOptional({
    description:
      '환불계좌코드 (*은행코드 참고)(가상계좌, 휴대폰 익월 환불 Only)',
  })
  RefundBankCd?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  @ApiPropertyOptional({
    description: '환불계좌주명 (euc-kr)(가상계좌, 휴대폰 익월 환불 Only)',
  })
  RefundAcctNm?: string;
}
