import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({
  name: 'ccali_qstn_plan_grnte_cn_map',
  comment: '중대재해 질문 & 플랜 보장내용 매핑 테이블',
})
@Unique(['questionId', 'guaranteeContentId'])
@Index(['guaranteeContentId'])
export class CcaliQuestionPlanGuaranteeContentMap {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({
    name: 'qstn_id',
    comment: '질문 ID',
    type: 'int',
    width: 11,
    nullable: false,
    unsigned: true,
  })
  questionId: number;

  @Column({
    name: 'grnte_cn_id',
    comment: '보장내용 ID',
    type: 'int',
    width: 11,
    nullable: false,
    unsigned: true,
  })
  guaranteeContentId: number;
}
