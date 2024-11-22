import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class SendAlimtalkReqDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ description: '수신자 휴대폰번호' })
  receiver: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['Y', 'N'])
  @ApiProperty({ description: '예약 여부(Y/N)' })
  reservedYn: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '예약 날짜(YYYY-MM-DD)' })
  reservedDate?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '예약 시간(HH:mm)' })
  reservedTime?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '발신자 번호' })
  sender?: string = process.env.ALIGO_SENDER;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ description: '가입 ID' })
  joinId?: number;

  @IsOptional()
  @IsString()
  @IsIn(['JOIN', 'JOIN_PDF', 'APPLY_DBANK', 'JOIN_DBANK'])
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({
    description:
      '메시지 내용 타입(JOIN: 가입완료, JOIN_PDF: 가입 증권/확인서 요청, APPLY_DBANK: 무통장입금 안내, JOIN_DBANK: 무통장입금 가입완료)',
  })
  messageType?: string;
}
