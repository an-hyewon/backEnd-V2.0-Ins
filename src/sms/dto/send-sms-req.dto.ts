import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class SendSmsReqDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(100)
  @ApiProperty({ description: '수신자 휴대폰번호' })
  receivers: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ description: '메시지 내용' })
  message: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsIn(['Y', 'N'])
  @ApiProperty({ description: '예약 여부(Y/N)' })
  reservedYn: string;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '예약 날짜(YYYY-MM-DD)' })
  reservedDate?: string;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '예약 시간(HH:mm)' })
  reservedTime?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '발신자 번호' })
  sender?: string = '15229323';

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '참조 키값' })
  referIdx?: string;

  // @IsOptional()
  // @IsString()
  // @IsIn(['JOIN', 'UNPAID_NOTI'])
  // @Transform(({ value }) => value?.trim())
  // @ApiPropertyOptional({
  //   description: '메시지 내용 타입(JOIN: 가입완료, UNPAID_NOTI: 미결제 알림)',
  // })
  // messageType?: string;
}
