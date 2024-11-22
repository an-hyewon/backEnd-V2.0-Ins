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
  name: 'insurator_join',
  comment: '인슈에이터 가입내역 관리 테이블(기존 보험 가입자 테이블과 조인)',
})
@Index(['referId'])
@Index(['plannerId'])
@Index(['joinId'])
@Index(['tmpId'])
@Index(['planStatusCd'])
export class InsuratorJoin {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'refer_id',
    comment: '참조 키값',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  referId: string;

  @Column({
    name: 'planner_id',
    comment: '설계사 ID',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  plannerId: number;

  @Column({
    name: 'ins_prod_com_id',
    comment: '보험상품-보험사 ID',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  insProdComId: number;

  @Column({
    name: 'join_id',
    comment: '보험 가입정보 ID',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  joinId: number;

  @Column({
    name: 'tmp_id',
    comment: '보험 임시저장 ID',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  tmpId: number;

  @Column({
    name: 'plan_stts_cd',
    comment:
      '설계 상태 코드(I: 조회, P: 설계, Q: 견적제출, C: 계약완료, E: 만기, N: 만기임박)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  planStatusCd: string;

  @Column({
    name: 'fee_amt',
    comment: '기본 수수료',
    type: 'decimal',
    precision: 20,
    scale: 2,
    nullable: true,
    default: 0,
  })
  feeAmt: number;

  @Column({
    name: 'fee_unit',
    comment: '수수료 단위(won: 원, percent: 퍼센트)',
    type: 'varchar',
    length: 10,
    nullable: false,
    default: 'percent',
  })
  feeUnit: string;

  @Column({
    name: 'team_id',
    comment: '소속 팀 ID',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  teamId: number;

  @Column({
    name: 'job_pstn_id',
    comment: '직책 ID',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  jobPositionId: number;

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
