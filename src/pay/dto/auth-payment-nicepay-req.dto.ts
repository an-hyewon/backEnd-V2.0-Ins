import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
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

export class AuthPaymentNicepayReqDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(4)
  @ApiProperty({ description: '인증 결과 코드, 0000 : 성공 (이외 실패)' })
  AuthResultCode: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @ApiPropertyOptional({ description: '인증 결과 메시지' })
  AuthResultMsg?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  @ApiProperty({ description: '인증 토큰' })
  AuthToken: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  @ApiPropertyOptional({
    description:
      '결제수단(CARD: 신용카드, BANK: 계좌이체, VBANK: 가상계좌, CELLPHONE : 휴대폰결제)',
  })
  PayMethod?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @ApiProperty({ description: '상점 아이디' })
  MID: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  @ApiProperty({ description: '상점 주문번호' })
  Moid: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(12)
  @ApiProperty({ description: '금액' })
  Amt: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiPropertyOptional({ description: '가맹점 여분 필드' })
  ReqReserved?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  @ApiPropertyOptional({ description: '거래 ID' })
  TxTid?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @ApiProperty({ description: '승인 요청 URL' })
  NextAppURL: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ description: '망취소 요청 URL' })
  NetCancelURL?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ description: 'URL' })
  referer?: string;
}
