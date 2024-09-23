import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'client_log', comment: '클라이언트 로그 테이블' })
export class ClientLog {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({
    name: 'session_id',
    comment: 'session id',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  sessionId: string;

  @Column({
    name: 'user_agent',
    comment: 'user agent',
    type: 'text',
    nullable: false,
  })
  userAgent: string;

  @Column({
    name: 'user_ip',
    comment: 'user ip',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  userIp: string;

  @Column({
    name: 'server_host',
    comment: '백엔드 서버 host',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  serverHost: string;

  @Column({
    name: 'req_path',
    comment: 'request originalUrl',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  path: string;

  @Column({
    name: 'url',
    comment: 'url',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  url: string;

  @Column({
    name: 'req_method',
    comment: 'request method',
    type: 'varchar',
    length: 10,
    nullable: false,
  })
  reqMethod: string;

  @Column({
    name: 'req_params',
    comment: 'params',
    type: 'text',
    nullable: false,
  })
  reqParams: string;

  @Column({
    name: 'req_query',
    comment: 'query',
    type: 'text',
    nullable: false,
  })
  reqQuery: string;

  @Column({ name: 'req_body', comment: 'body', type: 'text', nullable: false })
  reqBody: string;

  @Column({
    name: 'username',
    comment: '아이디',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  username: string;

  @Column({
    name: 'user_role',
    comment: '아이디 권한(admin, user)',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  userRole: string;

  @Column({ name: 'res_data', comment: '응답', type: 'text', nullable: true })
  resJson: string;

  @CreateDateColumn({
    name: 'crt_dt',
    comment: '생성일시',
    type: 'datetime',
    nullable: false,
  })
  createdDt: Date;
}
