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
  name: 'alimtalk_templt_btn',
  comment: '알림톡 템플릿 버튼 정보 테이블',
})
@Unique(['templtId', 'ordering'])
export class AlimtalkTemplateButton {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'templt_id',
    comment: '템플릿 ID',
    type: 'int',
    width: 11,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  templtId: number;

  @Column({
    name: 'ordering',
    comment: '버튼 순서 (1 ~ 5)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  ordering: string;

  @Column({
    name: 'name',
    comment: '버튼명',
    type: 'varchar',
    length: 14,
    nullable: true,
  })
  name: string;

  @Column({
    name: 'link_type',
    comment:
      '버튼타입(AC: 채널추가, DS: 배송조회, WL: 웹링크, AL: 앱링크, BK: 봇키워드, MD: 메시지전달)',
    type: 'varchar',
    length: 2,
    nullable: true,
  })
  linkType: string;

  @Column({
    name: 'link_type_name',
    comment: '버튼타입명',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  linkTypeName: string;

  @Column({
    name: 'link_mo',
    comment: '모바일 웹링크 (WL일때)',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  linkMo: string;

  @Column({
    name: 'link_pc',
    comment: 'PC 웹링크 (WL일때)',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  linkPc: string;

  @Column({
    name: 'link_ios',
    comment: 'IOS 앱링크 (AL일때)',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  linkIos: string;

  @Column({
    name: 'link_and',
    comment: '안드로이드 앱링크 (AL일때)',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  linkAnd: string;

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
