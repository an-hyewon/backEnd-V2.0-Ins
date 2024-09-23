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

@Entity({ name: 'ccali_qstn_ctgry', comment: '중대재해 질문 카테고리 테이블' })
@Unique(['parentId', 'categoryNm'])
@Index(['parentId'])
export class CcaliQuestionCategory {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'prnt_id',
    comment: '상위 카테고리 ID',
    type: 'int',
    width: 11,
    nullable: true,
    default: null,
    unsigned: true,
  })
  parentId: number;

  @Column({
    name: 'ctgry_nm',
    comment: '카테고리 명',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  categoryNm: string;

  @Column({
    name: 'site_ctgry_nm',
    comment: '사이트 카테고리 명',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  siteCategoryNm: string;

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
    (questionCategory) => questionCategory.childrens,
    {
      nullable: true,
      onDelete: 'NO ACTION',
    },
  )
  @JoinColumn({ name: 'prnt_id', referencedColumnName: 'parentId' }) // 외래 키 명시
  parent: CcaliQuestionCategory;

  @OneToMany(
    () => CcaliQuestionCategory,
    (questionCategory) => questionCategory.parent,
  )
  childrens: CcaliQuestionCategory[];

  @OneToMany(() => CcaliQuestion, (question) => question.category)
  questions: CcaliQuestion[];
}
