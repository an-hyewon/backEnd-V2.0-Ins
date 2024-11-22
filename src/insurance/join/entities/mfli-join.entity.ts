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
  name: 'tb_insured_mfli_info',
  comment: '다중이용업소화재배상책임보험 가입신청 정보 테이블',
})
@Unique(['referId'])
@Index(['insuredBizNo'])
@Index(['deletedYn'])
export class MfliJoin {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'refer_idx',
    comment: '참조 키값',
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  referId: string;

  @Column({
    name: 'biz_type',
    comment: '사업자 구분(P:개인사업자, C:법인사업자, N:사업자아님)',
    type: 'varchar',
    length: 1,
    nullable: false,
    default: 'N',
  })
  bizType: string;

  @Column({
    name: 'insured_biz_no',
    comment: '피보험자 사업자번호',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  insuredBizNo: string;

  @Column({
    name: 'insured_fran_nm',
    comment: '피보험자 상호명',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  insuredFranNm: string;

  @Column({
    name: 'insured_nm',
    comment: '피보험자 성명(대표자명)',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  insuredNm: string;

  @Column({
    name: 'insured_corp_no',
    comment: '피보험자 법인번호(법인)',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  insuredCorpNo: string;

  @Column({
    name: 'insured_rr_no',
    comment: '피보험자 주민번호(법인:앞 7자리, 개인)',
    type: 'varchar',
    length: 14,
    nullable: true,
  })
  insuredRrNo: string;

  @Column({
    name: 'insured_tel_no',
    comment: '피보험자 휴대폰번호',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  insuredTelNo: string;

  @Column({
    name: 'insured_email',
    comment: '피보험자 이메일',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  insuredEmail: string;

  @Column({
    name: 'insured_sno',
    comment: '고유번호(일련번호)',
    type: 'varchar',
    length: 14,
    nullable: true,
  })
  insuredSno: string;

  @Column({
    name: 'insured_owner_yn',
    comment: '피보험자 소유/임차 여부(O: 소유자, T: 임차자)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  insuredOwnerFlag: string;

  @Column({
    name: 'insured_bzc_cd',
    comment: '사업자등록번호 조회시 나오는 업종 코드',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  insuredBzcCd: string;

  @Column({
    name: 'insured_bzc_nm',
    comment: '사업자등록번호 조회시 나오는 업종 이름',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  insuredBzcNm: string;

  @Column({
    name: 'insured_bzc_boon_cd',
    comment: '업종코드(목적물코드)',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  insuredBzcBoonCd: string;

  @Column({
    name: 'insured_bzc_boon_nm',
    comment: '업종명(목적물코드명)',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  insuredBzcBoonNm: string;

  @Column({
    name: 'calc_amt',
    comment: '요율산출기초수(면적, 대수, 객실수, 좌석수, 연간매출액)',
    type: 'varchar',
    length: 21,
    nullable: true,
  })
  calcAmt: string;

  @Column({
    name: 'calc_unit_cd',
    comment: '요율산출기초 단위코드',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  calcUnitCd: string;

  @Column({
    name: 'calc_unit_nm',
    comment: '요율산출기초 단위명',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  calcUnitNm: string;

  @Column({
    name: 'insured_bzc_origin',
    comment:
      '사업자번호 정보 가지고 온 데이터 위치(1:kodata, 2:kodata법인, 3:제로페이, 4:기가입자, 5:글로벌핀테크, 0:없음)',
    type: 'int',
    width: 11,
    nullable: false,
    default: 0,
    unsigned: true,
  })
  insuredBzcOrigin: number;

  @Column({
    name: 'mgm_bldrgst_pk',
    comment: '건축물대장 표제부 PK',
    type: 'varchar',
    length: 33,
    nullable: true,
  })
  mgmBldrgstPk: string;

  @Column({
    name: 'sigungu_cd',
    comment: '시군구코드(표제부)',
    type: 'varchar',
    length: 5,
    nullable: true,
  })
  sigunguCd: string;

  @Column({
    name: 'bjdong_cd',
    comment: '법정동코드(표제부)',
    type: 'varchar',
    length: 5,
    nullable: true,
  })
  bjdongCd: string;

  @Column({
    name: 'new_plat_plc',
    comment: '사업장 소재지',
    type: 'varchar',
    length: 400,
    nullable: true,
  })
  insuredRoadAddr: string;

  @Column({
    name: 'new_plat_plc_etc',
    comment: '사업장 소재지 상세주소',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  insuredRoadAddrDetail: string;

  @Column({
    name: 'zip_cd',
    comment: '우편번호',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  insuredZipCd: string;

  @Column({
    name: 'terms_agree',
    comment: '동의내용(순차적으로 1/2 중 입력)(tb_ins_prod_terms_info 와 join)',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  termsAgree: string;

  @Column({
    name: 'marketing_agree_yn',
    comment: '마케팅 이용동의 여부(선택)(Y:동의 N:미동의)',
    type: 'varchar',
    length: 1,
    nullable: false,
    default: 'N',
  })
  marketingAgreeYn: string;

  @Column({
    name: 'acc_yn',
    comment: '사고여부(Y/N)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  accidentYn: string;

  @Column({
    name: 'join_auto_type',
    comment: '자동 가입 구분(A:자동(보험사 API), M:수동)',
    type: 'varchar',
    length: 2,
    nullable: false,
    default: 'M',
  })
  joinAutoType: string;

  @Column({
    name: 'ins_com',
    comment: '보험사',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  insCom: string;

  @Column({
    name: 'ins_prod_nm',
    comment: '보험 상품명',
    type: 'varchar',
    length: 20,
    nullable: false,
    default: '다중이용',
  })
  insProdNm: string;

  @Column({
    name: 'join_day',
    comment: '가입일',
    type: 'date',
    nullable: false,
    default: () => new Date(),
  })
  joinYmd: Date;

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
    name: 'bd_guaranteed_cost',
    comment: '대인 보장금액(대인 인당 보상한도액)',
    type: 'bigint',
    width: 20,
    nullable: false,
    default: 0,
  })
  bdGuaranteedCost: number;

  @Column({
    name: 'pt_guaranteed_cost',
    comment: '대물 보장금액(대물 사고당 보상한도액)',
    type: 'bigint',
    width: 20,
    nullable: false,
    default: 0,
  })
  ptGuaranteedCost: number;

  @Column({
    name: 'deductible_ins_cost',
    comment: '자기부담금',
    type: 'bigint',
    width: 20,
    nullable: false,
    default: 0,
  })
  deductibleInsCost: number;

  @Column({
    name: 'apply_cost',
    comment: '적용보험료(=결제보험료)',
    type: 'bigint',
    width: 20,
    nullable: false,
    default: 0,
  })
  applyCost: number;

  @Column({
    name: 'tot_ins_cost',
    comment: '총 보험료',
    type: 'bigint',
    width: 20,
    nullable: false,
    default: 0,
  })
  totInsCost: number;

  @Column({
    name: 'pay_yn',
    comment: '결제 여부(Y: 예(유료), N: 아니오(무료))',
    type: 'varchar',
    length: 1,
    nullable: false,
    default: 'Y',
  })
  payYn: string;

  @Column({
    name: 'pay_method',
    comment:
      '결제수단(CARD:신용카드, BANK:계좌이체, VBANK: 가상계좌, DBANK: 무통장입금)',
    type: 'varchar',
    length: 40,
    nullable: true,
  })
  payMethod: string;

  @Column({
    name: 'pay_status',
    comment: '결제 상태(N:결제전, Y:결제완료)',
    type: 'varchar',
    length: 1,
    nullable: true,
    default: 'N',
  })
  payStatusCd: string;

  @Column({
    name: 'pay_dt',
    comment: '결제일시',
    type: 'datetime',
    nullable: true,
  })
  payDt: Date;

  @Column({
    name: 'pay_logs_seq_no',
    comment: '결제 로그 seq_no',
    type: 'int',
    width: 11,
    nullable: false,
    default: 0,
    unsigned: true,
  })
  payLogId: number;

  @Column({
    name: 'cert_logs_seq_no',
    comment: '휴대폰 본인인증 로그 seq_no',
    type: 'int',
    width: 11,
    nullable: false,
    default: 0,
    unsigned: true,
  })
  certLogId: number;

  @Column({
    name: 'biz_member_seq_no',
    comment: '사업자정보 통합테이블(가입보험) seq_no',
    type: 'int',
    width: 11,
    nullable: false,
    default: 0,
    unsigned: true,
  })
  bizMemberId: number;

  @Column({
    name: 'prctr_no',
    comment: '가계약번호(청약번호)',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  prctrNo: string;

  @Column({
    name: 'ins_stock_no',
    comment: '증권번호',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  insStockNo: string;

  @Column({
    name: 'join_renew',
    comment: '보험갱신여부(0:첫가입, 1~ :n차수)',
    type: 'int',
    width: 11,
    nullable: false,
    default: 0,
  })
  joinRenew: number;

  @Column({
    name: 'bf_ins_stock_no',
    comment: '갱신전 증권번호(갱신계약 청약시 갱신 이전 증권번호)',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  beforeInsStockNo: string;

  @Column({
    name: 'join_entry_type',
    comment: '가입 접수 방식(온라인, 어드민)',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  joinEntryType: string;

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
    name: 'join_target_region',
    comment: '가입 대상 지역',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  joinTargetRegion: string;

  @Column({
    name: 'join_period_no',
    comment: '가입 차수',
    type: 'int',
    width: 11,
    nullable: false,
    default: 0,
  })
  joinPeriodNo: number;

  @Column({
    name: 'join_ck',
    comment:
      '가입 상태(N:가입심사중, Y:가입완료(유효), D:가입심사완료(중복), E:가입심사완료(주소오류))',
    type: 'varchar',
    length: 1,
    nullable: false,
    default: 'N',
  })
  joinStatusCd: string;

  @Column({
    name: 'etc',
    comment: '',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  etc: string;

  @Column({
    name: 'refer_json',
    comment: '참고 데이터',
    type: 'varchar',
    length: 2000,
    nullable: true,
  })
  referJson: string;

  @Column({
    name: 'rec_ins_start_dt',
    comment: '보험 시작일(기록용)',
    type: 'datetime',
    nullable: true,
  })
  recInsStartYmd: Date;

  @Column({
    name: 'rec_ins_start_hm',
    comment: '보험 시작 시간(HH:mm)(기록용)',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  recInsStartTime: string;

  @Column({
    name: 'rec_ins_end_dt',
    comment: '보험 종료일(기록용)',
    type: 'datetime',
    nullable: true,
  })
  recInsEndYmd: Date;

  @Column({
    name: 'rec_ins_end_hm',
    comment: '보험 종료 시간(HH:mm)(기록용)',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  recInsEndTime: string;

  @Column({
    name: 'referer',
    comment: '가입한 url 데이터',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  url: string;

  @Column({
    name: 'comment',
    comment: '',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  comments: string;

  @Column({
    name: 'del_yn',
    comment: '삭제 여부(Y/N)',
    type: 'varchar',
    length: 1,
    nullable: false,
  })
  deletedYn: string = 'N';

  @Column({
    name: 'disbursed_dt',
    comment: '수납일시',
    type: 'datetime',
    nullable: true,
  })
  disbursedDt: Date;

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
