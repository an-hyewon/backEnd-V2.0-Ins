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
  name: 'join_cfm',
  comment: '가입확인서 번호 테이블',
})
@Unique(['insProdId', 'joinYmd', 'orderNo'])
@Unique(['joinId'])
@Unique(['joinConfirmNo'])
@Index(['insProdCd'])
@Index(['insComCd'])
@Index(['purps'])
export class JoinConfirm {
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
    name: 'ins_prod_cd',
    comment: '보험상품 코드',
    type: 'varchar',
    length: 5,
    nullable: false,
  })
  insProdCd: string;

  @Column({
    name: 'ins_com_cd',
    comment: '보험사 코드',
    type: 'varchar',
    length: 5,
    nullable: false,
  })
  insComCd: string;

  @Column({
    name: 'join_ymd',
    comment: '가입일(결제일)',
    type: 'date',
    nullable: false,
  })
  joinYmd: Date;

  @Column({
    name: 'order_no',
    comment: '순번',
    type: 'int',
    width: 11,
    nullable: false,
    default: 0,
    unsigned: true,
  })
  orderNo: number;

  @Column({
    name: 'join_id',
    comment: '가입정보 ID',
    type: 'int',
    width: 11,
    nullable: false,
    default: 0,
    unsigned: true,
  })
  joinId: number;

  @Column({
    name: 'join_cfm_no',
    comment: '가입확인서 번호',
    type: 'varchar',
    length: 30,
    nullable: false,
  })
  joinConfirmNo: string;

  @Column({
    name: 'prps',
    comment: '용도 구분(dev: 개발, prod: 운영)',
    type: 'varchar',
    length: 5,
    nullable: false,
  })
  purps: string;

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
