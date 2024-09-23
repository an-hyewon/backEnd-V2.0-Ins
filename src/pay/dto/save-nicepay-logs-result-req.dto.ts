import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class SaveNicepayLogsResultReqDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({
    description:
      '결제 결과 코드(3001 : 신용카드 성공, 4000 : 계좌이체 성공,4100 : 가상계좌 발급 성공, A000 : 휴대폰 소액결제 성공, 7001 : 현금영수증)',
  })
  ResultCode?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '결제 결과 메시지' })
  ResultMsg?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({
    description: '결제 금액(예)1000원인 경우 -> 000000001000)',
  })
  Amt?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '상점 ID' })
  MID?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '상점주문번호' })
  Moid?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({
    description:
      '위변조 검증 데이터(hex(sha256(TID + MID + Amt + MerchantKey)))',
  })
  Signature?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '구매자 이메일' })
  BuyerEmail?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '구매자 휴대폰번호' })
  BuyerTel?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '구매자 명' })
  BuyerName?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '상품명' })
  GoodsName?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '거래ID' })
  TID?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({
    description: '승인 번호 (신용카드, 계좌이체, 휴대폰)',
  })
  AuthCode?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '승인 날짜(YYMMDDHHMMSS)' })
  AuthDate?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({
    description:
      '결제수단(CARD:신용카드, BANK:계좌이체, VBANK : 가상계좌, CELLPHONE : 휴대폰결제)',
  })
  PayMethod?: string;

  // @IsOptional()
  // @IsString()
  // @Transform(({ value }) => value?.trim())
  // @ApiPropertyOptional({ description: '' })
  // requestId?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '가맹점 여분 필드' })
  MallReserved?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '결제 카드사 코드' })
  CardCode?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '결제 카드사 이름' })
  CardName?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({
    description:
      '카드번호(카카오머니/네이버포인트/페이코포인트 전액결제 거래 null)',
  })
  CardNo?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '할부개월(00:일시불, 03:3개월...)' })
  CardQuota?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({
    description: '상점분담 무이자 적용여부(0:미적용, 1:적용)',
  })
  CardInterest?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '매입 카드사 코드' })
  AcquCardCode?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '매입 카드사 이름' })
  AcquCardName?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '카드 구분(0:신용, 1:체크)' })
  CardCl?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '부분취소 가능 여부(0:불가능 1:가능)' })
  CcPartCl?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '카드 형태(01:개인 02:법인 03:해외)' })
  CardType?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({
    description:
      '간편결제구분(6:SKPAY, 8:SAMSUNGPAY(구버전), 15:PAYCO, 16:KAKAOPAY, 20:NAVERPAY, 21:SAMSUNGPAY, 22:APPLEPAY)',
  })
  ClickpayCl?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '쿠폰 금액' })
  CouponAmt?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '쿠폰 최소금액' })
  CouponMinAmt?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({
    description: '포인트 승인금액(예)1000원인 경우 -> 000000001000)',
  })
  PointAppAmt?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({
    description:
      '(페이코, 카카오 간편결제)복합결제 여부(0:복합결제 미사용, 1:복합결제 사용)',
  })
  MultiCl?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({
    description:
      '(페이코, 카카오 간편결제)복합결제 신용카드 금액(예)1000원인 경우 -> 1000)',
  })
  MultiCardAcquAmt?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({
    description:
      '(페이코, 카카오 간편결제)복합결제 포인트 금액(예)1000원인 경우 -> 1000)',
  })
  MultiPointAmt?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({
    description:
      '(페이코, 카카오 간편결제)복합결제 쿠폰 금액(예)1000원인 경우 -> 1000)',
  })
  MultiCouponAmt?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({
    description:
      '(네이버페이-포인트 결제, 계좌이체)현금영수증타입(0:발행안함, 1:소득공제, 2:지출증빙, 이외 발행안함)',
  })
  RcptType?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({
    description: '(네이버페이-포인트 결제, 계좌이체)현금영수증 TID',
  })
  RcptTID?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({
    description: '(네이버페이-포인트 결제, 계좌이체)현금영수증 승인번호',
  })
  RcptAuthCode?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '결제은행코드' })
  VbankBankCode?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '결제은행명' })
  VbankBankName?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '가상계좌번호' })
  VbankNum?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '가상계좌 입금만료일(yyyyMMdd)' })
  VbankExpDate?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '가상계좌 입금만료시간(HHmmss)' })
  VbankExpTime?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '결제은행코드' })
  BankCode?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '결제은행명' })
  BankName?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '취소 금액' })
  CancelAmt?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '취소일자 (YYYYMMDD)' })
  CancelDate?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '취소시간 (HHmmss)' })
  cancelTime?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '취소번호' })
  cancelNum?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '취소 후 잔액' })
  remainAmt?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '' })
  MsgSource?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '' })
  CartData?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '' })
  CancelCd?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: '' })
  CancelMsg?: string;
}
