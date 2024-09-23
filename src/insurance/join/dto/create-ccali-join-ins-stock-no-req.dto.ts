import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Min,
} from 'class-validator';
import * as dayjs from 'dayjs';

export class CreateCcaliJoinInsStockNoReqDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @ApiProperty({ description: '보험상품 ID' })
  insProdId: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ description: '플랜 ID' })
  planId?: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @ApiProperty({ description: '가입 ID' })
  joinId: number;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ description: '가입일' })
  joinYmd: string;
}
