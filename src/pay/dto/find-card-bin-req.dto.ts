import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';

export class FindCardBinReqDto {
  @IsNotEmpty()
  @IsNumberString()
  @Transform(({ value }) => value?.trim())
  @MinLength(6)
  @MaxLength(16)
  @ApiProperty({ description: '카드번호(6~16자리)' })
  cardNo: string;
}
