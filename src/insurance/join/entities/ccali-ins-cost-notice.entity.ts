import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { CcaliJoin } from './ccali-join.entity';
import { EmailReceiveLogs } from 'src/mail/entities/email-receive-logs.entity';

@Entity({ name: 'ccali_ins_cst_ntc', comment: '중대재해 보험료 안내 테이블' })
@Unique(['emailReceiveLogsId'])
@Index(['joinId'])
@Index(['insuredBizNo'])
@Index(['phBizNo'])
@Index(['phFranNm'])
export class CcaliInsCostNotice {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'Id',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'join_id',
    comment: '가입 ID',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  joinId: number;

  @Column({
    name: 'eml_rcv_logs_id',
    comment: '메일 수신 로그 ID',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  emailReceiveLogsId: number;

  @Column({
    name: 'eml_snd_logs_id',
    comment: '메일 발신 로그 ID',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  emailSendLogsId: number;

  @Column({
    name: 'insured_biz_no',
    comment: '개별계약자 사업자번호',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  insuredBizNo: string;

  @Column({
    name: 'ph_biz_no',
    comment: '개별계약자 사업자번호',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  phBizNo: string;

  @Column({
    name: 'ph_fran_nm',
    comment: '개별계약자 상호명',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  phFranNm: string;

  @Column({
    name: 'ccali_biz_type_nm',
    comment: '산재가입(중대재해) 업종명',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  ccaliBizTypeNm: string;

  @Column({
    name: 'tot_emp_cnt',
    comment: '근로자수',
    type: 'int',
    width: 11,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  totEmployeeCnt: number;

  @Column({
    name: 'tot_anl_wgs',
    comment: '연임금 총액',
    type: 'bigint',
    width: 20,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  totAnnualWages: number;

  @Column({
    name: 'sub_com_join_cd',
    comment: '자회사 담보 코드(1: Y, 2: N)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  subCompanyJoinCd: string;

  @Column({
    name: 'bf_grnte_1_join_cd',
    comment: '1)기업중대사고 배상책임보험 보통약관 코드(1: Y, 2: N)(신청)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  bfGuarantee1JoinCd: string;

  @Column({
    name: 'bf_grnte_2_join_cd',
    comment: '2)징벌적 손해배상책임 특별약관 코드(1: Y, 2: N)(신청)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  bfGuarantee2JoinCd: string;

  @Column({
    name: 'bf_grnte_3_join_cd',
    comment: '3)중대사고 형사방어비용 특별약관 코드(1: Y, 2: N)(신청)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  bfGuarantee3JoinCd: string;

  @Column({
    name: 'bf_grnte_4_join_cd',
    comment: '4)중대()재해만을 위한 보장 특별약관 코드(1: Y, 2: N)(신청)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  bfGuarantee4JoinCd: string;

  @Column({
    name: 'bf_grnte_5_join_cd',
    comment: '5)기업 중대사고 위기관리실행비용 특별약관 코드(1: Y, 2: N)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  bfGuarantee5JoinCd: string;

  @Column({
    name: 'bf_grnte_6_join_cd',
    comment: '6)민사상 손해배상책임 부담보 특별약관 코드(1: Y, 2: N)(신청)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  bfGuarantee6JoinCd: string;

  @Column({
    name: 'bf_grnte_7_join_cd',
    comment: '7)날짜인식오류 보상제외 특별약관 코드(1: Y, 2: N)(신청)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  bfGuarantee7JoinCd: string;

  @Column({
    name: 'bf_grnte_8_join_cd',
    comment: '8)제재위반 부보장특별약관 코드(1: Y, 2: N)(신청)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  bfGuarantee8JoinCd: string;

  @Column({
    name: 'bf_grnte_9_join_cd',
    comment: '9)테러행위 면책 특별약관 코드(1: Y, 2: N)(신청)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  bfGuarantee9JoinCd: string;

  @Column({
    name: 'bf_grnte_10_join_cd',
    comment: '10)정보기술 특별약관 코드(1: Y, 2: N)(신청)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  bfGuarantee10JoinCd: string;

  @Column({
    name: 'bf_grnte_11_join_cd',
    comment: '11)날짜인식오류 부보장 추가약관 코드(1: Y, 2: N)(신청)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  bfGuarantee11JoinCd: string;

  @Column({
    name: 'bf_grnte_12_join_cd',
    comment: '12)[LMA5399]전염병 면택 특별약관 Ⅱ 코드(1: Y, 2: N)(신청)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  bfGuarantee12JoinCd: string;

  @Column({
    name: 'bf_per_acdnt_cvrg_limit',
    comment: '사고당 보상한도(신청)',
    type: 'bigint',
    width: 20,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  bfPerAccidentCoverageLimit: number;

  @Column({
    name: 'bf_tot_cvrg_limit',
    comment: '증권 총 보상한도(신청)',
    type: 'bigint',
    width: 20,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  bfTotCoverageLimit: number;

  @Column({
    name: 'grnte_1_join_cd',
    comment: '1)기업중대사고 배상책임보험 보통약관 코드(1: Y, 2: N)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  guarantee1JoinCd: string;

  @Column({
    name: 'grnte_2_join_cd',
    comment: '2)징벌적 손해배상책임 특별약관 코드(1: Y, 2: N)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  guarantee2JoinCd: string;

  @Column({
    name: 'grnte_3_join_cd',
    comment: '3)중대사고 형사방어비용 특별약관 코드(1: Y, 2: N)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  guarantee3JoinCd: string;

  @Column({
    name: 'grnte_4_join_cd',
    comment: '4)중대()재해만을 위한 보장 특별약관 코드(1: Y, 2: N)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  guarantee4JoinCd: string;

  @Column({
    name: 'grnte_5_join_cd',
    comment: '5)기업 중대사고 위기관리실행비용 특별약관 코드(1: Y, 2: N)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  guarantee5JoinCd: string;

  @Column({
    name: 'grnte_6_join_cd',
    comment: '6)민사상 손해배상책임 부담보 특별약관 코드(1: Y, 2: N)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  guarantee6JoinCd: string;

  @Column({
    name: 'grnte_7_join_cd',
    comment: '7)날짜인식오류 보상제외 특별약관 코드(1: Y, 2: N)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  guarantee7JoinCd: string;

  @Column({
    name: 'grnte_8_join_cd',
    comment: '8)제재위반 부보장특별약관 코드(1: Y, 2: N)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  guarantee8JoinCd: string;

  @Column({
    name: 'grnte_9_join_cd',
    comment: '9)테러행위 면책 특별약관 코드(1: Y, 2: N)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  guarantee9JoinCd: string;

  @Column({
    name: 'grnte_10_join_cd',
    comment: '10)정보기술 특별약관 코드(1: Y, 2: N)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  guarantee10JoinCd: string;

  @Column({
    name: 'grnte_11_join_cd',
    comment: '11)날짜인식오류 부보장 추가약관 코드(1: Y, 2: N)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  guarantee11JoinCd: string;

  @Column({
    name: 'grnte_12_join_cd',
    comment: '12)[LMA5399]전염병 면택 특별약관 Ⅱ 코드(1: Y, 2: N)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  guarantee12JoinCd: string;

  @Column({
    name: 'per_acdnt_cvrg_limit',
    comment: '사고당 보상한도',
    type: 'bigint',
    width: 20,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  perAccidentCoverageLimit: number;

  @Column({
    name: 'tot_cvrg_limit',
    comment: '증권 총 보상한도',
    type: 'bigint',
    width: 20,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  totCoverageLimit: number;

  @Column({
    name: 'single_ins_cst',
    comment: '일시납 보험료',
    type: 'bigint',
    width: 20,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  singleInsCost: number;

  @Column({
    name: 'bianl_ins_cst',
    comment: '2회납 보험료',
    type: 'bigint',
    width: 20,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  biannualInsCost: number;

  @Column({
    name: 'quarter_ins_cst',
    comment: '4회납 보험료',
    type: 'bigint',
    width: 20,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  quarterlyInsCost: number;

  @Column({
    name: 'prem_cmpt_ymd',
    comment: '보험료 안내일',
    type: 'date',
    nullable: true,
  })
  premCmptYmd: Date;

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

  @ManyToOne(() => CcaliJoin, (join) => join.costNotices)
  @JoinColumn({ name: 'join_id', referencedColumnName: 'id' })
  join: CcaliJoin;

  @OneToOne(() => EmailReceiveLogs, (join) => join.costNotices)
  @JoinColumn({ name: 'eml_rcv_logs_id', referencedColumnName: 'id' })
  emailReceiveLog: EmailReceiveLogs;
}
