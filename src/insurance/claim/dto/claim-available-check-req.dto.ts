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

export class ClaimAvailableCheckReqDto {
  @IsNotEmpty()
  @IsNumberString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(10)
  @ApiProperty({ description: '피보험자 사업자번호' })
  insuredBizNo: string;

  @IsNotEmpty()
  @IsNumberString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(20)
  @ApiProperty({ description: '피보험자 휴대폰번호' })
  insuredPhoneNo: string;
}
