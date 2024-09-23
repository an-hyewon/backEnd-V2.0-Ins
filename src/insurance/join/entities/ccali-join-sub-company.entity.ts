import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { CcaliJoin } from './ccali-join.entity';

@Entity({
  name: 'ccali_join_sub_com',
  comment: '중대재해 자회사 담보 목록 테이블',
})
@Unique(['joinId', 'subCompanyBizNo'])
@Index(['joinId'])
@Index(['ntsBizTypeId'])
@Index(['ccaliBizTypeId'])
@Index(['korBizTypeId'])
export class CcaliJoinSubCompany {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'Id',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'join_id',
    comment: '가입 ID',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  joinId: number;

  @Column({
    name: 'sub_com_biz_no',
    comment: '자회사 사업자번호',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  subCompanyBizNo: string;

  @Column({
    name: 'sub_com_biz_no_gb_cd',
    comment: '자회사 사업자번호 구분 코드',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  subCompanyBizNoGbCd: string;

  @Column({
    name: 'sub_com_fran_nm',
    comment: '자회사 명',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  subCompanyFranNm: string;

  @Column({
    name: 'sub_com_jibun_addr',
    comment: '지번 주소',
    type: 'varchar',
    length: 400,
    nullable: true,
  })
  subCompanyJibunAddr: string;

  @Column({
    name: 'sub_com_road_addr',
    comment: '도로명 주소',
    type: 'varchar',
    length: 400,
    nullable: true,
  })
  subCompanyRoadAddr: string;

  @Column({
    name: 'sub_com_zip_cd',
    comment: '우편번호',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  subCompanyZipCd: string;

  @Column({
    name: 'nts_biz_type_id',
    comment: '국세청 업종 ID',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  ntsBizTypeId: number;

  @Column({
    name: 'nts_biz_type_cd',
    comment: '국세청 업종코드',
    type: 'varchar',
    length: 6,
    nullable: true,
  })
  ntsBizTypeCd: string;

  @Column({
    name: 'nts_biz_type_nm',
    comment: '국세청 업종명',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  ntsBizTypeNm: string;

  @Column({
    name: 'ccali_biz_type_id',
    comment: '중대재해 업종 ID',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  ccaliBizTypeId: number;

  @Column({
    name: 'ccali_biz_type_cd',
    comment: '중대재해 업종코드',
    type: 'varchar',
    length: 5,
    nullable: true,
  })
  ccaliBizTypeCd: string;

  @Column({
    name: 'ccali_biz_type_nm',
    comment: '중대재해 업종명',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  ccaliBizTypeNm: string;

  @Column({
    name: 'kor_biz_type_id',
    comment: '표준산업코드 업종 ID',
    type: 'int',
    width: 11,
    nullable: true,
    unsigned: true,
  })
  korBizTypeId: number;

  @Column({
    name: 'emp_cnt',
    comment: '소속 근로자수',
    type: 'int',
    width: 11,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  employeeCnt: number;

  @Column({
    name: 'ext_emp_cnt',
    comment: '소속 외 근로자 수',
    type: 'int',
    width: 11,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  externalEmployeeCnt: number;

  @Column({
    name: 'tot_emp_cnt',
    comment: '총 근로자수',
    type: 'int',
    width: 11,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  totEmployeeCnt: number;

  @Column({
    name: 'tot_anl_wgs',
    comment: '연임금 총액',
    type: 'bigint',
    width: 20,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  totAnnualWages: number;

  @Column({
    name: 'sales_cst',
    comment: '연간 매출액',
    type: 'bigint',
    width: 20,
    nullable: true,
    default: 0,
    unsigned: true,
  })
  salesCost: number;

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

  @ManyToOne(() => CcaliJoin, (join) => join.subCompanys, {
    nullable: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'join_id', referencedColumnName: 'id' }) // 외래 키 명시
  join: CcaliJoin;
}
