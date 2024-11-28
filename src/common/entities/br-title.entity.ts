import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ name: 'tb_br_title_info', comment: '건축물대장 표제부' })
@Index(['sigunguCd', 'bjdongCd', 'platGbCd', 'bun', 'ji'])
@Index(['sigunguCd'])
@Index(['etcPurps'])
@Index(['pmsDay'])
@Index(['useAprDay'])
export class BrTitle {
  @PrimaryColumn({
    name: 'mgm_bldrgst_pk',
    comment: '관리건축물대장PK',
    type: 'varchar',
    length: 33,
    nullable: false,
    default: '',
  })
  mgmBldrgstPk: string;

  @Column({
    name: 'regstr_gb_cd',
    comment: '대장구분코드',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  regstrGbCd: string;

  @Column({
    name: 'regstr_gb_cd_nm',
    comment: '대장구분코드명',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  regstrGbCdNm: string;

  @Column({
    name: 'regstr_kind_cd',
    comment: '대장종류코드',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  regstrKindCd: string;

  @Column({
    name: 'regstr_kind_cd_nm',
    comment: '대장종류코드명',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  regstrKindCdNm: string;

  @Column({
    name: 'plat_plc',
    comment: '대지위치',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  platPlc: string;

  @Column({
    name: 'new_plat_plc',
    comment: '도로명대지위치',
    type: 'varchar',
    length: 400,
    nullable: true,
  })
  newPlatPlc: string;

  @Column({
    name: 'bld_nm',
    comment: '건물명',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  bldNm: string;

  @Column({
    name: 'sigungu_cd',
    comment: '행정표준코드',
    type: 'varchar',
    length: 5,
    nullable: true,
  })
  sigunguCd: string;

  @Column({
    name: 'bjdong_cd',
    comment: '행정표준코드',
    type: 'varchar',
    length: 5,
    nullable: true,
  })
  bjdongCd: string;

  @Column({
    name: 'plat_gb_cd',
    comment: '0:대지 1:산 2:블록',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  platGbCd: string;

  @Column({
    name: 'bun',
    comment: '번',
    type: 'varchar',
    length: 4,
    nullable: true,
  })
  bun: string;

  @Column({
    name: 'ji',
    comment: '지',
    type: 'varchar',
    length: 4,
    nullable: true,
  })
  ji: string;

  @Column({
    name: 'splot_nm',
    comment: '특수지명',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  splotNm: string;

  @Column({
    name: 'block',
    comment: '블록',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  block: string;

  @Column({
    name: 'lot',
    comment: '로트',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  lot: string;

  @Column({
    name: 'bylot_cnt',
    comment: '외필지수',
    type: 'mediumint',
    width: 5,
    nullable: true,
  })
  bylotCnt: number;

  @Column({
    name: 'na_road_cd',
    comment: '새주소도로코드',
    type: 'varchar',
    length: 12,
    nullable: true,
  })
  naRoadCd: string;

  @Column({
    name: 'na_bjdong_cd',
    comment: '새주소법정동코드',
    type: 'varchar',
    length: 5,
    nullable: true,
  })
  naBjdongCd: string;

  @Column({
    name: 'na_ugrnd_cd',
    comment: '새주소지상지하코드',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  naUgrndCd: string;

  @Column({
    name: 'na_main_bun',
    comment: '새주소본번',
    type: 'mediumint',
    width: 5,
    nullable: true,
  })
  naMainBun: number;

  @Column({
    name: 'na_sub_bun',
    comment: '새주소부번',
    type: 'mediumint',
    width: 5,
    nullable: true,
  })
  naSubBun: number;

  @Column({
    name: 'dong_nm',
    comment: '동명',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  dongNm: string;

  @Column({
    name: 'main_atch_gb_cd',
    comment: '주부속구분코드',
    type: 'char',
    length: 1,
    nullable: true,
  })
  mainAtchGbCd: string;

  @Column({
    name: 'main_atch_gb_cd_nm',
    comment: '주부속구분코드명',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  mainAtchGbCdNm: string;

  @Column({
    name: 'plat_area',
    comment: '대지면적(㎡)',
    type: 'decimal',
    precision: 19,
    scale: 9,
    nullable: true,
  })
  platArea: number;

  @Column({
    name: 'arch_area',
    comment: '건축면적(㎡)',
    type: 'decimal',
    precision: 19,
    scale: 9,
    nullable: true,
  })
  archArea: number;

  @Column({
    name: 'bc_rat',
    comment: '건폐율(%)',
    type: 'decimal',
    precision: 19,
    scale: 9,
    nullable: true,
  })
  bcRat: number;

  @Column({
    name: 'tot_area',
    comment: '연면적(㎡)',
    type: 'decimal',
    precision: 19,
    scale: 9,
    nullable: true,
  })
  totArea: number;

  @Column({
    name: 'vl_rat_estm_tot_area',
    comment: '용적률산정연면적(㎡)',
    type: 'decimal',
    precision: 19,
    scale: 9,
    nullable: true,
  })
  vlRatEstmTotArea: number;

  @Column({
    name: 'vl_rat',
    comment: '용적률(%)',
    type: 'decimal',
    precision: 19,
    scale: 9,
    nullable: true,
  })
  vlRat: number;

  @Column({
    name: 'strct_cd',
    comment: '구조코드',
    type: 'varchar',
    length: 2,
    nullable: true,
  })
  strctCd: string;

  @Column({
    name: 'strct_cd_nm',
    comment: '구조코드명',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  strctCdNm: string;

  @Column({
    name: 'etc_strct',
    comment: '기타구조',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  etcStrct: string;

  @Column({
    name: 'main_purps_cd',
    comment: '주용도코드',
    type: 'varchar',
    length: 5,
    nullable: true,
  })
  mainPurpsCd: string;

  @Column({
    name: 'main_purps_cd_nm',
    comment: '주용도코드명',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  mainPurpsCdNm: string;

  @Column({
    name: 'etc_purps',
    comment: '기타용도',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  etcPurps: string;

  @Column({
    name: 'roof_cd',
    comment: '지붕코드',
    type: 'varchar',
    length: 2,
    nullable: true,
  })
  roofCd: string;

  @Column({
    name: 'roof_cd_nm',
    comment: '지붕코드명',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  roofCdNm: string;

  @Column({
    name: 'etc_roof',
    comment: '기타지붕',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  etcRoof: string;

  @Column({
    name: 'hhld_cnt',
    comment: '세대수(세대)',
    type: 'mediumint',
    width: 5,
    nullable: true,
  })
  hhldCnt: number;

  @Column({
    name: 'fmly_cnt',
    comment: '가구수(가구)',
    type: 'mediumint',
    width: 5,
    nullable: true,
  })
  fmlyCnt: number;

  @Column({
    name: 'heit',
    comment: '높이(m)',
    type: 'decimal',
    precision: 19,
    scale: 9,
    nullable: true,
  })
  heit: number;

  @Column({
    name: 'grnd_flr_cnt',
    comment: '지상층수',
    type: 'mediumint',
    width: 5,
    nullable: true,
  })
  grndFlrCnt: number;

  @Column({
    name: 'ugrnd_flr_cnt',
    comment: '지하층수',
    type: 'mediumint',
    width: 5,
    nullable: true,
  })
  ugrndFlrCnt: number;

  @Column({
    name: 'ride_use_elvt_cnt',
    comment: '승용승강기수',
    type: 'mediumint',
    width: 5,
    nullable: true,
  })
  rideUseElvtCnt: number;

  @Column({
    name: 'emgen_use_elvt_cnt',
    comment: '비상용승강기수',
    type: 'mediumint',
    width: 5,
    nullable: true,
  })
  emgenUseElvtCnt: number;

  @Column({
    name: 'atch_bld_cnt',
    comment: '부속건축물수',
    type: 'mediumint',
    width: 5,
    nullable: true,
  })
  atchBldCnt: number;

  @Column({
    name: 'atch_bld_area',
    comment: '부속건축물면적(㎡)',
    type: 'decimal',
    precision: 19,
    scale: 9,
    nullable: true,
  })
  atchBldArea: number;

  @Column({
    name: 'tot_dong_tot_area',
    comment: '총동연면적(㎡)',
    type: 'decimal',
    precision: 19,
    scale: 9,
    nullable: true,
  })
  totDongTotArea: number;

  @Column({
    name: 'indr_mech_utcnt',
    comment: '옥내기계식대수(대)',
    type: 'mediumint',
    width: 6,
    nullable: true,
  })
  indrMechUtcnt: number;

  @Column({
    name: 'indr_mech_area',
    comment: '옥내기계식면적(㎡)',
    type: 'decimal',
    precision: 19,
    scale: 9,
    nullable: true,
  })
  indrMechArea: number;

  @Column({
    name: 'oudr_mech_utcnt',
    comment: '옥외기계식대수(대)',
    type: 'mediumint',
    width: 6,
    nullable: true,
  })
  oudrMechUtcnt: number;

  @Column({
    name: 'oudr_mech_area',
    comment: '옥외기계식면적(㎡)',
    type: 'decimal',
    precision: 19,
    scale: 9,
    nullable: true,
  })
  oudrMechArea: number;

  @Column({
    name: 'indr_auto_utcnt',
    comment: '옥내자주식대수(대)',
    type: 'mediumint',
    width: 6,
    nullable: true,
  })
  indrAutoUtcnt: number;

  @Column({
    name: 'indr_auto_area',
    comment: '옥내자주식면적(㎡)',
    type: 'decimal',
    precision: 19,
    scale: 9,
    nullable: true,
  })
  indrAutoArea: number;

  @Column({
    name: 'oudr_auto_utcnt',
    comment: '옥외자주식대수(대)',
    type: 'mediumint',
    width: 6,
    nullable: true,
  })
  oudrAutoUtcnt: number;

  @Column({
    name: 'oudr_auto_area',
    comment: '옥내자주식면적(㎡)',
    type: 'decimal',
    precision: 19,
    scale: 9,
    nullable: true,
  })
  oudrAutoArea: number;

  @Column({
    name: 'pms_day',
    comment: '허가일',
    type: 'varchar',
    length: 8,
    nullable: true,
  })
  pmsDay: string;

  @Column({
    name: 'stcns_day',
    comment: '착공일',
    type: 'varchar',
    length: 8,
    nullable: true,
  })
  stcnsDay: string;

  @Column({
    name: 'use_apr_day',
    comment: '사용승인일',
    type: 'varchar',
    length: 8,
    nullable: true,
  })
  useAprDay: string;

  @Column({
    name: 'pmsno_year',
    comment: '허가번호년',
    type: 'varchar',
    length: 4,
    nullable: true,
  })
  pmsnoYear: string;

  @Column({
    name: 'pmsno_kik_cd',
    comment: '허가번호기관코드',
    type: 'char',
    length: 7,
    nullable: true,
  })
  pmsnoKikCd: string;

  @Column({
    name: 'pmsno_kik_cd_nm',
    comment: '허가번호기관코드명',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  pmsnoKikCdNm: string;

  @Column({
    name: 'pmsno_gb_cd',
    comment: '허가번호구분코드',
    type: 'varchar',
    length: 4,
    nullable: true,
  })
  pmsnoGbCd: string;

  @Column({
    name: 'pmsno_gb_cd_nm',
    comment: '허가번호구분코드명',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  pmsnoGbCdNm: string;

  @Column({
    name: 'ho_cnt',
    comment: '호수(호)',
    type: 'mediumint',
    width: 5,
    nullable: true,
  })
  hoCnt: number;

  @Column({
    name: 'engr_grade',
    comment: '에너지효율등급',
    type: 'varchar',
    length: 4,
    nullable: true,
  })
  engrGrade: string;

  @Column({
    name: 'engr_rat',
    comment: '에너지절감율',
    type: 'decimal',
    precision: 19,
    scale: 9,
    nullable: true,
  })
  engrRat: number;

  @Column({
    name: 'engr_epi',
    comment: 'EPI점수',
    type: 'mediumint',
    width: 5,
    nullable: true,
  })
  engrEpi: number;

  @Column({
    name: 'gn_bld_grade',
    comment: '친환경건축물등급',
    type: 'char',
    length: 1,
    nullable: true,
  })
  gnBldGrade: string;

  @Column({
    name: 'gn_bld_cert',
    comment: '친환경건축물인증점수',
    type: 'mediumint',
    width: 5,
    nullable: true,
  })
  gnBldCert: number;

  @Column({
    name: 'itg_bld_grade',
    comment: '지능형건축물등급',
    type: 'char',
    length: 1,
    nullable: true,
  })
  itgBldGrade: string;

  @Column({
    name: 'itg_bld_cert',
    comment: '지능형건축물인증점수',
    type: 'mediumint',
    width: 5,
    nullable: true,
  })
  itgBldCert: number;

  @Column({
    name: 'crtn_day',
    comment: '생성일자',
    type: 'varchar',
    length: 8,
    nullable: true,
  })
  crtnDay: string;

  @Column({
    name: 'rserthqk_dsgn_apply_yn',
    comment: '내진설계유무',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  rserthqkDsgnApplyYn: string;

  @Column({
    name: 'rserthqk_ablty',
    comment: '내진설계설명',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  rserthqkAblty: string;
}
