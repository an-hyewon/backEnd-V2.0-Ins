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
  name: 'ccali_emp_cnt',
  comment: '중대재해 근로자수 구간 테이블',
})
@Index(['insProdId'])
@Index(['minEmployeeCnt'])
@Index(['maxEmployeeCnt'])
export class CcaliEmployeeCnt {
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
    name: 'min_emp_cnt',
    comment: '최소 근로자수',
    type: 'int',
    width: 11,
    nullable: true,
  })
  minEmployeeCnt: number;

  @Column({
    name: 'min_emp_cnt_op',
    comment: '최소 근로자수 연산자(OVER:초과, MORE:이상)',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  minEmployeeCntOperator: string;

  @Column({
    name: 'max_emp_cnt',
    comment: '최대 근로자수',
    type: 'int',
    width: 11,
    nullable: true,
  })
  maxEmployeeCnt: number;

  @Column({
    name: 'max_emp_cnt_op',
    comment: '최대 근로자수 연산자(UNDER:미만, LESS:이하)',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  maxEmployeeCntOperator: string;

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
