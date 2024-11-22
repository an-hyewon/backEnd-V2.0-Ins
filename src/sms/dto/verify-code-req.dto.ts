import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class VerifyCodeReqDto {
  @IsNotEmpty()
  @IsNumberString()
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ description: '수신자 휴대폰번호' })
  telNo: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(6, 6)
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ description: '인증번호' })
  authCode: string;
}
