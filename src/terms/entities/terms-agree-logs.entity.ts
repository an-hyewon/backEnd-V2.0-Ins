import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'tb_terms_agree_logs', comment: '약관동의 내역 로그 테이블' })
export class TermsAgreeLogs {
  @PrimaryGeneratedColumn({
    name: 'seq_no',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'terms_cd',
    comment: '',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  termsAgreeCd: string;

  @Column({
    name: 'ip_address',
    comment: '',
    type: 'varchar',
    length: 45,
    nullable: true,
  })
  ipAddress: string;

  @Column({
    name: 'agree',
    comment: '',
    type: 'tinyint',
    width: 1,
    nullable: false,
  })
  agree: number;

  @Column({
    name: 'businessnumber',
    comment: '사업자번호/주민등록번호',
    type: 'varchar',
    length: 13,
    nullable: false,
  })
  insuredBizNo: string;

  @Column({
    name: 'phone',
    comment: '전화번호',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  insuredPhoneNo: string;

  @Column({
    name: 'company',
    comment: '사업장명',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  insuredFranNm: string;

  @Column({
    name: 'datajson',
    comment: '입력받은모든값',
    type: 'text',
    nullable: true,
  })
  datajson: string;

  @Column({
    name: 'useragent',
    comment: '유저에이전트',
    type: 'varchar',
    length: 500,
    nullable: false,
  })
  userAgent: string;

  @Column({
    name: 'params',
    comment: '파라메터 / 현재주소값',
    type: 'varchar',
    length: 500,
    nullable: false,
  })
  referer: string;

  @CreateDateColumn({
    name: 'user_created_time',
    comment: '생성시간(사용자기준)',
    type: 'varchar',
    length: 45,
    nullable: false,
  })
  userCreatedDt: Date;
}
