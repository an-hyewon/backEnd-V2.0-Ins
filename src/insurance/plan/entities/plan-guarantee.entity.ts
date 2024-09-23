import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'plan_grnte', comment: '플랜 보장항목 테이블' })
@Index(['insProdId'])
@Index(['sortSeq'])
@Index(['guaranteeLargeScaleId'])
export class PlanGuarantee {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({
    name: 'ins_prod_id',
    comment: '보험상품 ID',
    type: 'int',
    width: 11,
    nullable: false,
    default: 0,
    unsigned: true,
  })
  insProdId: number = 0;

  @Column({
    name: 'grnte_lclsf_id',
    comment: '보장항목 대분류 ID',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  guaranteeLargeScaleId: number;

  @Column({
    name: 'grnte_nm',
    comment: '담보명',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  guaranteeNm: string;

  @Column({
    name: 'sort_seq',
    comment: '정렬 순서',
    type: 'int',
    width: 11,
    nullable: false,
    default: 0,
    unsigned: true,
  })
  sortSeq: number = 0;

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
