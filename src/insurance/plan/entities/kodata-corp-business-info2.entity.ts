import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({
  name: 'kodata_corp_business',
  comment: '코데이터 법인사업자 정보(2024년 08월) 테이블',
})
@Unique(['bzno', 'bznoCorp'])
@Index(['bzcCd'])
@Index(['franNm'])
@Index(['franAddr'])
export class KodataCorpBusinessInfo2 {
  @PrimaryGeneratedColumn({
    name: 'seq_no',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'fran_nm',
    comment: '업체명',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  franNm: string;

  @Column({
    name: 'bzno',
    comment: '사업자번호',
    type: 'varchar',
    length: 13,
    nullable: true,
  })
  bzno: string;

  @Column({
    name: 'bzno_corp',
    comment: '법인번호',
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  bznoCorp: string;

  @Column({
    name: 'owner_nm',
    comment: '대표자명',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  ownerNm: string;

  @Column({
    name: 'owner_no',
    comment: '대표자주민번호(앞7자리)',
    type: 'varchar',
    length: 14,
    nullable: true,
  })
  ownerNo: string;

  @Column({
    name: 'fran_addr_zip',
    comment: '주소',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  franAddrZip: string;

  @Column({
    name: 'fran_addr',
    comment: '주소',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  franAddr: string;

  @Column({
    name: 'bzc_cd',
    comment: '업종코드_10차(대분류 코드 1 + 세세분류 코드 5)',
    type: 'varchar',
    length: 8,
    nullable: true,
  })
  bzcCd: string;

  @Column({
    name: 'bzc_nm',
    comment: '업종명10차_세세분류',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  bzcNm: string;

  @Column({
    name: 'gen_email',
    comment: '이메일',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  genEmail: string;

  @Column({
    name: 'gen_tel',
    comment: '전화번호',
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  genTel: string;

  @Column({
    name: 'enp_type',
    comment: '기업유형(외국법인여부)',
    type: 'varchar',
    length: 14,
    nullable: true,
  })
  enpType: string;

  @Column({
    name: 'estb_dt',
    comment: '설립연도',
    type: 'varchar',
    length: 8,
    nullable: true,
  })
  estbDt: string;

  @Column({
    name: 'acct_dt',
    comment: '결산년월일',
    type: 'varchar',
    length: 8,
    nullable: true,
  })
  acctDt: string;

  @Column({
    name: 'sales',
    comment: '매출액(천원)',
    type: 'int',
    width: 11,
    nullable: true,
  })
  sales: number;

  @Column({
    name: 'wage',
    comment: '임금총액(천원)',
    type: 'int',
    width: 11,
    nullable: true,
  })
  wage: number;

  @Column({
    name: 'outsourcing',
    comment: '용역비총액(천원)',
    type: 'int',
    width: 11,
    nullable: true,
  })
  outsourcing: number;

  @Column({
    name: 'sanbo2312',
    comment: '산재보험가입자수(23년12월)',
    type: 'int',
    width: 11,
    nullable: true,
  })
  sanbo2312: number;

  @Column({
    name: 'gobo2312',
    comment: '고용보험가입자수(23년12월)',
    type: 'int',
    width: 11,
    nullable: true,
  })
  gobo2312: number;

  @Column({
    name: 'em_dt',
    comment: '종업원수(자체조사) 기준일',
    type: 'varchar',
    length: 8,
    nullable: true,
  })
  emDt: string;

  @Column({
    name: 'em',
    comment: '종업원수(자체조사)',
    type: 'int',
    width: 11,
    nullable: true,
  })
  em: number;

  @Column({
    name: 'gmyg_ym',
    comment: '국민연금가입자수 기준년월',
    type: 'varchar',
    length: 8,
    nullable: true,
  })
  gmygYm: string;

  @Column({
    name: 'em_gmyg',
    comment: '국민연금가입자수',
    type: 'int',
    width: 11,
    nullable: true,
  })
  emGmyg: number;
}
