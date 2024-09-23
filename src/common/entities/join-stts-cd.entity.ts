import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'join_stts', comment: '가입 상태 테이블' })
@Unique(['joinStatusCd'])
export class JoinStatus {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'join_stts_cd',
    comment: '가입 상태 코드',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  joinStatusCd: string;

  @Column({
    name: 'join_stts_nm',
    comment: '가입 상태 명',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  joinStatusNm: string;

  @Column({
    name: 'join_stts_expln',
    comment: '가입 상태 설명',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  joinStatusExplain: string;

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
