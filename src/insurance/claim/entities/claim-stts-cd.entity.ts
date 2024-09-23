import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'claim_stts', comment: '사고접수 상태 테이블' })
@Unique(['claimStatusCd'])
export class ClaimStatus {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'claim_stts_cd',
    comment: '사고접수 상태 코드',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  claimStatusCd: string;

  @Column({
    name: 'claim_stts_nm',
    comment: '사고접수 상태 명',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  claimStatusNm: string;

  @Column({
    name: 'claim_stts_expln',
    comment: '사고접수 상태 설명',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  claimStatusExplain: string;

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
