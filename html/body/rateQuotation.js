/**
 * 50인 이상 질문서 Body Element
 * @return {string} pdf변환용 string
 */
const dayjs = require('dayjs');

// 금액형식
const costFomatter = (num) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '';
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

const numberToKorean2 = (number) => {
  number = parseInt((number + '').replace(/[^0-9]/g, ''), 10); // 숫자/문자/돈 을 숫자만 있는 문자열로 변환
  // console.log('num', num)
  if (number == 0) return '0';
  if (number < 10000) return costFomatter(number); // 1만원 이하 그대로 표시

  var unitWords = ['', '만', '억', '조', '경'];
  var splitUnit = 10000;
  var splitCount = unitWords.length;
  var resultArray = [];
  var resultString = '';

  for (var i = 0; i < splitCount; i++) {
    var unitResult =
      (number % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i);
    unitResult = Math.floor(unitResult);
    if (unitResult > 0) {
      resultArray[i] = unitResult;
    }
  }
  // console.log('resultArray: ',resultArray)

  for (var i = 0; i < resultArray.length; i++) {
    if (!resultArray[i]) continue;
    if (
      resultString == '' &&
      unitWords[i] == '만' &&
      costFomatter(resultArray[i]).includes(',000')
    ) {
      resultString =
        String(resultArray[i]).charAt(0) + '천' + unitWords[i] + resultString;
    } else if (resultString == '') {
      resultString =
        String(costFomatter(resultArray[i])) + unitWords[i] + resultString;
    } else {
      resultString =
        String(costFomatter(resultArray[i])) +
        unitWords[i] +
        ' ' +
        resultString;
    }
  }

  return resultString;
};

const rateQuotation = (data) => {
  const {
    id,
    insProdCd,
    insProdFullNm, // 보험상품명 전체
    insProdTermsUrl,
    insJoinFileUrl,
    insStockNo,
    tempInsStockNo,
    insComCd,
    insComNm,
    phPhoneNo,
    corpManagerNm,
    corpManagerPhoneNo,
    insuredFranNm,
    insuredBizNo,
    insuredCorpNo,
    insuredCorpNationality,
    insuredPhoneNo,
    insuredEmail,
    insuredAddress,
    insuredZipCd,
    ntsBizTypeCd,
    ntsBizTypeNm,
    ccaliBizTypeCd,
    ccaliBizTypeNm,
    openedCurrentYearYn,
    referralHistoryYn,
    guaranteeDisaterCd,
    guaranteeDisaterNm,
    guaranteeRegionCd,
    guaranteeRegionNm,
    subCompanyJoinYn,
    joinStatusCd,
    joinStatusNm,
    payStatusCd,
    payStatusNm,
    payDt,
    insStartDt,
    insEndDt,
    joinAccount,
    joinPath,
    wooricardPayYn,
    referIdx,
    joinYmd,
    phNm,
    phBizNo,
    phEmail,
    planId,
    insuredCorpFoundationYmd,
    salesCost,
    regularEmployeeCnt,
    dispatchedEmployeeCnt,
    subcontractEmployeeCnt,
    totEmployeeCnt,
    totAnnualWages,
    joinRenewNo,
    perAccidentCoverageLimit,
    totCoverageLimit,
    deductibleInsCost,
    totInsCost,
    premCmptDt,
    claimYn,
    claimData,
    // claimData: [
    //   {
    //     claimAccidentDt: null,
    //     claimAccidentContent: null,
    //     claimStatusCd: null,
    //     claimStatusNm: null,
    //     claimDt: null
    //   }
    // ],
    ntsBizLargeTypeCd,
    ntsBizLargeTypeNm,
    ccaliBizLargeTypeCd,
    ccaliBizLargeTypeNm,
    subCompanyList,
    planGuarantee,
    // planGuarantee: [
    //   {
    //     planId: 5,
    //     planType: '',
    //     planNm: '50인 이상',
    //     insProdCd: 'ccali',
    //     insProdNm: '중대재해',
    //     insProdFullNm: '기업중대사고 배상책임보험',
    //     insComCd: 'DB',
    //     insComNm: 'DB손해보험',
    //     insComFullNm: 'DB손해보험',
    //     guaranteeData: [
    //       {
    //         guaranteeId: 1,
    //         guaranteeNm: '자기부담금',
    //         guaranteeContent: null,
    //         guaranteeExplain:
    //           '없음(단, 징벌적 손해배상책임 특별약관에서는 손해액의 20%)',
    //       },
    //       {
    //         guaranteeId: 2,
    //         guaranteeNm: '법률적 배상책임 (보통약관)',
    //         guaranteeContent: null,
    //         guaranteeExplain: null,
    //       },
    //       {
    //         guaranteeId: 4,
    //         guaranteeNm: '중대사고 형사방어비용 (특별약관)',
    //         guaranteeContent: null,
    //         guaranteeExplain: '사고 당/총 보상한도액의 30% 한도',
    //       },
    //       {
    //         guaranteeId: 7,
    //         guaranteeNm: '민사상 배상책임 부담보 (특별약관)',
    //         guaranteeContent: null,
    //         guaranteeExplain: null,
    //       },
    //       {
    //         guaranteeId: 10,
    //         guaranteeNm: '대위권 포기 (특별약관)',
    //         guaranteeContent: null,
    //         guaranteeExplain: null,
    //       },
    //     ],
    //   },
    // ],
    fileType,
    productType,
    highRiskProducts,
    responseList,
    insCostNoticeData,
  } = data;

  const responseArray = [];
  for (
    let responseIndex = 0;
    responseIndex < responseList.length;
    responseIndex++
  ) {
    const responseElement = responseList[responseIndex];
    responseArray.push(responseElement.answerId);
  }

  let guaranteeTextDb = ``;
  if (planId == 5) {
    guaranteeTextDb = `1&#41; 기업중대사고 배상책임보험 보통약관<br />
    2&#41; 징벌적 손해배상책임 특별약관<br />`;

    const guaranteeNmList = [];
    for (
      let index = 0;
      index < planGuarantee[0].guaranteeData.length;
      index++
    ) {
      const element = planGuarantee[0].guaranteeData[index];
      guaranteeNmList.push(element.guaranteeNm);

      if (index == planGuarantee[0].guaranteeData.length - 1) {
        if (guaranteeNmList.includes('중대사고 형사방어비용 (특별약관)')) {
          guaranteeTextDb += `3&#41; 중대사고 형사방어비용 특별약관 : 사고당/총보상한도액의 30%를 한도로 보상<br />`;
        }
        guaranteeTextDb += `4&#41; 중대( )재해만을 위한 보장 특별약관 - (${guaranteeDisaterNm})<br />`;
        if (guaranteeNmList.includes('중대사고 위기관리실행비용Ⅰ(특별약관)')) {
          guaranteeTextDb += `5&#41; 기업 중대사고 위기관리실행비용Ⅰ 특별약관 : 사고당/총보상한도액의 5%를 한도로 보상(단, 사고당 1억원을 초과하지 않음)<br />`;
        } else if (
          guaranteeNmList.includes('중대사고 위기관리실행비용Ⅱ(특별약관)')
        ) {
          guaranteeTextDb += `5&#41; 기업 중대사고 위기관리실행비용Ⅱ 특별약관 : 사고당/총보상한도액의 5%를 한도로 보상(단, 사고당 1억원을 초과하지 않음)<br />`;
        }
        if (guaranteeNmList.includes('민사상 배상책임 부담보 (특별약관)')) {
          guaranteeTextDb += `6&#41; 민사상 손해배상책임 부담보 특별약관<br />`;
        }
        guaranteeTextDb += `7&#41; 날짜인식오류 보상제외 특별약관<br />
    8&#41; 제재위반 부보장 특별약관<br />
    9&#41; 테러행위 면책 특별약관<br />
    10&#41; 정보기술 특별약관(사이버위험 보상제외 특별약관)<br />
    11&#41; 날짜인식오류 부보장 추가약관<br />
    12&#41; [LMA5399]전염병 면책 특별약관Ⅱ`;
      }
    }
  } else {
    guaranteeTextDb = `1&#41; 기업중대사고 배상책임보험 보통약관<br />
    2&#41; 징벌적 손해배상책임 특별약관<br />
    3&#41; 중대사고 형사방어비용 특별약관 : 사고당/총보상한도액의 30%를 한도로 보상<br />
    4&#41; 중대( )재해만을 위한 보장 특별약관 - (${guaranteeDisaterNm})<br />
    `;
    if (responseArray.includes(22)) {
      guaranteeTextDb += `5&#41; 기업 중대사고 위기관리실행비용Ⅰ 특별약관 : 사고당/총보상한도액의 5%를 한도로 보상(단, 사고당 1억원을 초과하지 않음)<br />`;
    } else if (responseArray.includes(171)) {
      guaranteeTextDb += `5&#41; 기업 중대사고 위기관리실행비용Ⅱ 특별약관 : 사고당/총보상한도액의 5%를 한도로 보상(단, 사고당 1억원을 초과하지 않음)<br />`;
    }
    guaranteeTextDb += `6&#41; 민사상 손해배상책임 부담보 특별약관<br />
    7&#41; 날짜인식오류 보상제외 특별약관<br />
    8&#41; 제재위반 부보장 특별약관<br />
    9&#41; 테러행위 면책 특별약관<br />
    10&#41; 정보기술 특별약관(사이버위험 보상제외 특별약관)<br />
    11&#41; 날짜인식오류 부보장 추가약관<br />
    12&#41; [LMA5399]전염병 면책 특별약관Ⅱ
    `;
  }

  // 1&#41; 기업중대사고 배상책임보험 보통약관<br />
  // 2&#41; 징벌적 손해배상책임 특별약관<br />
  // 3&#41; 중대사고 형사방어비용 특별약관 : 사고당/총보상한도액의 30%를 한도로 보상<br />
  // 4&#41; 중대( )재해만을 위한 보장 특별약관 - (중대산업재해)<!-- 중대산업재해 / 중대산업&시민재해 --><br />
  // 5&#41; 기업 중대사고 위기관리실행비용 특별약관 : 사고당/총보상한도액의 5%를 한도로 보상(단, 사고당 1억원을 초과하지 않음)<br />
  // 6&#41; 민사상 손해배상책임 부담보 특별약관<br />
  // 7&#41; 날짜인식오류 보상제외 특별약관<br />
  // 8&#41; 제재위반 부보장 특별약관<br />
  // 9&#41; 테러행위 면책 특별약관<br />
  // 10&#41; 정보기술 특별약관(사이버위험 보상제외 특별약관)<br />
  // 11&#41; 날짜인식오류 부보장 추가약관<br />
  // 12&#41; [LMA5399]전염병 면책 특별약관Ⅱ

  if (insComCd == 'MR') {
    return `
      <div id="page" class="db">
        <div class="page_wrap">
          <header>
            <div>
              <p style="font-size:10pt; font-weight: 900;  letter-spacing: 0.02mm;">MERITZ FIRE & MARINE INSURANCE CO., LTD</p>
              <p style="font-size:9pt; font-weight:500; letter-spacing: -0.06mm;">382 Gangnamdae-ro, Gangnam-gu, Seoul, Korea</p>
            </div>
            <div style="text-align:right;"">
              <img src="https://insboon-assets.s3.ap-northeast-2.amazonaws.com/meritz/logo_meritz_insuarance.png" alt="메리츠화재보험" width="104" style=" margin-top: -0.5mm; margin-bottom:1mm; margin-right:-1mm;" />
              <div>${dayjs(joinYmd).format('YYYY.MM.DD')}<!-- 요율구득 요청일자 ex)2024.08.16 --></div>
            </div>  
          </header>

          <div class="content_wrap" style="padding:1.5mm 0 0;">
            <div style="font-weight: 900; margin-bottom:7.5mm;">Quoting Offer for&nbsp;&nbsp;<span style="letter-spacing: 0.2mm;">기업중대사고배상책임보험</span></div>
            <div>
              <dl>
                <dt>1. 피보험자&nbsp;&nbsp;:</dt>
                <dd>${insuredFranNm} (${bizFomatter(insuredBizNo)})<!-- 피보험자명 --></dd>
              </dl>
              <dl>
                <dt>2. 보힘기간&nbsp;&nbsp;:</dt>
                <dd>1년</dd>
              </dl>
              <dl>
                <dt>3. 담보위험&nbsp;&nbsp;:</dt>
                <dd style="padding-left:2mm;">
                  <div>중대재해&nbsp;&nbsp;&nbsp;발생으로&nbsp;&nbsp;&nbsp;인해&nbsp;&nbsp;&nbsp;피보험자가&nbsp;&nbsp;&nbsp;부담하는&nbsp;&nbsp;&nbsp;법률상의&nbsp;&nbsp;&nbsp;배상책임&nbsp;&nbsp;&nbsp;및 형사방어비용
                    <div style="font-size:10pt; font-weight: 900; letter-spacing: 0.4mm; margin-top: 1mm;">* ${guaranteeDisaterNm}<!-- 중대산업재해 + 중대시민재해 --></div>
                  </div>
                </dd>
              </dl>
              <dl>
                <dt>4. 보상한도&emsp;:</dt>
                <dd >
                  <div>
                    <span style="letter-spacing:-0.15mm">${numberToKorean2(perAccidentCoverageLimit)}<!-- 사고당보상한도 -->-사고당 / ${numberToKorean2(totCoverageLimit)}<!-- 증권총보상한도 -->-증권총보상한도<br/>
                  </div>
                </dd>
              </dl>
              <dl>
                <dt>5. 공제금액&emsp;:</dt>
                <dd style="letter-spacing: 0.23mm;">없음 (단, 징벌적 배상책임 담보에 대해서는 손해액의 20%적용)</dd>
              </dl>
              <dl>
                <dt>6. 보험조건&emsp;:</dt>
                <dd></dd>
              </dl>
              <div style="margin:1.5mm 0 0mm 15mm">
                <ul>
                  <li>
                    <div class="checkbox_wrap">
                      <div class="checkbox"></div>
                      <p>기업중대사고배상책임보험</p>
                    </div>
                  </li>
                  <li>
                    <div class="checkbox_wrap">
                      <div class="checkbox"></div>
                      <p>징벌적 손해배상책임 특약</p>
                    </div>
                  </li>
                  <li>
                    <div class="checkbox_wrap">
                      <div class="checkbox"></div>
                      <p>소급보장일자 : 보험개시일</p>
                    </div>
                  </li>
                  ${
                    guaranteeTextDb.indexOf('중대사고 형사방어비용 특별약관') >
                    -1
                      ? `
                      <li>
                        <div class="checkbox_wrap">
                          <div class="checkbox"></div>
                          <p>중대사고 형사방어비용 특약 : 사고당 보상한도액의 30%한도내</p>
                        </div>
                      </li>
                      `
                      : ``
                  }
                  ${
                    guaranteeTextDb.indexOf('중대사고 위기관리실행비용') > -1
                      ? `
                      <li>
                        <div class="checkbox_wrap">
                          <div class="checkbox"></div>
                          <p>기업 중대사고 위기관리실행비용 특별약관</p>
                        </div>
                      </li>
                      `
                      : ``
                  }
                  <li>
                    <div class="checkbox_wrap">
                      <div class="checkbox"></div>
                      <p>중대(${guaranteeDisaterNm == '중대산업재해' ? '산업' : guaranteeDisaterNm == '중대시민재해' ? '시민' : '산업+시민'})재해만을 위한 보장 특별약관</p>
                    </div>
                  </li>
                  ${
                    guaranteeTextDb.indexOf('민사상 손해배상책임 부담보') > -1
                      ? `
                      <li>
                        <div class="checkbox_wrap">
                          <div class="checkbox"></div>
                          <p>민사상 배상책임 부담보 특별약관</p>
                        </div>
                      </li>
                      `
                      : ``
                  }
                  ${
                    responseArray.includes(27)
                      ? `
                      <li>
                        <div class="checkbox_wrap">
                          <div class="checkbox"></div>
                          <p>공중교통수단 보장확대 특별약관</p>
                        </div>
                      </li>
                      `
                      : ``
                  }
                  ${
                    responseArray.includes(31)
                      ? `
                      <li>
                        <div class="checkbox_wrap">
                          <div class="checkbox"></div>
                          <p>대위권포기 특별약관</p>
                        </div>
                      </li>
                      `
                      : ``
                  }
                  ${
                    responseArray.includes(29)
                      ? `
                      <li>
                        <div class="checkbox_wrap">
                          <div class="checkbox"></div>
                          <p>오염손해 보장확대 특별약관</p>
                        </div>
                      </li>
                      `
                      : ``
                  }
                  ${
                    guaranteeTextDb.indexOf('날짜인식오류 부보장 추가약관') > -1
                      ? `
                      <li>
                        <div class="checkbox_wrap">
                          <div class="checkbox"></div>
                          <p>날짜인식오류 부보</p>
                        </div>
                      </li>
                      `
                      : ``
                  }
                  ${
                    guaranteeTextDb.indexOf('제재위반 부보장 특별약관') > -1
                      ? `
                      <li>
                        <div class="checkbox_wrap">
                          <div class="checkbox"></div>
                          <p>제재위반 부보장</p>
                        </div>
                      </li>
                      `
                      : ``
                  }
                  ${
                    guaranteeTextDb.indexOf('[LMA5399]전염병 면책 특별약관') >
                    -1
                      ? `
                      <li>
                        <div class="checkbox_wrap">
                          <div class="checkbox"></div>
                          <p>전염병 보장제외<span style="letter-spacing: -0.1mm;">(LMA5399)</span></p>
                        </div>
                      </li>
                      `
                      : ``
                  }
                  ${
                    guaranteeTextDb.indexOf('테러행위 면책 특별약관') > -1
                      ? `
                      <li>
                        <div class="checkbox_wrap">
                          <div class="checkbox"></div>
                          <p>테러행위 면책</p>
                        </div>
                      </li>
                      `
                      : ``
                  }
                  ${
                    guaranteeTextDb.indexOf(
                      '정보기술 특별약관(사이버위험 보상제외 특별약관)',
                    ) > -1
                      ? `
                      <li>
                        <div class="checkbox_wrap">
                          <div class="checkbox"></div>
                          <p>사이버위험 보장제외</p>
                        </div>
                      </li>
                      `
                      : ``
                  }
                </ul>
              </div>
              <dl style="margin-bottom:1mm;">
                <dt style="letter-spacing: -0.25mm;">7. Information:</dt>
                <dd style="margin-left:-3mm; font-weight: 900;">신규</dd>
              </dl>
              <div>
                <p style="margin-bottom:2mm;">Yours very truly.</p>
                <img src="https://insboon-assets.s3.ap-northeast-2.amazonaws.com/meritz/sign_meritz_gm.png" width="100mm" style="margin-bottom:2mm;" />
                <p style="margin-bottom:2mm;">General Manager</p>
                <p style="margin-bottom:2mm;">Casualty Department</p>
              </div>
            </div>
          </div>
          <!-- content_wrap -->
        </div>
        <!-- page_wrap -->
      </div>
      <!-- page -->
    `;
  } else {
    return `
      <div id="page" class="db">
        <div class="page_wrap">
          <header style="margin-bottom: 4mm">
            <div
              style="
                display: flex;
                display: -webkit-flex;
                align-items: center;
                gap: 9mm;
                margin-bottom: 2mm;
              "
            >
              <img
                src="https://insboon-assets.s3.ap-northeast-2.amazonaws.com/db/db_logo_promise.png"
                width="131"
                height="41"
              />

              <div>
                <h1
                  style="
                    font-size: 19pt;
                    font-weight: 600;
                    letter-spacing: -0.1mm;
                    padding-left: 1mm;
                  "
                >
                  요율구득요청서[RATE QUOTATION]
                </h1>
              </div>
            </div>

            <div
              style="
                width: calc(100% + 2mm);
                height: 10px;
                background: linear-gradient(to right, #00954d, #a2cc36);
                border-radius: 0 0 3mm 0;
              "
            ></div>
          </header>

          <div class="content_wrap">
            <table>
              <colgroup>
                <col style="width: 15%" />
              </colgroup>
              <tbody>
                <tr>
                  <th style="text-align: center">수&emsp;&emsp;&emsp;신</th>
                  <td>
                    <div class="flex justify-between">
                      코리안리재보험주식회사(KOREAN RE)
                      <div>${dayjs(joinYmd).format('YYYY. M. D.')}<!-- 요율구득 요청일자 ex)2024. 7. 5. --></div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th style="text-align: center">제&emsp;&emsp;&emsp;목</th>
                  <td style="font-weight: 900">
                    요율 구득 요청서 (RATE QUOTATION)
                  </td>
                </tr>
              </tbody>
            </table>

            <div style="text-align: center; font-size: 11pt; margin: 5mm 0">
              <p style="margin-bottom: 5mm">
                아래와 같은 조건으로 보험요율을 요청하오니 안내하여 주시기
                바랍니다.
              </p>
              <p>- 아&emsp;&emsp;&emsp;래 -</p>
            </div>

            <table>
              <colgroup>
                <col style="width: 20%" />
              </colgroup>
              <tbody>
                <tr>
                  <th>
                    <div>1. 보험종목</div>
                  </th>
                  <td>기업중대사고 배상책임보험</td>
                </tr>
                <tr>
                  <th>
                    <div>2. 계약자</div>
                  </th>
                  <td>${phNm} (${bizFomatter(phBizNo)})<!-- 계약자명 --></td>
                </tr>
                <tr>
                  <th>3. 피보험자</th>
                  <td>${insuredFranNm} (${bizFomatter(insuredBizNo)})<!-- 피보험자명 --></td>
                </tr>
                <tr>
                  <th>4. 소재지</th>
                  <td>(${insuredZipCd}) ${insuredAddress}<!-- 소재지 주소 --></td>
                </tr>
                <tr>
                  <th>5. 담보내용</th>
                  <td>
                    중대재해 발생으로 인해 피보험자가 부담하는 법률상의 배상책임
                    및 형사방어비용<br />
                    - 업종: 기타의 사업-정보처리 및 기타 컴퓨터 운용관련사업<!-- 업종 -->
                    <br />
                    - 매출액: ${costFomatter(salesCost)}<!-- 매출액 -->원<br />
                    - 근로자수: ${costFomatter(totEmployeeCnt)}<!-- 근로자수 -->명<br />
                    - 연임금 총액: ${costFomatter(totAnnualWages)}<!-- 연임금 총액 -->원<br />
                    <div class="flex">
                      * 자회사 담보 (
                      <!-- 자회사담보 여부 check -->
                      <div class="checkbox_wrap" style="margin-right: 2mm">
                        <div class="checkbox ${subCompanyJoinYn == 'Y' ? 'checked' : ''}" style="margin-right: 1mm"></div>
                        <p>예</p>
                      </div>
                      <div class="checkbox_wrap">
                        <div class="checkbox ${subCompanyJoinYn == 'Y' ? '' : 'checked'}" style="margin-right: 1mm"></div>
                        <p>아니오</p>
                      </div>
                      )
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>6. 소급보장일자</th>
                  <td>보험개시일</td>
                </tr>
                <tr>
                  <th>7. 보험기간</th>
                  <td>1년</td>
                </tr>
                <tr>
                  <th>8. 담보지역</th>
                  <td>${guaranteeRegionCd == 'W' ? '전세계(북미제외)' : '한국'}</td>
                </tr>
                <tr>
                  <th>9. 재판관할권</th>
                  <td>한국</td>
                </tr>
                <tr>
                  <th>10. 보험조건</th>
                  <td>
                    <div>
                      ${guaranteeTextDb}
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>11. 보상한도액</th>
                  <td>
                    증권총보상한도: ${costFomatter(totCoverageLimit)}<!-- 증권총보상한도 -->원<br />
                    중대재해(산업/시민)배상책임: ${costFomatter(perAccidentCoverageLimit)}<!-- 사고당보상한도 -->원 - 1사고당 /
                    ${costFomatter(totCoverageLimit)}<!-- 총보상한도 -->원 - 총보상한도
                  </td>
                </tr>
                <tr>
                  <th>12. 자기부담금</th>
                  <td>NIL (단, 징벌배상책임 담보에 대해서는 손해액의 20%)</td>
                </tr>
                <tr>
                  <th>13. 보험료 납입방법</th>
                  <td>${planId == 5 ? '일시납/2회납/4회납' : '일시납'}<!-- 일시납/2회납/4회납 --></td>
                </tr>
              </tbody>
            </table>

            <div style="text-align: center; font-size: 11pt; margin: 5mm 0">
              <p style="margin-bottom: 5mm">
                가능한 빠른 시간 내에 안내를 부탁합니다.
              </p>
              <p class="nanummyeongjo" style="font-size: 18pt; font-weight: 600">
                특 종 업 무 파 트 장
              </p>
            </div>
          </div>

          <!-- content_wrap -->
          <div style="margin-top: auto">
            <footer>
              <div class="flex justify-between" style="width: 100%">
                <div></div>
                <div>
                  설계번호: ${tempInsStockNo}
                  <!-- 증권번호 입력 -->
                </div>
              </div>
              <div class="flex justify-between" style="width: 100%">
                <div style="flex: 1">P-6421-2403-0862</div>
                <div style="flex: 1; text-align: center">1 / 1</div>
                <div style="flex: 1; text-align: right">GCAB656RP</div>
              </div>
            </footer>
          </div>
        </div>
        <!-- page_wrap -->
      </div>
      <!-- page -->
    `;
  }
};

module.exports = {
  rateQuotation,
};
