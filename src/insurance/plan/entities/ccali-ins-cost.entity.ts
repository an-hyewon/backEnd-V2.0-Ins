import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'ccali_ins_cst',
  comment: '중대재해 보험료 테이블',
})
@Index(['planId'])
@Index(['bizSmallTypeCd'])
@Index(['employeeCntId'])
@Index(['coverageLimitId'])
export class CcaliInsCost {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'plan_id',
    comment: '플랜 ID',
    type: 'int',
    width: 11,
    nullable: false,
    default: 0,
    unsigned: true,
  })
  planId: number;

  @Column({
    name: 'biz_small_type_cd',
    comment: '업종 소분류 코드',
    type: 'varchar',
    length: 3,
    nullable: true,
  })
  bizSmallTypeCd: string;

  @Column({
    name: 'emp_cnt_id',
    comment: '근로자수 구간 ID',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  employeeCntId: number;

  @Column({
    name: 'cvrg_limit_id',
    comment: '보상한도 ID',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  coverageLimitId: number;

  @Column({
    name: 'ins_cst',
    comment: '보험료',
    type: 'bigint',
    width: 20,
    nullable: true,
    unsigned: true,
  })
  insCost: number;

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
