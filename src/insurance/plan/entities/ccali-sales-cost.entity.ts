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
  name: 'ccali_sales_cst',
  comment: '중대재해 매출액 구간 테이블',
})
@Index(['insProdId'])
@Index(['minSalesCost'])
@Index(['maxSalesCost'])
export class CcaliSalesCost {
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
    name: 'min_sales_cst',
    comment: '최소 매출액',
    type: 'bigint',
    width: 20,
    nullable: true,
  })
  minSalesCost: number;

  @Column({
    name: 'min_sales_cst_op',
    comment: '최소 매출액 연산자(OVER:초과, MORE:이상)',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  minSalesCostOperator: string;

  @Column({
    name: 'max_sales_cst',
    comment: '최대 매출액',
    type: 'bigint',
    width: 20,
    nullable: true,
  })
  maxSalesCost: number;

  @Column({
    name: 'max_sales_cst_op',
    comment: '최대 매출액 연산자(UNDER:미만, LESS:이하)',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  maxSalesCostOperator: string;

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
