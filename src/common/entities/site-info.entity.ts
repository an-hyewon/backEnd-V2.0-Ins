import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'tb_referer_ins_prod_account_info',
  comment: '사이트 url, 보험상품, 제휴사, 채널 관리 테이블',
})
@Unique(['referer'])
export class SiteInfo {
  @PrimaryGeneratedColumn({
    name: 'seq_no',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'referer',
    comment: '사이트 url',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  referer: string;

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
    name: 'join_aba_yn',
    comment: '사이트 가입 가능 여부',
    type: 'varchar',
    length: 1,
    nullable: true,
    default: 'N',
  })
  joinAvailableYn: string;

  @Column({
    name: 'pay_yn',
    comment: '결제 여부(Y: 예(유료), N: 아니오(무료))',
    type: 'varchar',
    length: 1,
    nullable: true,
    default: 'N',
  })
  payYn: string;

  @Column({
    name: 'dsf_two_sell_yn',
    comment: '풍수해2 판매 여부(Y/N)',
    type: 'varchar',
    length: 1,
    nullable: true,
    default: 'N',
  })
  dsfTwoSellYn: string;

  @Column({
    name: 'dsf_three_sell_yn',
    comment: '풍수해3 판매 여부(Y/N)',
    type: 'varchar',
    length: 1,
    nullable: true,
    default: 'N',
  })
  dsfThreeSellYn: string;

  @Column({
    name: 'dsf_six_sell_yn',
    comment: '풍수해6 판매 여부(Y/N)',
    type: 'varchar',
    length: 1,
    nullable: true,
    default: 'N',
  })
  dsfSixSellYn: string;

  @Column({
    name: 'dli_sell_yn',
    comment: '재난배상 판매 여부(Y/N)',
    type: 'varchar',
    length: 1,
    nullable: true,
    default: 'N',
  })
  dliSellYn: string;

  @Column({
    name: 'mfli_sell_yn',
    comment: '다중이용 판매 여부(Y/N)',
    type: 'varchar',
    length: 1,
    nullable: true,
    default: 'N',
  })
  mfliSellYn: string;

  @Column({
    name: 'pip_two_sell_yn',
    comment: '개인정보보호 판매 여부(Y/N)',
    type: 'varchar',
    length: 1,
    nullable: true,
    default: 'N',
  })
  pipTwoSellYn: string;

  @Column({
    name: 'tlc_sell_yn',
    comment: '기술보호 판매 여부(Y/N)',
    type: 'varchar',
    length: 1,
    nullable: true,
    default: 'N',
  })
  tlcSellYn: string;

  @Column({
    name: 'pli_sell_yn',
    comment: '생산물배상 판매 여부(Y/N)',
    type: 'varchar',
    length: 1,
    nullable: true,
    default: 'N',
  })
  pliSellYn: string;

  @Column({
    name: 'ti_sell_yn',
    comment: '국내여행자 판매 여부(Y/N)',
    type: 'varchar',
    length: 1,
    nullable: true,
    default: 'N',
  })
  tiSellYn: string;

  @Column({
    name: 'oti_sell_yn',
    comment: '해외여행자 판매 여부(Y/N)',
    type: 'varchar',
    length: 1,
    nullable: true,
    default: 'N',
  })
  otiSellYn: string;

  @Column({
    name: 'otmi_sell_yn',
    comment: '해외여행자실손 판매 여부(Y/N)',
    type: 'varchar',
    length: 1,
    nullable: true,
    default: 'N',
  })
  otmiSellYn: string;

  @Column({
    name: 'mbi_sell_yn',
    comment: '다태아 판매 여부(Y/N)',
    type: 'varchar',
    length: 1,
    nullable: true,
    default: 'N',
  })
  mbiSellYn: string;

  @Column({
    name: 'ccali_sell_yn',
    comment: '중대재해 판매 여부(Y/N)',
    type: 'varchar',
    length: 1,
    nullable: true,
    default: 'N',
  })
  ccaliSellYn: string;

  @Column({
    name: 'site_ver',
    comment: '사이트 버전',
    type: 'decimal',
    precision: 20,
    scale: 6,
    nullable: true,
    default: 1.5,
  })
  siteVer: number;

  @Column({
    name: 'page_gb_cd',
    comment: '메인페이지 구분 코드(0: 구버전, 1: 통합몰메인, 2: 개별상품메인)',
    type: 'int',
    width: 11,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  pageGbCd: number;

  @Column({
    name: 'page_sub_gb_cd',
    comment:
      '메인페이지 서브 구분코드(0: 구버전, 1: 보온, 2: 제휴사, 3: 보온스타일X)',
    type: 'int',
    width: 11,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  pageSubGbCd: number;

  @Column({
    name: 'primary_color',
    comment: '',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  primaryColor: string;

  @Column({
    name: 'secondary_color',
    comment: '',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  secondaryColor: string;

  @Column({
    name: 'disabled_color',
    comment: '',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  disabledColor: string;

  @Column({
    name: 'background_color',
    comment: '',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  backgroundColor: string;

  @Column({
    name: 'font_title',
    comment: '',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  fontTitle: string;

  @Column({
    name: 'font',
    comment: '',
    type: 'text',
    nullable: true,
  })
  font: string;

  @Column({
    name: 'notice_yn',
    comment: '공지사항 사용 여부',
    type: 'varchar',
    length: 1,
    nullable: true,
    default: 'N',
  })
  noticeYn: string;

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
