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

export class GetIamportPhoneCertLogsReqDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiProperty({
    description:
      '가맹점 주문번호(결제 위변조 대사 작업시 주문번호를 이용하여 검증)',
  })
  merchantUid: string;
}
