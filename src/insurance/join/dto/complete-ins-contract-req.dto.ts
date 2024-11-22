import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Min,
} from 'class-validator';
import * as dayjs from 'dayjs';

export class CompleteInsContractReqDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsIn([
    'dli',
    'mfli',
    // 'dsf2',
    // 'dsf3',
    // 'dsf6',
    'ti',
    'oti',
    'otmi',
    // 'pip2',
    // 'ccali',
    // 'chi',
  ])
  @ApiProperty({
    description:
      '보험상품코드(dli: 재난배상, mfli: 다중이용, dsf2: 풍수해2, dsf3: 풍수해3, dsf6: 풍수해6, ti: 국내여행자, oti: 해외여행자, otmi: 해외여행자실손, pip2: 개인정보보호, ccali: 중대재해, chi: 주택종합보험)',
  })
  insProdCd: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '결제일시',
    example: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  })
  payDt?: string | null;
}
