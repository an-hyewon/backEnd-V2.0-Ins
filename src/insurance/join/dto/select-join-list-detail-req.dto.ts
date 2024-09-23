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

export class SelectJoinListDetailReqDto {
  @IsNotEmpty()
  @IsNumberString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(20)
  @ApiProperty({ description: '계약자 휴대폰번호/(법인)담당자 휴대폰번호' })
  phPhoneNo: string;
}
