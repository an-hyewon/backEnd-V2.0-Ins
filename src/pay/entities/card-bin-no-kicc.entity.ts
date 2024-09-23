import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  name: 'card_bin_no_kicc',
  comment: 'KICC 카드 BIN 번호 테이블',
})
@Unique(['cardBinNo'])
export class CardBinNoKicc {
  @ApiProperty({ description: 'ID' })
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @ApiPropertyOptional({ description: '발급사' })
  @Column({
    name: 'card_issuer',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  cardIssuer: string;

  @ApiPropertyOptional({ description: '카드 BIN 번호' })
  @Column({
    name: 'card_bin_no',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  cardBinNo: string;

  @ApiPropertyOptional({ description: '카드명칭(전표인자명)' })
  @Column({
    name: 'card_nm',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  cardNm: string;

  @Column({
    name: 'corp_gb_cd',
    comment: '개인/법인 구분 코드(P:개인, C:법인)',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  corpGbCd: string;

  @ApiPropertyOptional({ description: '카드 브랜드' })
  @Column({
    name: 'card_brand',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  cardBrand: string;

  @ApiPropertyOptional({ description: '카드종류(신용/체크/기프트)' })
  @Column({
    name: 'card_type',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  cardType: string;

  @ApiPropertyOptional({ description: '적용날짜(등록/수정일자)' })
  @Column({
    name: 'apply_day',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  applyDay: string;

  @ApiPropertyOptional({ description: '변경사항(변경/삭제/신규)' })
  @Column({
    name: 'updt_txt',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  updtTxt: string;

  @ApiPropertyOptional({ description: '비고' })
  @Column({
    name: 'etc',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  etc: string;
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
