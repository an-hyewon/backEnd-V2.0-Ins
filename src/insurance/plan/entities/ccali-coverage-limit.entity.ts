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
  name: 'ccali_cvrg_limit',
  comment: '중대재해 보상한도 테이블',
})
@Index(['insProdId'])
@Index(['perAccidentCoverageLimit'])
@Index(['totCoverageLimit'])
export class CcaliCoverageLimit {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
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
  insProdId: number;

  @Column({
    name: 'per_acdnt_cvrg_limit',
    comment: '사고당 보상한도',
    type: 'bigint',
    width: 20,
    nullable: true,
  })
  perAccidentCoverageLimit: number;

  @Column({
    name: 'tot_cvrg_limit',
    comment: '증권 총 보상한도',
    type: 'bigint',
    width: 20,
    nullable: true,
  })
  totCoverageLimit: number;

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
