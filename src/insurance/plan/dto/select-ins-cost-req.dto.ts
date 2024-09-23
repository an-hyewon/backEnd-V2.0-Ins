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
  MaxLength,
  Min,
} from 'class-validator';

export class SelectInsCostReqDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(255)
  @ApiPropertyOptional({ description: 'URL' })
  locationHref?: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ description: '산재 가입 기준 업종 코드', example: '22907' })
  ccaliBizTypeCd: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
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

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  @ApiPropertyOptional({ description: '플랜 ID' })
  planId?: number = 1;
}
