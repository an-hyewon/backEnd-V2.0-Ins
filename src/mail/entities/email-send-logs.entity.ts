import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'eml_snd_logs',
  comment: 'mail 전송 로그 테이블',
})
@Index(['emailFrom'])
@Index(['emailTo'])
export class EmailSendLogs {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'eml_from',
    comment: '발송자',
    type: 'varchar',
    length: 200,
    nullable: false,
    default: '',
  })
  emailFrom: string;

  @Column({
    name: 'eml_to',
    comment: '수신자',
    type: 'varchar',
    length: 200,
    nullable: false,
    default: '',
  })
  emailTo: string;

  @Column({
    name: 'eml_subject',
    comment: '메일 제목',
    type: 'varchar',
    length: 200,
    nullable: false,
    default: '',
  })
  emailSubject: string;

  @Column({
    name: 'eml_cc',
    comment: '메일 참조',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  emailCc: string;

  @Column({
    name: 'eml_text',
    comment: '메일 내용',
    type: 'text',
    nullable: true,
  })
  emailText: string;

  @Column({
    name: 'eml_html',
    comment: '메일 내용 HTML',
    type: 'text',
    nullable: true,
  })
  emailHtml: string;

  @Column({
    name: 'eml_attachments',
    comment: '메일 첨부파일',
    type: 'text',
    nullable: true,
  })
  emailAttachments: string;

  @Column({
    name: 'rspns_data',
    comment: '응답 데이터',
    type: 'text',
    nullable: true,
  })
  responseData: string;

  @Column({
    name: 'error_data',
    comment: '에러 데이터',
    type: 'text',
    nullable: true,
  })
  errorData: string;

  @Column({
    name: 'message_id',
    comment: '',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  messageId: string;

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
