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

export class SelectPlanGuaranteeDto {
  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ description: '플랜 ID' })
  planId?: number;
}
