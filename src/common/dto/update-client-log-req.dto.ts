import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateClientLogReqDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'resJson' })
  resJson: string;
}
