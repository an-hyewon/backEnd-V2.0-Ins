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
  name: 'tb_nicepay_payment_logs',
  comment: '나이스페이 결제 로그 테이블',
})
@Index(['Moid'])
@Index(['BuyerTel'])
@Index(['GoodsName'])
export class PayNicepayLogs {
  @PrimaryGeneratedColumn({
    name: 'seq_no',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'result_code',
    comment:
      '결제 결과 코드(3001 : 신용카드 성공, 4000 : 계좌이체 성공,4100 : 가상계좌 발급 성공, A000 : 휴대폰 소액결제 성공, 7001 : 현금영수증)',
    type: 'varchar',
    length: 10,
    nullable: false,
  })
  ResultCode: string;

  @Column({
    name: 'result_msg',
    comment: '결제 결과 메시지',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  ResultMsg: string;

  @Column({
    name: 'amt',
    comment: '결제 금액(예)1000원인 경우 -> 000000001000)',
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  Amt: string;

  @Column({
    name: 'mid',
    comment: '상점 ID',
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  MID: string;

  @Column({
    name: 'moid',
    comment: '상점주문번호',
    type: 'varchar',
    length: 64,
    nullable: false,
  })
  Moid: string;

  @Column({
    name: 'signature',
    comment: '위변조 검증 데이터(hex(sha256(TID + MID + Amt + MerchantKey)))',
    type: 'varchar',
    length: 500,
    nullable: false,
  })
  Signature: string;

  @Column({
    name: 'buyer_email',
    comment: '구매자 이메일',
    type: 'varchar',
    length: 60,
    nullable: true,
  })
  BuyerEmail: string;

  @Column({
    name: 'buyer_tel',
    comment: '구매자 휴대폰번호',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  BuyerTel: string;

  @Column({
    name: 'buyer_name',
    comment: '구매자 명',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  BuyerName: string;

  @Column({
    name: 'goods_name',
    comment: '상품명',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  GoodsName: string;

  @Column({
    name: 'tid',
    comment: '거래ID',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  TID: string;

  @Column({
    name: 'auth_code',
    comment: '승인 번호 (신용카드, 계좌이체, 휴대폰)',
    type: 'varchar',
    length: 30,
    nullable: false,
  })
  AuthCode: string;

  @Column({
    name: 'auth_date',
    comment: '승인 날짜(YYMMDDHHMMSS)',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  AuthDate: string;

  @Column({
    name: 'pay_method',
    comment:
      '결제수단(CARD:신용카드, BANK:계좌이체, VBANK : 가상계좌, CELLPHONE : 휴대폰결제)',
    type: 'varchar',
    length: 40,
    nullable: false,
  })
  PayMethod: string;

  @Column({
    name: 'mall_reserved',
    comment: '가맹점 여분 필드',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  MallReserved: string;

  @Column({
    name: 'card_code',
    comment: '결제 카드사 코드',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  CardCode: string;

  @Column({
    name: 'card_name',
    comment: '결제 카드사 이름',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  CardName: string;

  @Column({
    name: 'card_no',
    comment:
      '카드번호(카카오머니/네이버포인트/페이코포인트 전액결제 거래 null)',
    type: 'varchar',
    length: 40,
    nullable: true,
  })
  CardNo: string;

  @Column({
    name: 'card_quota',
    comment: '할부개월(00:일시불, 03:3개월...)',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  CardQuota: string;

  @Column({
    name: 'card_interest',
    comment: '상점분담 무이자 적용여부(0:미적용, 1:적용)',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  CardInterest: string;

  @Column({
    name: 'acqu_card_code',
    comment: '매입 카드사 코드',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  AcquCardCode: string;

  @Column({
    name: 'acqu_card_name',
    comment: '매입 카드사 이름',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  AcquCardName: string;

  @Column({
    name: 'card_cl',
    comment: '카드 구분(0:신용, 1:체크)',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  CardCl: string;

  @Column({
    name: 'cc_part_cl',
    comment: '부분취소 가능 여부(0:불가능 1:가능)',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  CcPartCl: string;

  @Column({
    name: 'card_type',
    comment: '카드 형태(01:개인 02:법인 03:해외)',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  CardType: string;

  @Column({
    name: 'clickpay_cl',
    comment:
      '간편결제구분(6:SKPAY, 8:SAMSUNGPAY(구버전), 15:PAYCO, 16:KAKAOPAY, 20:NAVERPAY, 21:SAMSUNGPAY, 22:APPLEPAY)',
    type: 'varchar',
    length: 40,
    nullable: true,
  })
  ClickpayCl: string;

  @Column({
    name: 'coupon_amt',
    comment: '쿠폰 금액',
    type: 'varchar',
    length: 45,
    nullable: true,
  })
  CouponAmt: string;

  @Column({
    name: 'coupon_min_amt',
    comment: '쿠폰 최소금액',
    type: 'varchar',
    length: 40,
    nullable: true,
  })
  CouponMinAmt: string;

  @Column({
    name: 'point_app_amt',
    comment: '포인트 승인금액(예)1000원인 경우 -> 000000001000)',
    type: 'varchar',
    length: 40,
    nullable: true,
  })
  PointAppAmt: string;

  @Column({
    name: 'multi_cl',
    comment:
      '(페이코, 카카오 간편결제)복합결제 여부(0:복합결제 미사용, 1:복합결제 사용)',
    type: 'varchar',
    length: 40,
    nullable: true,
  })
  MultiCl: string;

  @Column({
    name: 'multi_card_acqu_amt',
    comment:
      '(페이코, 카카오 간편결제)복합결제 신용카드 금액(예)1000원인 경우 -> 1000)',
    type: 'varchar',
    length: 40,
    nullable: true,
  })
  MultiCardAcquAmt: string;

  @Column({
    name: 'multi_point_amt',
    comment:
      '(페이코, 카카오 간편결제)복합결제 포인트 금액(예)1000원인 경우 -> 1000)',
    type: 'varchar',
    length: 40,
    nullable: true,
  })
  MultiPointAmt: string;

  @Column({
    name: 'multi_coupon_amt',
    comment:
      '(페이코, 카카오 간편결제)복합결제 쿠폰 금액(예)1000원인 경우 -> 1000)',
    type: 'varchar',
    length: 40,
    nullable: true,
  })
  MultiCouponAmt: string;

  @Column({
    name: 'rcpt_type',
    comment:
      '(네이버페이-포인트 결제, 계좌이체)현금영수증타입(0:발행안함, 1:소득공제, 2:지출증빙, 이외 발행안함)',
    type: 'varchar',
    length: 40,
    nullable: true,
  })
  RcptType: string;

  @Column({
    name: 'rcpt_tid',
    comment: '(네이버페이-포인트 결제, 계좌이체)현금영수증 TID',
    type: 'varchar',
    length: 40,
    nullable: true,
  })
  RcptTID: string;

  @Column({
    name: 'rcpt_auth_code',
    comment: '(네이버페이-포인트 결제, 계좌이체)현금영수증 승인번호',
    type: 'varchar',
    length: 40,
    nullable: true,
  })
  RcptAuthCode: string;

  @Column({
    name: 'vbank_bank_code',
    comment: '결제은행코드',
    type: 'varchar',
    length: 40,
    nullable: true,
  })
  VbankBankCode: string;

  @Column({
    name: 'vbank_bank_name',
    comment: '결제은행명',
    type: 'varchar',
    length: 40,
    nullable: true,
  })
  VbankBankName: string;

  @Column({
    name: 'vbank_num',
    comment: '가상계좌번호',
    type: 'varchar',
    length: 40,
    nullable: true,
  })
  VbankNum: string;

  @Column({
    name: 'vbank_exp_date',
    comment: '가상계좌 입금만료일(yyyyMMdd)',
    type: 'varchar',
    length: 40,
    nullable: true,
  })
  VbankExpDate: string;

  @Column({
    name: 'VbankExpTime',
    comment: '가상계좌 입금만료시간(HHmmss)',
    type: 'varchar',
    length: 40,
    nullable: true,
  })
  VbankExpTime: string;

  @Column({
    name: 'bank_code',
    comment: '결제은행코드',
    type: 'varchar',
    length: 40,
    nullable: true,
  })
  BankCode: string;

  @Column({
    name: 'bank_name',
    comment: '결제은행명',
    type: 'varchar',
    length: 40,
    nullable: true,
  })
  BankName: string;

  @Column({
    name: 'cancel_amt',
    comment: '취소 금액',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  CancelAmt: string;

  @Column({
    name: 'cancel_date',
    comment: '취소일자 (YYYYMMDD)',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  CancelDate: string;

  @Column({
    name: 'cancel_time',
    comment: '취소시간 (HHmmss)',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  CancelTime: string;

  @Column({
    name: 'cancel_num',
    comment: '취소번호',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  CancelNum: string;

  @Column({
    name: 'remain_amt',
    comment: '취소 후 잔액',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  RemainAmt: string;

  @Column({
    name: 'msg_source',
    comment: '',
    type: 'varchar',
    length: 10,
    nullable: false,
  })
  MsgSource: string;

  @Column({
    name: 'cart_data',
    comment: '',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  CartData: string;

  @Column({
    name: 'cancel_cd',
    comment: '',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  CancelCd: string;

  @Column({
    name: 'cancel_msg',
    comment: '',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  CancelMsg: string;

  @CreateDateColumn({
    name: 'created_dt',
    comment: '생성일시',
    type: 'datetime',
    nullable: false,
  })
  createdDt: Date;

  @UpdateDateColumn({
    name: 'updated_dt',
    comment: '수정일시',
    type: 'datetime',
    nullable: false,
  })
  updatedDt: Date;

  @DeleteDateColumn({
    name: 'deleted_dt',
    comment: '삭제일시',
    type: 'datetime',
    nullable: true,
  })
  deletedDt: Date;
}
