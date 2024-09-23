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

const costNotice = (data) => {
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
    instalmentNo,
    productType,
    highRiskProducts,
    responseList,
    insCostNoticeData,
  } = data;

  let realPhNm = '(주)넥솔';
  realPhNm = '(주)우리카드';
  if (joinAccount == 'SK엠앤서비스') {
    realPhNm = 'SK엠앤서비스(주)';
  }

  const responseArray = [];
  for (
    let responseIndex = 0;
    responseIndex < responseList.length;
    responseIndex++
  ) {
    const responseElement = responseList[responseIndex];
    responseArray.push(responseElement.answerId);
  }

  let guaranteeText = ``;
  if (insCostNoticeData[0]?.guarantee1JoinCd == '1') {
    guaranteeText += `1&#41; 기업중대사고 배상책임보험 보통약관<br />`;
  }
  if (insCostNoticeData[0]?.guarantee2JoinCd == '1') {
    guaranteeText += `2&#41; 징벌적 손해배상책임 특별약관<br />`;
  }
  if (insCostNoticeData[0]?.guarantee3JoinCd == '1') {
    guaranteeText += `3&#41; 중대사고 형사방어비용 특별약관 : 사고당/총보상한도액의 30%를 한도로 보상<br />`;
  }
  if (insCostNoticeData[0]?.guarantee4JoinCd == '2') {
    guaranteeText += `4&#41; 중대( )재해만을 위한 보장 특별약관 - (중대산업재해)<br />`;
  } else if (insCostNoticeData[0]?.guarantee4JoinCd == '3') {
    guaranteeText += `4&#41; 중대( )재해만을 위한 보장 특별약관 - (중대시민재해)<br />`;
  } else if (
    insCostNoticeData[0]?.guarantee4JoinCd != '2' &&
    insCostNoticeData[0]?.guarantee4JoinCd != '3'
  ) {
    guaranteeText += `4&#41; 중대( )재해만을 위한 보장 특별약관 - (중대산업재해 + 중대시민재해)<br />`;
  }
  if (insCostNoticeData[0]?.guarantee5JoinCd == '1') {
    guaranteeText += `5&#41; 기업 중대사고 위기관리실행비용Ⅰ 특별약관 : 사고당/총보상한도액의 5%를 한도로 보상(단, 사고당 1억원을 초과하지 않음)<br />`;
  } else if (insCostNoticeData[0]?.guarantee5JoinCd == '2') {
    guaranteeText += `5&#41; 기업 중대사고 위기관리실행비용Ⅱ 특별약관 : 사고당/총보상한도액의 5%를 한도로 보상(단, 사고당 1억원을 초과하지 않음)<br />`;
  }
  if (insCostNoticeData[0]?.guarantee6JoinCd == '1') {
    guaranteeText += `6&#41; 민사상 손해배상책임 부담보 특별약관<br />`;
  }
  if (insCostNoticeData[0]?.guarantee7JoinCd == '1') {
    guaranteeText += `7&#41; 날짜인식오류 보상제외 특별약관<br />`;
  }
  if (insCostNoticeData[0]?.guarantee8JoinCd == '1') {
    guaranteeText += `8&#41; 제재위반 부보장 특별약관<br />`;
  }
  if (insCostNoticeData[0]?.guarantee9JoinCd == '1') {
    guaranteeText += `9&#41; 테러행위 면책 특별약관<br />`;
  }
  if (insCostNoticeData[0]?.guarantee10JoinCd == '1') {
    guaranteeText += `10&#41; 정보기술 특별약관(사이버위험 보상제외 특별약관)<br />`;
  }
  if (insCostNoticeData[0]?.guarantee11JoinCd == '1') {
    guaranteeText += `11&#41; 날짜인식오류 부보장 추가약관<br />`;
  }
  if (insCostNoticeData[0]?.guarantee12JoinCd == '1') {
    guaranteeText += `12&#41; [LMA5399]전염병 면책 특별약관Ⅱ`;
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

  let payInsCost = 0;
  if (instalmentNo == 2) {
    payInsCost = insCostNoticeData[0]?.biannualInsCost;
  } else if (instalmentNo == 4) {
    payInsCost = insCostNoticeData[0]?.quarterlyInsCost;
  } else {
    payInsCost = insCostNoticeData[0]?.singleInsCost;
  }

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
                보험료 안내문
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
                <th style="text-align: center">문서번호</th>
                <td>
                  <div class="flex justify-between">
                    특종업무파트
                    <div>${dayjs(premCmptDt).format('YYYY. M. D.')}<!-- 보험료 안내문 발송일자 --></div>
                  </div>
                </td>
              </tr>
              <tr>
                <th style="text-align: center">수&emsp;&emsp;&emsp;신</th>
                <td>${realPhNm}</td>
              </tr>
              <tr>
                <th style="text-align: center">참&emsp;&emsp;&emsp;조</th>
                <td></td>
              </tr>
              <tr>
                <th style="text-align: center">제&emsp;&emsp;&emsp;목</th>
                <td style="font-weight: 900">
                  기업중대사고 배상책임보험 보험료 안내문
                </td>
              </tr>
            </tbody>
          </table>

          <div style="text-align: left; font-size: 11pt; padding: 20mm 10mm">
            <p style="margin-bottom: 10mm">
              1. 귀사의 무궁한 발전을 기원합니다.
            </p>
            <p style="margin-bottom: 10mm">
              2. 귀사에서 가입하고자 하시는 보험의 보험료를 첨부와 같이
              안내하오니 검토하시어 귀사의 의견을 회신하여 주시기 바랍니다.
            </p>
            <p style="margin-bottom: 20mm">
              3. 고객님을 위하여 항상 최선을 다하겠습니다.
            </p>
            <p># 첨부 : 보험료 안내문 1부</p>
          </div>
        </div>
        <!-- content_wrap -->

        <footer style="margin-top: auto">
          <div style="text-align: right; margin-bottom: 5mm">
            <img
              src="https://insboon-assets.s3.ap-northeast-2.amazonaws.com/db/sign_db_ceo.png"
              width="190mm"
            />
          </div>
          <div
            class="flex justify-between"
            style="
              width: 100%;
              border-top: 0.55mm solid rgba(0, 133, 74, 1);
              padding-top: 1mm;
            "
          >
            <div></div>
            <div>
              설계번호: ${tempInsStockNo}
              <!-- 증권번호 -->
            </div>
          </div>
          <div class="flex justify-between" style="width: 100%">
            <div style="flex: 1">P-6421-2403-0862</div>
            <div style="flex: 1; text-align: center">1 / 2</div>
            <div style="flex: 1; text-align: right">GCAB656RP</div>
          </div>
        </footer>
      </div>
      <!-- page_wrap -->
    </div>
    <!-- page -->

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
                보험료 안내문
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
                <td>${phNm} ${phBizNo !== null && phBizNo != '' ? '(' + bizFomatter(phBizNo) + ')' : ''}<!-- 계약자 --></td>
              </tr>
              <tr>
                <th>3. 피보험자</th>
                <td>${insuredFranNm} (${bizFomatter(insuredBizNo)})<!-- 피보험자 --></td>
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
                  - 업종: ${ccaliBizLargeTypeNm}-${ccaliBizTypeNm}<!-- 업종 --><br />
                  - 매출액: ${costFomatter(salesCost)}<!-- 매출액 -->원<br />
                  - 근로자수: ${costFomatter(totEmployeeCnt)}<!-- 근로자수 -->명<br />
                  - 연임금 총액: ${costFomatter(totAnnualWages)}<!-- 연임금총액 -->원<br />
                  <div class="flex">
                    * 자회사 담보 (
                    <!-- 자회사 담보 여부 check -->
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
                <td>${guaranteeRegionCd == 'W' ? guaranteeRegionNm : '한국'}</td>
              </tr>
              <tr>
                <th>9. 재판관할권</th>
                <td>한국</td>
              </tr>
              <tr>
                <th>10. 보험조건</th>
                <td>
                  <div>
                    ${guaranteeText}
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
                <th>13. 보험료</th>
                <td>
                  KRW ${costFomatter(Number(payInsCost))}
                  <!-- 요율제시서상 보험료  ex)10,000,000 -->
                </td>
              </tr>
              <tr>
                <th>14. 유효기간</th>
                <td>안내일로부터 15일</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- content_wrap -->

        <footer style="margin-top: auto">
          <div
            class="flex justify-between"
            style="
              width: 100%;
              border-top: 0.55mm solid rgba(0, 133, 74, 1);
              padding-top: 1mm;
            "
          >
            <div></div>
            <div>
              설계번호: ${tempInsStockNo}
              <!-- 증권번호 -->
            </div>
          </div>
          <div class="flex justify-between" style="width: 100%">
            <div style="flex: 1">P-6421-2403-0862</div>
            <div style="flex: 1; text-align: center">2 / 2</div>
            <div style="flex: 1; text-align: right">GCAB656RP</div>
          </div>
        </footer>
      </div>
      <!-- page_wrap -->
    </div>
    <!-- page -->
    `;
};

module.exports = {
  costNotice,
};
