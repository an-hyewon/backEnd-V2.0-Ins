import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class SelectQuestionReqDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @ApiProperty({ description: '산재 가입 기준 업종 ID' })
  ccaliBizTypeId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  @ApiProperty({ description: '플랜 ID' })
  planId: number;
}
