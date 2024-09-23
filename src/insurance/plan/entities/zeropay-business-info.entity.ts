import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'tb_zeropay_business_info',
  comment: '제로페이 사업자 정보 테이블',
})
@Index(['bzno'])
@Index(['franNm'])
@Index(['kbcBzcCd'])
@Index(['franAddr'])
export class ZeropayBusinessInfo {
  @ApiProperty({ description: 'ID' })
  @PrimaryGeneratedColumn({ name: 'seq_no', type: 'int', unsigned: true })
  id: number;

  @ApiPropertyOptional({ description: '사업자등록번호' })
  @Column({
    name: 'bzno',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  bzno: string;

  @ApiPropertyOptional({ description: '상호명' })
  @Column({
    name: 'fran_nm',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  franNm: string;

  @ApiPropertyOptional({
    description: '업종코드(10차 표준산업분류 세세분류 코드)',
  })
  @Column({
    name: 'kbc_bzc_cd',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  kbcBzcCd: string;

  @ApiPropertyOptional({ description: '업종' })
  @Column({
    name: 'kbc_bzc_nm',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  kbcBzcNm: string;

  @ApiPropertyOptional({ description: '업태코드' })
  @Column({
    name: 'bzc_cd',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  bzcCd: string;

  @ApiPropertyOptional({ description: '업태' })
  @Column({
    name: 'bzc_nm',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  bzcNm: string;

  @ApiPropertyOptional({ description: '주소' })
  @Column({
    name: 'fran_addr',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  franAddr: string;

  @ApiPropertyOptional({ description: '세부주소' })
  @Column({
    name: 'fran_addr_etc',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  franAddrEtc: string;

  @ApiPropertyOptional({ description: '시도' })
  @Column({
    name: 'fran_addr_sido',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  franAddrSido: string;

  @ApiPropertyOptional({ description: '시군구' })
  @Column({
    name: 'fran_addr_sigungu',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  franAddrSigungu: string;

  @ApiPropertyOptional({ description: '우편번호' })
  @Column({
    name: 'fran_addr_zipcode',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  franAddrZipcode: string;

  @ApiPropertyOptional({ description: '' })
  @Column({
    name: 'fran_addr_x',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  franAddrX: string;

  @ApiPropertyOptional({ description: '' })
  @Column({
    name: 'fran_addr_y',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  franAddrY: string;

  @ApiPropertyOptional({ description: '' })
  @Column({
    name: 'fran_road_addr_x',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  franRoadAddrX: string;

  @ApiPropertyOptional({ description: '' })
  @Column({
    name: 'fran_road_addr_y',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  franRoadAddrY: string;

  @ApiPropertyOptional({ description: '대표자명' })
  @Column({
    name: 'fran_owner',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  franOwner: string;

  @ApiPropertyOptional({ description: '' })
  @Column({
    name: 'em2021',
    type: 'int',
    width: 11,
    nullable: true,
    default: 0,
  })
  em2021: number;

  @ApiPropertyOptional({ description: '' })
  @Column({
    name: 'em202206',
    type: 'int',
    width: 11,
    nullable: true,
    default: 1,
  })
  em202206: number;

  @ApiPropertyOptional({ description: '' })
  @Column({
    name: 'est_sales_1y',
    type: 'int',
    width: 11,
    nullable: true,
    default: 0,
  })
  estSales1y: number;
}
