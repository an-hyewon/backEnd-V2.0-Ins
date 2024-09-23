import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { CcaliJoin } from './ccali-join.entity';

@Entity({ name: 'ccali_join_pay_logs', comment: '중대재해 납입 내역 테이블' })
@Unique(['joinId', 'payNo'])
@Index(['joinId'])
@Index(['payScheduledDt'])
export class CcaliJoinPayLogs {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'join_id',
    comment: '가입신청 ID',
    type: 'int',
    width: 10,
    nullable: false,
    default: 0,
    unsigned: true,
  })
  joinId: number;

  @Column({
    name: 'pay_no',
    comment: '결제 회차',
    type: 'tinyint',
    width: 1,
    nullable: false,
    default: 0,
    unsigned: true,
  })
  payNo: number;

  @Column({
    name: 'pay_mthd',
    comment:
      '결제수단(CARD:신용카드, BANK:계좌이체, VBANK: 가상계좌, DBANK: 무통장입금)',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  payMethod: string;

  @Column({
    name: 'pay_ins_cst',
    comment: '결제 보험료(납입 보험료)',
    type: 'bigint',
    width: 20,
    nullable: false,
    default: 0,
    unsigned: true,
  })
  payInsCost: number;

  @Column({
    name: 'pay_logs_id',
    comment: '결제 로그 ID',
    type: 'int',
    width: 11,
    nullable: true,
    default: null,
    unsigned: true,
  })
  payLogsId: number;

  @Column({
    name: 'pay_schdl_dt',
    comment: '결제 예정일시',
    type: 'datetime',
    nullable: false,
  })
  payScheduledDt: Date;

  @Column({
    name: 'pay_du_dt',
    comment: '결제 마감일시',
    type: 'datetime',
    nullable: false,
  })
  payDueDt: Date;

  @Column({
    name: 'pay_dt',
    comment: '결제일시',
    type: 'datetime',
    nullable: true,
  })
  payDt: Date;

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

  @ManyToOne(() => CcaliJoin, (join) => join.joinPayLogs)
  @JoinColumn({ name: 'join_id', referencedColumnName: 'id' })
  join: CcaliJoin;
}
