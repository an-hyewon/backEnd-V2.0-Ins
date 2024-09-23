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

@Entity({ name: 'alimtalk_templt', comment: '알림톡 템플릿 테이블' })
@Index(['templtCode'])
export class AlimtalkTemplate {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'sender_key',
    comment: '발신프로필키',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  senderKey: string;

  @Column({
    name: 'templt_code',
    comment: '템플릿 코드',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  templtCode: string;

  @Column({
    name: 'templt_name',
    comment: '템플릿 명',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  templtName: string;

  @Column({
    name: 'templt_content',
    comment: '등록된 템플릿 콘텐츠',
    type: 'varchar',
    length: 2000,
    nullable: true,
  })
  templtContent: string;

  @Column({
    name: 'template_type',
    comment:
      '템플릿 메세지 유형(BA: 기본형, EX: 부가 정보형, AD: 광고 추가형, MI: 복합형)',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  templateType: string;

  @Column({
    name: 'template_em_type',
    comment:
      '템플릿 강조유형(NONE: 선택안함, TEXT: 강조표기형, IMAGE: 이미지형)',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  templateEmType: string;

  @Column({
    name: 'template_extra',
    comment: '부가정보',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  templateExtra: string;

  @Column({
    name: 'template_advert',
    comment: '채널추가',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  templateAdvert: string;

  @Column({
    name: 'templt_title',
    comment: '강조표기 핵심정보',
    type: 'varchar',
    length: 28,
    nullable: true,
  })
  templtTitle: string;

  @Column({
    name: 'templt_subtitle',
    comment: '강조표기 보조문구',
    type: 'varchar',
    length: 22,
    nullable: true,
  })
  templtSubtitle: string;

  @Column({
    name: 'templt_image_name',
    comment: '템플릿 이미지 파일명',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  templtImageName: string;

  @Column({
    name: 'templt_image_url',
    comment: '템플릿 이미지 링크',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  templtImageUrl: string;

  @Column({
    name: 'block',
    comment: '',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  block: string;

  @Column({
    name: 'dormant',
    comment: '',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  dormant: string;

  @Column({
    name: 'security_flag',
    comment: '보안 템플릿 여부(모바일에서만 알림톡 조회 가능)(Y/N)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  securityFlag: string;

  @Column({
    name: 'status',
    comment: '상태 (S: 중단, A: 정상, R: 대기)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  status: string;

  @Column({
    name: 'insp_status',
    comment: '승인상태 (REG: 등록, REQ: 심사요청, APR: 승인, REJ: 반려)',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  inspStatus: string;

  @Column({
    name: 'cdate',
    comment: '템플릿 생성일',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  cdate: string;

  @Column({
    name: 'comments',
    comment: '템플릿 코멘트',
    type: 'text',
    nullable: true,
  })
  comments: string;

  @CreateDateColumn({
    name: 'crt_dt',
    comment: '생성일시',
    type: 'datetime',
    nullable: false,
  })
  createdDt: Date;

  @UpdateDateColumn({
    name: 'updt_dt',
    comment: '갱신일시',
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
