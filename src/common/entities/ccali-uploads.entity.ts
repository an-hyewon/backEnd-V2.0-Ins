import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'ccali_uploads', comment: '중대재해 첨부파일 테이블' })
@Unique(['fileUrl'])
@Index(['joinId'])
export class CcaliUploads {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'join_id',
    comment: '가입 ID',
    type: 'int',
    width: 11,
    nullable: false,
    default: 0,
    unsigned: true,
  })
  joinId: number = 0;

  @Column({
    name: 'original_file_nm',
    comment: '원본 파일 이름',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  originalFileNm: string;

  @Column({
    name: 'file_nm',
    comment: '저장된 파일 이름',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  fileNm: string;

  @Column({
    name: 'file_path',
    comment: '파일 경로',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  filePath: string;

  @Column({
    name: 'file_url',
    comment: '파일 URL',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  fileUrl: string;

  @Column({
    name: 'file_size',
    comment: '파일 크기',
    type: 'bigint',
    width: 20,
    nullable: true,
    unsigned: true,
  })
  fileSize: number;

  @Column({
    name: 'mime_type',
    comment: 'MIME 타입',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  mimeType: string;

  @CreateDateColumn({
    name: 'upload_dt',
    comment: '업로드 일시',
    type: 'datetime',
    nullable: false,
  })
  uploadDt: Date;
}
