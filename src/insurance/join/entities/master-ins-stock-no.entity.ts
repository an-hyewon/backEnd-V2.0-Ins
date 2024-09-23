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

@Entity({ name: 'master_ins_stock_no', comment: '마스터 증권번호 테이블' })
@Unique(['insProdId', 'planId', 'startDt'])
@Index(['insStockNo'])
@Index(['insComCd'])
export class MasterInsStockNo {
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
    unsigned: true,
  })
  insProdId: number;

  @Column({
    name: 'plan_id',
    comment: '플랜 ID',
    type: 'int',
    width: 11,
    nullable: false,
    unsigned: true,
  })
  planId: number;

  @Column({
    name: 'ins_com_cd',
    comment: '보험사 코드(DB, MR, KB, SM, HD)',
    type: 'varchar',
    length: 5,
    nullable: false,
  })
  insComCd: string;

  @Column({
    name: 'ins_stock_no',
    comment: '마스터 증권번호',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  insStockNo: string;

  @Column({
    name: 'strt_dt',
    comment: '적용 시작일시',
    type: 'datetime',
    nullable: true,
  })
  startDt: Date;

  @Column({
    name: 'end_dt',
    comment: '적용 종료일시',
    type: 'datetime',
    nullable: true,
  })
  endDt: Date;

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
