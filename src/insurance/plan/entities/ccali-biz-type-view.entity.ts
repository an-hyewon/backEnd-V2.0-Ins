import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ViewColumn,
  ViewEntity,
} from 'typeorm';

// 중대재해 업종코드 테이블
@ViewEntity({
  name: 'vw_ccali_biz_type',
  expression: `
    SELECT cblt.id AS biz_large_type_id
           , cblt.biz_large_type_cd
           , cblt.biz_large_type_nm
           , cbmt.id AS biz_medium_type_id
           , cbmt.biz_medium_type_cd
           , cbmt.biz_medium_type_nm
           , cbst.id AS biz_small_type_id
           , cbst.biz_small_type_cd
           , cbst.biz_small_type_nm
           , cbst.indst_dstr_indiv_yn
           , cbst.indst_dstr_trf_type_id
           , cbst.civil_dstr_indiv_yn
           , cbst.civil_dstr_trf_type_id
           , cbst.memo
    FROM ccali_biz_small_type cbst INNER JOIN (
                                              SELECT *
                                              FROM ccali_biz_medium_type 
                                              WHERE del_dt IS NULL
                                             ) cbmt ON cbst.biz_medium_type_cd = cbmt.biz_medium_type_cd
                                  INNER JOIN (
                                              SELECT *
                                              FROM ccali_biz_large_type 
                                              WHERE del_dt IS NULL
                                             ) cblt ON cbmt.biz_large_type_cd = cblt.biz_large_type_cd
    WHERE 1=1
          AND cbst.del_dt IS NULL
  `,
})
export class CcaliBizTypeView {
  @ApiPropertyOptional({ description: '대분류 ID' })
  @ViewColumn({ name: 'biz_large_type_id' })
  bizLargeTypeId: number;

  @ApiPropertyOptional({ description: '대분류 코드' })
  @ViewColumn({ name: 'biz_large_type_cd' })
  bizLargeTypeCd: string;

  @ApiPropertyOptional({ description: '대분류 명' })
  @ViewColumn({ name: 'biz_large_type_nm' })
  bizLargeTypeNm: string;

  @ApiPropertyOptional({ description: '중분류 ID' })
  @ViewColumn({ name: 'biz_medium_type_id' })
  bizMediumTypeId: number;

  @ApiPropertyOptional({ description: '중분류 코드' })
  @ViewColumn({ name: 'biz_medium_type_cd' })
  bizMediumTypeCd: string;

  @ApiPropertyOptional({ description: '중분류 명' })
  @ViewColumn({ name: 'biz_medium_type_nm' })
  bizMediumTypeNm: string;

  @ApiPropertyOptional({ description: '소분류 ID' })
  @ViewColumn({ name: 'biz_small_type_id' })
  bizSmallTypeId: number;

  @ApiPropertyOptional({ description: '소분류 코드' })
  @ViewColumn({ name: 'biz_small_type_cd' })
  bizSmallTypeCd: string;

  @ApiPropertyOptional({ description: '소분류 명' })
  @ViewColumn({ name: 'biz_small_type_nm' })
  bizSmallTypeNm: string;

  @ApiPropertyOptional({ description: '산업재해 개별구득 여부' })
  @ViewColumn({ name: 'indst_dstr_indiv_yn' })
  indstDstrIndivYn: string;

  @ApiPropertyOptional({ description: '산업재해 요율 분류 ID' })
  @ViewColumn({ name: 'indst_dstr_trf_type_id' })
  indstDstrTrfTypeId: number;

  @ApiPropertyOptional({ description: '시민재해 개별구득 여부' })
  @ViewColumn({ name: 'civil_dstr_indiv_yn' })
  civilDstrIndivYn: string;
  @ApiPropertyOptional({ description: '시민재해 요율 분류 ID' })
  @ViewColumn({ name: 'civil_dstr_trf_type_id' })
  civilDstrTrfTypeId: number;

  @ApiPropertyOptional({ description: '비고' })
  @ViewColumn({ name: 'memo' })
  memo: string;
}
