import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({
  name: 'ccali_nts_biz_type_map',
  comment: '중대재해 & 국세청 업종 매핑 테이블',
})
@Unique(['ccaliBizTypeId', 'ntsBizTypeId'])
@Index(['ntsBizTypeId'])
export class CcaliNtsBizTypeMap {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'ccali_biz_type_id',
    comment: '중대재해 업종 ID',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  ccaliBizTypeId: number;

  @Column({
    name: 'nts_biz_type_id',
    comment: '국세청 업종 ID',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  ntsBizTypeId: number;
}
