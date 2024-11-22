import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class SendSmsCodeReqDto {
  @IsNotEmpty()
  @IsNumberString()
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ description: '수신자 휴대폰번호' })
  telNo: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '발신자 번호' })
  sender?: string = process.env.ALIGO_SENDER;
}
