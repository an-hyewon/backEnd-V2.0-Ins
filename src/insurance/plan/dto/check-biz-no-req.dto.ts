import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CheckBizNoReqDto {
  @IsNotEmpty()
  @IsNumberString()
  @Transform(({ value }) => value?.trim())
  @Length(10, 10)
  @ApiProperty({ description: '사업자번호(10자리)' })
  insuredBizNo: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '클라이언트 URL' })
  locationHref: string;
}
