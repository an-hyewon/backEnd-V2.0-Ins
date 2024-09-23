import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'msg_type', comment: '메시지 타입 테이블' })
@Unique(['msgType'])
export class MessageType {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'msg_type',
    comment: '메시지 타입',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  msgType: string;

  @Column({
    name: 'msg_type_expln',
    comment: '메시지 타입 설명',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  msgTypeExplain: string;
}
