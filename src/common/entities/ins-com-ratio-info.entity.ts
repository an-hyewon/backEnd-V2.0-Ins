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
  name: 'tb_ins_com_ratio_info_test',
  comment: '보험상품, 제휴사, 채널, 보험사별 신청 비율 관리 테이블',
})
@Unique(['joinAccount', 'joinPath', 'insProdNm', 'payYn'])
export class InsComRatioInfo {
  @PrimaryGeneratedColumn({
    name: 'seq_no',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

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
    name: 'ins_prod_cd',
    comment: '보험 상품코드',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  insProdCd: string;

  @Column({
    name: 'ins_prod_nm',
    comment: '보험 상품명',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  insProdNm: string;

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
    name: 'meritz_yn',
    comment: '메리츠 가입 여부',
    type: 'varchar',
    length: 1,
    nullable: true,
    default: 'N',
  })
  meritzYn: string;

  @Column({
    name: 'meritz_join_type',
    comment: `메리츠 가입 구분
    1자리 - M:수동, A:자동(보험사 API)
    2자리 - G:단체계약, I:개별계약`,
    type: 'varchar',
    length: 2,
    nullable: true,
  })
  meritzJoinType: string;

  @Column({
    name: 'meritz_ratio',
    comment: '메리츠 비율',
    type: 'int',
    width: 11,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  meritzRatio: number;

  @Column({
    name: 'db_yn',
    comment: 'DB손보 가입 여부',
    type: 'varchar',
    length: 1,
    nullable: true,
    default: 'N',
  })
  dbYn: string;

  @Column({
    name: 'db_join_type',
    comment: `DB손보 가입 구분
    1자리 - M:수동, A:자동(보험사 API)
    2자리 - G:단체계약, I:개별계약`,
    type: 'varchar',
    length: 2,
    nullable: true,
  })
  dbJoinType: string;

  @Column({
    name: 'db_ratio',
    comment: 'DB손보 비율',
    type: 'int',
    width: 11,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  dbRatio: number;

  @Column({
    name: 'kb_yn',
    comment: 'KB손보 가입 여부',
    type: 'varchar',
    length: 1,
    nullable: true,
    default: 'N',
  })
  kbYn: string;

  @Column({
    name: 'kb_join_type',
    comment: `KB손보 가입 구분
    1자리 - M:수동, A:자동(보험사 API)
    2자리 - G:단체계약, I:개별계약`,
    type: 'varchar',
    length: 2,
    nullable: true,
  })
  kbJoinType: string;

  @Column({
    name: 'kb_ratio',
    comment: 'KB손보 비율',
    type: 'int',
    width: 11,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  kbRatio: number;

  @Column({
    name: 'hyundai_yn',
    comment: '현대해상 가입 여부',
    type: 'varchar',
    length: 1,
    nullable: true,
    default: 'N',
  })
  hyundaiYn: string;

  @Column({
    name: 'hyundai_join_type',
    comment: `현대해상 가입 구분
    1자리 - M:수동, A:자동(보험사 API)
    2자리 - G:단체계약, I:개별계약`,
    type: 'varchar',
    length: 2,
    nullable: true,
  })
  hyundaiJoinType: string;

  @Column({
    name: 'hyundai_ratio',
    comment: '현대해상 비율',
    type: 'int',
    width: 11,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  hyundaiRatio: number;

  @Column({
    name: 'samsung_yn',
    comment: '삼성화재 가입 여부',
    type: 'varchar',
    length: 1,
    nullable: true,
    default: 'N',
  })
  samsungYn: string;

  @Column({
    name: 'samsung_join_type',
    comment: `삼성화재 가입 구분
    1자리 - M:수동, A:자동(보험사 API)
    2자리 - G:단체계약, I:개별계약`,
    type: 'varchar',
    length: 2,
    nullable: true,
  })
  samsungJoinType: string;

  @Column({
    name: 'samsung_ratio',
    comment: '삼성화재 비율',
    type: 'int',
    width: 11,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  samsungRatio: number;

  @Column({
    name: 'comment',
    comment: '',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  comment: string;

  @Column({
    name: 'start_dt',
    comment: '시작일시',
    type: 'datetime',
    nullable: false,
  })
  startDt: Date;

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
