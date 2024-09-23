import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'ccali_ans_res', comment: '중대재해 응답 테이블' })
@Unique(['joinId', 'questionId', 'answerId'])
@Index(['joinId'])
@Index(['questionId'])
@Index(['answerId'])
export class CcaliAnswerResponse {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'join_id',
    comment: '가입 ID',
    type: 'int',
    width: 11,
    nullable: true,
    default: null,
    unsigned: true,
  })
  joinId: number;

  @Column({
    name: 'qstn_id',
    comment: '질문 ID',
    type: 'int',
    width: 11,
    nullable: true,
    default: null,
    unsigned: true,
  })
  questionId: number;

  @Column({
    name: 'ans_id',
    comment: '답변 ID',
    type: 'int',
    width: 11,
    nullable: true,
    default: null,
    unsigned: true,
  })
  answerId: number;

  @Column({
    name: 'ans_value',
    comment: '답변 값',
    type: 'text',
    nullable: true,
  })
  answerValue: string;

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
