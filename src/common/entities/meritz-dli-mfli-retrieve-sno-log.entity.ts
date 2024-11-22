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
  name: 'tb_meritz_dli_mfli_retrieve_sno_logs',
  comment:
    '메리츠API 재난배상&다중이용업소 API(재난배상일련번호조회) 통신 로그 테이블',
})
@Index(['inspeBizpeNo'])
export class MeritzDliMfliRetrieveSnoLog {
  @PrimaryGeneratedColumn({
    name: 'seq_no',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'aflco_div_cd',
    comment: '제휴사 구분코드(이용기관에서 정한 구분값)',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  aflcoDivCd: string;

  @Column({
    name: 'pd_cd',
    comment: '상품 코드(재난배상: 14541, 다중이용: 14383)',
    type: 'varchar',
    length: 5,
    nullable: true,
  })
  pdCd: string;

  @Column({
    name: 'inspe_bizpe_no',
    comment: '피보험자 사업자번호',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  inspeBizpeNo: string;

  @Column({
    name: 'obj_cd',
    comment: '목적물 코드',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  objCd: string;

  @Column({
    name: 'fm_nm',
    comment: '상호명',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  fmNm: string;

  @Column({
    name: 'lctn_adr',
    comment: '소재지 주소',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  lctnAdr: string;

  @Column({
    name: 'dsst_cmps_sno',
    comment: '재난배상/다중이용업소 일련번호(요청)',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  dsstCmpsSno: string;

  @Column({
    name: 'res_yn',
    comment: 'API 응답 상태(N: 실패, Y: 성공)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  resYn: string;

  @Column({
    name: 'err_cd',
    comment: '에러코드',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  errCd: string;

  @Column({
    name: 'err_msg',
    comment: '에러메시지',
    type: 'varchar',
    length: 450,
    nullable: true,
  })
  errMsg: string;

  @Column({
    name: 'sno_inq_cnt',
    comment: '일련번호 조회 결과 건수',
    type: 'varchar',
    length: 5,
    nullable: true,
  })
  snoInqCnt: string;

  @Column({
    name: 'opapi_dsst_cmps_sno_inq_rsl_cbc_vo',
    comment: '오픈API재난배상일련번호조회결과',
    type: 'text',
    nullable: true,
  })
  opapiDsstCmpsSnoInqRslCbcVo: string;

  @Column({
    name: 'fcl_dsst_cmps_sno',
    comment: '재난배상/다중이용업소 일련번호(응답)',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  fclDsstCmpsSno: string;

  @Column({
    name: 'fcl_fm_nm',
    comment: '일련번호 조회 결과 시설의 상호명',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  fclFmNm: string;

  @Column({
    name: 'tpids_cd',
    comment: '일련번호 조회 결과 시설의 업종코드',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  tpidsCd: string;

  @Column({
    name: 'fcl_sqme',
    comment: '일련번호 조회 결과 시설의 면적',
    type: 'varchar',
    length: 21,
    nullable: true,
  })
  fclSqme: string;

  @Column({
    name: 'fcl_obj_cd',
    comment: '일련번호 조회 결과 시설의 목적물코드',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  fclObjCd: string;

  @Column({
    name: 'fcl_lctn_adr',
    comment: '일련번호 조회 결과 시설의 소재지 주소',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  fclLctnAdr: string;

  @Column({
    name: 'purps',
    comment: '용도 구분(dev: 개발, prod: 운영)',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  purps: string;

  @Column({
    name: 'referer',
    comment: '가입한 url 데이터',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  referer: string;

  @Column({
    name: 'res_json',
    comment: '응답받은 모든값',
    type: 'text',
    nullable: true,
  })
  resJson: string;

  @Column({
    name: 'req_dt',
    comment: '요청일시',
    type: 'datetime',
    nullable: true,
  })
  reqDt: Date;

  @Column({
    name: 'res_dt',
    comment: '응답일시',
    type: 'datetime',
    nullable: true,
  })
  resDt: Date;
}
