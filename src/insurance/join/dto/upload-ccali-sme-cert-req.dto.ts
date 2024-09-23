import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class UploadSmeCertReqDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @ApiProperty({ description: '가입 ID' })
  joinId: number;
}
