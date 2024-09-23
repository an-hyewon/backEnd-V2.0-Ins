import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({
  name: 'nts_kor_biz_type_map',
  comment: '국세청 & 산업표준 업종 매핑 테이블',
})
@Unique(['ntsBizTypeId', 'korBizTypeId'])
@Index(['korBizTypeId'])
export class NtsKoreaBizTypeMap {
  @ApiProperty({ description: 'ID' })
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @ApiPropertyOptional({ description: '국세청 업종 ID' })
  @Column({
    name: 'nts_biz_type_id',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  ntsBizTypeId: number;

  @ApiPropertyOptional({ description: '표준산업 업종 ID' })
  @Column({
    name: 'kor_biz_type_id',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  korBizTypeId: number;
}
