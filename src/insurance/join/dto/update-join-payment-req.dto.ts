import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateJoinPaymentReqDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(255)
  @ApiPropertyOptional({ description: 'URL' })
  locationHref?: string;

  @IsOptional()
  @IsInt()
  @IsIn([1, 2, 3, 4])
  @ApiPropertyOptional({ description: '납입 회차' })
  payNo?: number = 1;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @ApiProperty({ description: '결제 금액' })
  payInsCost: number;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsIn(['Y', 'N', 'C'])
  @ApiProperty({ description: '결제 성공여부(Y: 성공, N: 실패, C: 취소)' })
  payStatusCd: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsIn(['CARD', 'BANK', 'DBANK', 'VBANK'])
  @ApiProperty({
    description:
      '결제수단(CARD:신용카드, BANK:계좌이체, VBANK: 가상계좌, DBANK: 무통장입금)',
  })
  payMethod: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @ApiProperty({ description: '결제 로그 ID' })
  payLogsId: number;
}
