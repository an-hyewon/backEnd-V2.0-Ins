const dayjs = require('dayjs');
const CryptoJS = require('crypto-js');
const crypto = require('crypto');

/**
 * test 함수
 * @param {number} id - 아이디
 * @param {string} name - 이름
 * @return {string} 아이디+이름
 */
const test = (id, name) => {
  return `${id}${name}`;
};

/**
 * 보험가입완료건에 대한 내부 ID값 생성 함수
 * @return {string} random 값
 */
const getRandomId = () => {
  return `${dayjs().tz().format('YYYYMMDDHHmmss')}${Math.random().toString(36).substr(2, 6)}`;
};

/**
 * 보험계약시작일자 구하는 함수
 * @return {date} 가입신청일(day) 기준 다음달 1일값을 리턴
 * 예) 2022년 11월 13일 가입신청시 보험계약시작일자는 2022년 12월 1일
 */
const getInsSDate = (account, event_num) => {
  let monthVal = 0;
  let regex = /[^0-9]/g; // 숫자만 추출 정규식

  switch (account) {
    case '제로페이':
      monthVal = 1;
      break;

    case '카페24':
      // monthVal = Number(event_num.replace(regex, "")) + 1
      monthVal = 1;
      break;

    case '하나카드':
      monthVal = 1;
      break;

    case '나이스정보':
      monthVal = 1;
      break;

    case '울산시':
      monthVal = 1;
      break;

    case '화성시':
      monthVal = 1;
      break;

    case '케이에스넷':
      monthVal = 1;
      break;
  }
  const now = dayjs().tz();
  return dayjs().add(Number(monthVal), 'month').startOf('month');
};

/**
 * 보험계약종료일자 구하는 함수
 * @return {date} 보험계약시작일(day) 기준 1년되는 날에서 하루 차감된 값을 리턴
 * 예) 보험계약시작일자가 2022년 12월 1일이라면 보험계약 종료일자는 2023년 11월 30일 23시 59분까지
 */
const getInsEDate = (account, event_num) => {
  const insSDate = getInsSDate(account, event_num);
  switch (account) {
    case '제로페이':
      return dayjs
        .tz(insSDate)
        .add(11, 'month')
        .endOf('month')
        .subtract(1, 'day');

    case '카페24':
      return dayjs
        .tz(insSDate)
        .add(11, 'month')
        .endOf('month')
        .subtract(1, 'day');

    case '하나카드':
      return dayjs
        .tz(insSDate)
        .add(11, 'month')
        .endOf('month')
        .subtract(1, 'day');

    case '나이스정보':
      return dayjs
        .tz(insSDate)
        .add(11, 'month')
        .endOf('month')
        .subtract(1, 'day');

    case '울산시':
      return dayjs
        .tz(insSDate)
        .add(11, 'month')
        .endOf('month')
        .subtract(1, 'day');

    case '화성시':
      return dayjs
        .tz(insSDate)
        .add(11, 'month')
        .endOf('month')
        .subtract(1, 'day');

    case '케이에스넷':
      return dayjs
        .tz(insSDate)
        .add(11, 'month')
        .endOf('month')
        .subtract(1, 'day');
  }
  return dayjs.tz(insSDate).add(11, 'month').endOf('month');
};

/**
 * nullCheck 함수
 * return {boolean}
 */
const nullCheckObj = (obj) => {
  return Object.keys(obj).every((checkIem) => obj[checkIem]);
};

const nullCheckObjKey = (obj) => {
  let nullObj = [];
  Object.entries(obj).forEach(([key, value]) => {
    if (value == null) {
      nullObj.push(key);
    }
  });
  return nullObj;
};

const checkBizNumType = (bizNum) => {
  if (bizNum.length != 10) {
    return false;
  }

  let chkStep1 = 0;
  chkStep1 += parseInt(bizNum.substring(0, 1), 10);
  chkStep1 += (parseInt(bizNum.substring(1, 2), 10) * 3) % 10;
  chkStep1 += (parseInt(bizNum.substring(2, 3), 10) * 7) % 10;
  chkStep1 += (parseInt(bizNum.substring(3, 4), 10) * 1) % 10;
  chkStep1 += (parseInt(bizNum.substring(4, 5), 10) * 3) % 10;
  chkStep1 += (parseInt(bizNum.substring(5, 6), 10) * 7) % 10;
  chkStep1 += (parseInt(bizNum.substring(6, 7), 10) * 1) % 10;
  chkStep1 += (parseInt(bizNum.substring(7, 8), 10) * 3) % 10;
  chkStep1 += (parseInt(bizNum.substring(8, 9), 10) * 5) % 10;
  chkStep1 += Math.floor((parseInt(bizNum.substring(8, 9), 10) * 5) / 10);
  chkStep1 += parseInt(bizNum.substring(9, 10), 10);

  if (chkStep1 % 10 != 0) {
    return false;
  } else {
    return true;
  }
};

/**
 * 메리츠 침수지역데이터 기준 판별로직
 * @param floodInfo
 * floodgInfo :  해당 사업장의 필지번호 DB 조회 후 받은 값
 * fz_flood_fp_gd : 침수흔적위험등급
 * fz_rain_fl_gd :집중호우위험등급
 * fz_river_fd_gd : 하천홍수 위험등급
 * fz_coastal_fd_gd : 해안홍수 위험등급
 * fz_tsunami_gd : 지진해일 위험등급
 * @return {boolean}
 */
const isMeritzFloodedArea = (floodInfo) => {
  const {
    fz_flood_fp_gd,
    fz_rain_fl_gd,
    fz_river_fd_gd,
    fz_coastal_fd_gd,
    fz_tsunami_gd,
  } = floodInfo;

  let isFloodArea = false;

  if (fz_flood_fp_gd > 3) {
    isFloodArea = true;
  }
  if (fz_flood_fp_gd > 2 && fz_rain_fl_gd > 3) {
    isFloodArea = true;
  }
  if (fz_flood_fp_gd > 2 && fz_coastal_fd_gd > 3) {
    isFloodArea = true;
  }
  if (fz_flood_fp_gd > 2 && fz_tsunami_gd > 3) {
    isFloodArea = true;
  }
  return isFloodArea;
};

/**
 * 보험가입금액 구하는 함수
 * @param {string} sido
 * @param {string} tenant 소유여부
 * @param {string} account 제휴사
 * @return {Object}
 * ins_cost_building : 건물
 * ins_cost_item : 시설 및 집기
 * ins_cost_inventory : 재고자산
 * ins_cost_deductible : 자기부담금
 */
const getDsfSixJoinCost = (sido, tenant, account) => {
  const area1 = [
    '서울',
    '부산',
    '울산',
    '강원',
    '강원특별자치도',
    '충남',
    '전북',
    '제주특별자치도',
    '제주',
  ];

  const area2 = [
    '대구',
    '인천',
    '광주',
    '대전',
    '세종',
    '세종특별자치시',
    '경기',
    '충북',
    '전남',
    '경북',
    '경남',
  ];

  if (account == '카카오페이') {
    return {
      ins_cost_building: 0,
      ins_cost_item: 30000000,
      ins_cost_inventory: 20000000,
      ins_cost_deductible: 200000,
    };
  }

  if (area1.includes(sido)) {
    if (tenant == '임차자') {
      return {
        ins_cost_building: 0,
        ins_cost_item: 70000000,
        ins_cost_inventory: 30000000,
        ins_cost_deductible: 200000,
      };
    } else {
      // 소유자
      return {
        ins_cost_building: 70000000,
        ins_cost_item: 0,
        ins_cost_inventory: 30000000,
        ins_cost_deductible: 200000,
      };
    }
  } else if (area2.includes(sido)) {
    if (tenant == '임차자') {
      return {
        ins_cost_building: 0,
        ins_cost_item: 40000000,
        ins_cost_inventory: 10000000,
        ins_cost_deductible: 200000,
      };
    } else {
      // 소유자
      return {
        ins_cost_building: 40000000,
        ins_cost_item: 0,
        ins_cost_inventory: 10000000,
        ins_cost_deductible: 200000,
      };
    }
  }
};

/**
 * 업종이 보온 업종리스트에 있는지 체크하는 함수
 * @param {string} bizcategory
 * @return {boolean}
 */
const isDsfSixBizCategory = (bizcategory) => {
  const soSangInBizType = [
    '숙박 및 음식점업',
    '도매 및 소매업',
    '교육서비스업',
    '정보통신업',
    '금융 및 보험업',
    '부동산업',
    '예술, 스포츠 및 여가 관련 서비스업',
    '건설업',
    '운수 및 창고업',
    '보건업 및 사회복지 서비스업',
    '수리(修理) 및 기타 개인 서비스업',
    '사업시설관리, 사업지원 및 임대서비스업',
    '전기, 가스, 증기 및 공기조절 공급업',
    '수도업',
    '광업',
    '농업, 임업 및 어업',
    '수도, 하수 및 폐기물 처리, 원료재생업(수도업은 제외)',
    '전문, 과학 및 기술서비스업',
  ];

  const soGongInBizType = [
    '식료품 제조업',
    '음료 제조업',
    '담배제조업',
    '섬유제품 제조업(의복 제조업 제외)',
    '의복, 의복 액세서리 및 모피제품 제조업',
    '가죽, 가방 및 신발 제조업',
    '목재 및 나무제품 제조업(가구 제조업은 제외)',
    '펄프, 종이 및 종이제품 제조업',
    '인쇄 및 기록매체 복제업',
    '코크스, 연탄 및 석유정제품 제조업',
    '화학물질 및 화학제품 제조업(의약품 제조업 제외)',
    '의료용 물질 및 의약품 제조업',
    '고무제품 및 플라스틱제품 제조업',
    '비금속 광물제품 제조업',
    '1차 금속 제조업',
    '금속가공제품 제조업(기계 및 가구제조업 제외)',
    '전자부품, 컴퓨터, 영상, 음향 및 통신장비 제조업',
    '의료, 정밀 광학기기 및 시계 제조업',
    '전기장비 제조업',
    '그 밖의 기계 및 장비 제조업',
    '자동차 및 트레일러 제조업',
    '그 밖의 운송장비 제조업',
    '가구 제조업',
    '그 밖의 제품 제조업',
    '산업용 기계 및 장비수리업',
  ];

  if (soSangInBizType.includes(bizcategory)) {
    return true;
  } else if (soGongInBizType.includes(bizcategory)) {
    return true;
  } else {
    return false;
  }
};

/**
 * 건물구조명 등급
 * @param {string} CheckValue
 * @return {string}
 */

const structureLevel = (CheckValue) => {
  let CheckValue_text = 0;

  if (CheckValue.includes('콘크') === true) {
    CheckValue_text = 1;
  } else if (CheckValue.includes('라멘') === true) {
    CheckValue_text = 1;
  } else if (CheckValue.includes('블록') === true) {
    CheckValue_text = 1;
  } else if (CheckValue.includes('석구조') === true) {
    CheckValue_text = 2;
  } else if (CheckValue.includes('벽돌') === true) {
    CheckValue_text = 1;
  } else if (CheckValue.includes('석회') === true) {
    CheckValue_text = 1;
  } else if (CheckValue.includes('시멘트') === true) {
    CheckValue_text = 1;
  } else if (CheckValue.includes('목구조') === true) {
    CheckValue_text = 4;
  } else if (CheckValue.includes('목조') === true) {
    CheckValue_text = 4;
  } else if (CheckValue.includes('통나무') === true) {
    CheckValue_text = 4;
  } else if (CheckValue.includes('기둥') === true) {
    CheckValue_text = 4;
  } else if (CheckValue.includes('파이프') === true) {
    CheckValue_text = 3;
  } else if (CheckValue.includes('경량철골') === true) {
    CheckValue_text = 3;
  } else if (CheckValue.includes('박판') === true) {
    CheckValue_text = 3;
  } else if (CheckValue.includes('단일') === true) {
    CheckValue_text = 3;
  } else if (CheckValue.includes('스틸') === true) {
    CheckValue_text = 3;
  } else if (CheckValue.includes('일반철골') === true) {
    CheckValue_text = 3;
  } else if (CheckValue.includes('트러스') === true) {
    CheckValue_text = 3;
  } else if (CheckValue.includes('컨테이너') === true) {
    CheckValue_text = 3;
  } else if (CheckValue.includes('기타') === true) {
    CheckValue_text = 4;
  } else if (CheckValue.includes('조적') === true) {
    CheckValue_text = 1;
  }

  return CheckValue_text;
};

/**
 * 적용할 주용도코드 목록 구하는 함수
 * @param {string} type
 * 0 : 단독주택/공동주택 대상 | 1: 단독주택만 대상 | 2: 공동주택만 대상
 * @return {Array}
 */
const getDsfThreePurpsCdArr = (type) => {
  const bld_type_single = ['01000', '01001', '01002', '01003'];
  const bld_type_multi = ['02000', '02001', '02002', '02003'];
  const bld_type_all = ['01000', '01002', '02000', '02001', '02002', '02003'];
  let arr = [];

  switch (type) {
    case '1':
      arr = bld_type_single;
      break;
    case '2':
      arr = bld_type_multi;
      break;
    default:
      arr = bld_type_all;
      break;
  }

  return arr;
};

/**
 * 건물급수 구하는 함수
 * @param {number} main - 주구조 급수
 * @param {number} roof - 지붕구조 급수
 * @return {number}
 */
const getBldStrctGrade = (main, roof) => {
  let strctGrade;

  if (main * roof >= 4) {
    strctGrade = 4;
  } else {
    strctGrade = main * roof;
  }
  return strctGrade;
};

/**
 * 사용승인 년도, 월 구하는 함수
 * @param {string} useAaprDate - 사용승인일
 * @return {Object}
 */
const getUseAprDate = (useAaprDate) => {
  let useAprYear = useAaprDate.slice(0, 4);
  let useAprMonth = useAaprDate.slice(4, 6);
  let useAprDay = useAaprDate.slice(6, 8);

  return {
    useAprYear: useAprYear,
    useAprMonth: useAprMonth,
  };
};

/**
 * (풍수해위험율 * 계속계약할인율 * 자기부담금할인율) 계산 후 소수점 7째자리에서 반올림하는 함수
 * @param {float} dsf_risk - 풍수해위험율
 * @param {float} ins_renew_discount - 계속계약할인율
 * @param {float} deductible_discount - 자기부담금할인율
 * @return {float}
 */
const getDsfThreeCalcRat = (
  dsf_risk,
  ins_renew_discount,
  deductible_discount,
) => {
  let int_dsf_risk = parseInt(dsf_risk * 10000 * 100);
  let int_ins_renew_discount = parseInt(ins_renew_discount * 100);
  let int_deductible_discount = parseInt(deductible_discount * 100);

  let int_calc =
    int_dsf_risk * int_ins_renew_discount * int_deductible_discount;
  let float_calc = parseFloat(int_calc / (10000 * 1000000000000));
  let calc_rat = Math.round(float_calc * 1000000) / 1000000;
  // console.log('test',int_dsf_risk, int_ins_renew_discount, int_deductible_discount)
  // console.log('calc', int_calc, float_calc, calc_value)

  return calc_rat;
};

/**
 * 보험가입금액(건물평가가액) 계산하는 함수
 * @param bldCostInfo
 * area(number) : 연면적
 * useAprDay(string) : 사용승인일
 * newBldCost(number) :신축단가(원)
 * correctionCnt(float) : 보정계수
 * depreciationCnt(float) : 경년감가율(%)
 * @return {number}
 */
const getDsfThreeBldCost = (bldCostInfo) => {
  /*
   * 사용년수(useCnt) = (올해 - 사용승인 년도) + {(이번 달 - 사용승인 월) / 12}
   * 감가율(%)(depRat) = 사용년수 * 경년감가율 (70 초과시 무조건 70)
   * 재조달가액(reprodCost) = 연면적 * 신축단가 * 보정계수
   * 감가상각액(depCost) = 재조달가액 * 감가율
   * 최종적으로 보험가입금액(bldCost) = (재조달가액 - 감가상가액) * 80% - 천원 단위 절사
   */
  const { area, useAprDay, newBldCost, correctionCnt, depreciationCnt } =
    bldCostInfo;
  const useAprYear = parseInt(getUseAprDate(useAprDay).useAprYear);
  const useAprMonth = parseInt(getUseAprDate(useAprDay).useAprMonth);
  const thisYear = parseInt(dayjs().format('YYYY'));
  const thisMonth = parseInt(dayjs().format('MM'));

  let useCnt = thisYear - useAprYear + (thisMonth - useAprMonth) / 12;
  let depRat =
    (thisYear - useAprYear + (thisMonth - useAprMonth) / 12) * depreciationCnt;
  let reprodCost = area * newBldCost * correctionCnt;
  let depCost;

  if (depRat > 70) {
    depCost = Math.trunc((reprodCost * 70) / 100);
  } else {
    depCost = Math.trunc(
      (reprodCost *
        ((thisYear - useAprYear + (thisMonth - useAprMonth) / 12) *
          depreciationCnt)) /
        100,
    );
  }
  let bldCost = Math.round(((reprodCost - depCost) * 80) / 100 / 10000) * 10000;

  // console.log('사용년수',useCnt,'감가율',depRat,'재조달가액',reprodCost,'감가상각액',depCost,'보험가입금액',bldCost)
  return bldCost;
};

/**
 * 총 보험료, 국고지원 보험료, 지방비지원 보험료, 계약자부담 보험료 계산하는 함수
 * @param bldCostInfo
 * bld_cost(number) : 보험가입금액
 * calc_rat(float) : (풍수해위험율 * 계속계약할인율 * 자기부담금할인율) 소수점 6째자리에서 반올림
 * gov_support_rat(float) : 정부부담 보험료 비율
 * local_gov_support_rat(float) : 지자체부담 보험료 비율
 * insured_support_rat(float) : 계약자부담 보험료 비율
 * @param highCostDiscountInfoArr
 * seq_no(number) : 보험가입금액 구간 번호
 * start_cost(number) : 구간별 시작금액(원)
 * end_cost(number) : 구간별 끝금액(원)
 * cost_amount(number) : 구간별 적용금액
 * application_rat(number) : 고액계약할인율
 * @param {string} payYn - 유료/무료 여부
 * @return {Object}
 * bld_cost : 보험가입금액
 * tot_ins_cost : 총 보험료
 * tot_gov_ins_cost : 국고지원 보험료
 * tot_local_gov_ins_cost : 지방비지원 보험료
 * tot_insured_ins_cost : 계약자부담 보험료
 */
const getDsfThreeInsCost = (bldCostInfo, highCostDiscountInfoArr, payYn) => {
  /*
   * 총보험료 = 보험가입금액 * (풍수해위험율 * 계속계약할인율 * 자기부담금할인율) * 고액계약할인율
   * 구간별 총 보험료, 지방비지원 보험료, 계약자부담 보험료 각자 합산 후 십원 단위 절사
   * 국고지원 보험료 = 총 보험료 - (지방비지원 보험료 + 계약자부담 보험료) 계산
   */
  const {
    bld_cost,
    calc_cnt,
    gov_support_rat,
    local_gov_support_rat,
    insured_support_rat,
  } = bldCostInfo;
  let arr = highCostDiscountInfoArr;
  let cnt = highCostDiscountInfoArr.length;

  console.log(
    bld_cost,
    calc_cnt,
    gov_support_rat,
    local_gov_support_rat,
    insured_support_rat,
  );

  let tot_ins_cost = 0;
  let tot_gov_ins_cost = 0;
  let tot_local_gov_ins_cost = 0;
  let tot_account_ins_cost = 0;
  let tot_insured_ins_cost = 0;

  if (payYn == 'N') {
    // 제휴사지원 보험료 계산
    for (let i = 0; i < cnt; i++) {
      let calc_cost; // 구간별 계산되는 보험가입금액

      if (i != cnt - 1) {
        calc_cost = highCostDiscountInfoArr[i].cost_amount;
      } else {
        calc_cost = bld_cost - highCostDiscountInfoArr[i].start_cost;
      }

      let ins_cost =
        (calc_cost * calc_cnt * highCostDiscountInfoArr[i].application_rat) /
        100;
      let local_gov_ins_cost =
        (((calc_cost * calc_cnt * highCostDiscountInfoArr[i].application_rat) /
          100) *
          local_gov_support_rat) /
        100;
      let account_ins_cost =
        (((calc_cost * calc_cnt * highCostDiscountInfoArr[i].application_rat) /
          100) *
          insured_support_rat) /
        100;
      arr[i].calc_cost = calc_cost;
      arr[i].ins_cost = ins_cost;
      tot_ins_cost += ins_cost;
      tot_local_gov_ins_cost += local_gov_ins_cost;
      tot_account_ins_cost += account_ins_cost;
    }
    // console.log('arr',arr)

    tot_ins_cost = Math.trunc(tot_ins_cost / 100) * 100;
    tot_local_gov_ins_cost = Math.trunc(tot_local_gov_ins_cost / 100) * 100;
    tot_account_ins_cost = Math.trunc(tot_account_ins_cost / 100) * 100;
    tot_gov_ins_cost =
      tot_ins_cost - tot_local_gov_ins_cost - tot_account_ins_cost;
  } else {
    // 계약자부담 보험료 계산
    for (let i = 0; i < cnt; i++) {
      let calc_cost; // 구간별 계산되는 보험가입금액

      if (i != cnt - 1) {
        calc_cost = highCostDiscountInfoArr[i].cost_amount;
      } else {
        calc_cost = bld_cost - highCostDiscountInfoArr[i].start_cost;
      }

      let ins_cost =
        (calc_cost * calc_cnt * highCostDiscountInfoArr[i].application_rat) /
        100;
      let local_gov_ins_cost =
        (((calc_cost * calc_cnt * highCostDiscountInfoArr[i].application_rat) /
          100) *
          local_gov_support_rat) /
        100;
      let insured_ins_cost =
        (((calc_cost * calc_cnt * highCostDiscountInfoArr[i].application_rat) /
          100) *
          insured_support_rat) /
        100;
      arr[i].calc_cost = calc_cost;
      arr[i].ins_cost = ins_cost;
      tot_ins_cost += ins_cost;
      tot_local_gov_ins_cost += local_gov_ins_cost;
      tot_insured_ins_cost += insured_ins_cost;
    }
    // console.log('arr',arr)

    tot_ins_cost = Math.trunc(tot_ins_cost / 100) * 100;
    tot_local_gov_ins_cost = Math.trunc(tot_local_gov_ins_cost / 100) * 100;
    tot_insured_ins_cost = Math.trunc(tot_insured_ins_cost / 100) * 100;
    tot_gov_ins_cost =
      tot_ins_cost - tot_local_gov_ins_cost - tot_insured_ins_cost;
  }

  return {
    bld_cost: bld_cost,
    tot_ins_cost: tot_ins_cost,
    tot_gov_ins_cost: tot_gov_ins_cost,
    tot_local_gov_ins_cost: tot_local_gov_ins_cost,
    tot_account_ins_cost: tot_account_ins_cost,
    tot_insured_ins_cost: tot_insured_ins_cost,
  };
};

const getDsfThreeInsCostTest = (highCostDiscountInfoArr) => {
  /*
   * 총보험료 = 보험가입금액 * (풍수해위험율 * 계속계약할인율 * 자기부담금할인율) * 고액계약할인율
   * 구간별 총 보험료, 지방비지원 보험료, 계약자부담 보험료 각자 합산 후 십원 단위 절사
   * 국고지원 보험료 = 총 보험료 - (지방비지원 보험료 + 계약자부담 보험료) 계산
   */
  const bld_cost = 38518800000;
  const calc_rat = 0.000372;
  const gov_support_rat = 56.5;
  const local_gov_support_rat = 19.5;
  const insured_support_rat = 24;
  let arr = highCostDiscountInfoArr;
  let cnt = highCostDiscountInfoArr.length;

  console.log(
    bld_cost,
    calc_rat,
    gov_support_rat,
    local_gov_support_rat,
    insured_support_rat,
  );

  let tot_ins_cost = 0;
  let tot_gov_ins_cost = 0;
  let tot_local_gov_ins_cost = 0;
  let tot_insured_ins_cost = 0;

  for (let i = 0; i < cnt; i++) {
    let calc_cost; // 구간별 계산되는 보험가입금액

    if (i != cnt - 1) {
      calc_cost = highCostDiscountInfoArr[i].cost_amount;
    } else {
      calc_cost = bld_cost - highCostDiscountInfoArr[i].start_cost;
    }

    let ins_cost =
      (calc_cost * calc_rat * highCostDiscountInfoArr[i].application_rat) / 100;
    let local_gov_ins_cost =
      (((calc_cost * calc_rat * highCostDiscountInfoArr[i].application_rat) /
        100) *
        local_gov_support_rat) /
      100;
    let insured_ins_cost =
      (((calc_cost * calc_rat * highCostDiscountInfoArr[i].application_rat) /
        100) *
        insured_support_rat) /
      100;
    arr[i].calc_cost = calc_cost;
    arr[i].ins_cost = ins_cost;
    tot_ins_cost += ins_cost;
    tot_local_gov_ins_cost += local_gov_ins_cost;
    tot_insured_ins_cost += insured_ins_cost;
  }
  // console.log('arr',arr)

  tot_ins_cost = Math.trunc(tot_ins_cost / 100) * 100;
  tot_local_gov_ins_cost = Math.trunc(tot_local_gov_ins_cost / 100) * 100;
  tot_insured_ins_cost = Math.trunc(tot_insured_ins_cost / 100) * 100;
  tot_gov_ins_cost =
    tot_ins_cost - tot_local_gov_ins_cost - tot_insured_ins_cost;

  // const { start_cost, end_cost, cost_amount, application_rat } = highCostDiscountInfo

  return {
    // data: arr,
    bld_cost: bld_cost,
    tot_ins_cost: tot_ins_cost,
    tot_gov_ins_cost: tot_gov_ins_cost,
    tot_local_gov_ins_cost: tot_local_gov_ins_cost,
    tot_insured_ins_cost: tot_insured_ins_cost,
  };
};

/**
 * 주택 아닌 기타용도 목록
 */
const getDsfThreeEtcPurpsNmArr = [
  '화장실',
  '변소',
  '보일러실',
  '주차장',
  '차고',
  '창고',
  '창고시설(창고)',
  '창고시설',
  '단독주택(계단실)',
  '단독주택(주차장)',
  '단독주택(단독주택(주차장))',
  '계단실 및 기계실',
  '펌프실및 물탱크실',
];

/**
 * 매출액 적용계수 계산하는 함수
 * @param {number} sales_cost - 매출액
 * @param {number} now_sales_cost - 현구간 매출액
 * @param {number} prev_sales_cost - 전구간 매출액
 * @param {float} now_sales_cnt - 현구간 적용계수
 * @param {float} prev_sales_cnt - 전구간 적용계수
 * @return {float}
 */
const getPrivacySalesCost = (
  sales_cost,
  now_sales_cost,
  prev_sales_cost,
  now_sales_cnt,
  prev_sales_cnt,
) => {
  /*
   * 매출액 1원당 직선보간 인상계수 : (현구간 적용계수 - 전구간 적용계수) / (현구간 매출액 - 전구간 매출액)
   * 매출액 적용계수 : (매출액 - 전구간 매출액) * 현구간 인상계수 + 전구간 적용계수
   */
  // console.log('log',sales_cost, now_sales_cnt, prev_sales_cnt, now_sales_cost, prev_sales_cost);
  let sales_cnt = 0;
  // 매출액 1원당 직선보간 인상계수
  let int_now_sales_cnt = parseInt(now_sales_cnt * 100);
  let int_prev_sales_cnt = parseInt(prev_sales_cnt * 100);
  let minus_sales_cnt = int_now_sales_cnt - int_prev_sales_cnt;
  let minus_sales_cost = now_sales_cost - prev_sales_cost;
  let tmp_cnt = minus_sales_cnt / minus_sales_cost;
  // console.log('tmp_cnt', minus_sales_cnt, minus_sales_cost, sales_cost - prev_sales_cost);
  let tmp_sales_cnt = ((sales_cost - prev_sales_cost) * tmp_cnt) / 100;

  sales_cnt = parseFloat(tmp_sales_cnt) + parseFloat(prev_sales_cnt);
  // let tmp = parseFloat(tmp_sales_cnt) + parseFloat(prev_sales_cnt);
  // console.log('tmp', tmp);

  console.log('tmp', tmp_sales_cnt, prev_sales_cnt, sales_cnt);

  return sales_cnt;
};

/**
 * 기본보험료 계산하는 함수
 * @param {number} user_cnt - 이용자수
 * @param {float} now_user_cnt - 현재구간 이용자수
 * @param {float} prev_user_cnt - 전구간 이용자수
 * @param {number} now_default_cost - 현재구간 보험료
 * @param {number} prev_default_cost - 전구간 보험료
 * @return {number}
 */
const getPrivacyDefaultCost = (
  user_cnt,
  now_user_cnt,
  prev_user_cnt,
  now_default_cost,
  prev_default_cost,
) => {
  /*
   * 이용자수 1인당 추가보험료 : (현재구간 보험료 - 전구간 보험료) / (현재구간 이용자수 - 전구간 이용자수)
   * 적용 기본보험료 : (이용자수 - 전구간 이용자수) * 이용자수 1인당 추가보험료 + 전구간 보험료
   */
  // 이용자수, 현재구간 이용자수, 전구간 이용자수, 현재구간 보험료, 전구간 보험료
  // console.log('log',user_cnt, now_user_cnt, prev_user_cnt, now_default_cost, prev_default_cost);

  let minus_default_cost = now_default_cost - prev_default_cost;
  let minus_user_cnt = now_user_cnt - prev_user_cnt;
  // 이용자수 1인당 추가보험료
  let default_cost_per_one = minus_default_cost / minus_user_cnt;

  // 적용 기본보험료
  let apply_cost =
    (user_cnt - prev_user_cnt) * default_cost_per_one + prev_default_cost;
  // 적용 기본보험료 소수점 이하 절사처리 - 확인할것
  apply_cost = Math.floor(apply_cost);

  // console.log('log2', minus_default_cost,minus_user_cnt,default_cost_per_one, apply_cost);

  return apply_cost;
};

/**
 * 1사고당 보상한도액 계산하는 함수
 * @param {number} guaranteed_cost - 1사고당 보상한도액
 * @param {number} now_guaranteed_cost - 현재구간 보상한도액
 * @param {number} prev_guaranteed_cost - 전구간 보상한도액
 * @param {float} now_guaranteed_cnt - 현재구간 적용계수
 * @param {float} prev_guaranteed_cnt - 전구간 적용계수
 * @return {number}
 */
const getPrivacyGuaranteedCost = (
  guaranteed_cost,
  now_guaranteed_cost,
  prev_guaranteed_cost,
  now_guaranteed_cnt,
  prev_guaranteed_cnt,
) => {
  /*
   * 보상한도액 1원당 직선보간 인상계수 : (현재구간 적용계수 - 전구간 적용계수) / (현재구간 보상한도액 - 전구간 보상한도액)
   * 1사고당 보상한도액 : (1사고당 보상한도액 - 전구간 보상한도액) * 현구간 인상계수
   */
  // 1사고당 보상한도액, 현재구간 보상한도액, 전구간 보상한도액, 현재구간 적용계수, 전구간 적용계수
  // console.log('log',guaranteed_cost, now_guaranteed_cost, prev_guaranteed_cost, now_guaranteed_cnt, prev_guaranteed_cnt);
  // let minus_default_cost = now_default_cost - prev_default_cost;
  // let minus_user_cnt = now_user_cnt - prev_user_cnt;
  // // 이용자수 1인당 추가보험료
  // let default_cost_per_one = minus_default_cost / minus_user_cnt;
  // // 적용 기본보험료
  // let apply_cost = (user_cnt - prev_user_cnt) * default_cost_per_one + prev_default_cost;
  // // 적용 기본보험료 소수점 이하 절사처리 - 확인할것
  // apply_cost = Math.floor(apply_cost);
  // // console.log('log2', minus_default_cost,minus_user_cnt,default_cost_per_one, apply_cost);
  // return apply_cost
};

/**
 * 보험료 계산하는 함수
 * @param {Object} ins_cost_info
 * user_cnt(number) : 이용자수
 * sales_cost(number) : 매출액
 * guaranteed_cost(number) : 보상한도액
 * deductible_ins_cost(number) : 자기부담금
 *
 * guaranteed_cnt(float)(3) : 보상한도액 인상계수
 * deductible_cnt(float)(3) : 자기부담금 할인계수
 * tot_guaranteed_cnt(float)(2) : 총 보상한도액 할인계수
 *
 * now_sales_seq : 현구간 seq번호
 * now_sales_cost(number) : 현구간 매출액
 * now_sales_cost_apply_cnt(float)(2) : 현구간 매출액 적용계수
 *
 * pre_sales_seq : 전구간 seq번호
 * pre_sales_cost(number) : 전구간 매출액
 * pre_sales_cost_apply_cnt(float)(2) : 전구간 매출액 적용계수
 *
 * business_type_no(number) : 업종별 위험군
 * business_type_cnt(float)(1) : 업종별 적용계수
 *
 * now_user_cnt(number) : 현구간 이용자수
 * now_default_cost(number) : 현구간 기본보험료
 *
 * pre_user_cnt(number) : 전구간 이용자수
 * pre_default_cost(number) : 전구간 기본보험료
 *
 * srp_sum_cnt(float)(2) : srp 적용계수
 * @return {Object}
 */
const getPrivacyInsCost = (ins_cost_info) => {
  const {
    user_cnt,
    sales_cost,
    guaranteed_cost,
    deductible_ins_cost,
    guaranteed_cnt,
    deductible_cnt,
    tot_guaranteed_cnt,
    now_sales_seq,
    now_sales_cost,
    now_sales_cost_apply_cnt,
    pre_sales_seq,
    pre_sales_cost,
    pre_sales_cost_apply_cnt,
    business_type_no,
    business_type_cnt,
    now_user_cnt,
    now_default_cost,
    pre_user_cnt,
    pre_default_cost,
    srp_sum_cnt,
  } = ins_cost_info;
  console.log('data', ins_cost_info);

  // let result = ins_cost_info;
  let result = {};
  /*
     * 기본보험료
     * 이용자수 1인당 추가보험료 : (현재구간 보험료 - 전구간 보험료) / (현재구간 이용자수 - 전구간 이용자수)
     * 적용 기본보험료 : (이용자수 - 전구간 이용자수) * 이용자수 1인당 추가보험료 + 전구간 보험료
          - 이용자수 3,000,000 초과시 "협의요율대상" - 함수 호출전에 체크
                    1,000,000 초과 3,000,000 이하 : (이용자수 - 5구간 이용자수) * 6구간 이용자수 1인당 추가보험료 + 5구간 보험료
                      500,000 초과 1,000,000 이하 : (이용자수 - 4구간 이용자수) * 5구간 이용자수 1인당 추가보험료 + 4구간 보험료
                      100,000 초과   500,000 이하 : (이용자수 - 3구간 이용자수) * 4구간 이용자수 1인당 추가보험료 + 3구간 보험료
                       10,000 초과   100,000 이하 : (이용자수 - 2구간 이용자수) * 3구간 이용자수 1인당 추가보험료 + 2구간 보험료
                        1,000 초과    10,000 이하 : (이용자수 - 1구간 이용자수) * 2구간 이용자수 1인당 추가보험료 + 1구간 보험료
                            0 초과     1,000 이하 : 1구간 보험료
     */
  let minus_default_cost = now_default_cost - pre_default_cost;
  let minus_user_cnt = now_user_cnt - pre_user_cnt;
  let apply_ins_cost;

  if (minus_user_cnt === 0) {
    apply_ins_cost = now_default_cost;
  } else {
    // 이용자수 1인당 추가보험료
    let default_cost_per_one = minus_default_cost / minus_user_cnt;
    apply_ins_cost =
      (user_cnt - pre_user_cnt) * default_cost_per_one + pre_default_cost;
  }
  console.log('apply_ins_cost', apply_ins_cost);

  /*
     * 매출액 적용계수
     * 매출액 1원당 직선보간 인상계수 : (현구간 적용계수 - 전구간 적용계수) / (현구간 매출액 - 전구간 매출액)
     * 매출액 적용계수 : (매출액 - 전구간 매출액) * 현구간 인상계수 + 전구간 적용계수
          - 매출액               0 초과   1,000,000,000 이하 : 1구간 적용계수
                     1,000,000,000 초과   5,000,000,000 이하 : (매출액 - 1구간 매출액) * 2구간 인상계수 + 1구간 적용계수
                     5,000,000,000 초과  10,000,000,000 이하 : (매출액 - 2구간 매출액) * 3구간 인상계수 + 2구간 적용계수
                    10,000,000,000 초과  20,000,000,000 이하 : (매출액 - 3구간 매출액) * 4구간 인상계수 + 3구간 적용계수
                    20,000,000,000 초과  40,000,000,000 이하 : (매출액 - 4구간 매출액) * 5구간 인상계수 + 4구간 적용계수
                    40,000,000,000 초과  60,000,000,000 이하 : (매출액 - 5구간 매출액) * 6구간 인상계수 + 5구간 적용계수
                    60,000,000,000 초과  80,000,000,000 이하 : (매출액 - 6구간 매출액) * 7구간 인상계수 + 6구간 적용계수
                    80,000,000,000 초과 100,000,000,000 이하 : (매출액 - 7구간 매출액) * 8구간 인상계수 + 7구간 적용계수
                   100,000,000,000 초과 : "협의요율대상" - 함수 호출 전에 체크
     */
  let sales_cnt;
  let ins_cost_calc;
  if (now_sales_seq === pre_sales_seq) {
    sales_cnt = now_sales_cost_apply_cnt;
    console.log('tmp', sales_cnt);

    ins_cost_calc =
      apply_ins_cost *
      (guaranteed_cnt * (1 - tot_guaranteed_cnt) - deductible_cnt) *
      sales_cnt *
      business_type_cnt;
    console.log('1', ins_cost_calc);
  } else {
    // 매출액 1원당 직선보간 인상계수
    // let int_now_sales_cnt = parseInt(now_sales_cost_apply_cnt * 100);
    // let int_pre_sales_cnt = parseInt(pre_sales_cost_apply_cnt * 100);
    // let minus_sales_cnt = int_now_sales_cnt - int_pre_sales_cnt;
    let minus_sales_cnt = parseFloat(
      now_sales_cost_apply_cnt - pre_sales_cost_apply_cnt,
    ).toFixed(2);
    let minus_sales_cost = now_sales_cost - pre_sales_cost;
    let tmp_cnt = minus_sales_cnt / minus_sales_cost;
    // console.log('tmp_cnt', minus_sales_cnt, minus_sales_cost, sales_cost - pre_sales_cost);
    // let tmp_sales_cnt = (sales_cost - pre_sales_cost) * tmp_cnt / 100;
    let tmp_sales_cnt = (sales_cost - pre_sales_cost) * tmp_cnt;

    sales_cnt =
      parseFloat(tmp_sales_cnt) + parseFloat(pre_sales_cost_apply_cnt);
    console.log('tmp', tmp_sales_cnt, pre_sales_cost_apply_cnt, sales_cnt);

    // ins_cost_calc = Math.round(apply_ins_cost * (guaranteed_cnt * (1 - tot_guaranteed_cnt) - deductible_cnt) * sales_cnt * business_type_cnt);
    ins_cost_calc =
      apply_ins_cost *
      (guaranteed_cnt * (1 - tot_guaranteed_cnt) - deductible_cnt) *
      sales_cnt *
      business_type_cnt;
    console.log('2', ins_cost_calc);
    // console.log('2 test',apply_ins_cost, guaranteed_cnt,tot_guaranteed_cnt,deductible_cnt,sales_cnt,business_type_cnt)

    // let test1 = apply_ins_cost * (guaranteed_cnt * (1 - tot_guaranteed_cnt) - deductible_cnt) * sales_cnt * business_type_cnt;
    // console.log('test',test1,test2,test3,test4)
  }

  /*
   * 적용보험료(SRP 미적용, 10원단위 절사 전)
   * - 기본보험료 "협의요율대상" 이면 "협의요율대상"
   *                           아니면 { 30000 | 기본보험료 * (1사고당 보상한도액 인상계수 * (1 - 총 보상한도액 할인계수) - 자기부담금 할인계수) * 매출액 적용계수 * 업종별 적용계수) } 둘 중 큰 수
   */
  let ins_cost_1 = Math.max(30000, ins_cost_calc);

  /*
   * 적용보험료(SRP 미적용, 10원단위 절사 후) (=SRP 적용 전 보험료)
   * - 기본보험료 "협의요율대상" 이면 "협의요율대상"
   *                           아니면 적용보험료(SRP 미적용, 10원단위 절사 전) 10원 단위 절사
   */
  let ins_cost_2 =
    Math.max(30000, ins_cost_calc) === 0
      ? 0
      : Math.floor(Math.max(30000, ins_cost_calc) / 100) * 100;

  /*
   * SRP 최대 적용 보험료
   * - 기본보험료 "협의요율대상" 이면 "협의요율대상"
   *                           아니면 적용보험료(SRP 미적용, 10원단위 절사 전) * 0.6 후 10원 단위 절사
   */
  let ins_cost_3 =
    ins_cost_1 === 0 ? 0 : Math.floor((ins_cost_1 * 0.6) / 100) * 100;

  console.log('ins_cost', ins_cost_1, ins_cost_2, ins_cost_3);
  /*
   * SRP 적용 보험료
   * 적용보험료(SRP 미적용, 10원단위 절사 후) * (1 + SRP 계산 합계) 10원 단위 절사
   */
  let srp_cost_1;
  console.log('sign', Math.sign(srp_sum_cnt));
  if (Math.sign(srp_sum_cnt) > 0) {
    srp_cost_1 = ins_cost_1 * (1 + Math.abs(srp_sum_cnt));
  } else {
    srp_cost_1 = ins_cost_1 * (1 - Math.abs(srp_sum_cnt));
  }
  let srp_cost_2 = srp_cost_1 === 0 ? 0 : Math.floor(srp_cost_1 / 100) * 100;

  // 납부 보험료(단체할인 9% 적용)
  let tmp_tot_ins_cost;
  if (srp_cost_1 === 0) {
    tmp_tot_ins_cost = 0;
  } else {
    tmp_tot_ins_cost = (srp_cost_1 * 91) / 100;
  }

  console.log(
    'srp_cost',
    srp_cost_1,
    srp_cost_2,
    '할인',
    (srp_cost_1 * 91) / 100,
    Math.floor((srp_cost_1 * 91) / 100 / 100) * 100,
  );

  //기본보험료
  result.apply_default_cost = Math.round(apply_ins_cost);
  // 적용보험료(SRP 미적용, 10원단위 절사 전)
  result.apply_cost = Math.round(ins_cost_1);
  // 적용보험료(SRP 미적용, 10원단위 절사 후) (=SRP 적용 전 보험료)
  result.apply_floor_cost = ins_cost_2;
  // SRP 최대 적용 보험료
  result.srp_max_cost = ins_cost_3;
  // SRP 적용 보험료
  result.srp_ins_cost = srp_cost_2;
  // 납부보험료
  result.tot_ins_cost =
    tmp_tot_ins_cost === 0 ? 0 : Math.floor(tmp_tot_ins_cost / 100) * 100;

  console.log(
    'result',
    Math.round(apply_ins_cost),
    Math.round(ins_cost_1),
    ins_cost_2,
    ins_cost_3,
    srp_cost_2,
  );

  // console.log('result',result)

  return result;
};

/**
 * 기술보호 법률비용 보상보험 예상 할인금액 계산하는 함수
 * @param {string} lawsuit_yn - 소송이력 여부
 * @param {number} discount_cnt - 할인사항 체크수
 * @return {number}
 */
const getProtectTechDiscountCost = (lawsuit_yn, discount_cnt) => {
  /*
   * 연 보험료 1,500,000원 기준 (고정)
   * 정부지원 기본 : 70%
   * 5년내 소송이력없음 : 10% 추가할인
   * 할인사항 할인 : 건당 3%, 최대 10%
   *
   * EX) 소송이력 아니오 체크, 할인사항 4건 체크
   * 150만원 X (70% + 10% + (4 X 3%))
   * -> 150만원 X (70% + 10% + 10%) = 135만원
   */
  // console.log('log',lawsuit_yn, discount_cnt);

  let default_cost = 1500000;
  let default_gov_rat = 70;
  let discount_rat = discount_cnt * 3;

  if (discount_rat > 10) {
    discount_rat = 10;
  }

  let tot_support_rat = default_gov_rat + discount_rat;
  if (lawsuit_yn === 'N') {
    tot_support_rat += 10;
  }

  let ins_cost = (default_cost * tot_support_rat) / 100;

  return ins_cost;
};

// 사업자 번호 포맷형식으로 변환
const bizFomatter = (num) => {
  let formatNum = '';
  if (num.length === 10) {
    formatNum = num.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
  } else {
    formatNum = num;
  }
  return formatNum;
};

// 사업자 번호 포맷형식으로 변환
const samsungBizFomatter = (num) => {
  let formatNum = '';
  if (num.length === 10) {
    formatNum = num.replace(/(\d{3})(\d{2})(\d{5})/, '$1/$2/$3');
  } else {
    formatNum = num;
  }
  return formatNum;
};

// 금액형식
const costFomatter = (num) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '';
};

/**
 * 보험 상품별로 필수항목 구하는 함수
 * @param {number} id - 보험 상품명
 * @param {string} name - 이름
 * @return {Array} 필수항목
 */
const test2 = (id, name) => {
  return `${id}${name}`;
};

/**
 * 라벨링 다중/재난
 * @param {string} value - 목적물
 * @param {string} pathRoot - 상품명
 * @return {string} 라벨링값
 */
const customLabeling = (value, pathRoot) => {
  let labeling = value;

  let CustomLabel = '';

  if (pathRoot == '재난배상') {
    if (labeling == '주유소') {
      CustomLabel = '연간 매출액';
    } else {
      CustomLabel = '면적';
    }
  } else {
    if (labeling === '고시원') {
      CustomLabel = '객실';
    } else if (labeling === '영화상영관') {
      CustomLabel = '좌석';
    } else if (
      labeling === '게임제공업' ||
      labeling === '인터넷컴퓨터게임시설제공업' ||
      labeling === '복합유통게임제공업'
    ) {
      CustomLabel = '대수';
    } else {
      CustomLabel = '면적';
    }
  }

  // console.log('labeling', labeling)

  return CustomLabel;
};

const getSignData = (str) => {
  let encrypted = CryptoJS.SHA256(str).toString();
  return encrypted;
};

/**
 * 기타용도에 키워드 존재하는지 체크하는 함수
 * @param {string} purps
 * @param {number} type
 * 0: 전체, 1: 단독/공동주택 - 계약자 개인 가입, 2: 단독/공동주택 - 계약자 단체 가입
 * @return {boolean}
 */
const isPossiblePurps = (purps, type) => {
  let purpsList = [];
  let result = false;

  switch (type) {
    case 1:
    case 2:
    case 3:
      purpsList = ['주택', '아파트', '다세대', '다가구', '연립'];

      if (purps != null) {
        for (let index = 0; index < purpsList.length; index++) {
          const element = purpsList[index];
          if (!result && purps.includes(element)) result = true;
        }
      }
      break;
    default: // 0
      result = true;
      break;
  }
  return result;
};

/**
 * 기타용도에 제외키워드 존재하는지 체크하는 함수
 * @param {string} purps
 * @param {number} type
 * 0: 전체, 1: 단독/공동주택 - 계약자 개인 가입, 2: 단독/공동주택 - 계약자 단체 가입
 * @return {boolean}
 */
const isExcludePurps = (purps, type) => {
  let excludePurpsList = [];
  let result = false;

  switch (type) {
    case 1:
    case 2:
    case 3:
      excludePurpsList = ['연면적제외'];

      if (purps != null) {
        for (let index = 0; index < excludePurpsList.length; index++) {
          const element = excludePurpsList[index];
          if (!result && purps.includes(element)) result = true;
        }
      }
      break;
    default: // 0
      result = false;
      break;
  }
  return result;
};

/**
 * referer에 상품명 있는지 체크하는 함수
 * @param {string} referer
 * @return {boolean}
 */
const isRefererInsProdCd = (referer) => {
  let insProdCdList = ['dsf2', 'dsf3', 'dsf6', 'dli', 'mfli'];
  let result = false;

  for (let index = 0; index < insProdCdList.length; index++) {
    const element = insProdCdList[index];
    if (referer.includes(element)) result = true;
  }

  return result;
};

/**
 * 사업자번호 개인/법인 구분
 * @param {string} bizNum - 목적물
 * @return {string} 개인/법인
 */
const getBizType = (bizNum) => {
  let bizType = '';

  const corpList = ['81', '82', '83', '84', '85', '86', '87'];
  const gbCd = bizNum.substring(3, 5);
  // console.log('gbCd', gbCd)
  if (corpList.includes(gbCd)) {
    bizType = 'C';
  } else {
    bizType = 'P';
  }

  return bizType;
};

const dliExcludeBzcBoonNm = [
  '경륜장',
  '경정장',
  '장외매장',
  '경마장',
  '장외발매소',
  '전시시설',
  '여객자동차터미널',
  '지하상가',
  '물류창고',
];

/**
 * 주택구분 구하는 함수
 * @param {string} mainPurpsType - 용도 종류
 * @return {string}
 */
const getBldTypeByPurpsType = (mainPurpsType) => {
  let bldType;

  let housePurpsType = ['단독주택', '다중주택', '다가구주택'];
  let apartPurpsType = ['아파트', '연립주택', '다세대주택(빌라)', '공동주택'];

  if (housePurpsType.includes(mainPurpsType)) {
    bldType = '단독';
  } else {
    bldType = '공동';
  }
  return bldType;
};

/**
 * 풍6 유료 가입금액 구하는 함수
 * @param {string} tenant 소유여부
 * @param {string} biztype 소상공인 구분
 * @param {number} costType 가입금액 유형(0: 직접선택, 1: 표준형, 2: 고급형)
 * @return {Object}
 * insCostBld : 건물 가입금액
 * insCostFcl : 시설 가입금액
 * insCostItem : 집기비품 가입금액
 * insCostMach : 기계 가입금액
 * insCostInven : 재고자산 가입금액
 * insCostDeductible : 자기부담금
 * insCostShopSign : 야외간판 특약 가입금액
 */
const getDsfSixPayGuaranteedCost = (tenant, biztype, costType) => {
  let insCostBld = 0;
  let insCostFcl = 0;
  let insCostItem = 0;
  let insCostMach = 0;
  let insCostInven = 0;
  let insCostDeductible = 200000;
  let insCostShopSign = 0;

  if (biztype.includes('소상인') && tenant.includes('소유')) {
    if (costType == 1) {
      insCostBld = 40000000;
      insCostFcl = 20000000;
      insCostItem = 20000000;
      // insCostMach = 0;
      insCostInven = 30000000;
    } else if (costType == 2) {
      insCostBld = 60000000;
      insCostFcl = 20000000;
      insCostItem = 20000000;
      // insCostMach = 0;
      insCostInven = 50000000;
    }
  } else if (biztype.includes('소상인') && tenant.includes('임차')) {
    if (costType == 1) {
      // insCostBld = 0;
      insCostFcl = 40000000;
      insCostItem = 40000000;
      // insCostMach = 0;
      insCostInven = 30000000;
    } else if (costType == 2) {
      // insCostBld = 0;
      insCostFcl = 50000000;
      insCostItem = 50000000;
      // insCostMach = 0;
      insCostInven = 50000000;
    }
  } else if (biztype.includes('소공인') && tenant.includes('소유')) {
    if (costType == 1) {
      insCostBld = 40000000;
      insCostFcl = 20000000;
      insCostItem = 20000000;
      insCostMach = 20000000;
      insCostInven = 30000000;
    } else if (costType == 2) {
      insCostBld = 60000000;
      insCostFcl = 30000000;
      insCostItem = 30000000;
      insCostMach = 30000000;
      insCostInven = 50000000;
    }
  } else {
    // 소공인 & 임차자
    if (costType == 1) {
      // insCostBld = 0;
      insCostFcl = 40000000;
      insCostItem = 40000000;
      insCostMach = 20000000;
      insCostInven = 30000000;
    } else if (costType == 2) {
      // insCostBld = 0;
      insCostFcl = 50000000;
      insCostItem = 50000000;
      insCostMach = 50000000;
      insCostInven = 50000000;
    }
  }

  return {
    insCostBld,
    insCostFcl,
    insCostItem,
    insCostMach,
    insCostInven,
    insCostDeductible,
    insCostShopSign,
  };
};

/**
 * 암호화
 * @param {string} type - 암호화 방법
 * @param {string} text - 암호화할 값
 * @param {string} salt
 * @return {Object}
 * encryptText : 암호화 값
 * salt : salt 값
 */
const encrypt = (type, text, salt) => {
  let saltValue = salt != '' ? salt : getRandomId();
  let encryptText = '';

  // 값이 없을 경우 빈 문자열 반환
  if (!text) return { encryptText, salt };

  switch (type) {
    case 'AES/ECB/PKCS5Padding':
      const cipher = crypto.createCipheriv(
        getAesAlgorithm(salt, 'ecb'),
        salt,
        null,
      );
      // console.log('encrypt cipher', cipher);
      const paddedText = addPKCS5Padding(Buffer.from(text, 'utf8'));

      encryptText = cipher.update(paddedText);
      encryptText = Buffer.concat([encryptText, cipher.final()]);
      encryptText = encryptText.toString('base64');

      break;
    case 'AES':
    default:
      encryptText = CryptoJS.AES.encrypt(text, saltValue).toString();

      break;
  }

  return { encryptText, salt: saltValue };
};

/**
 * 복호화
 * @param {string} type - 복호화 방법
 * @param {string} text - 암호화된 값
 * @param {string} salt
 * @return {string} 복호화 값
 */
const decrypt = (type, text, salt) => {
  let decryptText = '';
  let bytes;

  // 값이 없을 경우 빈 문자열 반환
  if (!text) return decryptText;

  try {
    switch (type) {
      case 'AES':
      default:
        bytes = CryptoJS.AES.decrypt(text, salt); // 복호화 시도
        decryptText = bytes.toString(CryptoJS.enc.Utf8);
        break;
    }

    return decryptText;
  } catch (error) {
    console.error('Decryption error:', error); // 에러 로깅
    return ''; // 에러 발생 시 빈 문자열 반환
  }
};

const getWesternAge = async (birthday, baseDt) => {
  let baseDay = dayjs();
  if (baseDt != null) {
    baseDay = dayjs(baseDt);
  }
  let birthDay = dayjs(birthday);
  let age = baseDay.get('year') - birthDay.get('year');

  let baseDayMonth = baseDay.get('month') + 1;
  let birthMonth = birthDay.get('month') + 1;

  if (
    birthMonth > baseDayMonth ||
    (birthMonth === baseDayMonth && birthDay.get('date') >= baseDay.get('date'))
  ) {
    age--;
  }
  return age;
};

const getInsPeriod = (insStartDt, insEndDt, unit) => {
  const insPeriodDuration = dayjs.duration(
    dayjs(insEndDt).diff(dayjs(insStartDt)),
  );
  let insPeriod = 0;

  switch (unit) {
    case 'd':
      insPeriod = Math.ceil(insPeriodDuration.as('days'));
      break;
    case 'h':
    default:
      insPeriod = insPeriodDuration.as('hours');
      break;
  }

  return insPeriod;
};

const getHmacEncode = (str, salt, algo, encodeType) => {
  const algoFormatted = algo.toLowerCase().replace('-', '');
  const hash = crypto.createHmac(algoFormatted, salt);
  hash.update(str);

  const res = hash.digest(encodeType);

  return res;
};

const getKbAuthData = (data, appKey) => {
  const hsKey = getHmacEncode(
    JSON.stringify(data),
    appKey,
    'SHA-256',
    'base64',
  );

  return hsKey;
};

const getSmAuthData = async (data, currentTimestamp, appSecret, appKey) => {
  const hsKey = getHmacEncode(
    JSON.stringify(data) + currentTimestamp,
    appSecret,
    'SHA-512',
    'hex',
  );

  const rtnMap = {
    appKey,
    hsKey,
    currentTimestamp,
  };

  return rtnMap;
};

// PKCS5 Padding을 추가하는 함수
function addPKCS5Padding(buffer) {
  const padding = 16 - (buffer.length % 16);
  const paddingText = Buffer.alloc(padding, padding);
  return Buffer.concat([buffer, paddingText]);
}

const stringToBytes = (str) => {
  let bytes = [];
  for (let index = 0; index < str.length; index++) {
    bytes.push(str.charCodeAt(index));
  }
  return bytes;
};

function getAesAlgorithm(keyBase64, type) {
  // let key = Buffer.from(keyBase64, 'base64');
  let key = stringToBytes(keyBase64);
  console.log('key length', key.length);
  switch (key.length) {
    case 16:
      return 'aes-128-' + type.toLowerCase();
    case 24:
      return 'aes-192-' + type.toLowerCase();
    case 32:
      return 'aes-256-' + type.toLowerCase();
  }

  throw new Error('Invalid key length: ' + key.length);
}

// 휴대폰 번호 포맷 형식으로 변환
// type - 0: 가운데 번호 마스킹, 1: 마스킹 없음
const phoneFomatter = (num, type) => {
  let formatNum = '';
  if (num.length == 11) {
    if (type == 0) {
      formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3');
    } else {
      formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }
  } else if (num.length == 8) {
    formatNum = num.replace(/(\d{4})(\d{4})/, '$1-$2');
  } else {
    if (num.indexOf('02') == 0) {
      if (type == 0) {
        formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-****-$3');
      } else {
        formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
      }
    } else {
      if (type == 0) {
        formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-***-$3');
      } else {
        formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
      }
    }
  }
  return formatNum;
};

// 다른파일에서 사용
// const {test} = require('./utill/function.js')

module.exports = {
  test,
  getRandomId,
  getInsSDate,
  getInsEDate,
  nullCheckObj,
  nullCheckObjKey,
  checkBizNumType,
  isMeritzFloodedArea,
  getDsfSixJoinCost,
  isDsfSixBizCategory,
  structureLevel,
  getBldStrctGrade,
  getUseAprDate,
  getDsfThreeCalcRat,
  getDsfThreeBldCost,
  getDsfThreeInsCost,
  getDsfThreeInsCostTest,
  getDsfThreePurpsCdArr,
  getDsfThreeEtcPurpsNmArr,

  getPrivacySalesCost,
  getPrivacyDefaultCost,
  getPrivacyInsCost,

  getProtectTechDiscountCost,
  bizFomatter,
  samsungBizFomatter,
  costFomatter,

  customLabeling,
  getSignData,

  isPossiblePurps,
  isExcludePurps,
  isRefererInsProdCd,
  getBizType,
  dliExcludeBzcBoonNm,
  getBldTypeByPurpsType,
  getDsfSixPayGuaranteedCost,

  encrypt,
  decrypt,
  getWesternAge,
  getInsPeriod,

  getHmacEncode,
  getKbAuthData,
  getSmAuthData,
  phoneFomatter,

  stringToBytes,
  getAesAlgorithm,
};
