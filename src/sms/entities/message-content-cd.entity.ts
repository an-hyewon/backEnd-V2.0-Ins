import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_sms_msg_type', comment: '메시지 내용 코드 테이블' })
@Unique(['msgContentCd'])
export class MessageContentCd {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: '',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'msg_type_cd',
    comment: '메시지 내용 타입 코드',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  msgContentCd: string;

  @Column({
    name: 'msg_type_nm',
    comment: '메시지 내용 설명',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  msgContentExplain: string;

  @CreateDateColumn({
    name: 'created_dt',
    comment: '생성일시',
    type: 'datetime',
    nullable: false,
  })
  createdDt: Date;

  @UpdateDateColumn({
    name: 'updated_dt',
    comment: '생성일시',
    type: 'datetime',
    nullable: false,
  })
  updatedDt: Date;

  @DeleteDateColumn({
    name: 'deleted_dt',
    comment: '삭제일시',
    type: 'datetime',
    nullable: true,
  })
  deletedDt: Date;
}
