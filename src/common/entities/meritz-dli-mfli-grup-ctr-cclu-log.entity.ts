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
  name: 'tb_meritz_dli_mfli_grup_ctr_cclu_logs',
  comment: '메리츠API 재난배상&다중이용업소 API(단체계약체결) 통신 로그 테이블',
})
@Index(['prctrNo'])
@Index(['polNo'])
@Index(['purps'])
export class MeritzDliMfliGrupCtrCcluLog {
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
    name: 'prctr_no',
    comment: '가계약 번호(발행한 당사 가계약번호)',
    type: 'varchar',
    length: 22,
    nullable: true,
  })
  prctrNo: string;

  @Column({
    name: 'apl_prem',
    comment: '적용 보험료(가계약 전체 보험료)',
    type: 'varchar',
    length: 17,
    nullable: true,
  })
  aplPrem: string;

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
    name: 'pol_no',
    comment: '증권번호',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  polNo: string;

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
