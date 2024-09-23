import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { CcaliQuestion } from './ccali-question.entity';

@Entity({
  name: 'ccali_qstn_ans_templt',
  comment: '중대재해 질문&답변 템플릿 테이블',
})
@Unique(['questionId', 'answerType', 'answerText'])
@Index(['questionId'])
@Index(['sortSeq'])
export class CcaliQuestionAnswerTemplate {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

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
    name: 'ans_type',
    comment: '답변 유형',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  answerType: string;

  @Column({
    name: 'ans_text',
    comment: '답변 text',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  answerText: string;

  @Column({
    name: 'sort_seq',
    comment: '정렬 순서',
    type: 'int',
    width: 11,
    nullable: true,
    default: null,
    unsigned: true,
  })
  sortSeq: number;

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

  @ManyToOne(() => CcaliQuestion, (question) => question.templates, {
    nullable: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'qstn_id', referencedColumnName: 'id' }) // 외래 키 명시
  question: CcaliQuestion;
}
