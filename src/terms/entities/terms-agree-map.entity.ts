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
  name: 'tb_boon_terms_agree_map',
  comment: '보온/제휴사몰 이용동의 항목 매핑 테이블',
})
export class TermsAgreeMap {
  @PrimaryGeneratedColumn({
    name: 'seq_no',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'ins_prod_cd',
    comment: '보험상품 코드',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  insPordCd: string;

  @Column({
    name: 'pay_yn',
    comment: '유료/무료 여부',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  payYn: string;

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
    name: 'ins_com',
    comment: '보험사',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  insCom: string;

  @Column({
    name: 'terms_agree_position',
    comment: '',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  termsAgreePosition: string;

  @Column({
    name: 'terms_agree_type',
    comment: '',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  termsAgreeType: string;

  @Column({
    name: 'terms_agree_title',
    comment: '',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  termsAgreeTitle: string;

  @Column({
    name: 'terms_agree_cd_seq_no',
    comment: '이용동의 항목 내용 seq_no',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  termsAgreeCdId: number;

  @Column({
    name: 'order_no',
    comment: '정렬순서',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  orderNo: number;

  @CreateDateColumn()
  @Column({
    name: 'created_dt',
    comment: '생성일시',
    type: 'datetime',
    nullable: true,
  })
  createdDt: Date;

  @UpdateDateColumn()
  @Column({
    name: 'updated_dt',
    comment: '수정일시',
    type: 'datetime',
    nullable: true,
  })
  updatedDt: Date;

  @DeleteDateColumn()
  @Column({
    name: 'deleted_dt',
    comment: '삭제일시',
    type: 'datetime',
    nullable: true,
  })
  deletedDt: Date;
}
