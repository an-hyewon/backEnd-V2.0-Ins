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
import { CcaliInsCostNotice } from 'src/insurance/join/entities/ccali-ins-cost-notice.entity';

@Entity({
  name: 'eml_rcv_logs',
  comment: 'mail 수신 로그 테이블',
})
@Index(['emailSubject'])
@Index(['emailFrom'])
@Index(['emailTo'])
@Index(['messageId'])
export class EmailReceiveLogs {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'eml_subject',
    comment: '메일 제목',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  emailSubject: string;

  @Column({
    name: 'eml_from',
    comment: '발신자',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  emailFrom: string;

  @Column({
    name: 'eml_to',
    comment: '수신자',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  emailTo: string;

  @Column({
    name: 'eml_date',
    comment: '발신일시',
    type: 'datetime',
    nullable: true,
  })
  emailDate: Date;

  @Column({
    name: 'message_id',
    comment: '메시지 ID',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  messageId: string;

  @Column({
    name: 'eml_headers',
    comment: '',
    type: 'text',
    nullable: true,
  })
  emailHeaders: string;

  @Column({
    name: 'eml_in_reply_to',
    comment: '',
    type: 'text',
    nullable: true,
  })
  emailInReplyTo: string;

  @Column({
    name: 'eml_reply_to',
    comment: '',
    type: 'text',
    nullable: true,
  })
  emailReplyTo: string;

  @Column({
    name: 'eml_references',
    comment: '',
    type: 'text',
    nullable: true,
  })
  emailReferences: string;

  @Column({
    name: 'eml_html',
    comment: '메일 내용 HTML',
    type: 'text',
    nullable: true,
  })
  emailHtml: string;

  @Column({
    name: 'eml_text',
    comment: '메일 내용',
    type: 'text',
    nullable: true,
  })
  emailText: string;

  @Column({
    name: 'eml_text_as_html',
    comment: '',
    type: 'text',
    nullable: true,
  })
  emailTextAsHtml: string;

  @Column({
    name: 'eml_attachments',
    comment: '첨부파일',
    type: 'text',
    nullable: true,
  })
  emailAttachments: string;

  @Column({
    name: 'message_seq_no',
    comment: '첨부파일',
    type: 'int',
    width: 11,
    nullable: true,
  })
  messageSeqNo: number;

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

  @OneToOne(
    () => CcaliInsCostNotice,
    (costNotice) => costNotice.emailReceiveLog,
  )
  costNotices: CcaliInsCostNotice[];
}
