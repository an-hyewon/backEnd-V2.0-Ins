import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ name: 'tb_br_expos_info', comment: '건축물대장 전유부' })
@Index(['sigunguCd', 'bjdongCd', 'platGbCd', 'bun', 'ji'])
@Index(['sigunguCd'])
export class BrExpos {
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
    comment: '동명칭',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  dongNm: string;

  @Column({
    name: 'ho_nm',
    comment: '호명칭',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  hoNm: string;

  @Column({
    name: 'flr_gb_cd',
    comment: '층구분코드',
    type: 'varchar',
    length: 2,
    nullable: true,
  })
  flrGbCd: string;

  @Column({
    name: 'flr_gb_cd_nm',
    comment: '층구분코드명',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  flrGbCdNm: string;

  @Column({
    name: 'flr_no',
    comment: '층번호',
    type: 'mediumint',
    width: 4,
    nullable: true,
  })
  flrNo: number;

  @Column({
    name: 'crtn_day',
    comment: '생성일자',
    type: 'varchar',
    length: 8,
    nullable: true,
  })
  crtnDay: string;
}
