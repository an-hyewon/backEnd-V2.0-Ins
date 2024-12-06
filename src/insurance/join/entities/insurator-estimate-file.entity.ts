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
  name: 'insurator_estimate_file',
  comment: '인슈에이터 가견적서 파일 테이블',
})
@Index(['insuratorJoinId'])
export class InsuratorEstimateFile {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'insurator_join_id',
    comment: '',
    type: 'int',
    width: 11,
    nullable: true,
  })
  insuratorJoinId: number;

  @Column({
    name: 'ins_strt_ymd',
    comment: '보험시작일',
    type: 'date',
    nullable: true,
  })
  insStartYmd: Date;

  @Column({
    name: 'ins_strt_tm',
    comment: '보험시작시간',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  insStartTime: string;

  @Column({
    name: 'ins_end_ymd',
    comment: '보험종료일',
    type: 'date',
    nullable: true,
  })
  insEndYmd: Date;

  @Column({
    name: 'ins_end_tm',
    comment: '보험종료시간',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  insEndTime: string;

  @Column({
    name: 'insured_nm',
    comment: '피보험자 명',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  insuredNm: string;

  @Column({
    name: 'insured_biz_no',
    comment: '피보험자 사업자번호',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  insuredBizNo: string;

  @Column({
    name: 'insured_addr',
    comment: '피보험자 주소',
    type: 'varchar',
    length: 400,
    nullable: true,
  })
  insuredAddr: string;

  @Column({
    name: 'insured_addr_dtl',
    comment: '피보험자 상세주소',
    type: 'varchar',
    length: 400,
    nullable: true,
  })
  insuredAddrDetail: string;

  @Column({
    name: 'insured_tel_no',
    comment: '피보험자 휴대폰번호',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  insuredTelNo: string;

  @Column({
    name: 'insured_eml',
    comment: '피보험자 이메일',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  insuredEmail: string;

  @Column({
    name: 'file_url',
    comment: '견적서 URL',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  fileUrl: string;

  @Column({
    name: 'send_yn',
    comment: '견적서 전달여부(Y/N)',
    type: 'varchar',
    length: 1,
    nullable: true,
    default: 'N',
  })
  sendYn: string;

  @Column({
    name: 'send_dt',
    comment: '견적서 전달일시',
    type: 'datetime',
    nullable: true,
  })
  sendDt: Date;

  @Column({
    name: 'comments',
    comment: '코멘트',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  comments: string;

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
