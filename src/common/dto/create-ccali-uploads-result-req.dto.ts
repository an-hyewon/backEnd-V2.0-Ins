import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCcaliUploadsResultReqDto {
  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ description: '가입 ID' })
  joinId?: number;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ description: '원본 파일 이름' })
  originalFileNm: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ description: '저장된 파일 이름' })
  fileNm: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ description: '파일 경로' })
  filePath: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ description: '파일 URL' })
  fileUrl: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '파일 크기' })
  fileSize?: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: 'MIME 타입' })
  mimeType?: string;
}
