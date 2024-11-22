import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'total_formmembers', comment: '풍수해6 가입신청 정보 테이블' })
@Unique(['referIdx'])
export class DsfSixJoin {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'Id',
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
  referIdx: string;

  @Column({
    name: 'businessnumber',
    comment: '사업자번호',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  insuredBizNo: string;

  @Column({
    name: 'company',
    comment: '상호명',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  insuredFranNm: string;

  @Column({
    name: 'phone',
    comment: '가입자 휴대폰번호',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  insuredTelNo: string;

  @Column({
    name: 'zonecode',
    comment: '우편번호',
    type: 'varchar',
    length: 8,
    nullable: true,
  })
  zipCd: string;

  @Column({
    name: 'address',
    comment: '도로명주소',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  insuredRoadAddr: string;

  @Column({
    name: 'oldaddress',
    comment: '지번주소',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  insuredJibunAddr: string;

  @Column({
    name: 'addressdetail',
    comment: '상세주소',
    type: 'varchar',
    length: 120,
    nullable: true,
  })
  insuredAddrDetail: string;

  @Column({
    name: 'pnu',
    comment: '필지고유번호',
    type: 'varchar',
    length: 19,
    nullable: true,
  })
  pnu: string;

  @Column({
    name: 'sido',
    comment: '시/도',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  sido: string;

  @Column({
    name: 'citycode',
    comment: '풍수해 시군구코드',
    type: 'varchar',
    length: 6,
    nullable: true,
  })
  citycode: string;

  @Column({
    name: 'city_text_1',
    comment: '',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  cityText1: string;

  @Column({
    name: 'city_text_2',
    comment: '',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  cityText2: string;

  @Column({
    name: 'structure',
    comment: '영업장 건물구조',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  structure: string;

  @Column({
    name: 'etcstructure',
    comment: '영업장 건물구조(상세)',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  etcstructure: string;

  @Column({
    name: 'tenant',
    comment: '임차 여부(임차자, 소유자)',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  tenant: string;

  @Column({
    name: 'underground',
    comment: '지하소재 여부(예, 아니오)',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  underground: string;

  @Column({
    name: 'floor',
    comment: '건물 전체 층수',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  floor: string;

  @Column({
    name: 'subfloor',
    comment: '건물 시작층',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  subfloor: string;

  @Column({
    name: 'endsubfloor',
    comment: '건물 끝층',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  endsubfloor: string;

  @Column({
    name: 'biztype',
    comment: '소상공인 구분(소상인, 소공인)',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  biztype: string;

  @Column({
    name: 'bizcategory',
    comment: '업종',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  bizcategory: string;

  @Column({
    name: 'ins_target',
    comment: '물건구분(일반, 공장)',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  insTarget: string;

  @Column({
    name: 'insured_corp_no',
    comment: '피보험자 법인등록번호',
    type: 'varchar',
    length: 13,
    nullable: true,
  })
  insuredCorpNo: string;

  @Column({
    name: 'insured_corp_ntnlty',
    comment: '피보험자 법인 국적',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  insuredCorpNationality: string;

  @Column({
    name: 'insured_corp_fndn_ymd',
    comment: '피보험자 법인 설립일(YYYYMMDD)',
    type: 'date',
    nullable: true,
  })
  insuredCorpFoundationYmd: Date;

  @Column({
    name: 'insured_phone_no',
    comment: '피보험자 휴대폰번호',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  insuredPhoneNo: string;

  @Column({
    name: 'insured_unique_key',
    comment: '피보험자 본인인증 unique key',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  insuredUniqueKey: string;

  @Column({
    name: 'insured_cert_logs_id',
    comment: '피보험자 본인인증 로그 ID',
    type: 'int',
    width: 11,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  insuredCertLogsId: number;

  @Column({
    name: 'insured_rr_no',
    comment: '피보험자 주민번호',
    type: 'varchar',
    length: 14,
    nullable: true,
  })
  insuredRrNo: string;

  @Column({
    name: 'insured_eml',
    comment: '피보험자 이메일',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  insuredEmail: string;

  @Column({
    name: 'insured_zip_cd',
    comment: '피보험자 우편번호',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  insuredZipCd: string;

  @Column({
    name: 'insured_bzc_origin',
    comment:
      '사업자번호 정보 가지고 온 데이터 위치(1:kodata, 2:kodata법인, 3:제로페이, 4:기가입자, 5:글로벌핀테크, 0:없음)',
    type: 'int',
    width: 11,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  insuredBzcOrigin: number;

  @Column({
    name: 'nts_biz_type_id',
    comment: '국세청 업종 ID',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  ntsBizTypeId: number;

  @Column({
    name: 'nts_biz_type_cd',
    comment: '국세청 업종코드',
    type: 'varchar',
    length: 6,
    nullable: true,
  })
  ntsBizTypeCd: string;

  @Column({
    name: 'nts_biz_type_nm',
    comment: '국세청 업종명',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  ntsBizTypeNm: string;

  @Column({
    name: 'ccali_biz_type_id',
    comment: '중대재해 업종 ID',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  ccaliBizTypeId: number;

  @Column({
    name: 'ccali_biz_type_cd',
    comment: '중대재해 업종코드',
    type: 'varchar',
    length: 5,
    nullable: true,
  })
  ccaliBizTypeCd: string;

  @Column({
    name: 'ccali_biz_type_nm',
    comment: '중대재해 업종명',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  ccaliBizTypeNm: string;

  @Column({
    name: 'kor_biz_type_id',
    comment: '표준산업코드 업종 ID',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  korBizTypeId: number;

  @Column({
    name: 'sales_cst',
    comment: '연간 매출액',
    type: 'bigint',
    width: 20,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  salesCost: number;

  @Column({
    name: 'reg_emp_cnt',
    comment: '소속 상시 근로자수',
    type: 'int',
    width: 11,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  regularEmployeeCnt: number;

  @Column({
    name: 'dspt_emp_cnt',
    comment: '파견 근로자수',
    type: 'int',
    width: 11,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  dispatchedEmployeeCnt: number;

  @Column({
    name: 'sbctr_emp_cnt',
    comment: '소속 외 하도급 근로자 수',
    type: 'int',
    width: 11,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  subcontractEmployeeCnt: number;

  @Column({
    name: 'tot_emp_cnt',
    comment: '총 근로자수',
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
    name: 'opened_current_year_yn',
    comment: '사업자 개업연도 올해 여부(Y: 올해, N: 올해 이전)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  openedCurrentYearYn: string;

  @Column({
    name: 'referral_hstry_yn',
    comment: '중대재해 처벌법에 따른 송치 이력 여부(Y/N)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  referralHistoryYn: string;

  @Column({
    name: 'grnte_dstr_cd',
    comment: '보장재해 코드',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  guaranteeDisaterCd: string;

  @Column({
    name: 'grnte_rgn_cd',
    comment: '보험 담보지역 코드',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  guaranteeRegionCd: string;

  @Column({
    name: 'sub_com_join_yn',
    comment: '자회사 가입 여부(Y/N)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  subCompanyJoinYn: string;

  @Column({
    name: 'prdt_type',
    comment: '제조하는 생산물 종류',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  productType: string;

  @Column({
    name: 'high_risk_prdt',
    comment: '고위험 품목',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  highRiskProducts: string;

  @Column({
    name: 'pay_yn',
    comment: '결제 여부(N:무료/Y:유료)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  payYn: string;

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
    name: 'pay_stts_cd',
    comment:
      '결제 상태(N:결제전, Y:결제완료, C:결제취소, I: 분납 결제 진행중, U: 연체)',
    type: 'varchar',
    length: 1,
    nullable: true,
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
    name: 'pay_logs_id',
    comment: '결제 로그 ID',
    type: 'int',
    width: 11,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  payLogsId: number;

  @Column({
    name: 'cvrg_limit_id',
    comment: '보상한도 ID',
    type: 'int',
    width: 11,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  coverageLimitId: number;

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
    name: 'deductible_ins_cst',
    comment: '자기부담금',
    type: 'bigint',
    width: 20,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  deductibleInsCost: number;

  @Column({
    name: 'dscnt_ins_cst',
    comment: '할인 금액',
    type: 'bigint',
    width: 20,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  discountInsCost: number;

  @Column({
    name: 'instalment_no',
    comment: '보험료 분납 횟수',
    type: 'int',
    width: 11,
    nullable: true,
    default: 1,
    unsigned: true,
  })
  instalmentNo: number;

  @Column({
    name: 'pay_no',
    comment: '결제 회차',
    type: 'int',
    width: 11,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  payNo: number;

  @Column({
    name: 'pay_ins_cst',
    comment: '결제 보험료(납입 보험료)',
    type: 'bigint',
    width: 20,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  payInsCost: number;

  @Column({
    name: 'tot_ins_cst',
    comment: '총 보험료',
    type: 'bigint',
    width: 20,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  totInsCost: number;

  @Column({
    name: 'prem_cmpt_dt',
    comment: '보험료 산출 일시',
    type: 'datetime',
    nullable: true,
  })
  premCmptDt: Date;

  @Column({
    name: 'join_stts_cd',
    comment:
      '가입상태(W: 신청중, Y: 가입완료, N: 가입신청(결제전), C: 취소, X: 만료)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  joinStatusCd: string;

  @Column({
    name: 'join_ymd',
    comment: '가입일',
    type: 'date',
    nullable: true,
  })
  joinYmd: Date;

  @Column({
    name: 'ins_strt_ymd',
    comment: '보험 시작일',
    type: 'date',
    nullable: true,
  })
  insStartYmd: Date;

  @Column({
    name: 'ins_strt_tm',
    comment: '보험 시작 시분(HH:mm)',
    type: 'varchar',
    length: 5,
    nullable: true,
  })
  insStartTime: string;

  @Column({
    name: 'ins_end_ymd',
    comment: '보험 종료일',
    type: 'date',
    nullable: true,
  })
  insEndYmd: Date;

  @Column({
    name: 'ins_end_tm',
    comment: '보험 종료 시분(HH:mm)',
    type: 'varchar',
    length: 5,
    nullable: true,
  })
  insEndTime: string;

  @Column({
    name: 'ins_stock_no',
    comment: '증권번호',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  insStockNo: string;

  @Column({
    name: 'join_renew_no',
    comment: '보험 갱신 차수(0: 첫가입, 1~n: 차수)',
    type: 'int',
    width: 11,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  joinRenewNo: number;

  @Column({
    name: 'bf_refer_idx',
    comment: '이전 참조 키값(신규/갱신 포함)',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  beforeReferIdx: string;

  @Column({
    name: 'bf_ins_stock_no',
    comment: '갱신전 증권번호(갱신계약 청약시 갱신 이전 증권번호)',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  beforeInsStockNo: string;

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
    name: 'rcmdr_org',
    comment: '추천인 소속',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  recommenderOrganization: string;

  @Column({
    name: 'rcmdr_nm',
    comment: '추천인',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  recommenderNm: string;

  @Column({
    name: 'mrktg_agre_yn',
    comment: '마케팅 동의 여부(Y/N)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  marketingAgreeYn: string;

  @Column({
    name: 'join_entry_type',
    comment: '가입 접수 방식(WEB:온라인, ADMIN:어드민)',
    type: 'varchar',
    length: 5,
    nullable: true,
  })
  joinEntryType: string = 'WEB';

  @Column({
    name: 'url',
    comment: '가입한 URL',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  url: string;

  @Column({
    name: 'dsbr_dt',
    comment: '수납일시',
    type: 'datetime',
    nullable: true,
  })
  disbursedDt: Date;

  @Column({
    name: 'cncl_dt',
    comment: '해지일시',
    type: 'datetime',
    nullable: true,
  })
  cancelDt: Date;

  @Column({
    name: 'rfnd_bacnt_bank_nm',
    comment: '환불 계좌 은행 명',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  refundBankNm: string;

  @Column({
    name: 'rfnd_actno',
    comment: '환불 계좌번호',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  refundAccount: string;

  @Column({
    name: 'rnfd_bacnt_dpstr',
    comment: '환불 계좌 예금주',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  refundAccountDepositorNm: string;

  @Column({
    name: 'rfnd_cst',
    comment: '환불 금액',
    type: 'bigint',
    width: 20,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  refundCost: number;

  @Column({
    name: 'rnfd_dt',
    comment: '환불일시',
    type: 'datetime',
    nullable: true,
  })
  refundDt: Date;

  @Column({
    name: 'comments',
    comment: '코멘트',
    type: 'text',
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
