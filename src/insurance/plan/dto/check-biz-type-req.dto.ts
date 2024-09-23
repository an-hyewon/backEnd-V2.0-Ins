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
  MaxLength,
  Min,
} from 'class-validator';

export class CheckBizTypeReqDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @ApiProperty({ description: '국세청 기준 업종 ID' })
  ntsBizTypeId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @ApiProperty({ description: '산재 가입 기준 업종 ID' })
  ccaliBizTypeId: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({ description: '총 근로자수' })
  totEmployeeCnt?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  // @Max(100000000000)
  @ApiPropertyOptional({ description: '연간 매출액' })
  salesCost?: number;
}
