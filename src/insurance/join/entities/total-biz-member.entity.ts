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
  name: 'tb_total_biz_member',
  comment: '통합 사업자보험 가입 정보 테이블',
})
export class TotalBizMember {
  @PrimaryGeneratedColumn({
    name: 'seq_no',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'insured_biz_no',
    comment: '사업자번호',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  insuredBizNo: string;

  @Column({
    name: 'ins_prod_nm',
    comment: '보험종류',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  insProdNm: string;

  @Column({
    name: 'ins_com',
    comment: '보험사',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  insCom: string;

  @Column({
    name: 'ins_start_dt',
    comment: '보험 시작일',
    type: 'datetime',
    nullable: true,
  })
  insStartYmd: Date;

  @Column({
    name: 'ins_start_hm',
    comment: '보험 시작 시간(HH:mm)',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  insStartTime: string;

  @Column({
    name: 'ins_end_dt',
    comment: '보험 종료일',
    type: 'datetime',
    nullable: true,
  })
  insEndYmd: Date;

  @Column({
    name: 'ins_end_hm',
    comment: '보험 종료 시간(HH:mm)',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  insEndTime: string;

  @Column({
    name: 'join_renew',
    comment: '보험갱신여부(0:첫가입, 1~ :n차수)',
    type: 'int',
    width: 11,
    nullable: true,
    default: 0,
  })
  joinRenew: number;

  @Column({
    name: 'join_day',
    comment: '가입일',
    type: 'date',
    nullable: true,
    default: () => new Date(),
  })
  joinYmd: Date;

  @Column({
    name: 'join_ck',
    comment:
      '가입 상태(N:가입심사중, Y:가입완료(유효), D:가입심사완료(중복), E:가입심사완료(주소오류))',
    type: 'varchar',
    length: 1,
    nullable: true,
    default: 'N',
  })
  joinStatusCd: string;

  @Column({
    name: 'personal_yn',
    comment: '개인정보수집동의',
    type: 'varchar',
    length: 1,
    nullable: true,
    default: 'N',
  })
  marketingAgreeYn: string;

  @Column({
    name: 'merchant_uid',
    comment: '',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  merchantUid: string;

  @Column({
    name: 'paid_info',
    comment: '결제정보(사용X)',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  paidInfo: string;

  @Column({
    name: 'paid_amount',
    comment: '결제금액',
    type: 'bigint',
    width: 20,
    nullable: true,
  })
  paidAmount: number;

  @Column({
    name: 'join_account',
    comment: '제휴사',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  joinAccount: string;

  @Column({
    name: 'join_path',
    comment: '가입 경로(채널)',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  joinPath: string;

  @Column({
    name: 'referer',
    comment: '가입한 url',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  url: string;

  @CreateDateColumn({
    name: 'createdAt',
    comment: '생성일시',
    type: 'datetime',
    nullable: false,
  })
  createdDt: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
    comment: '수정일시',
    type: 'datetime',
    nullable: false,
  })
  updatedDt: Date;

  @DeleteDateColumn({
    name: 'deletedAt',
    comment: '삭제일시',
    type: 'datetime',
    nullable: true,
  })
  deletedDt: Date;
}
