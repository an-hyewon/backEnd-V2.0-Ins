import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'ins_com_info', comment: '보험사 테이블' })
@Unique(['insComCd'])
export class InsCom {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({
    name: 'ins_com_cd',
    comment: '보험사 코드',
    type: 'varchar',
    length: 5,
    nullable: false,
  })
  insComCd: string;

  @Column({
    name: 'ins_com_nm',
    comment: '보험사 명',
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  insComNm: string;

  @Column({
    name: 'ins_com_full_nm',
    comment: '보험사 전체명',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  insComFullNm: string;

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
