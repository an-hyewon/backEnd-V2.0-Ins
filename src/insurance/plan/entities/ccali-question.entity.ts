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
import { CcaliQuestionCategory } from './ccali-question-category.entity';
import { CcaliQuestionAnswerTemplate } from './ccali-question-answer-template.entity';

@Entity({ name: 'ccali_qstn', comment: '중대재해 질문 목록 테이블' })
@Unique(['fileId', 'categoryId', 'questionText'])
@Index(['fileId'])
@Index(['categoryId'])
@Index(['sortSeq'])
@Index(['siteSortSeq'])
export class CcaliQuestion {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'file_id',
    comment: '서류 ID',
    type: 'int',
    width: 11,
    nullable: true,
    default: null,
    unsigned: true,
  })
  fileId: number;

  @Column({
    name: 'ctgry_id',
    comment: '카테고리 ID',
    type: 'int',
    width: 11,
    nullable: true,
    default: null,
    unsigned: true,
  })
  categoryId: number;

  @Column({
    name: 'qstn_text',
    comment: '질문 text',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  questionText: string;

  @Column({
    name: 'site_qstn_text',
    comment: '사이트 질문 text',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  siteQuestionText: string;

  @Column({
    name: 'site_qstn_expln',
    comment: '사이트 질문 설명',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  siteQuestionExplain: string;

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

  @Column({
    name: 'site_sort_seq',
    comment: '사이트 정렬 순서',
    type: 'int',
    width: 11,
    nullable: true,
    default: null,
    unsigned: true,
  })
  siteSortSeq: number;

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

  @ManyToOne(
    () => CcaliQuestionCategory,
    (questionCategory) => questionCategory.questions,
    {
      nullable: true,
      onDelete: 'NO ACTION',
    },
  )
  @JoinColumn({ name: 'ctgry_id', referencedColumnName: 'id' }) // 외래 키 명시
  category: CcaliQuestionCategory;

  @OneToMany(() => CcaliQuestionAnswerTemplate, (template) => template.question)
  templates: CcaliQuestionAnswerTemplate[];
}
