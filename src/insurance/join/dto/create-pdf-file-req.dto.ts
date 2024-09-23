import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePdfFileReqDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsIn(['questionUnder', 'questionOver', 'rateQuotation', 'costNotice'])
  @ApiProperty({
    description:
      '서류 코드(questionUnder: 50인 미만 질문서, questionOver: 50인 이상 질문서, rateQuotation: RQ, costNotice: 보험료 안내문)',
  })
  fileType: string;
}
