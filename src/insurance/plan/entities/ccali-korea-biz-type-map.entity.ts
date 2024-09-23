import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({
  name: 'ccali_kor_biz_type_map',
  comment: '중대재해 & 산업표준 업종 매핑 테이블',
})
@Unique(['ccaliBizTypeId', 'korBizTypeId'])
@Index(['korBizTypeId'])
export class CcaliKoreaBizTypeMap {
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
    name: 'kor_biz_type_id',
    comment: '표준산업 업종 ID',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  korBizTypeId: number;
}
