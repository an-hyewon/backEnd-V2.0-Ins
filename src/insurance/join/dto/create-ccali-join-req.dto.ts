import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import * as dayjs from 'dayjs';
import { SubCompanyDto } from './sub-company.dto';

export class CreateCcaliJoinReqDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(255)
  @ApiPropertyOptional({ description: 'URL' })
  locationHref?: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(20)
  @ApiProperty({ description: '참조 키값' })
  referIdx: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @ApiProperty({ description: '플랜 ID' })
  planId: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(100)
  @ApiPropertyOptional({ description: '계약자 명' })
  phNm?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(100)
  @ApiPropertyOptional({ description: '계약자 상호명' })
  phFranNm?: string;

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(10)
  @ApiPropertyOptional({ description: '계약자 사업자번호' })
  phBizNo?: string;

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(20)
  @ApiPropertyOptional({ description: '계약자 휴대폰번호' })
  phPhoneNo?: string;

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(14)
  @ApiPropertyOptional({ description: '계약자 주민번호' })
  phRrNo?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(200)
  @IsEmail()
  @ApiPropertyOptional({
    description: '계약자 이메일',
    example: 'example@gmail.com',
  })
  phEmail?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(400)
  @ApiPropertyOptional({ description: '계약자 지번 주소' })
  phJibunAddr?: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(400)
  @ApiProperty({ description: '계약자 도로명 주소' })
  phRoadAddr: string;

  @IsNotEmpty()
  @IsNumberString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(10)
  @ApiProperty({ description: '계약자 우편번호' })
  phZipCd: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(100)
  @ApiPropertyOptional({ description: '피보험자 명' })
  insuredNm?: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(100)
  @ApiProperty({ description: '피보험자 상호명' })
  insuredFranNm: string;

  @IsNotEmpty()
  @IsNumberString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(10)
  @ApiProperty({ description: '피보험자 사업자번호' })
  insuredBizNo: string;

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => value?.trim())
  @Length(13, 13)
  @ApiPropertyOptional({ description: '피보험자 법인등록번호(13자리)' })
  insuredCorpNo?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(100)
  @ApiPropertyOptional({ description: '피보험자 법인 국적' })
  insuredCorpNationality?: string;

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(8)
  @ApiPropertyOptional({ description: '피보험자 법인 설립일(YYYYMMDD)' })
  insuredCorpFoundationYmd?: string;

  @IsNotEmpty()
  @IsNumberString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(20)
  @ApiProperty({ description: '피보험자 휴대폰번호' })
  insuredPhoneNo: string;

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(14)
  @ApiPropertyOptional({ description: '피보험자 주민번호' })
  insuredRrNo?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(200)
  @IsEmail()
  @ApiPropertyOptional({
    description: '피보험자 이메일',
    example: 'example@gmail.com',
  })
  insuredEmail?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(400)
  @ApiPropertyOptional({ description: '피보험자 지번 주소' })
  insuredJibunAddr?: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(400)
  @ApiProperty({ description: '피보험자 도로명 주소' })
  insuredRoadAddr: string;

  @IsNotEmpty()
  @IsNumberString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(10)
  @ApiProperty({ description: '피보험자 우편번호' })
  insuredZipCd: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(6)
  @ApiProperty({
    description:
      '사업자번호 정보 가지고 온 데이터 위치(1:kodata, 2:kodata법인, 3:제로페이, 4:기가입자, 5:글로벌핀테크, 6:kodata법인2, 0:없음)',
  })
  insuredBzcOrigin: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @ApiProperty({ description: '국세청 업종 ID', example: 193 })
  ntsBizTypeId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @ApiProperty({ description: '중대재해 업종 ID', example: 150 })
  ccaliBizTypeId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @ApiProperty({ description: '연간 매출액' })
  salesCost: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @ApiProperty({ description: '소속 상시 근로자수' })
  regularEmployeeCnt: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @ApiProperty({ description: '파견 근로자수' })
  dispatchedEmployeeCnt: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @ApiProperty({ description: '소속 외 하도급 근로자 수' })
  subcontractEmployeeCnt: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({ description: '연임금 총액' })
  totAnnualWages?: number;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsIn(['Y', 'N'])
  @ApiProperty({
    description: '사업자 개업연도 올해 여부(Y: 올해, N: 올해 이전)',
  })
  openedCurrentYearYn: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsIn(['Y', 'N'])
  @ApiProperty({ description: '중대재해 처벌법에 따른 송치 이력 여부(Y/N)' })
  referralHistoryYn: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @ApiProperty({ description: '보상한도 ID' })
  coverageLimitId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @ApiProperty({ description: '자기부담금' })
  deductibleInsCost: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @ApiProperty({ description: '결제 보험료(납입 보험료)' })
  payInsCost: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @ApiProperty({ description: '총 보험료' })
  totInsCost: number;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: '보험 시작일시(YYYY-MM-DD HH:mm:ss)',
    example: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  })
  insStartDt?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: '보험 종료일시(YYYY-MM-DD HH:mm:ss)',
    example: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  })
  insEndDt?: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @ApiProperty({ description: '보험 갱신 차수(0: 첫가입, 1~n: 차수)' })
  joinRenewNo: number = 0;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(20)
  @ApiPropertyOptional({ description: '갱신 전 참조 키값(신규/갱신 포함)' })
  beforeReferIdx?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(100)
  @ApiPropertyOptional({ description: '추천인 소속' })
  recommenderOrganization?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(100)
  @ApiPropertyOptional({ description: '추천인' })
  recommenderNm?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ each: true })
  @Min(1, { each: true })
  @ApiPropertyOptional({
    description: `
    질문 응답 정보
    보험 담보 지역(guaranteeRegionList), 특별약관 가입(specialClauseList), 중대산업재해 추가 정보, 중대시민재해 추가 정보
    `,
  })
  answerIds?: number[];

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsIn(['Y', 'N'])
  @ApiPropertyOptional({ description: '자회사 가입 여부(Y/N)' })
  subCompanyJoinYn?: string;

  @IsOptional()
  @Type(() => SubCompanyDto)
  @ValidateNested({ each: true })
  @ApiPropertyOptional({
    description: `자회사 담보 목록`,
  })
  subCompanyList?: SubCompanyDto[];

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(100)
  @ApiPropertyOptional({ description: '제조하는 생산물 종류(제조업인 경우)' })
  productType?: string;

  @IsOptional()
  @Type(() => String)
  @IsString({ each: true })
  @ApiPropertyOptional({
    description: `
    고위험 품목 포함 여부
    - 항공기 및 관련 부품
    - 완성차 및 관련 부품
    - 타이어
    - 헬멧
    - 철도 및 철로용 신호장치
    - 농약 및 제초제
    - 담배
    - 의약품 및 체내이식형 의료기기
    - 혈액 및 인체추출 물질
    - 폭죽, 탄약, 화약 등 폭발 용도로 사용되는 제품
    `,
  })
  highRiskProducts?: string[];
}
