import { ApiProperty } from '@nestjs/swagger';
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
  name: 'tb_boon_terms_agree_cd_info',
  comment: '보온/제휴사몰 이용동의 항목 코드 테이블',
})
export class TermsAgreeCdInfo {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'terms_agree_cd',
    comment: '이용동의 항목 코드',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  termsAgreeCd: string;

  @Column({
    name: 'terms_agree_nm',
    comment: '이용동의 항목 명',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  termsAgreeNm: string;

  @Column({
    name: 'terms_agree_cont_full',
    comment: '이용동의 항목 내용',
    type: 'text',
    nullable: true,
  })
  termsAgreeContFull: string;

  @Column({
    name: 'terms_agree_cont',
    comment: '이용동의 항목 내용(항목별 분리)',
    type: 'text',
    nullable: true,
  })
  termsAgreeCont: string;

  @Column({
    name: 'terms_agree_desc',
    comment: '이용동의 항목 설명',
    type: 'text',
    nullable: true,
  })
  termsAgreeDesc: string;

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
