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

@Entity({ name: 'plan_grnte_cn', comment: '플랜 보장내용 테이블' })
@Unique(['planId', 'guaranteeId'])
@Index(['guaranteeId'])
export class PlanGuaranteeContent {
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

  @Column({
    name: 'grnte_expln',
    comment: '담보 내용',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  guaranteeContent: string;

  @Column({
    name: 'grnte_expln',
    comment: '담보 설명',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  guaranteeExplain: string;

  @Column({
    name: 'required_yn',
    comment: '필수 여부',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  requiredYn: string;

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
