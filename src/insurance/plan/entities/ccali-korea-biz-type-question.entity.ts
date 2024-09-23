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
  name: 'ccali_kor_biz_type_qstn',
  comment: '중대재해 업종 질문 테이블',
})
@Unique(['korBizSubSubTypeCd', 'questionNo'])
@Index(['ccaliBizSmallTypeCd'])
export class CcaliKoreaBizTypeQuestion {
  @ApiProperty({ description: 'ID' })
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @ApiProperty({ description: '표준산업 세세분류 코드' })
  @Column({
    name: 'kor_biz_sub_sub_type_cd',
    type: 'varchar',
    length: 6,
    nullable: false,
  })
  korBizSubSubTypeCd: string;

  @ApiProperty({ description: '질문 번호' })
  @Column({
    name: 'qstn_no',
    type: 'int',
    width: 11,
    nullable: false,
    default: 0,
    unsigned: true,
  })
  questionNo: string;

  @ApiProperty({ description: '질문' })
  @Column({
    name: 'qstn_txt',
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  questionTxt: string;

  @ApiProperty({ description: '산업재해 소분류 코드' })
  @Column({
    name: 'ccali_biz_small_type_cd',
    type: 'varchar',
    length: 5,
    nullable: false,
  })
  ccaliBizSmallTypeCd: string;

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
