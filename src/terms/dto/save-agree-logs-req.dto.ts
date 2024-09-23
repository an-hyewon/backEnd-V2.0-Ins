import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import * as dayjs from 'dayjs';

export class SaveAgreeLogsReqDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty({
    description: '동의 항목 코드',
    example: 'collection_use_personal',
  })
  agreeCd: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsIn(['Y', 'N'])
  @ApiProperty({ description: '동의 여부(Y/N)' })
  agreeYn: string;

  @IsOptional()
  @IsString()
  @MaxLength(13)
  @ApiPropertyOptional({ description: '피보험자 사업자번호' })
  insuredBizNo: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @ApiPropertyOptional({ description: '피보험자 휴대폰번호' })
  insuredPhoneNo: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  @ApiPropertyOptional({ description: '피보험자 상호명' })
  insuredFranNm: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: '입력받은 모든값', example: '{}' })
  dataJson: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  @ApiProperty({
    description: '파라메터 / 현재주소값',
    example: 'http://localhost:3000/pay/',
  })
  referer: string;

  @IsNotEmpty()
  @IsDateString()
  @MaxLength(100)
  @ApiProperty({
    description: '생성일시(사용자기준)',
    example: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  })
  userCreatedDt: string;
}
