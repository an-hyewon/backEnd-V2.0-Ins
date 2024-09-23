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

@Entity({ name: 'ccali_claim', comment: '중대재해 사고접수 테이블' })
@Index(['joinId'])
@Index(['claimStatusCd'])
@Index(['emailSendYn'])
export class CcaliClaim {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'Id',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'join_id',
    comment: '가입정보 ID',
    type: 'int',
    width: 11,
    nullable: false,
    default: 0,
    unsigned: true,
  })
  joinId: number;

  @Column({
    name: 'acdnt_ymd',
    comment: '사고 발생일자',
    type: 'date',
    nullable: true,
  })
  accidentYmd: Date;

  @Column({
    name: 'acdnt_tm',
    comment: '사고 발생 시간(HH:mm)',
    type: 'varchar',
    length: 5,
    nullable: true,
  })
  accidentTime: string;

  @Column({
    name: 'acdnt_type',
    comment: '사고 유형',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  accidentType: string;

  @Column({
    name: 'acdnt_cn',
    comment: '사고내용',
    type: 'text',
    nullable: true,
  })
  accidentContent: string;

  @Column({
    name: 'claim_stts_cd',
    comment: '사고접수 상태 코드',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  claimStatusCd: string;

  @Column({
    name: 'eml_snd_yn',
    comment: '메일 전송 여부',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  emailSendYn: string;

  @Column({
    name: 'eml_snd_dt',
    comment: '메일 전송일시',
    type: 'datetime',
    nullable: true,
  })
  emailSendDt: Date;

  @Column({
    name: 'eml_rcv_dt',
    comment: '메일 수신일시',
    type: 'datetime',
    nullable: true,
  })
  emailReceiveDt: Date;

  @Column({
    name: 'eml_cfm_dt',
    comment: '메일 확인일시',
    type: 'datetime',
    nullable: true,
  })
  emailConfirmDt: Date;

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
