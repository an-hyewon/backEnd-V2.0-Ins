import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({
  name: 'ccali_sales_cvrg_limit_default_map',
  comment: '중대재해 매출액 대비 보상한도 기본값 매핑 테이블',
})
@Unique(['salesCostId', 'coverageLimitId'])
@Index(['coverageLimitId'])
export class CcaliSalesCoverageLimitDefaultMap {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'sales_cst_id',
    comment: '매출액 구간 ID',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  salesCostId: number;

  @Column({
    name: 'cvrg_limit_id',
    comment: '보상한도 ID',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  coverageLimitId: number;
}
