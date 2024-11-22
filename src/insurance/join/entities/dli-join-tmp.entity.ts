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
  name: 'tb_insured_dli_info_tmp',
  comment: '재난배상책임보험 인슈에이터 임시저장 테이블',
})
@Unique(['referId'])
@Index(['plannerId'])
@Index(['insuredBizNo'])
@Index(['deletedYn'])
export class DliJoinTmp {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'planner_id',
    comment: '설계사 ID',
    type: 'int',
    width: 11,
    nullable: false,
  })
  plannerId: number;

  @Column({
    name: 'refer_idx',
    comment: '참조 키값',
    type: 'varchar',
    length: 20,
    nullable: true,
    unsigned: true,
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
  insuredBizNoGbCd: string;

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
    name: 'bld_clearance_cd',
    comment: '주위건물 이격거리 코드(KB 주유소)',
    type: 'varchar',
    length: 2,
    nullable: true,
  })
  bldClearanceCd: string;

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
    name: 'plat_plc',
    comment: '사업장 소재지(지번)',
    type: 'varchar',
    length: 400,
    nullable: true,
  })
  insuredJibunAddr: string;

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
    default: '재난배상',
  })
  insProdNm: string;

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
    name: 'prem_cmpt_log_id',
    comment: '보험료 조회 로그 ID',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  premCmptLogId: number;

  @Column({
    name: 'prctr_no',
    comment: '가계약번호(청약번호)',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  prctrNo: string;

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
    name: 'etc',
    comment: '',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  etc: string;

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
