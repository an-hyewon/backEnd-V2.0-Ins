import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'plan_grnte_map', comment: '플랜 보장항목 매핑테이블' })
@Unique(['planId', 'guaranteeId'])
@Index(['guaranteeId'])
export class PlanGuaranteeMap {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({
    name: 'plan_id',
    comment: '플랜 ID',
    type: 'int',
    width: 10,
    nullable: false,
    unsigned: true,
  })
  planId: number;

  @Column({
    name: 'grnte_id',
    comment: '보장항목 ID',
    type: 'int',
    width: 10,
    nullable: false,
    unsigned: true,
  })
  guaranteeId: number;
}
