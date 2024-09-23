import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class SelectNtsBizTypeDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '키워드' })
  keyword?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '업종 대분류 명' })
  bizLargeTypeNm?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '업종 중분류 명' })
  bizMediumTypeNm?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '업종 소분류 명' })
  bizSmallTypeNm?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '업종 세분류 명' })
  bizSubTypeNm?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '업종 세세분류 명' })
  bizSubSubTypeNm?: string;
}
