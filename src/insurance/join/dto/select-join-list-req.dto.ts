import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Min,
} from 'class-validator';
import * as dayjs from 'dayjs';

export class SelectJoinListReqDto {
  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(10)
  @ApiProperty({ description: '피보험자 사업자번호' })
  insuredBizNo: string;
}
