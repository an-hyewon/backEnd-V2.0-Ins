import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class SelectInsCostDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ description: '보험상품 ID' })
  insProdId: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ description: '플랜 ID' })
  planId: number;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(5, 5)
  @ApiProperty({ description: '중대재해 업종 소분류 코드' })
  bizSmallTypeCd: string;

  @IsNotEmpty()
  @IsInt()
  @Min(5)
  @Max(49)
  @ApiProperty({ description: '근로자 수' })
  employeeCnt: number;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ description: '사고당 보상한도' })
  perAccidentCoverageLimit?: number;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ description: '증권 총 보상한도' })
  totCoverageLimit?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({ description: '연간 매출액' })
  salesCost?: number;
}
