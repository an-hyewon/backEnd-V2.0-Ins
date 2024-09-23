import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({
  name: 'msg_type_alimtalk_templt_map',
  comment: '메시지 타입 & 알림톡 템플릿 매핑 테이블',
})
@Unique(['msgContentId', 'templtId'])
@Index(['templtId'])
export class MessageContentAlimtalkTemplateMap {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({
    name: 'msg_type_cd_id',
    comment: '메시지 내용 타입 ID',
    type: 'int',
    width: 10,
    nullable: false,
    unsigned: true,
  })
  msgContentId: number;

  @Column({
    name: 'templt_id',
    comment: '플랜 설명 ID',
    type: 'int',
    width: 10,
    nullable: false,
    unsigned: true,
  })
  templtId: number;
}
