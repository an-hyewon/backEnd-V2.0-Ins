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
  name: 'boon_cnslg',
  comment: '보온 상담내역',
})
@Index(['regId'])
@Index(['insProdCd'])
@Index(['joinId'])
export class BoonCounseling {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'reg_id',
    comment: '작성자 ID',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  regId: number;

  @Column({
    name: 'reg_nm',
    comment: '작성자 이름',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  regNm: string;

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
    comment: '가입 ID',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  joinId: number;

  @Column({
    name: 'contents',
    comment: '상담내용 or 문자내용 or 메일내용',
    type: 'varchar',
    length: 2000,
    nullable: true,
  })
  contents: string;

  @Column({
    name: 'cnsl_type',
    comment: '상담내역 상태(관리자 : A, 사용자: U)',
    type: 'varchar',
    length: 1,
    nullable: true,
    default: 'A',
  })
  counselingType: string;

  @Column({
    name: 'cate',
    comment: '구분(C : 상담내역, S : 문자, M : 메일, K : 카카오톡)',
    type: 'varchar',
    length: 1,
    nullable: true,
    default: 'C',
  })
  cate: string;

  @Column({
    name: 'ttl',
    comment: '제목',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  title: string;

  @Column({
    name: 'sender',
    comment: '보낸사람',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  sender: string;

  @Column({
    name: 'receiver',
    comment: '받는사람',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  receiver: string;

  @Column({
    name: 'view_yn',
    comment: '표출여부(외부: Y, 내부: N)',
    type: 'varchar',
    length: 1,
    nullable: true,
    default: 'Y',
  })
  viewYn: string;

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
