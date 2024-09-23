import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class SubCompanyDto {
  @IsNotEmpty()
  @IsNumberString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(10)
  @ApiProperty({ description: '자회사 사업자번호' })
  subCompanyBizNo: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(100)
  @ApiProperty({ description: '자회사 상호명' })
  subCompanyFranNm: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(400)
  @ApiPropertyOptional({ description: '자회사 지번 주소' })
  subCompanyJibunAddr?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(400)
  @ApiPropertyOptional({ description: '자회사 도로명 주소' })
  subCompanyRoadAddr?: string;

  @IsNotEmpty()
  @IsNumberString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(10)
  @ApiProperty({ description: '자회사 우편번호' })
  subCompanyZipCd: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @ApiProperty({ description: '국세청 업종 ID', example: 193 })
  ntsBizTypeId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @ApiProperty({ description: '중대재해 업종 ID', example: 150 })
  ccaliBizTypeId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @ApiProperty({ description: '소속 근로자수' })
  employeeCnt: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @ApiProperty({ description: '소속 외 근로자수' })
  externalEmployeeCnt: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @ApiProperty({ description: '연간 매출액' })
  salesCost: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @ApiProperty({ description: '연임금 총액' })
  totAnnualWages: number;
}
