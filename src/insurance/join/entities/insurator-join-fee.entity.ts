import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'insurator_join_fee',
  comment: '인슈에이터 가입내역 수수료 관리 테이블',
})
@Index(['insuratorJoinId'])
@Index(['plannerId'])
@Index(['gaId'])
@Index(['teamId'])
export class InsuratorJoinFee {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'insurator_join_id',
    comment: '설계사 ID',
    type: 'int',
    width: 11,
    nullable: false,
    unsigned: true,
  })
  insuratorJoinId: number;

  @Column({
    name: 'planner_id',
    comment: '설계사 ID',
    type: 'int',
    width: 11,
    nullable: false,
    unsigned: true,
  })
  plannerId: number;

  @Column({
    name: 'ga_id',
    comment: 'GA ID',
    type: 'int',
    width: 11,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  gaId: number;

  @Column({
    name: 'team_id',
    comment: '소속 팀 ID',
    type: 'int',
    width: 11,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  teamId: number;

  @Column({
    name: 'depth',
    comment: 'depth',
    type: 'int',
    width: 11,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  depth: number;

  @Column({
    name: 'fee_amt',
    comment: '기본 수수료',
    type: 'decimal',
    precision: 20,
    scale: 2,
    nullable: true,
    default: 0,
  })
  feeAmt: number;

  @Column({
    name: 'fee_unit',
    comment: '수수료 단위(won: 원, percent: 퍼센트)',
    type: 'varchar',
    length: 10,
    nullable: true,
    default: 'percent',
  })
  feeUnit: string;

  @CreateDateColumn({
    name: 'crt_dt',
    comment: '생성일시',
    type: 'datetime',
    nullable: false,
  })
  createdDt: Date;

  @UpdateDateColumn({
    name: 'updt_dt',
    comment: '수정일시',
    type: 'datetime',
    nullable: false,
  })
  updatedDt: Date;

  @DeleteDateColumn({
    name: 'del_dt',
    comment: '삭제일시',
    type: 'datetime',
    nullable: true,
  })
  deletedDt: Date;
}
