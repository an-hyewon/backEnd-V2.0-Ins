import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'tb_finpc_corp_business_info',
  comment: '글로벌핀테크 법인 사업자 정보 테이블',
})
@Index(['franNm'])
@Index(['bzno'])
@Index(['franAddr'])
@Index(['bzcCd'])
export class FinpcCorpBusinessInfo {
  @ApiProperty({ description: 'ID' })
  @PrimaryGeneratedColumn({ name: 'seq_no', type: 'int', unsigned: true })
  id: number;

  @ApiPropertyOptional({ description: '상호(법인)명' })
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

  @ApiPropertyOptional({ description: '법인등록번호' })
  @Column({
    name: 'bzno_corp',
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  bznoCorp: string;

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

  @ApiPropertyOptional({ description: '주요제품(상품)' })
  @Column({
    name: 'main_product_nm',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  mainProductNm: string;

  @ApiPropertyOptional({ description: '종업원수' })
  @Column({
    name: 'employee_cnt',
    type: 'varchar',
    length: 16,
    nullable: true,
  })
  employeeCnt: string;

  @ApiPropertyOptional({ description: '종업원수 기준일자(yyyyMMdd)' })
  @Column({
    name: 'employee_dt',
    type: 'varchar',
    length: 8,
    nullable: true,
  })
  employeeDt: string;

  @ApiPropertyOptional({ description: '22매출액(천원)' })
  @Column({
    name: 'sales_cnt',
    type: 'varchar',
    length: 16,
    nullable: true,
  })
  salesCnt: string;

  @ApiPropertyOptional({ description: '22(손익)_급여(급료와임금)' })
  @Column({
    name: 'profit_loss_pay_cnt',
    type: 'varchar',
    length: 16,
    nullable: true,
  })
  profitLossPayCnt: string;

  @ApiPropertyOptional({ description: '22(제조)_급여(급료및임금)' })
  @Column({
    name: 'manufacturing_pay_cnt',
    type: 'varchar',
    length: 16,
    nullable: true,
  })
  manufacturingPayCnt: string;

  @ApiPropertyOptional({ description: '22(제조)상여금' })
  @Column({
    name: 'manufacturing_bonnus_pay_cnt',
    type: 'varchar',
    length: 16,
    nullable: true,
  })
  manufacturingBonnusPayCnt: string;

  @ApiPropertyOptional({ description: '22(제조)퇴직급여' })
  @Column({
    name: 'manufacturing_retire_pay_cnt',
    type: 'varchar',
    length: 16,
    nullable: true,
  })
  manufacturingRetirePayCnt: string;

  @ApiPropertyOptional({ description: '22(제조)용역비_원재료비' })
  @Column({
    name: 'manufacturing_service_raw_material_cnt',
    type: 'varchar',
    length: 16,
    nullable: true,
  })
  manufacturingServiceRawMaterialCnt: string;

  @ApiPropertyOptional({ description: '22(제조)용역비_노무비' })
  @Column({
    name: 'manufacturing_service_labor_cnt',
    type: 'varchar',
    length: 16,
    nullable: true,
  })
  manufacturingServiceLaborCnt: string;

  @ApiPropertyOptional({ description: '22(제조)용역비_경비' })
  @Column({
    name: 'manufacturing_service_expense_cnt',
    type: 'varchar',
    length: 16,
    nullable: true,
  })
  manufacturingServiceExpenseCnt: string;

  @ApiPropertyOptional({ description: '22(제조)기타' })
  @Column({
    name: 'manufacturing_etc_cnt',
    type: 'varchar',
    length: 16,
    nullable: true,
  })
  manufacturingEtcCnt: string;

  @ApiPropertyOptional({ description: '22(제조)외주비(외주가공비)' })
  @Column({
    name: 'manufacturing_out_cnt',
    type: 'varchar',
    length: 16,
    nullable: true,
  })
  manufacturingOutCnt: string;
}
