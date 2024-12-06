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
  name: 'boon_sms_log',
  comment: '보온 알리고 문자 전송 로그',
})
@Index(['adminId'])
@Index(['insProdCd'])
@Index(['joinId'])
export class BoonSmsSendLog {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'admin_id',
    comment: '관리자 ID',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  adminId: number;

  @Column({
    name: 'ins_prod_cd',
    comment: '보험상품코드',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  insProdCd: string;

  @Column({
    name: 'join_id',
    comment: '가입정보 ID',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  joinId: number;

  @Column({
    name: 'send_data',
    comment: '전송 데이터',
    type: 'text',
    nullable: false,
  })
  sendData: string;

  @Column({
    name: 'response_data',
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
