import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({
  name: 'tb_kodata_corp_business_info',
  comment: '코데이터 법인사업자 정보 테이블',
})
@Unique(['bzno', 'bznoCorp'])
@Index(['franNm'])
@Index(['franAddr'])
@Index(['bzcCd'])
export class KodataCorpBusinessInfo {
  @ApiProperty({ description: 'ID' })
  @PrimaryGeneratedColumn({ name: 'seq_no', type: 'int', unsigned: true })
  id: number;

  @ApiPropertyOptional({ description: '상호명' })
  @Column({
    name: 'fran_nm',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  franNm: string;

  @ApiPropertyOptional({ description: '사업자등록번호' })
  @Column({
    name: 'bzno',
    type: 'varchar',
    length: 13,
    nullable: true,
  })
  bzno: string;

  @ApiPropertyOptional({ description: '법인번호' })
  @Column({
    name: 'bzno_corp',
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  bznoCorp: string;

  @ApiPropertyOptional({ description: '대표자명' })
  @Column({
    name: 'owner_nm',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  ownerNm: string;

  @ApiPropertyOptional({ description: '대표자주민번호(앞7자리)' })
  @Column({
    name: 'owner_no',
    type: 'varchar',
    length: 14,
    nullable: true,
  })
  ownerNo: string;

  @ApiPropertyOptional({ description: '주소' })
  @Column({
    name: 'fran_addr',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  franAddr: string;

  @ApiPropertyOptional({
    description: '10차 표준산업분류 코드(대분류 코드 1 + 세세분류 코드 5)',
  })
  @Column({
    name: 'bzc_cd',
    type: 'varchar',
    length: 8,
    nullable: true,
  })
  bzcCd: string;

  @ApiPropertyOptional({ description: '10차 표준산업분류 세세분류 코드명' })
  @Column({
    name: 'bzc_nm',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  bzcNm: string;

  @ApiPropertyOptional({ description: '이메일' })
  @Column({
    name: 'gen_email',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  genEmail: string;

  @ApiPropertyOptional({ description: '전화번호' })
  @Column({
    name: 'gen_tel',
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  genTel: string;

  @ApiPropertyOptional({ description: '종업원수기준일자_최근' })
  @Column({
    name: 'employee_dt',
    type: 'varchar',
    length: 8,
    nullable: true,
  })
  employeeDt: string;

  @ApiPropertyOptional({ description: '종업원수_최근' })
  @Column({
    name: 'employee_cnt',
    type: 'varchar',
    length: 16,
    nullable: true,
  })
  employeeCnt: string;

  @ApiPropertyOptional({ description: '결산일_2021' })
  @Column({
    name: 'sales_dt',
    type: 'varchar',
    length: 8,
    nullable: true,
  })
  salesDt: string;

  @ApiPropertyOptional({ description: '매출액_2021(천원)' })
  @Column({
    name: 'sales_cnt',
    type: 'varchar',
    length: 16,
    nullable: true,
  })
  salesCnt: string;
}
