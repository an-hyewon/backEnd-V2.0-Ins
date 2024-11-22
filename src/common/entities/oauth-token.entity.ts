import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_oauth_token', comment: '토큰 관리 테이블' })
export class OauthToken {
  @PrimaryGeneratedColumn({
    name: 'seq_no',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'token_type',
    comment: '접근토큰 유형(Bearer 고정값)',
    type: 'varchar',
    length: 6,
    nullable: true,
  })
  tokenType: string;

  @Column({
    name: 'access_token',
    comment: '발급된 접근토큰',
    type: 'varchar',
    length: 1500,
    nullable: true,
  })
  accessToken: string;

  @Column({
    name: 'expires_in',
    comment: '접근토큰 유효기간(단위: 초)',
    type: 'varchar',
    length: 9,
    nullable: true,
  })
  expiresIn: string;

  @Column({
    name: 'expires_dt',
    comment: '접근토큰 유효일시',
    type: 'datetime',
    nullable: true,
  })
  expiresDt: Date;

  @Column({
    name: 'refresh_token',
    comment: '리프레시 토큰',
    type: 'varchar',
    length: 1500,
    nullable: true,
  })
  refreshToken: string;

  @Column({
    name: 'refresh_token_expires_in',
    comment: '리프레시 토큰 유효기간(단위: 초)',
    type: 'varchar',
    length: 9,
    nullable: true,
  })
  refreshTokenExpiresIn: string;

  @Column({
    name: 'refresh_token_expires_dt',
    comment: '리프레시 토큰 유효일시',
    type: 'datetime',
    nullable: true,
  })
  refreshTokenExpiresDt: Date;

  @Column({
    name: 'scope',
    comment:
      'grant_type 값에 따라 설정 (다중 scope 가능)(client_credentials 값일 경우 public 추가)',
    type: 'varchar',
    length: 128,
    nullable: true,
  })
  scope: string;

  @Column({
    name: 'provider',
    comment: 'api 제공자',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  provider: string;

  @Column({
    name: 'purps',
    comment: '용도 구분(dev: 개발, prod: 운영)',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  purps: string;

  @CreateDateColumn({
    name: 'created_dt',
    comment: '토큰 발급일시(refresh_token 참고)',
    type: 'datetime',
    nullable: false,
  })
  createdDt: Date;

  @Column({
    name: 'updated_dt',
    comment: '토큰 갱신일시(access_token 참고)',
    type: 'datetime',
    nullable: true,
  })
  updatedDt: Date;
}
