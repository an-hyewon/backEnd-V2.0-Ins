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

@Entity({
  name: 'dsf_six_gruop_join_upload',
  comment: '풍수해6 단체가입 업로드 내역 테이블',
})
@Index(['tfId'])
export class DsfSixGruopJoinUpload {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'Id',
    type: 'int',
    unsigned: true,
  })
  id: number;

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
    length: 50,
    nullable: true,
  })
  insuredFranNm: string;

  @Column({
    name: 'insured_nm',
    comment: '피보험자 명',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  insuredNm: string;

  @Column({
    name: 'insured_tel_no',
    comment: '피보험자 휴대폰번호',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  insuredTelNo: string;

  @Column({
    name: 'address',
    comment: '주소',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  Address: string;

  @Column({
    name: 'address_detail',
    comment: '상세주소',
    type: 'varchar',
    length: 120,
    nullable: true,
  })
  AddressDetail: string;

  @Column({
    name: 'tenant',
    comment: '임차 여부',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  tenant: string;

  @Column({
    name: 'underground',
    comment: '지하소재',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  underground: string;

  @Column({
    name: 'ins_target',
    comment: '물건구분(일반, 공장)',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  insTarget: string;

  @Column({
    name: 'using_all_flr',
    comment: '건물전체가입여부',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  usingAllFlr: string;

  @Column({
    name: 'using_flr_nm_list',
    comment: '가입층수',
    type: 'text',
    nullable: true,
  })
  usingFlrNmList: string;

  @Column({
    name: 'ins_cost_bld',
    comment: '건물 가입금액',
    type: 'bigint',
    width: 20,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  insCostBld: number;

  @Column({
    name: 'ins_cost_mach',
    comment: '기계 가입금액',
    type: 'bigint',
    width: 20,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  insCostMach: number;

  @Column({
    name: 'ins_cost_fcl',
    comment: '시설 및 집기비품 가입금액',
    type: 'bigint',
    width: 20,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  insCostFcl: number;

  @Column({
    name: 'ins_cost_inven',
    comment: '재고자산 가입금액',
    type: 'bigint',
    width: 20,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  insCostInven: number;

  @Column({
    name: 'ins_cost_deductible',
    comment: '자기부담금',
    type: 'bigint',
    width: 20,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  insCostDeductible: number;

  @Column({
    name: 'ins_cost_shop_sign',
    comment: '야외간판 특약 가입금액',
    type: 'bigint',
    width: 20,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  insCostShopSign: number;

  @Column({
    name: 'group_nm',
    comment: '단체명',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  groupNm: string;

  @Column({
    name: 'ins_com_cd',
    comment: '보험사 코드',
    type: 'varchar',
    length: 5,
    nullable: true,
  })
  insComCd: string;

  @Column({
    name: 'zip_cd',
    comment: '우편번호',
    type: 'varchar',
    length: 8,
    nullable: true,
  })
  zipCd: string;

  @Column({
    name: 'road_addr',
    comment: '도로명 주소',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  roadAddr: string;

  @Column({
    name: 'jibun_addr',
    comment: '지번 주소',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  jibunAddr: string;

  @Column({
    name: 'addr_detail',
    comment: '상세주소',
    type: 'varchar',
    length: 120,
    nullable: true,
  })
  addrDetail: string;

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
    name: 'plat_gb_cd',
    comment: '대지구분코드(0:대지 1:산 2:블록)(표제부)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  platGbCd: string;

  @Column({
    name: 'bun',
    comment: '번(표제부)',
    type: 'varchar',
    length: 4,
    nullable: true,
  })
  bun: string;

  @Column({
    name: 'ji',
    comment: '지(표제부)',
    type: 'varchar',
    length: 4,
    nullable: true,
  })
  ji: string;

  @Column({
    name: 'mgm_bldrgst_pk',
    comment: '건축물대장 표제부 PK',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  mgmBldrgstPk: string;

  @Column({
    name: 'mgm_bldrgst_expos',
    comment: '건축물대장 전유부 PK',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  mgmBldrgstExpos: string;

  @Column({
    name: 'biznum_status_ck',
    comment:
      '사업자등록 상태조회(휴폐업조회) 여부(N:조회X Y:계속사업자 F:휴폐업자)',
    type: 'varchar',
    length: 1,
    nullable: true,
    default: 'N',
  })
  biznumStatusCk: string;

  @Column({
    name: 'err_cd',
    comment: '에러코드',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  errCd: string;

  @Column({
    name: 'err_msg',
    comment: '에러메시지',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  errMsg: string;

  @Column({
    name: 'tf_id',
    comment: '가입신청 테이블 seq_no',
    type: 'int',
    width: 11,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  tfId: number;

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
