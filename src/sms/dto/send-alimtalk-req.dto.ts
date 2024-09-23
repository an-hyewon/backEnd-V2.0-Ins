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
  @Transform(({ value }) => value?.trim())
  @MaxLength(100)
  @ApiProperty({ description: '수신자 휴대폰번호' })
  receivers: string;

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
  @IsInt()
  @ApiPropertyOptional({ description: '가입 ID' })
  joinId?: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['JOIN', 'JOIN_PDF', 'APPLY_PREM', 'NOTICE_PREM'])
  @Transform(({ value }) => value?.trim())
  @ApiProperty({
    description:
      '메시지 내용 타입(JOIN: 가입완료, JOIN_PDF: 가입확인서 요청, UNPAID_NOTI: 미결제 알림, APPLY_PREM: 보험료 조회 신청 완료, NOTICE_PREM: 보험료 안내)',
  }) // PAY_REQ: 결제 요청
  messageType: string;
}
