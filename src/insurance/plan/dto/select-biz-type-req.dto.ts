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

export class SelectBizTypeReqDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsIn(['nts', 'ccali'])
  @ApiPropertyOptional({
    description: '변경된 업종 기준(nts: 국세청 기준, ccali: 산재 가입 기준)',
  })
  changeType?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ description: '국세청 기준 업종 ID' })
  ntsBizTypeId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ description: '산재 가입 기준 업종 ID' })
  ccaliBizTypeId?: number;
}
