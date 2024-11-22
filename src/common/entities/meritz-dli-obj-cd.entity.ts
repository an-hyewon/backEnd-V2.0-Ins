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
  name: 'tb_meritz_dli_obj_cd_info',
  comment: '메리츠 API 재난배상책임보험 목적물 코드 테이블',
})
export class MeritzDliLObjCd {
  @PrimaryGeneratedColumn({
    name: 'seq_no',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'obj_cd',
    comment: '목적물 코드',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  objCd: string;

  @Column({
    name: 'obj_nm',
    comment: '목적물 명',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  objNm: string;

  @Column({
    name: 'stats_gb',
    comment: '통계 구분(S:통계, N: 비통계)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  statsGb: string;

  @Column({
    name: 'cmpt_base_seq',
    comment: '산출 기초 테이블 seq_no',
    type: 'int',
    width: 11,
    nullable: true,
    default: 0,
  })
  cmptBaseId: number;

  @Column({
    name: 'cmpt_base_nm',
    comment: '산출 기초 명',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  cmptBaseNm: string;

  @Column({
    name: 'avlb_yn',
    comment: '가입가능여부',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  avlbYn: string;

  @Column({
    name: 'comment',
    comment: '비고',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  comments: string;
}
