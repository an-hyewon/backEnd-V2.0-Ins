import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class SelectDefaultCoverageLimitReqDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(255)
  @ApiPropertyOptional({ description: 'URL' })
  locationHref?: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ description: '매출액' })
  salesCost: number;
}
