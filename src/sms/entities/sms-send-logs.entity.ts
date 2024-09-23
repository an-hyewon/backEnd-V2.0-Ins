import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_sms_send_logs', comment: '문자발송 로그 테이블' })
@Unique(['msgId'])
@Index(['referIdx'])
@Index(['receivers'])
export class SmsSendLogs {
  @PrimaryGeneratedColumn({
    name: 'seq_no',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'msg_type',
    comment: '메시지 타입 (SMS, LMS, MMS, AT: 알림톡, FT: 친구톡)',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  msgType: string;

  @Column({
    name: 'refer_idx',
    comment: '참조 키값',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  referIdx: string;

  @Column({
    name: 'sender',
    comment: '발신자 전화번호',
    type: 'varchar',
    length: 16,
    nullable: true,
  })
  sender: string;

  @Column({
    name: 'receivers',
    comment: '수신자들전번',
    type: 'varchar',
    length: 5000,
    nullable: true,
  })
  receivers: string;

  @Column({
    name: 'msg_data',
    comment: '메세지내용',
    type: 'varchar',
    length: 2000,
    nullable: true,
  })
  msgData: string;

  @Column({
    name: 'msg_title',
    comment: '문자제목(LMS,MMS만 허용)',
    type: 'varchar',
    length: 44,
    nullable: true,
  })
  msgTitle: string;

  @Column({
    name: 'msg_destination',
    comment: '%고객명% 치환용 입력',
    type: 'varchar',
    length: 2000,
    nullable: true,
  })
  msgDestination: string;

  @Column({
    name: 'image1',
    comment: '첨부이미지 (image 또는 image1)',
    type: 'varchar',
    length: 300,
    nullable: true,
  })
  image1: string;

  @Column({
    name: 'result_code',
    comment: '결과코드',
    type: 'varchar',
    length: 10,
    nullable: false,
  })
  resultCode: string;

  @Column({
    name: 'message',
    comment: '성공여부',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  message: string;

  @Column({
    name: 'msg_id',
    comment: '메시지id',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  msgId: string;

  @Column({
    name: 'success_cnt',
    comment: '전송성공갯수',
    type: 'int',
    width: 11,
    nullable: true,
  })
  successCnt: string;

  @Column({
    name: 'error_cnt',
    comment: '전송실패갯수',
    type: 'int',
    width: 11,
    nullable: true,
  })
  errorCnt: string;

  @Column({
    name: 'msg_cn_cd',
    comment:
      '메시지 내용 코드(JOIN: 가입완료, UNPAID_NOTI: 미결제 알림, PAY_REQ: 결제 요청)',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  msgContentCd: string;

  @Column({
    name: 'tpl_code',
    comment: '템플릿 코드',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  tplCode: string;

  @Column({
    name: 'senddate',
    comment: '예약일(YYYYMMDDHHmmss)',
    type: 'varchar',
    length: 14,
    nullable: true,
  })
  senddate: string;

  @Column({
    name: 'advert',
    comment: '광고분류(Y/N)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  advert: string;

  @Column({
    name: 'receiver_1',
    comment: '수신자 연락처',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  receiver1: string;

  @Column({
    name: 'recvname_1',
    comment: '수신자 이름',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  recvname1: string;

  @Column({
    name: 'subject_1',
    comment: '알림톡 제목',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  subject1: string;

  @Column({
    name: 'message_1',
    comment: '알림톡 내용',
    type: 'text',
    nullable: true,
  })
  message1: string;

  @Column({
    name: 'emtitle_1',
    comment: '강조표기형의 타이틀',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  emtitle1: string;

  @Column({
    name: 'button_1',
    comment: '버튼 정보',
    type: 'text',
    nullable: true,
  })
  button1: string;

  @Column({
    name: 'failover',
    comment: '실패시 대체문자 전송기능(Y/N)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  failover: string;

  @Column({
    name: 'fsubject_1',
    comment: '실패시 대체문자 제목',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  fsubject1: string;

  @Column({
    name: 'fmessage_1',
    comment: '실패시 대체문자 내용',
    type: 'text',
    nullable: true,
  })
  fmessage1: string;

  @Column({
    name: 'image',
    comment: '첨부이미지',
    type: 'text',
    nullable: true,
  })
  image: string;

  @Column({
    name: 'image_url',
    comment: '첨부이미지 링크',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  imageUrl: string;

  @Column({
    name: 'wideyn',
    comment: '와이드 이미지 전송(Y/N)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  wideyn: string;

  @Column({
    name: 'fimage',
    comment: '실패시 첨부이미지',
    type: 'text',
    nullable: true,
  })
  fimage: string;

  @Column({
    name: 'current',
    comment: '포인트',
    type: 'decimal',
    precision: 10,
    scale: 1,
    nullable: true,
    unsigned: true,
  })
  current: number;

  @Column({
    name: 'unit',
    comment: '개별전송단가',
    type: 'decimal',
    precision: 10,
    scale: 1,
    nullable: true,
    unsigned: true,
  })
  unit: number;

  @Column({
    name: 'total',
    comment: '전체전송단가',
    type: 'decimal',
    precision: 10,
    scale: 1,
    nullable: true,
    unsigned: true,
  })
  total: number;

  @Column({
    name: 'scnt',
    comment: '정상적으로 요청된 연락처 갯수',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  scnt: number;

  @Column({
    name: 'fcnt',
    comment: '잘못 요청된 연락처 갯수',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  fcnt: number;

  @Column({
    name: 'send_dt',
    comment: '발송일시',
    type: 'datetime',
    nullable: true,
  })
  sendDt: Date;

  @CreateDateColumn({
    name: 'created_dt',
    comment: '생성일시',
    type: 'datetime',
    nullable: false,
  })
  createdDt: Date;

  @DeleteDateColumn({
    name: 'deleted_dt',
    comment: '삭제일시',
    type: 'datetime',
    nullable: true,
  })
  deletedDt: Date;
}
