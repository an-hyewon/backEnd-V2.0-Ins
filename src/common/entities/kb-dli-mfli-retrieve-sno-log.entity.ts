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
  name: 'tb_kb_dli_mfli_retrieve_sno_logs',
  comment:
    'KB손보 API 재난배상&다중이용업소 API(재난배상일련번호조회) 통신 로그 테이블',
})
@Index(['insdpsIdno'])
export class KbDliMfliRetrieveSnoLog {
  @PrimaryGeneratedColumn({
    name: 'seq_no',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'guid',
    comment: '앱/웹에서 생성하는 GUID',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  guid: string;

  @Column({
    name: 'hs_key',
    comment: 'body 전문검증(BODY 전문 해쉬값)',
    type: 'text',
    nullable: true,
  })
  hsKey: string;

  @Column({
    name: 'uuid',
    comment: 'G/W에서 채번한 uuid값(G/W에서 자동으로 값 세팅)',
    type: 'varchar',
    length: 7,
    nullable: true,
  })
  uuid: string;

  @Column({
    name: 'client_ip',
    comment: '실제 클라이언트 IP(G/W에서 자동으로 값 세팅)',
    type: 'varchar',
    length: 7,
    nullable: true,
  })
  clientIp: string;

  @Column({
    name: 'co_cd',
    comment:
      '제휴사구분코드: 연계회사이니셜(2자리)+해당년(2자리)+일련번호(3자리)',
    type: 'varchar',
    length: 7,
    nullable: true,
  })
  coCd: string;

  @Column({
    name: 'evnt_cd',
    comment: '구분코드(일련번호 조희: T, 보험료 계산: C, 보험계약: S)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  evntCd: string;

  @Column({
    name: 'pd_cd',
    comment: '상품 코드(재난배상: 14164, 다중이용: 14150)',
    type: 'varchar',
    length: 5,
    nullable: true,
  })
  pdCd: string;

  @Column({
    name: 'group_cont_yn',
    comment: '그룹계약여부(Y/N)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  groupContYn: string;

  @Column({
    name: 'apc_date',
    comment: '청약일자(현재일자)',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  apcDate: string;

  @Column({
    name: 'ins_bg_dt',
    comment:
      '보험개시일자(현재일자 기준으로 이전일자는 가입불가 (소급불가))(YYYY-MM-DD)',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  insBgDt: string;

  @Column({
    name: 'ins_end_dt',
    comment:
      '보험종료일자(보험종료일자는 보험개시일자 기준 반드시 1년)(YYYY-MM-DD)',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  insEndDt: string;

  @Column({
    name: 'polhd_nm',
    comment: '계약자 한글명',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  polhdNm: string;

  @Column({
    name: 'polhd_bzrgno',
    comment: '계약자 사업자번호',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  polhdBzrgno: string;

  @Column({
    name: 'insdps_nm',
    comment: '상호명',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  insdpsNm: string;

  @Column({
    name: 'insdps_idno',
    comment: '피보험자 사업자번호',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  insdpsIdno: string;

  @Column({
    name: 'ntr_obj_cd',
    comment: '가입물건코드',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  ntrObjCd: string;

  @Column({
    name: 'rate_calc_fndtn_cnt',
    comment: '요율산출기초수',
    type: 'decimal',
    precision: 21,
    scale: 6,
    nullable: true,
  })
  rateCalcFndtnCnt: number;

  @Column({
    name: 'perps_lol',
    comment: '대인 인당 보상한도액(1인당 1.5억 고정)',
    type: 'decimal',
    precision: 17,
    scale: 6,
    nullable: true,
  })
  perpsLol: number;

  @Column({
    name: 'peracc_lol',
    comment: '대물 사고당 보상한도액(1사고당 10억 고정)',
    type: 'decimal',
    precision: 17,
    scale: 6,
    nullable: true,
  })
  peraccLol: number;

  @Column({
    name: 'bzplc_cfcd',
    comment: '사업장구분코드(01 : 세입자(임차인) 02 : 건물주(임대인))',
    type: 'varchar',
    length: 2,
    nullable: true,
  })
  bzplcCfcd: string;

  @Column({
    name: 'loct_hngl_nm',
    comment: '상호명',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  loctHnglNm: string;

  @Column({
    name: 'korlg_bsadr',
    comment: '주소',
    type: 'varchar',
    length: 300,
    nullable: true,
  })
  korlgBsadr: string;

  @Column({
    name: 'korlg_dtadr',
    comment: '상세주소',
    type: 'varchar',
    length: 300,
    nullable: true,
  })
  korlgDtadr: string;

  @Column({
    name: 'loct_post_no_1',
    comment: '소재지의 우편번호 첫3자리',
    type: 'varchar',
    length: 4,
    nullable: true,
  })
  loctPostNo1: string;

  @Column({
    name: 'loct_post_no_2',
    comment: '소재지의 우편번호 뒤2자리',
    type: 'varchar',
    length: 4,
    nullable: true,
  })
  loctPostNo2: string;

  @Column({
    name: 'acc_yn',
    comment: '사고여부(Y/N)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  accYn: string;

  @Column({
    name: 'obgt_ins_seq',
    comment: '재난배상/다중이용업소 일련번호(요청)',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  obgtInsSeq: string;

  @Column({
    name: 'apcno',
    comment: '청약번호(요청)',
    type: 'varchar',
    length: 12,
    nullable: true,
  })
  apcno: string;

  @Column({
    name: 'rnwl_pcno',
    comment: '갱신전 증권번호(갱신계약 청약시 갱신 이전 증권번호)',
    type: 'varchar',
    length: 11,
    nullable: true,
  })
  rnwlPcno: string;

  @Column({
    name: 'res_yn',
    comment: 'API 응답 상태(N: 실패, Y: 성공)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  resYn: string;

  @Column({
    name: 'success_cd',
    comment: 'API 성공, 실패 여부(KB API 응답)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  successCd: string;

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
    name: 'dbio_fetch_seq',
    comment: '페이징건수',
    type: 'int',
    width: 11,
    nullable: true,
  })
  dbioFetchSeq: number;

  @Column({
    name: 'dbio_fetch_size',
    comment: '조회건수',
    type: 'int',
    width: 11,
    nullable: true,
  })
  dbioFetchSize: number;

  @Column({
    name: 'dbio_total_count',
    comment: '전체건수',
    type: 'int',
    width: 11,
    nullable: true,
  })
  dbioTotalCount: number;

  @Column({
    name: 'dbio_affected_count',
    comment: '반영건수',
    type: 'int',
    width: 11,
    nullable: true,
  })
  dbioAffectedCount: number;

  @Column({
    name: 'gi_api_obgt_ins_info_dto',
    comment: '오픈API 재난배상일련번호 조회결과',
    type: 'text',
    nullable: true,
  })
  giApiObgtInsInfoDto: string;

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
