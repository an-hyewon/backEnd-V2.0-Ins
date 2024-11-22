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
  receiver: string;

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
  sender?: string = process.env.ALIGO_SENDER;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '참조 ID' })
  referId?: string;

  @IsOptional()
  @IsString()
  @IsIn(['JOIN', 'JOIN_PDF', 'DBANK'])
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({
    description:
      '메시지 내용 타입(JOIN: 가입완료, JOIN_PDF: 가입증권 요청, DBANK: 무통장입금 안내)',
  })
  messageType?: string;
}
