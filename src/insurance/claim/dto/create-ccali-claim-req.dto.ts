import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import * as dayjs from 'dayjs';

export class createCcaliClaimReqDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(255)
  @ApiPropertyOptional({ description: 'URL' })
  locationHref?: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @ApiProperty({ description: '가입정보 ID' })
  joinId: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '사고 발생일시(YYYY-MM-DD HH:mm:ss)',
    example: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  })
  accidentDt: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(200)
  @ApiProperty({ description: '사고 내용' })
  accidentContent: string;
}
