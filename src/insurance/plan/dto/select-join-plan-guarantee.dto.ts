import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class SelectJoinPlanGuaranteeDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ description: '가입 ID' })
  joinId: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ description: '플랜 ID' })
  planId: number;
}
