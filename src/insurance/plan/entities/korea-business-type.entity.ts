import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({
  name: 'tb_korea_business_info',
  comment: '한국표준산업분류코드 테이블',
})
@Unique(['bizSubSubTypeCd'])
@Index(['bizLargeTypeCd'])
@Index(['bizMediumTypeCd'])
@Index(['bizSmallTypeCd'])
@Index(['bizSubTypeCd'])
@Index(['sbSeq'])
@Index(['privacySeq'])
@Index(['privacySbSeq'])
export class KoreaBusinessInfo {
  @ApiProperty({ description: 'ID' })
  @PrimaryGeneratedColumn({ name: 'seq_no', type: 'int', unsigned: true })
  id: number;

  @ApiPropertyOptional({ description: '대분류 코드' })
  @Column({
    name: 'large_type_cd',
    type: 'varchar',
    length: 2,
    nullable: true,
  })
  bizLargeTypeCd: string;

  @ApiPropertyOptional({ description: '대분류 코드명' })
  @Column({
    name: 'large_type_nm',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  bizLargeTypeNm: string;

  @ApiPropertyOptional({ description: '중분류 코드' })
  @Column({
    name: 'medium_type_cd',
    type: 'varchar',
    length: 2,
    nullable: true,
  })
  bizMediumTypeCd: string;

  @ApiPropertyOptional({ description: '중분류 코드명' })
  @Column({
    name: 'medium_type_nm',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  bizMediumTypeNm: string;

  @ApiPropertyOptional({ description: '소분류 코드' })
  @Column({
    name: 'small_type_cd',
    type: 'varchar',
    length: 3,
    nullable: true,
  })
  bizSmallTypeCd: string;

  @ApiPropertyOptional({ description: '소분류 코드명' })
  @Column({
    name: 'small_type_nm',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  bizSmallTypeNm: string;

  @ApiPropertyOptional({ description: '세분류 코드' })
  @Column({
    name: 'sub_type_cd',
    type: 'varchar',
    length: 4,
    nullable: true,
  })
  bizSubTypeCd: string;

  @ApiPropertyOptional({ description: '세분류 코드명' })
  @Column({
    name: 'sub_type_nm',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  bizSubTypeNm: string;

  @ApiPropertyOptional({ description: '세세분류 코드' })
  @Column({
    name: 'sub_sub_type_cd',
    type: 'varchar',
    length: 5,
    nullable: true,
  })
  bizSubSubTypeCd: string;

  @ApiPropertyOptional({ description: '세세분류 코드명' })
  @Column({
    name: 'sub_sub_type_nm',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  bizSubSubTypeNm: string;

  @ApiPropertyOptional({ description: '소상공인 분류 테이블 seq_no' })
  @Column({
    name: 'sb_seq',
    type: 'int',
    width: 11,
    nullable: true,
    default: 0,
  })
  sbSeq: number;

  @ApiPropertyOptional({ description: '개인정보보호 업종 분류 테이블 seq_no' })
  @Column({
    name: 'privacy_seq',
    type: 'int',
    width: 11,
    nullable: true,
  })
  privacySeq: number;

  @ApiPropertyOptional({
    description: '개인정보보호 소상공인 분류 테이블 seq_no',
  })
  @Column({
    name: 'privacy_sb_seq',
    type: 'int',
    width: 11,
    nullable: true,
  })
  privacySbSeq: number;
}
