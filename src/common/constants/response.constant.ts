export const response = {
  SUCCESS: {
    responseCode: 0,
    responseMsg: 'ok',
  },
  SUCCESS_DATAS: {
    responseCode: 1,
    responseMsg: '검색 결과 2개 이상',
  },
  FAIL: {
    responseCode: 999,
    responseMsg: '실패',
  },
  SAVE_FAIL: {
    responseCode: 11,
    responseMsg: '저장 실패',
  },
  ALREADY_DONE: {
    responseCode: 12,
    responseMsg: '이미 처리됨',
  },
  NOT_PAY: {
    responseCode: 13,
    responseMsg: '결제 완료되지 않음',
  },
  NOT_JOIN: {
    responseCode: 14,
    responseMsg: '가입 완료되지 않음',
  },
  NOT_FOUND: {
    responseCode: 20,
    responseMsg: '검색 결과 없음',
  },
  DUP_JOIN: {
    responseCode: 21,
    responseMsg: '가입 내역 있음',
  },
  HTTP_ERROR: {
    responseCode: 30,
    responseMsg: '통신 에러',
  },
  WRONG_VLD: {
    responseCode: 40,
    responseMsg: '필수값 오류',
  },
  WRONG_VLD_LEN: {
    responseCode: 41,
    responseMsg: '필수값 길이 오류',
  },
  NOT_JOIN_OBJ: {
    responseCode: 42,
    responseMsg: '가입불가 업종',
  },
  WRONG_ADDR: {
    responseCode: 43,
    responseMsg: '잘못된 주소',
  },
  WRONG_SIGUNGU: {
    responseCode: 44,
    responseMsg: '잘못된 시군구코드',
  },
  WRONG_OBJ: {
    responseCode: 45,
    responseMsg: '잘못된 업종/산출기초수',
  },
  WRONG_DT: {
    responseCode: 46,
    responseMsg: '날짜 정합성 오류',
  },
  WRONG_INS_DT: {
    responseCode: 47,
    responseMsg: '보험기간 오류',
  },
  NOT_JOIN_INS_DT_BEFORE: {
    responseCode: 47,
    responseMsg: '현재일자 기준으로 이전일자는 가입불가',
  },
  WRONG_ACC: {
    responseCode: 48,
    responseMsg: '위험고지 오류',
  },
  WRONG_CVRG_LIMIT: {
    responseCode: 49,
    responseMsg: '보상한도 오류',
  },
  WRONG_PRCTR: {
    responseCode: 50,
    responseMsg: '청약번호 정합성 오류',
  },
  WRONG_SNO: {
    responseCode: 51,
    responseMsg: '유효하지 않은 일련번호',
  },
  NOT_JOIN_DLI: {
    responseCode: 52,
    responseMsg: '재난배상 의무가입대상 아님',
  },
  WRONG_BIZ_NO: {
    responseCode: 53,
    responseMsg: '잘못된 사업자번호',
  },
  CLOSED_BIZ_NO: {
    responseCode: 53,
    responseMsg: '휴/폐업자',
  },
  ESTMT_EXPRY: {
    responseCode: 54,
    responseMsg: '견적 유효기간 지남',
  },
  NOT_JOIN_INS_DT_AFTER: {
    responseCode: 55,
    responseMsg: '보험시작일 이후 계약불가',
  },
};
