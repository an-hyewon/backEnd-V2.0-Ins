import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class SendAlimtalkDto {
  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ description: '관리자 ID' })
  adminId?: number;

  @IsNotEmpty()
  @IsNumberString()
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
  @IsNumberString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '발신자 번호' })
  sender?: string = process.env.ALIGO_SENDER;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '보험상품코드' })
  insProdCd: string;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ description: '가입 ID' })
  joinId?: number;

  @IsOptional()
  @IsString()
  @IsIn([
    'APLY',
    'JOIN',
    'JOIN_FREE',
    'APLY_DBANK',
    'JOIN_DBANK',
    'CNCL',
    'CHG',
    'JOIN_PDF',
    'MR_JOIN_PDF',
    'LOTTE_APLY',
    'LOTTE_JOIN',
    'APLY_CLAIM',
    'APLY_PREM_NOTI',
    'PREM_NOTI',
    'REJOIN',
    'JOIN_RJCT',
    'NOT_JOIN',
  ])
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({
    description:
      '메시지 내용 타입(JOIN: 가입완료, JOIN_PDF: 가입 증권/확인서 요청, APPLY_DBANK: 무통장입금 안내, JOIN_DBANK: 무통장입금 가입완료)',
  })
  messageType?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '메시지 내용' })
  message?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '버튼 내용' })
  buttons?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '대체문자 내용' })
  failSmsMessage?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '알림톡 템플릿 코드' })
  templateCd?: string;

  @IsOptional()
  @IsIn(['Y', 'N'])
  @ApiPropertyOptional({
    description: '대체문자 테스트 여부(Y: 대체문자 발송, N: 정상 발송)',
  })
  testYn?: string;
}
