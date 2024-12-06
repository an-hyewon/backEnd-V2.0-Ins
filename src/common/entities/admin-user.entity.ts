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

@Entity({ name: 'users', comment: '보온 어드민 계정정보 테이블' })
@Unique(['adminUserId'])
export class AdminUser {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'ID',
    type: 'int',
    unsigned: false,
  })
  id: number;

  @Column({
    name: 'nick',
    comment: '',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  adminUserNm: string;

  @Column({
    name: 'email',
    comment: '관리자 아이디',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  adminUserId: string;

  // @Column({
  //   name: 'password',
  //   comment: '비밀번호',
  //   type: 'varchar',
  //   length: 100,
  //   nullable: true,
  // })
  // password: string;

  @Column({
    name: 'password_view',
    comment: '비밀번호',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  password: string;

  @Column({
    name: 'provider',
    comment: '',
    type: 'varchar',
    length: 50,
    nullable: false,
    default: 'local',
  })
  provider: string;

  @Column({
    name: 'snsId',
    comment: '',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  snsId: string;

  @Column({
    name: 'user_level',
    comment: '레벨 M:관리자, I: 보험사, A: 제휴사, C: 채널사',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  userLevel: string;

  @Column({
    name: 'user_work_level',
    comment: '',
    type: 'int',
    width: 11,
    nullable: true,
    default: 0,
  })
  userWorkLevel: number;

  @CreateDateColumn({
    name: 'createdAt',
    comment: '생성일시',
    type: 'datetime',
    nullable: false,
  })
  createdDt: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
    comment: '수정일시',
    type: 'datetime',
    nullable: false,
  })
  updatedDt: Date;

  @DeleteDateColumn({
    name: 'deletedAt',
    comment: '삭제일시',
    type: 'datetime',
    nullable: true,
  })
  deletedDt: Date;
}
