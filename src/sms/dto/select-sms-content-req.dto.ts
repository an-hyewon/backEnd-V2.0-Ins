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

export class SelectSmsContentReqDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsIn(['ccali'])
  @ApiProperty({ description: '보험 상품코드(ccali: 중대재해)' })
  insProdCd: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsIn(['JOIN'])
  @ApiProperty({ description: '메시지 내용 타입(JOIN: 가입완료)' })
  messageType: string;
}
