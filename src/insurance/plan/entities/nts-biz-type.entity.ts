import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'nts_biz_type',
  comment: '국세청 업종코드 테이블',
})
@Index(['bizLargeTypeCd'])
@Index(['bizMediumTypeCd'])
@Index(['bizSmallTypeCd'])
@Index(['bizSubTypeCd'])
@Index(['bizSubSubTypeCd'])
export class NtsBizType {
  @ApiProperty({ description: 'ID' })
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @ApiPropertyOptional({ description: '대분류 코드' })
  @Column({
    name: 'biz_large_type_cd',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  bizLargeTypeCd: string;

  @ApiPropertyOptional({ description: '대분류 명' })
  @Column({
    name: 'biz_large_type_nm',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  bizLargeTypeNm: string;

  @ApiPropertyOptional({ description: '중분류 코드' })
  @Column({
    name: 'biz_medium_type_cd',
    type: 'varchar',
    length: 2,
    nullable: true,
  })
  bizMediumTypeCd: string;

  @ApiPropertyOptional({ description: '중분류 명' })
  @Column({
    name: 'biz_medium_type_nm',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  bizMediumTypeNm: string;

  @ApiPropertyOptional({ description: '소분류 코드' })
  @Column({
    name: 'biz_small_type_cd',
    type: 'varchar',
    length: 3,
    nullable: true,
  })
  bizSmallTypeCd: string;

  @ApiPropertyOptional({ description: '소분류 명' })
  @Column({
    name: 'biz_small_type_nm',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  bizSmallTypeNm: string;

  @ApiPropertyOptional({ description: '세분류 코드' })
  @Column({
    name: 'biz_sub_type_cd',
    type: 'varchar',
    length: 4,
    nullable: true,
  })
  bizSubTypeCd: string;

  @ApiPropertyOptional({ description: '세분류 명' })
  @Column({
    name: 'biz_sub_type_nm',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  bizSubTypeNm: string;

  @ApiPropertyOptional({ description: '세세분류 코드' })
  @Column({
    name: 'biz_sub_sub_type_cd',
    type: 'varchar',
    length: 6,
    nullable: true,
  })
  bizSubSubTypeCd: string;

  @ApiPropertyOptional({ description: '세세분류 명' })
  @Column({
    name: 'biz_sub_sub_type_nm',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  bizSubSubTypeNm: string;

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

  @ApiPropertyOptional({ description: '삭제일시' })
  @DeleteDateColumn({
    name: 'del_dt',
    type: 'datetime',
    nullable: true,
  })
  deletedDt: Date;
}
