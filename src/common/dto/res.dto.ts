import { ApiProperty } from '@nestjs/swagger';

export class PageResDto<TData> {
  @ApiProperty({ required: true })
  page: number;

  @ApiProperty({ required: true })
  size: number;

  items: TData[];
}

export abstract class BaseResponse<T> {
  @ApiProperty({ description: '응답 코드', example: 200000 })
  code: number;

  @ApiProperty({ description: '응답 메세지', example: 'ok' })
  message: string;

  @ApiProperty({ description: '실제 사용하는 데이터 전문' })
  result: T;
}
