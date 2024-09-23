import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'ins_prod_info', comment: '보험상품 테이블' })
@Unique(['insComCd', 'insProdFullNm'])
@Index(['insComCd'])
@Index(['insProdCd'])
export class InsProd {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({
    name: 'ins_com_cd',
    comment: '보험사 코드(DB, MR, KB, SM, HD)',
    type: 'varchar',
    length: 5,
    nullable: false,
  })
  insComCd: string;

  @Column({
    name: 'ins_prod_cd',
    comment: '보험상품 코드(ccali: 중대재해)',
    type: 'varchar',
    length: 5,
    nullable: false,
  })
  insProdCd: string;

  @Column({
    name: 'ins_prod_nm',
    comment: '보험상품 명',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  insProdNm: string;

  @Column({
    name: 'ins_prod_full_nm',
    comment: '보험상품 전체명',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  insProdFullNm: string;

  @CreateDateColumn({
    name: 'crt_dt',
    comment: '생성일시',
    type: 'datetime',
    nullable: false,
  })
  createdDt: Date;

  @UpdateDateColumn({
    name: 'updt_dt',
    comment: '수정일시',
    type: 'datetime',
    nullable: false,
  })
  updatedDt: Date;

  @DeleteDateColumn({
    name: 'del_dt',
    comment: '삭제일시',
    type: 'datetime',
    nullable: true,
  })
  deletedDt: Date;
}
