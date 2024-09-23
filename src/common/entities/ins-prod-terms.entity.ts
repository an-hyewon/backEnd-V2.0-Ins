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
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'ins_prod_trms', comment: '보험상품 약관 테이블' })
@Unique(['insProdId', 'startDt'])
export class InsProdTerms {
  @ApiProperty({ description: 'ID' })
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @ApiProperty({ description: '보험상품 ID' })
  @Column({
    name: 'ins_prod_id',
    type: 'int',
    width: 10,
    nullable: false,
    default: 0,
    unsigned: true,
  })
  insProdId: number = 0;

  @ApiProperty({ description: '보험상품 약관 URL' })
  @Column({
    name: 'trms_url',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  termsUrl: string;

  @ApiProperty({ description: '보험상품 약관 단축 URL' })
  @Column({
    name: 'trms_short_url',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  termsShortUrl: string;

  @ApiProperty({ description: '적용 시작일시' })
  @Column({
    name: 'strt_dt',
    type: 'datetime',
    nullable: true,
  })
  startDt: Date;

  @ApiProperty({ description: '적용 종료일시' })
  @Column({
    name: 'end_dt',
    type: 'datetime',
    nullable: true,
  })
  endDt: Date;

  @ApiProperty({ description: '생성일시' })
  @CreateDateColumn({
    name: 'crt_dt',
    type: 'datetime',
    nullable: false,
  })
  createdDt: Date;

  @ApiProperty({ description: '수정일시' })
  @UpdateDateColumn({
    name: 'updt_dt',
    type: 'datetime',
    nullable: false,
  })
  updatedDt: Date;

  @ApiProperty({ description: '삭제일시' })
  @DeleteDateColumn({
    name: 'del_dt',
    type: 'datetime',
    nullable: true,
  })
  deletedDt: Date;
}
