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

@Entity({
  name: 'tb_secukit_one_logs',
  comment: '한국정보인증 secukit_one 로그 테이블',
})
export class SecukitOneCertLogs {
  @PrimaryGeneratedColumn({
    name: 'seq_no',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'biz_num',
    comment: '사업자번호',
    type: 'varchar',
    length: 10,
    nullable: false,
  })
  insuredBizNo: string;

  @Column({
    name: 'ath_no',
    comment: '주문번호(결제 위변조 대사 작업시 주문번호를 이용하여 검증)',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  athNo: string;

  @Column({
    name: 'cert_base_64',
    comment: '',
    type: 'text',
    nullable: true,
  })
  certBase64: string;

  @Column({
    name: 'cert_hex',
    comment: '',
    type: 'text',
    nullable: true,
  })
  certHex: string;

  @Column({
    name: 'cert_pem',
    comment: '',
    type: 'text',
    nullable: true,
  })
  certPem: string;

  @Column({
    name: 'cn',
    comment: '',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  cn: string;

  @Column({
    name: 'issue_dn',
    comment: '',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  issueDn: string;

  @Column({
    name: 'issuer',
    comment: '',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  issuer: string;

  @Column({
    name: 'issuer_to_name',
    comment: '',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  issuerToName: string;

  @Column({
    name: 'key_size',
    comment: '',
    type: 'int',
    width: 11,
    nullable: true,
  })
  keySize: number;

  @Column({
    name: 'oid',
    comment: '',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  oid: string;

  @Column({
    name: 'policy',
    comment: '',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  policy: string;

  @Column({
    name: 'public_key',
    comment: '',
    type: 'text',
    nullable: true,
  })
  publicKey: string;

  @Column({
    name: 'serial',
    comment: '',
    type: 'bigint',
    width: 1201,
    nullable: true,
  })
  serial: number;

  @Column({
    name: 'signature_algorithm_id',
    comment: '',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  signatureAlgorithmId: string;

  @Column({
    name: 'todate',
    comment: '',
    type: 'date',
    nullable: true,
  })
  todate: Date;

  @Column({
    name: 'usage_to_name',
    comment: '',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  usageToName: string;

  @Column({
    name: 'user_dn',
    comment: '',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  userDn: string;

  @Column({
    name: 'username',
    comment: '',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  username: string;

  @Column({
    name: 'validate_from',
    comment: '',
    type: 'date',
    nullable: true,
  })
  validateFrom: Date;

  @Column({
    name: 'validate_to',
    comment: '',
    type: 'date',
    nullable: true,
  })
  validateTo: Date;

  @Column({
    name: 'version',
    comment: '',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  version: string;

  @Column({
    name: 'sign_data',
    comment: '',
    type: 'text',
    nullable: false,
  })
  signData: string;

  @CreateDateColumn({
    name: 'created_dt',
    comment: '생성일시',
    type: 'datetime',
    nullable: false,
  })
  createdDt: Date;

  @UpdateDateColumn({
    name: 'updated_dt',
    comment: '수정일시',
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
