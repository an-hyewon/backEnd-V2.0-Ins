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
  name: 'tb_meritz_dli_mfli_prem_cmpt_logs',
  comment: '메리츠 API 재난배상&다중이용업소 API(보험료산출) 통신 로그 테이블',
})
@Index(['inspeBizpeNo'])
export class MeritzDliMfliPremCmptLog {
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
    name: 'sbcp_dt',
    comment: '청약일자(현재일자)',
    type: 'varchar',
    length: 8,
    nullable: true,
  })
  sbcpDt: string;

  @Column({
    name: 'ins_bgn_dt',
    comment:
      '보험개시일자(현재일자 기준으로 이전일자는 가입불가 (소급불가))(YYYYMMDD)',
    type: 'varchar',
    length: 8,
    nullable: true,
  })
  insBgnDt: string;

  @Column({
    name: 'ins_ed_dt',
    comment:
      '보험종료일자(보험종료일자는 보험개시일자 기준 반드시 1년)(YYYYMMDD)',
    type: 'varchar',
    length: 8,
    nullable: true,
  })
  insEdDt: string;

  @Column({
    name: 'polhd_nm',
    comment: '계약자 한글명',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  polhdNm: string;

  @Column({
    name: 'polhd_bizpe_no',
    comment: '계약자 사업자번호',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  polhdBizpeNo: string;

  @Column({
    name: 'polhd_crp_no',
    comment: '계약자 법인번호(법인)',
    type: 'varchar',
    length: 13,
    nullable: true,
  })
  polhdCrpNo: string;

  @Column({
    name: 'polhd_rsid_no',
    comment: '계약자 주민번호(개인)',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  polhdRsidNo: string;

  @Column({
    name: 'inspe_nm',
    comment: '피보험자 한글명',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  inspeNm: string;

  @Column({
    name: 'inspe_bizpe_no',
    comment: '피보험자 사업자번호',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  inspeBizpeNo: string;

  @Column({
    name: 'inspe_crp_no',
    comment: '피보험자 법인번호(법인)',
    type: 'varchar',
    length: 13,
    nullable: true,
  })
  inspeCrpNo: string;

  @Column({
    name: 'inspe_rsid_no',
    comment: '피보험자 주민번호(개인)',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  inspeRsidNo: string;

  @Column({
    name: 'obj_cd',
    comment: '목적물 코드',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  objCd: string;

  @Column({
    name: 'cmpt_base_num',
    comment: '산출 기초수',
    type: 'varchar',
    length: 21,
    nullable: true,
  })
  cmptBaseNum: string;

  @Column({
    name: 'pcpt_coms_lm_amt',
    comment: '대인 인당 보상한도액(1인당 1.5억 고정)',
    type: 'varchar',
    length: 17,
    nullable: true,
  })
  pcptComsLmAmt: string;

  @Column({
    name: 'prda_oplm_amt',
    comment: '대물 사고당 보상한도액(1사고당 10억 고정)',
    type: 'varchar',
    length: 17,
    nullable: true,
  })
  prdaOplmAmt: string;

  @Column({
    name: 'owbr_amt',
    comment: '자기부담금(0 고정)',
    type: 'varchar',
    length: 17,
    nullable: true,
  })
  owbrAmt: string;

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
    name: 'ath_no',
    comment: '휴대폰 본인인증시 인증번호',
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  athNo: string;

  @Column({
    name: 'agr_inf_con',
    comment: '동의정보(Y: 1, N: 2)(항목 9개)',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  agrInfCon: string;

  @Column({
    name: 'rnwl_bf_pol_no',
    comment: '갱신전 증권번호(갱신계약 청약시 갱신 이전 증권번호)',
    type: 'varchar',
    length: 22,
    nullable: true,
  })
  rnwlBfPolNo: string;

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
    name: 'apl_prem',
    comment: '적용 보험료(가계약 전체 보험료)',
    type: 'varchar',
    length: 17,
    nullable: true,
  })
  aplPrem: string;

  @Column({
    name: 'pers_apl_prem',
    comment: '대인 적용 보험료',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  persAplPrem: string;

  @Column({
    name: 'prda_apl_prem',
    comment: '대물 적용 보험료',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  prdaAplPrem: string;

  @Column({
    name: 'prctr_no',
    comment: '가계약 번호(발행한 당사 가계약번호)',
    type: 'varchar',
    length: 22,
    nullable: true,
  })
  prctrNo: string;

  @Column({
    name: 'fcl_dsst_cmps_sno',
    comment: '재난배상/다중이용업소 일련번호(응답)',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  fclDsstCmpsSno: string;

  @Column({
    name: 'fcl_obj_cd',
    comment: '일련번호 조회 결과 시설의 목적물코드',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  fclObjCd: string;

  @Column({
    name: 'fcl_fm_nm',
    comment: '일련번호 조회 결과 시설의 상호명',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  fclFmNm: string;

  @Column({
    name: 'fcl_sqme',
    comment: '일련번호 조회 결과 시설의 면적',
    type: 'varchar',
    length: 21,
    nullable: true,
  })
  fclSqme: string;

  @Column({
    name: 'obj_cd_dagr_yn',
    comment: '목적물코드 불일치 여부(불일치: 1, 일치: 2)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  objCdDagrYn: string;

  @Column({
    name: 'sqme_dagr_yn',
    comment:
      '면적 불일치 여부(불일치: 1, 일치: 2)(산출기초가 면적인 경우에만 비교함, 면적이 아닌 경우 일치: 2로 회신)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  sqmeDagrYn: string;

  @Column({
    name: 'exst_ctr_pol_no',
    comment: '기존계약증권번호',
    type: 'varchar',
    length: 22,
    nullable: true,
  })
  exstCtrPolNo: string;

  @Column({
    name: 'exst_ctr_ins_bgn_dtm',
    comment:
      '보험개시일자 기준 보험종기가 3개월 이내에 있는 계약의 보험개시일시(일련번호 기준)(YYYYMMDDHHmmss)',
    type: 'varchar',
    length: 14,
    nullable: true,
  })
  exstCtrInsBgnDtm: string;

  @Column({
    name: 'exst_ctr_ins_ed_dtm',
    comment:
      '보험개시일자 기준 보험종기가 3개월 이내에 있는 계약의 보험종료일시(일련번호 기준)(YYYYMMDDHHmmss)',
    type: 'varchar',
    length: 14,
    nullable: true,
  })
  exstCtrInsEdDtm: string;

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
