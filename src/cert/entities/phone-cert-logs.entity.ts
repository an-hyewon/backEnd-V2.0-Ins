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
  name: 'tb_certifications_logs',
  comment: '휴대폰 본인인증 로그 테이블',
})
@Unique(['impUid'])
@Index(['merchantUid'])
@Index(['insuredBizNo'])
@Index(['referIdx'])
@Index(['name'])
@Index(['phone'])
@Index(['uniqueKey'])
export class PhoneCertLogs {
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
    name: 'refer_idx',
    comment: '참조 키값',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  referIdx: string;

  @Column({
    name: 'success',
    comment: '성공여부(0: False, 1: True)',
    type: 'int',
    width: 11,
    nullable: false,
  })
  success: number;

  @Column({
    name: 'imp_uid',
    comment: '포트원 인증 고유번호',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  impUid: string;

  @Column({
    name: 'merchant_uid',
    comment: '가맹점 주문번호',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  merchantUid: string;

  @Column({
    name: 'request_id',
    comment: '',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  requestId: string;

  @Column({
    name: 'pg_tid',
    comment: 'PG사 본인인증결과 고유번호',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  pgTid: string;

  @Column({
    name: 'pg_provider',
    comment: 'PG사 구분코드',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  pgProvider: string;

  @Column({
    name: 'name',
    comment: '이름',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  name: string;

  @Column({
    name: 'gender',
    comment: '성별',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  gender: string;

  @Column({
    name: 'birth',
    comment: '',
    type: 'int',
    width: 11,
    nullable: true,
  })
  birth: number;

  @Column({
    name: 'birthday',
    comment: '생년월일(YYYY-MM-DD)',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  birthday: string;

  @Column({
    name: 'foreigner',
    comment:
      '외국인 여부(다날 본인인증서비스 계약시 외국인 구분기능 추가/그 외 false)(0: False, 1: True)',
    type: 'int',
    width: 11,
    nullable: true,
  })
  foreigner: number;

  @Column({
    name: 'phone',
    comment: '휴대폰번호',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  phone: string;

  @Column({
    name: 'carrier',
    comment: '통신사',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  carrier: string;

  @Column({
    name: 'certified',
    comment: '인증성공여부(0: False, 1: True)',
    type: 'int',
    width: 11,
    nullable: true,
  })
  certified: number;

  @Column({
    name: 'certified_at',
    comment: '인증처리시각(UNIX timestamp)',
    type: 'int',
    width: 11,
    nullable: true,
  })
  certifiedAt: number;

  @Column({
    name: 'unique_key',
    comment: '개인 고유구분 식별키',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  uniqueKey: string;

  @Column({
    name: 'unique_in_site',
    comment: '가맹점 내 개인 고유구분 식별키',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  uniqueInSite: string;

  @Column({
    name: 'origin',
    comment: '웹 페이지 URL',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  origin: string;

  @Column({
    name: 'foreigner_v2',
    comment:
      '외국인 여부(다날 본인인증서비스 계약시 외국인 구분기능 추가/그 외 null)(0: False, 1: True)',
    type: 'int',
    width: 11,
    nullable: true,
  })
  foreignerV2: number;

  @CreateDateColumn({
    name: 'created_dt',
    comment: '생성일시',
    type: 'datetime',
    nullable: false,
  })
  createdDt: Date;

  @UpdateDateColumn({
    name: 'updated_dt',
    comment: '수정일시',
    type: 'datetime',
    nullable: false,
  })
  updatedDt: Date;

  @DeleteDateColumn({
    name: 'deleted_dt',
    comment: '삭제일시',
    type: 'datetime',
    nullable: true,
  })
  deletedDt: Date;
}
