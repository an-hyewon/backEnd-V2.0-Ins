/**
 * 50인 미만 질문서 Body Element
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

// 법인등록번호 포맷형식으로 변환
const corpFomatter = (num) => {
  let formatNum = '';
  if (num.length === 13) {
    formatNum = num.replace(/(\d{6})(\d{7})/, '$1-$2');
  } else {
    formatNum = num;
  }
  return formatNum;
};

const questionUnder = (data) => {
  const {
    id,
    insProdCd,
    insProdFullNm, // 보험상품명 전체
    insProdTermsUrl,
    insJoinFileUrl,
    insStockNo,
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

  const joinYear = dayjs(joinYmd).format('YYYY');
  const joinMonth = dayjs(joinYmd).format('MM');
  const joinDay = dayjs(joinYmd).format('DD');

  const responseArray = [];
  for (
    let responseIndex = 0;
    responseIndex < responseList.length;
    responseIndex++
  ) {
    const responseElement = responseList[responseIndex];
    responseArray.push(responseElement.answerId);
  }

  if (insComCd == 'MR') {
    return `
      <div id="page">
        <div class="page_wrap">
          <header>
            <div style="text-align:right;"">
              <img src="https://insboon-assets.s3.ap-northeast-2.amazonaws.com/meritz/logo_meritz_korean.png" alt="메리츠화재" width="145" height="72" style="margin: -0.5mm -0.8mm 0 0" />
            </div>  
          </header>

          <div class="content_wrap" style="padding:3mm 0 0 0">
            <div style="font-size:19pt; font-weight: 700; text-align: center; border-top:0.6mm solid #000; border-bottom:0.6mm solid #000; background:#F2F2F2; padding:2mm 0; margin-top:4mm; letter-spacing: 0.3mm; margin-bottom:0.3mm;">
              기업 중대사고 배상책임보험_보험가입용 설문서
            </div>
            <div class="gulim" style="font-size: 11pt; font-weight: 900; line-height: 1.6; letter-spacing: -0.23mm;">보험증권 발행 시 본 질문은 보험증권에 첨부되어 보험증권의 일부를 구성하므로 반드시 모든 질문에 답해주십시오. 필요할 경우 별도의 용지를 사용하십시오.</div>

            <h2><span style="font-size:10pt;">Ⅰ</span>. 일반사항 (담보지역 기준)</h2>

            <div style="padding-left:1mm;">
              <table class="gulim first_table" style="letter-spacing: 0.3mm;">
                <colgroup>
                  <col style="width: 26%" />
                  <col style="width: 12%" />
                  <col style="width: 22%" />
                  <col style="width: 16%" />
                  <col style="width: 24%" />
                </colgroup>
                <tbody>
                  <tr>
                    <td>1.&ensp;상&emsp;&emsp;&emsp;&nbsp;호</td>
                    <td colspan="3">(한글)${insuredFranNm}</td>
                    <td>(대표자)${phNm}</td>
                  </tr>
                  <tr>
                    <td>2.&ensp;본점 소재지</td>
                    <td colspan="4">${insuredAddress}</td>
                  </tr>
                  <tr>
                    <td>3.&ensp;사업자및법인번호</td>
                    <td colspan="4">${bizFomatter(insuredBizNo)}</td>
                  </tr>
                  <tr>
                    <td>4.&ensp;법인 국적</td>
                    <td colspan="4">${insuredCorpNationality == null ? '' : insuredCorpNationality}</td>
                  </tr>
                  <tr>
                    <td style="padding:1mm 2mm">5.&ensp;법인 설립일</td>
                    <td style="padding:1mm 2mm" colspan="4">${insuredCorpFoundationYmd == null ? '' : dayjs(insuredCorpFoundationYmd).format('YYYY.MM.DD')}</td>
                  </tr>
                  <tr>
                    <td><div class="flex items-center">6.&ensp;연간 매출액<span style="font-size:6pt; font-weight: 900;">＊</span></div></td>
                    <td colspan="4">${costFomatter(salesCost)}</td>
                  </tr>
                  <tr>
                    <td>7.&ensp;사업자번호</td>
                    <td colspan="4">${bizFomatter(insuredBizNo)}</td>
                  </tr>
                  <tr>
                    <td>8.&ensp;법인번호</td>
                    <td colspan="4">${insuredCorpNo == null ? '' : corpFomatter(insuredCorpNo)}</td>
                  </tr>
                  <tr>
                    <td rowspan="5">9.&ensp;해당업종 (필수)</td>
                    <td style="text-align: center;">구분</td>
                    <td style="text-align: center;" colspan="3">업&ensp;종&ensp;구&ensp;분</td>
                  </tr>
                  <tr>
                    <td rowspan="2" style="text-align: center; line-height: 1.8em;">
                      업종<br/>
                      (대분류)
                    </td>
                    <td>(산재가입) 기준</td>
                    <td colspan="2">${ccaliBizLargeTypeNm}</td>
                  </tr>
                  <tr>
                    <td>(국세청) 기준</td>
                    <td colspan="2">${ntsBizLargeTypeNm}</td>
                  </tr>
                  <tr>
                    <td rowspan="2" style="text-align: center; line-height: 1.8em;">
                      업종<br/>
                      (소분류)
                    </td>
                    <td>(산재가입) 기준</td>
                    <td colspan="2">${ccaliBizTypeNm}</td>
                  </tr>
                  <tr>
                    <td>(국세청) 기준</td>
                    <td colspan="2">${ntsBizTypeNm}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style="margin-top: 1mm;">* 연간 매출액 : 재무제표상 총매출액 기준, 단 중앙행정기관 및 지방자치단체인 경우 프로그램총원가(사업 총원가)</p>

            <h2><span style="font-size:10pt;">Ⅱ</span>. 근로자 정보 (담보지역 기준)</h2>
            <div style="padding-left:1mm;">
              <table class="gulim">
                <colgroup>
                  <col style="width: 28%" />
                </colgroup>
                <tbody>
                  <tr>
                    <th>1.&ensp;소속 근로자 수</th>
                    <td>${costFomatter(regularEmployeeCnt)}</td>
                  </tr>
                  <tr>
                    <th><div class="flex items-center">2.&ensp;소속 외 근로자 수<span style="font-size:6pt; font-weight: 900;">＊</span></div></th>
                    <td>${costFomatter(dispatchedEmployeeCnt + subcontractEmployeeCnt)}</td>
                  </tr>
                  <tr>
                    <th>3.&ensp;총 근로자 수</th>
                    <td>${costFomatter(totEmployeeCnt)}</td>
                  </tr>
                  <tr>
                    <th><div class="flex items-center">4.&ensp;연임금 총액<span style="font-size:6pt; font-weight: 900;">＊</span></div></th>
                    <td>${costFomatter(totAnnualWages)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style="margin-top: 0.5mm;">* 소속 외 근로자: 보험가입 사업주가 사업(장)에서 사용하는 다른 사업주 소속의 파견, 하도급 용역 등의 근로자</p>
            <p style="margin-top: 1.5mm;">* 연임금 총액: 소속 근로자수 임금총액을 원칙으로 하되, 소속 외 근로자수 포함인 경우에는 해당 <span style="font-size: 9pt;">기준을 명기</span></p>            
          </div>
          <!-- content_wrap -->
          <footer style="margin-top: auto;">
              <div style="text-align: center; margin-bottom:5mm;">1/6</div>
              <div style="height:3mm; background:linear-gradient(90deg, black, white)"></div>
          </footer>
        </div>
        <!-- page_wrap -->
      </div>
      <!-- page -->

      <div id="page">
        <div class="page_wrap">
          <header>
            <div style="text-align:right;"">
              <img src="https://insboon-assets.s3.ap-northeast-2.amazonaws.com/meritz/logo_meritz_korean.png" alt="메리츠화재" width="145" height="72" style="margin: -0.5mm -0.8mm 0 0" />
            </div>  
          </header>

          <div class="content_wrap" style="padding:1mm 0 0 0">
            <h2 style="margin:0"><span style="font-size:10pt;">Ⅲ</span>. 중대산업재해 추가 정보</h2>

            <p style="margin: 1mm 0;">* 각 항목별 해당되는 ‘체크사항’에 체크하여 주십시오</p>

            <div style="padding-left:1mm;">
              <table class="check_table">
                <colgroup>
                  <col style="width: 24%" />
                  <col style="width: 47%" />
                  <col style="width: 23%" />
                  <col style="width: 6%" />
                </colgroup>
                <tbody>
                  <tr>
                    <th>구 분</th>
                    <th>내 용</th>
                    <th colspan="2">체크사항</th>
                  </tr>
                  <tr>
                    <td rowspan="4">(1) 관련법 위반</td>
                    <td rowspan="4" class="leading-7">
                        최근3년내 산업안전보건법 또는<br/>
                        중대재해처벌법(산업재해) 위반 여부
                    </td>
                    <td class="text-center">없음</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">1회</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">2회</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">3회 이상</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td rowspan="4">(2) 소송 여부</td>
                    <td rowspan="4" class="leading-7">
                        현재 산업안전보건법 또는<br/>
                        중대재해처벌법 관련 계류중인 소송 여부
                    </td>
                    <td class="text-center">없음</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">1회</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">2회</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">3회 이상</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td rowspan="4">(3) 산재 사망</td>
                    <td rowspan="4" class="leading-7">
                        최근 3년내 산업재해 관련 사망자 여부<br/>
                        (3년 누적기준)
                    </td>
                    <td class="text-center">없음</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">3명 이하</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">10명 이하</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">11명 이상</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td rowspan="4">(4) 산재 부상</td>
                    <td rowspan="4" class="leading-7">
                        최근 3년내 산업재해 관련 부상인원 여부<br/>
                        (3년 누적기준)
                    </td>
                    <td class="text-center">10명 이하</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">30명 이하</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">50명 이하</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">51명 이상</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td rowspan="4">(5) 산재 질병</td>
                    <td rowspan="4" class="leading-7">
                        최근 3년내 산업재해 관련 질병 인원 여부<br/>
                        (3년 누적기준)
                    </td>
                    <td class="text-center">5명 이하</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">10명 이하</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">20명 이하</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">21명 이상</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td rowspan="4">(6) 근로자 연령</td>
                    <td rowspan="4">
                      전체근로자 중 60대 이상 근로자 비중
                    </td>
                    <td class="text-center">20% 미만</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">30% 미만</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">40% 미만</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">40% 이상</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td rowspan="4">(7) 근로성숙도
                      <div style="margin:1mm 0 0 7mm">(1년)</div>
                    </td>
                    <td rowspan="4">
                      전체근로자 중 1년 미만 근로자 비중
                    </td>
                    <td class="text-center">10% 미만</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">15% 미만</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">20% 미만</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">20% 이상</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td rowspan="4">(8) 직원 안전교육</td>
                    <td rowspan="4">
                      산업안전보건법 대비 교육시간
                    </td>
                    <td class="text-center">3배 이상</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">2배 이상</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">1배 초과</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">1배 이하</td>
                    <td class="check_td"></td>
                  </tr>
                </tbody>
              </table>
            </div>          
          </div>
          <!-- content_wrap -->
          <footer style="margin-top: auto;">
              <div style="text-align: center; margin-bottom:5mm;">2/6</div>
              <div style="height:3mm; background:linear-gradient(90deg, black, white)"></div>
          </footer>
        </div>
        <!-- page_wrap -->
      </div>
      <!-- page -->

      <div id="page">
        <div class="page_wrap">
          <header>
            <div style="text-align:right;"">
              <img src="https://insboon-assets.s3.ap-northeast-2.amazonaws.com/meritz/logo_meritz_korean.png" alt="메리츠화재" width="145" height="72" style="margin: -0.5mm -0.8mm 0 0" />
            </div>  
          </header>

          <div class="content_wrap" style="padding:1mm 0 0 0">
            <div style="padding-left:1mm;">
              <table class="check_table">
                <colgroup>
                  <col style="width: 24%" />
                  <col style="width: 47%" />
                  <col style="width: 23%" />
                  <col style="width: 6%" />
                </colgroup>
                <tbody>
                  <tr>
                    <td rowspan="4">(9) 외주 안전교육</td>
                    <td rowspan="4" class="leading-7">
                        하청직원 작업 전<br/>
                        (1) 안전교육 실시, (2) 점검표 작성
                    </td>
                    <td class="text-center">실시O, 작성O</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">실시O, 작성X</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">실시X, 작성O</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">실시X, 작성X</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td rowspan="4">(10) 자율점검표</td>
                    <td rowspan="4">
                      자율점검표 작성 및 긍정 비중
                    </td>
                    <td class="text-center" style="font-size:8.5pt;">긍정비율 90% 이상</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center" style="font-size:8.5pt;">긍정비율 70% 이상</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center" style="font-size:8.5pt;">긍정비율 50% 이상</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center" style="font-size:8.5pt;">긍정비율 50% 미만</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td rowspan="4" class="leading-7">(11) 하청 근로자 &ensp;&ensp;비중</td>
                    <td rowspan="4">
                      전체 근로자 대비 외부하청 근로자 비중
                    </td>
                    <td>10% 미만</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td>20% 미만</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td>30% 미만</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td>30% 이상</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td rowspan="4" class="leading-7">(12) 안전보건점검 &ensp;&ensp;횟수</td>
                    <td rowspan="4">
                      보건 및 안전관리에 대한 자율점검*
                    </td>
                    <td>1년에 4회 이상</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td>1년에 3회</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td>1년에 2회</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td>1년에 1회</td>
                    <td class="check_td"></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div style="padding:1mm 0 0 1mm">
              <div style="margin-bottom:1mm;">*자율 점검표</div>
              <ol class="number-list" style="padding-left: 6mm;">
                <li>고용노동부 제공 자율점검표를 우선 적용하고, 해당 업종은 업종 우선
                  <ul class="hyphen-list">
                    <li>폐기물처리업 자율점검표, 창고및운수업 자율점검표, 건설업 자율점검표</li>
                    <li>중소기업 안전보건관리 자율점검표, 안전보건관리체계 구축 가이드북</li>
                  </ul>
                </li>
                <li>기업자체 자율점검표는 평가항목이 50개 이상인 것만 인정합니다.	<br/>
                        (문서화가 되어 있어야 하며, Y/N 등 최소 평가기준 충족 필요)
                  </li>
              </ol>
            </div>

            <h2 style="margin-bottom:0"><span style="font-size:10pt;">Ⅳ</span>. 중대시민재해 추가 정보</h2>

            <p style="margin: 1mm 0;">* 각 항목별 해당되는 ‘체크사항’에 체크하여 주십시오</p>

            <div style="padding-left:1mm;">
              <table class="check_table">
                <colgroup>
                  <col style="width: 24%" />
                  <col style="width: 47%" />
                  <col style="width: 23%" />
                  <col style="width: 6%" />
                </colgroup>
                <tbody>
                  <tr>
                    <th>구 분</th>
                    <th>내 용</th>
                    <th colspan="2">체크사항</th>
                  </tr>
                  <tr>
                    <td rowspan="4">(1) 관련법* 위반</td>
                    <td rowspan="4" class="leading-7">
                      최근 3년내 관련법* 또는<br/>
                      중대재해처벌법 위반 여부
                    </td>
                    <td class="text-center">없음</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">1회</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">2회</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">3회 이상</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td rowspan="4">(2) 소송 여부</td>
                    <td rowspan="4" class="leading-7">
                      현재 관련법 또는 중대재해처벌법 관련<br/>
                      계류중인 소송 여부
                    </td>
                    <td class="text-center">없음</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">1건</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">2건</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">3건 이상</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td rowspan="2">(3) 시민 사망</td>
                    <td rowspan="2">
                      최근 3년내 시민재해 관련 사망자 여부
                    </td>
                    <td class="text-center">없음</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">3명 이하</td>
                    <td class="check_td"></td>
                  </tr>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- content_wrap -->
          <footer style="margin-top: auto;">
              <div style="text-align: center; margin-bottom:5mm;">3/6</div>
              <div style="height:3mm; background:linear-gradient(90deg, black, white)"></div>
          </footer>
        </div>
        <!-- page_wrap -->
      </div>
      <!-- page -->

      <div id="page">
        <div class="page_wrap">
          <header>
            <div style="text-align:right;"">
              <img src="https://insboon-assets.s3.ap-northeast-2.amazonaws.com/meritz/logo_meritz_korean.png" alt="메리츠화재" width="145" height="72" style="margin: -0.5mm -0.8mm 0 0" />
            </div>  
          </header>

          <div class="content_wrap" style="padding:1mm 0 0 0">
            <div style="padding-left:1mm;">
              <table class="check_table">
                <colgroup>
                  <col style="width: 24%" />
                  <col style="width: 47%" />
                  <col style="width: 23%" />
                  <col style="width: 6%" />
                </colgroup>
                <tbody>
                  <tr>
                    <td rowspan="2"></td>
                    <td rowspan="2"></td>
                    <td class="text-center">10명 이하</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">11명 이상</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td rowspan="4">(4) 시민 부상</td>
                    <td rowspan="4" class="leading-7">
                      최근 3년내 시민재해 관련 부상 인원<br/> 여부
                    </td>
                    <td class="text-center">10명 이하</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">30명 이하</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">50명 이하</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">51명 이상</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td rowspan="4" class="leading-7">(5) 시민 질병</td>
                    <td rowspan="4" class="leading-7">
                      최근 3년내 시민지해 관련 질병 인원<br/>
                      여부
                    </td>
                    <td class="text-center">5명 이하</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">10명 이하</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">20명 이하</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">21명 이상</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td rowspan="4" class="leading-7">(6) 조직 및 인원</td>
                    <td rowspan="4">
                      중대시민재해를 전담하는 조직 여부
                    </td>
                    <td class="text-center" style="font-size:8pt;">전담부서, 전담직원 O</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center" style="font-size:8pt;">겸직부서, 전담직원 O</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center" style="font-size:8pt;">겸직부서, 겸직직원 O</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center" style="font-size:8pt;">해당 없음</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td rowspan="4" class="leading-7">(7) 안전보건점검 &ensp;&ensp;횟수</td>
                    <td rowspan="4">
                      보건 및 안전관리에 대한 자율점검*
                    </td>
                    <td class="text-center">1년에 4회 이상</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">1년에 3회</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">1년에 2회</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center">1년에 1회</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td rowspan="4" class="leading-7">(8) 모의훈련</td>
                    <td rowspan="4">
                      응급사태 매뉴얼 보유 및 모의 훈련 실시
                    </td>
                    <td class="text-center" style="font-size:8pt;">매뉴얼 O, 훈련 O</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center" style="font-size:8pt;">매뉴얼 X, 훈련 O</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center" style="font-size:8pt;">매뉴얼 O, 훈련 X</td>
                    <td class="check_td"></td>
                  </tr>
                  <tr>
                    <td class="text-center" style="font-size:8pt;">매뉴얼 X, 훈련 X</td>
                    <td class="check_td"></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="leading-7" style="padding:1mm 0 0 2mm; font-size:9pt; letter-spacing: 0.35mm;">
              <div style="margin-bottom:1mm;">* 관련법 범위: 제조물책임법, 실내공기질관리법, 시설물의 안전 및 유지관리에 관한 특별법, 다중이<br/>&ensp;&ensp;&ensp;용업소의 안전관리에 관한 특별법</div>
              <div style="margin-bottom:1mm;">*자율 점검표</div>
              <ol class="number-list" style="padding-left: 6mm;">
                <li>공공기관에서 만든 안전관리 점검표를 우선 적용합니다.
                  <ul class="hyphen-list">
                    <li>환경부 제공, 중대재해처벌법 해설, 중대시민재해(원료, 제조물) 점검표</li>
                    <li>국토교통부 제공, 중대재해처벌법 해설, 중대시민재해(시설물) 점검표</li>
                    <li>다중이용업소 안전관리 등 세부점검표, 다중이용업소 실내공기질 점검표</li>
                    <li>다중이용업소의 안전관리에 관한 특별법 시행규칙 별지제10호 서식</li>
                    <li>고용노동부 제공, 자율점검표, 폐기물처리업 자율점검표</li>
                    <li>창고 및 운수업 자율점검표, 건설업 자율점검표, 중소기업안전보건관리 자율점검표</li>
                    <li>안전보건관리체계 구축 가이드북</li>
                  </ul>
                </li>
                <li>기업자체 자율점검표는 평가항목이 50개 이상인 것만 인정됩니다.<br/>
                  (문서화가 되어 있어야 하며, Y/N 등 최소 평가기준 충족 필요)              
                  </li>
              </ol>
            </div>
          </div>
          <!-- content_wrap -->
          <footer style="margin-top: auto;">
              <div style="text-align: center; margin-bottom:5mm;">4/6</div>
              <div style="height:3mm; background:linear-gradient(90deg, black, white)"></div>
          </footer>
        </div>
        <!-- page_wrap -->
      </div>
      <!-- page -->

      <div id="page">
        <div class="page_wrap">
          <header>
            <div style="text-align:right;"">
              <img src="https://insboon-assets.s3.ap-northeast-2.amazonaws.com/meritz/logo_meritz_korean.png" alt="메리츠화재" width="145" height="72" style="margin: -0.5mm -0.8mm 0 0" />
            </div>  
          </header>

          <div class="content_wrap" style="padding:1mm 0 0 0">
            <div style="font-size: 10pt;">※ 업종 대분류가 제조업인 경우 아래 내용을 추가로 기재하여 주시기 바랍니다.</div>
            <div style="padding-left: 7mm;">
              <table>
                <colgroup>
                  <col style="width: 29%" />
                </colgroup>
                <tbody>
                  <tr>
                    <td class="text-center">구&ensp;분</td>
                    <td class="text-center">내용</td>
                  </tr>
                  <tr>
                    <td class="text-center">제품 및 원재료명</td>
                    <td class="text-center">${productType == null ? '' : productType}</td>
                  </tr>
                  <tr>
                    <td class="text-center leading-7">
                      고위험 품목 포함여부<br/>
                      (해당란에 반드시 V자<br/>
                      표시해주시기 바랍니다)
                    </td>
                    <td class="text-center">
                      <div class="flex" style="margin-bottom:1mm;">
                        <div class="checkbox_wrap" style="margin-right: 6mm;">
                          <div class="checkbox ${highRiskProducts.includes('항공기 및 관련 부품') ? 'checked' : ''}"></div>
                          <p style="letter-spacing: 0.5mm;">항공기 및 관련 부품,</p>
                        </div>
                        <div class="checkbox_wrap">
                          <div class="checkbox ${highRiskProducts.includes('완성차 및 관련 부품') ? 'checked' : ''}"></div>
                          <p style="letter-spacing: 0.5mm;">완성차 및 관련 부품</p>
                        </div>
                      </div>
                      <div class="flex" style="margin-bottom:1mm;">
                        <div class="checkbox_wrap" style="margin-right: 6mm;">
                          <div class="checkbox ${highRiskProducts.includes('타이어') ? 'checked' : ''}"></div>
                          <p style="letter-spacing: 0.5mm;">타이어,</p>
                        </div>
                        <div class="checkbox_wrap" style="margin-right: 6mm;">
                          <div class="checkbox ${highRiskProducts.includes('헬멧') ? 'checked' : ''}"></div>
                          <p style="letter-spacing: 0.5mm;">헬멧,</p>
                        </div>
                        <div class="checkbox_wrap" style="margin-right: 6mm;">
                          <div class="checkbox ${highRiskProducts.includes('철도 및 철로용 신호장치') ? 'checked' : ''}"></div>
                          <p style="letter-spacing: 0.5mm;">철도 및 철로용 신호장치,</p>
                        </div>
                      </div>
                      <div class="flex" style="margin-bottom:1mm;">
                        <div class="checkbox_wrap" style="margin-right: 3mm;">
                          <div class="checkbox ${highRiskProducts.includes('의약품 및 체내이식형 의료기기') ? 'checked' : ''}"></div>
                          <p style="letter-spacing: 0.5mm;">의약품 및 의료기기,</p>
                        </div>
                        <div class="checkbox_wrap" style="margin-right: 3mm;">
                          <div class="checkbox ${highRiskProducts.includes('담배') ? 'checked' : ''}"></div>
                          <p style="letter-spacing: 0.5mm;">담배,</p>
                        </div>
                        <div class="checkbox_wrap">
                          <div class="checkbox ${highRiskProducts.includes('혈액 및 인체추출 물질') ? 'checked' : ''}"></div>
                          <p style="letter-spacing: 0.5mm;">혈액 등 인체추출 물질,</p>
                        </div>
                      </div>
                      <div class="flex" >
                        <div class="checkbox_wrap" style="margin-right:2mm;">
                          <div class="checkbox ${highRiskProducts.includes('농약 및 제초제') ? 'checked' : ''}"></div>
                          <p style="letter-spacing: 0.5mm;">농약및제초제,</p>
                        </div>
                        <div class="checkbox_wrap">
                          <div class="checkbox ${highRiskProducts.includes('폭죽, 탄약, 화약 등 폭발 용도로 사용되는 제품') ? 'checked' : ''}"></div>
                          <p style="letter-spacing: 0.2mm;">폭죽,탄약,화약 등 폭발용도로 사용되는 제품</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2><span style="font-size:10pt;">Ⅴ</span>. 자회사 현황</h2>

            <table class="gulim" style="margin-bottom:8mm">
              <colgroup>
                <col style="width: 50%" />
              </colgroup>
              <tbody>
                <tr>
                  <th>자회사 담보여부</th>
                  <td><div class="flex justify-between" style="padding-right: 5mm;">담보 (<span></span>), 부담보 (<span>✔</span>)</div></td>
                </tr>
              </tbody>
            </table>

            <div class="gulim" style="font-size: 10pt;"><span style="font-size: 8pt;">✽</span>자회사 담보시, 그 세부현황을 기재해주십시오.</div>
            <table class="gulim" style="margin-bottom:1mm">
              <colgroup>
                <col style="width: 11%" />
                <col style="width: 10%" />
                <col style="width: 15%" />
                <col style="width: 17%" />
                <col style="width: 12%" />
                <col style="width: 15%" />
                <col style="width: 10%" />
                <col style="width: 10%" />
              </colgroup>
              <tbody>
                <tr>
                  <th style="font-size:9pt" class="text-center">자회사명</th>
                  <th style="font-size:9pt" class="text-center">소재지</th>
                  <th style="font-size:9pt" class="text-center leading-7">업종 분류<br/>
                  (산재 기준)</th>
                  <th style="font-size:9pt" class="text-center leading-7">업종 분류<br/>
                    (국세청 기준)</th>
                  <th style="font-size:9pt" class="text-center leading-7">
                    소속<br/>
                    근로자수
                  </th>
                  <th style="font-size:9pt" class="text-center leading-7">
                    소속 외<br/>
                    근로자수
                  </th>
                  <th style="font-size:9pt" class="text-center leading-7">
                    연임금<br/>
                    총액
                  </th>
                  <th style="font-size:9pt" class="text-center">
                    매출액
                  </th>
                </tr>
                <tr>
                  <td>&nbsp;</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>&nbsp;</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            <div class="leading-7" style="font-size: 9pt; letter-spacing: 0.35mm;">
              * 자회사: 직접적이든 또는 다른 자회사를 통한 간접이든 관계없이 법인이 발행한 주식(의결권이 없는<br/>
              &ensp;&ensp;주식은 제외합니다.) 총수의 50%를 초과하는 주식을 소유하고 있는 법인을 말합니다
            </div>

            <h2 style="margin-top: 8mm;"><span style="font-size:10pt;">Ⅵ</span>. 지배/운영/관리하는 공중이용시설 또는 공중교통수단 여부</h2>
            <table class="gulim" style="margin-bottom:2mm">
              <colgroup>
                <col style="width: 26%" />
                <col style="width: 33%" />
                <col style="width: 39%" />
              </colgroup>
              <tbody>
                <tr>
                  <th>공중이용시설</th>
                  <td colspan="2">
                    <div class="flex" style="padding-left: 4mm;">(<span class="text-center" style="width: 28mm;"></span>)개소</div>
                  </td>
                </tr>
                <tr>
                  <th>공중교통수단</th>
                  <td>
                    <div class="flex" style="padding-left: 4mm;">(<span class="text-center" style="width: 28mm;"></span>)대</div>
                  </td>
                  <td>
                    <div class="flex justify-between" style="padding:0 3mm">
                      <span>담보여부:</span>
                      <div class="checkbox_wrap">
                        <div class="checkbox"></div>
                        <p>예</p>
                      </div>
                      <div class="checkbox_wrap">
                        <div class="checkbox"></div>
                        <p>아니오</p>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div style="font-size:8.5pt; letter-spacing: 0.3mm;">
              <div class="gulim" style="margin-bottom:3mm;">
                *공중이용시설 및 공중교통수단 : 중대재해처벌법 제2조 4항, 5항에 따른 시설과 수단을 말합니다.
              </div>
              <div class="gulim">
                *공중교통수단으로 인한 사고를 보장받으시려면, 해당 특약의 가입이 필요합니다.
              </div>
            </div>

            <h2 style="margin-top: 8mm; margin-bottom:1mm"><span style="font-size:10pt;">Ⅶ</span>. 보험가입경력</h2>
            <div class="gulim leading-7" style="font-size:9pt; letter-spacing: 0.39mm;">
              현재 귀사가 근로자재해보장책임보험, 영업배상책임보험(CGL포함), 임원배상책임보험 또는 이와 유사한 보험에 가입중인 경우, 아래 내용을 기재해 주십시오.
            </div>
            <table class="gulim" style="margin-bottom:2mm">
              <colgroup>
                <col style="width: 16%" />
                <col style="width: 16%" />
                <col style="width: 16%" />
                <col style="width: 16%" />
                <col style="width: 16%" />
                <col style="width: 16%" />
              </colgroup>
              <tbody>
                <tr>
                  <th class="text-center">보험상품명</th>
                  <th class="text-center">보험사</th>
                  <th class="text-center">보험기간</th>
                  <th class="text-center">보상한도</th>
                  <th class="text-center">공제금액</th>
                  <th class="text-center">보험료</th>
                </tr>
                <tr>
                  <td>&nbsp;</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>&nbsp;</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>

            <h2 style="margin-top: 8mm; margin-bottom:1mm"><span style="font-size:10pt;">Ⅷ</span>. 과거의 사고사항</h2>
          </div>
          <!-- content_wrap -->
          <footer style="margin-top: auto;">
              <div style="text-align: center; margin-bottom:5mm;">5/6</div>
              <div style="height:3mm; background:linear-gradient(90deg, black, white)"></div>
          </footer>
        </div>
        <!-- page_wrap -->
      </div>
      <!-- page -->

      <div id="page">
        <div class="page_wrap">
          <header>
            <div style="text-align:right;"">
              <img src="https://insboon-assets.s3.ap-northeast-2.amazonaws.com/meritz/logo_meritz_korean.png" alt="메리츠화재" width="145" height="72" style="margin: -0.5mm -0.8mm 0 0" />
            </div>  
          </header>

          <div class="content_wrap" style="padding:1mm 0 0 0">
            <div style="padding-left: 2mm;">
              <div class="gulim leading-7" style="font-size: 10pt; font-weight: 700; background:#D9D9D9; padding:0mm 2mm 0; letter-spacing: -0.1mm; margin-bottom:1mm;">
                1. 과거 3년간 귀사의 업무와 관련하여, 근로자 또는 시민에게 피해가 발생한 중대재해<br/>
                <div class="flex">사고가 발생한 적이 있습니까?&emsp;(
                  <div class="flex justify-between" style="width: 50mm; padding-left: 1mm;">
                    <div class="checkbox_wrap">
                      <div class="checkbox"></div>
                      <p>예</p>
                    </div>
                    <div class="checkbox_wrap">
                      <div class="checkbox"></div>
                      <p>아니오</p>
                    </div>
                  </div>
                )</div>
              </div>

              <div class="gulim leading-7" style="font-size: 10pt; font-weight: 700; background:#D9D9D9; padding:1mm 2mm; letter-spacing: -0.1mm;">
                (만일, 예로 답하신 경우, 해당 사항을 자세히 기재해 주시기 바랍니다.)
                <div style="font-size:9pt; font-weight: 500; letter-spacing: 0.05mm; margin-top: 12mm;">(*)중대재해사고:사망자1명이상 또는 중대부상자(치료가 6개월이상소요) 2명이상 등이 발생한 사고</div>
              </div>

              <h2><span style="font-size:10pt;">Ⅸ</span>. 가입희망 보험조건</h2>
            </div>

            <div class="flex items-end" style="margin-bottom:1mm;">
              <h3>기본 담보</h3>
              <p class="gulim" style="font-size:8pt; padding-left:4mm;">* 원하시는 금액에 체크하여 주십시오.</p>
            </div>

            <div style="padding-left: 2mm; margin-bottom:7mm;">
              <table class="gulim check_table">
                <colgroup>
                  <col style="width: 22%" />
                  <col style="width: 16%" />
                </colgroup>
                <tbody>
                  <tr>
                    <th>담보내용</th>
                    <th>구분</th>
                    <th>금액(보상한도액, 자기부담금)</th>
                  </tr>
                  <tr>
                    <td rowspan="3" class="leading-7">
                      법률상 / 징벌적<br/>
                      손해배상책임<br/>
                      (필수가입)
                    </td>
                    <td class="text-center">1청구당</td>
                    <td>
                      <div class="flex justify-between" style="padding:0 2mm;">
                        <div class="checkbox_wrap">
                          <div class="checkbox ${perAccidentCoverageLimit == 200000000 ? 'checked' : ''}"></div>
                          <p>2억,</p>
                        </div>
                        <div class="checkbox_wrap">
                          <div class="checkbox ${perAccidentCoverageLimit == 500000000 ? 'checked' : ''}"></div>
                          <p>5억,</p>
                        </div>
                        <div class="checkbox_wrap">
                          <div class="checkbox ${perAccidentCoverageLimit == 1000000000 ? 'checked' : ''}"></div>
                          <p>10억,</p>
                        </div>
                        <div class="checkbox_wrap">
                          <div class="checkbox ${perAccidentCoverageLimit == 2000000000 ? 'checked' : ''}"></div>
                          <p>20억</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="text-center">총보상한도</td>
                    <td>
                      <div class="flex justify-between" style="padding:0 2mm;">
                        <div class="checkbox_wrap">
                          <div class="checkbox ${totCoverageLimit == 200000000 ? 'checked' : ''}"></div>
                          <p>2억,</p>
                        </div>
                        <div class="checkbox_wrap">
                          <div class="checkbox ${totCoverageLimit == 500000000 ? 'checked' : ''}"></div>
                          <p>5억,</p>
                        </div>
                        <div class="checkbox_wrap">
                          <div class="checkbox ${totCoverageLimit == 1000000000 ? 'checked' : ''}"></div>
                          <p>10억,</p>
                        </div>
                        <div class="checkbox_wrap">
                          <div class="checkbox ${totCoverageLimit == 2000000000 ? 'checked' : ''}"></div>
                          <p>20억</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="text-center">자기부담금</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="flex items-end" style="margin-bottom:1mm;">
              <h3>선택 담보</h3>
              <p class="gulim" style="font-size:8pt; padding-left:4mm;">* ‘구분’사항에 체크하여 주십시오.</p>
            </div>

            <div style="padding-left: 2mm; margin-bottom:7mm">
              <table class="gulim check_table">
                <colgroup>
                  <col style="width: 43%" />
                </colgroup>
                <tbody>
                  <tr>
                    <th>담보내용</th>
                    <th>구분</th>
                  </tr>
                  <tr>
                    <td>중대사고 형사방어비용</td>
                    <td>
                      <div class="flex">
                        <div class="checkbox_wrap" style="width: 40mm;">
                          <div class="checkbox checked"></div>
                          <p>가입</p>
                        </div>
                        <div class="checkbox_wrap">
                          <div class="checkbox"></div>
                          <p>미가입</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>위기관리실행비용</td>
                    <td>
                      <div class="flex">
                        <div class="checkbox_wrap" style="width: 40mm;">
                          <div class="checkbox ${responseArray.includes(22) || responseArray.includes(171) ? 'checked' : ''}"></div>
                          <p>가입</p>
                        </div>
                        <div class="checkbox_wrap">
                          <div class="checkbox ${responseArray.includes(23) && responseArray.includes(172) ? 'checked' : ''}"></div>
                          <p>미가입</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>공중교통수단 보장확대</td>
                    <td>
                      <div class="flex">
                        <div class="checkbox_wrap" style="width: 40mm;">
                          <div class="checkbox"></div>
                          <p>가입</p>
                        </div>
                        <div class="checkbox_wrap">
                          <div class="checkbox"></div>
                          <p>미가입</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>오염손해 보장확대</td>
                    <td>
                      <div class="flex">
                        <div class="checkbox_wrap" style="width: 40mm;">
                          <div class="checkbox"></div>
                          <p>가입</p>
                        </div>
                        <div class="checkbox_wrap">
                          <div class="checkbox"></div>
                          <p>미가입</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>민사상배상책임 부보장</td>
                    <td>
                      <div class="flex">
                        <div class="checkbox_wrap" style="width: 40mm;">
                          <div class="checkbox checked"></div>
                          <p>가입</p>
                        </div>
                        <div class="checkbox_wrap">
                          <div class="checkbox"></div>
                          <p>미가입</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>중대(&emsp;)재해만을 위한 보장</td>
                    <td>
                      <div class="flex">
                        <div class="checkbox_wrap" style="width: 40mm;">
                          <div class="checkbox ${guaranteeDisaterCd == 'indst' || guaranteeDisaterCd == 'all' ? 'checked' : ''}"></div>
                          <p>중대산업재해</p>
                        </div>
                        <div class="checkbox_wrap">
                          <div class="checkbox ${guaranteeDisaterCd == 'civil' || guaranteeDisaterCd == 'all' ? 'checked' : ''}"></div>
                          <p>중대시민재해</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>대위권 포기</td>
                    <td>
                      <div class="flex">
                        <div class="checkbox_wrap" style="width: 40mm;">
                          <div class="checkbox"></div>
                          <p>가입</p>
                        </div>
                        <div class="checkbox_wrap">
                          <div class="checkbox"></div>
                          <p>미가입</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="flex items-end" style="margin-bottom:1mm;">
              <h3>보험 담보 지역&ensp;</h3>
            </div>

            <div style="padding-left: 2mm; margin-bottom:7mm">
              <table class="gulim check_table">
                <colgroup>
                  <col style="width: 43%" />
                </colgroup>
                <tbody>
                  <tr>
                    <td>담보지역</td>
                    <td>
                      <div class="flex">
                        <div class="checkbox_wrap" style="width: 40mm;">
                          <div class="checkbox ${guaranteeRegionCd == 'D' ? 'checked' : ''}"></div>
                          <p>대한민국</p>
                        </div>
                        <div class="checkbox_wrap">
                          <div class="checkbox ${guaranteeRegionCd == 'W' ? 'checked' : ''}"></div>
                          <p>전세계(북미제외)</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="gulim leading-7" style="padding-right: 5mm;">
              <div style="font-size:10pt;">
                상기 진술의 모든 내용은 은폐나 허위가 없는 사실이며, 동 자료의 내용이 귀사와<br/>
                체결할 보험계약의 기초가 되는 것에 대하여 동의 합니다
              </div>
              <div class="flex flex-col items-end" style="font-size:10.5pt;">
                <dl class="flex justify-between" style="width: 75mm;">
                  <dt>
                    작성일자 :
                  </dt>
                  <dd class="flex">
                    <span class="text-center" style="width: 20mm;">${joinYear}</span>년<span class="text-center" style="width: 10mm;">09</span>${joinMonth}월<span class="text-center" style="width: 10mm;">${joinDay}</span>일
                  </dd>
                </dl>
                <dl class="flex justify-between" style="width: 75mm;">
                  <dt>
                    회사명 :
                  </dt>
                  <dd class="flex-grow-1 text-center">${phNm}</dd>
                </dl>
                <dl class="flex justify-between" style="width: 75mm;">
                  <dt>
                    부서명 :
                  </dt>
                  <dd class="flex-grow-1 text-center"></dd>
                </dl>
                <dl class="flex justify-between" style="width: 75mm;">
                  <dt>
                    성명(서명 또는 날인 포함) :
                  </dt>
                  <dd class="flex-grow-1 text-center">${phNm}</dd>
                </dl>
              </div>
            </div>
          </div>
          <!-- content_wrap -->
          <footer style="margin-top: auto;">
              <div style="text-align: center; margin-bottom:5mm;">6/6</div>
              <div style="height:3mm; background:linear-gradient(90deg, black, white)"></div>
          </footer>
        </div>
        <!-- page_wrap -->
      </div>
      <!-- page -->
    `;
  } else {
    return `
      <div id="page" class="db">
        <div class="page_wrap flex flex-col">
          <div
            class="inner"
            style="height: 100%; border: 0.5mm solid #030303; padding: 1mm 1mm"
          >
            <header style="margin-bottom: 1mm">
              <h1
                class="flex justify-between items-start"
                style="margin-bottom: 2mm; padding-right: 2mm"
              >
                <div
                  class="flex items-center"
                  style="
                    font-size: 16.5pt;
                    font-weight: 700;
                    letter-spacing: -0.2mm;
                  "
                >
                  <img
                    src="https://insboon-assets.s3.ap-northeast-2.amazonaws.com/form_db_logo.svg"
                    width="140mm"
                    style="margin: -3mm 1mm 0 -2mm"
                  />질문서
                </div>
                <div style="font-size: 9.2pt; color: #008347">
                  An Excellent Global Company
                </div>
              </h1>

              <div class="header_line">
                <div class="left_line"></div>
                <div class="right_line"></div>
              </div>
            </header>

            <div class="content_wrap" style="padding: 0 8.5mm 12mm">
              <h2
                style="
                  font-size: 20pt;
                  font-weight: 600;
                  color: #18178e;
                  text-align: center;
                  margin-bottom: 4mm;
                "
              >
                기업중대사고배상책임보험 질문서_<span style="font-size: 16pt"
                  >50 인 미만 사업장&ensp;용</span
                >
              </h2>

              <h3>1. 일반사항</h3>
              <table>
                <colgroup>
                  <col style="width: 20%" />
                  <col style="width: 20%" />
                </colgroup>
                <tbody>
                  <tr>
                    <th colspan="2">법인(상호)명</th>
                    <td>${insuredFranNm}</td>
                  </tr>
                  <tr>
                    <th colspan="2">본점 소재지(주소)</th>
                    <td>${insuredAddress}</td>
                  </tr>
                  <tr>
                    <th rowspan="2">국세청 기준</th>
                    <th>업종 대분류</th>
                    <td>${ntsBizLargeTypeNm}</td>
                  </tr>
                  <tr>
                    <th>업종 소분류</th>
                    <td>${ntsBizTypeNm}</td>
                  </tr>
                  <tr>
                    <th rowspan="2">산재가입 기준</th>
                    <th>업종 대분류</th>
                    <td>${ccaliBizLargeTypeNm}</td>
                  </tr>
                  <tr>
                    <th>업종 소분류</th>
                    <td>${ccaliBizTypeNm}</td>
                  </tr>
                  <tr>
                    <th colspan="2">연간매출액*</th>
                    <td>${costFomatter(salesCost)}</td>
                  </tr>
                  <tr>
                    <th colspan="2">사업자 번호</th>
                    <td>${bizFomatter(insuredBizNo)}</td>
                  </tr>
                  <tr>
                    <th colspan="2" style="border-right: 0.3mm solid #3e3e3e;">총 근로자 수(소속 / 소속 외*)</th>
                    <td class="flex" style="border-top: 0;; border-bottom: 0; border-left: 0;">
                      <div style="width: 40%; text-align: right; padding-right: 2mm;">${costFomatter(totEmployeeCnt)}명</div>
                      <div style="width: 60%; text-align: left; padding-left: 2mm;">(&emsp;${costFomatter(regularEmployeeCnt)}명&emsp;/&emsp;${costFomatter(dispatchedEmployeeCnt + subcontractEmployeeCnt)}명&emsp;)</div>
                    </td>
                  </tr>
                  <tr>
                    <th colspan="2">중대재해처벌법에 따라 송치이력 여부</th>
                    <td>
                      <div class="flex justify-center">
                        <div class="checkbox_wrap" style="margin-right: 8mm">
                          <div class="checkbox ${referralHistoryYn == 'N' ? '' : 'checked'}" style="margin-right: 1mm"></div>
                          <p>예</p>
                        </div>
                        <div class="checkbox_wrap">
                          <div class="checkbox ${referralHistoryYn == 'N' ? 'checked' : ''}" style="margin-right: 1mm"></div>
                          <p>아니오</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div style="margin-top: 1.5mm;">
                <p style="white-space: nowrap;">* 재무재표상 총 매출액 기준, 단 중앙행정기관 및 지방자치단체인 경우 프로그램 총원가(사업 총원가)를 기재</p>
                <p style="white-space: nowrap; margin-top: 2mm;">* 근로자수: 상시근로자 기준 작성, 하도급, 파견 근로자 등이 있는 경우 소속 외 근로자 작성 필수</p>
              </div>

              <div style="margin-top: 6mm;">
                <div style="white-space: nowrap;">&nbsp;&nbsp;※ 업종 대분류가 제조업인 경우 아래 내용을 추가로 기재하여 주시기 바랍니다.</div>

                <table style="margin-top: 1mm;">
                  <colgroup>
                    <col style="width: 30%" />
                    <col style="width: 70%" />
                  </colgroup>
                  <tbody>
                    <tr>
                      <th>구분</th>
                      <th>항목</th>
                    </tr>
                    <tr>
                      <td style="text-align: center; white-space: nowrap;">생산물 종류</td>
                      <td>${productType == null ? '' : productType}</td>
                    </tr>
                    <tr>
                      <td style="text-align: center;">해당 제품 포함여부<br />(포함시 체크 필요)</td>
                      <td style="padding-left: 2mm;">
                        <div class="flex">
                          <div class="checkbox_wrap">
                            <div class="checkbox ${highRiskProducts.includes('항공기 및 관련 부품') ? 'checked' : ''}" style="margin-right: 1mm"></div>
                            <p style="white-space: nowrap;">항공기 및 관련부품</p>
                          </div>

                          <div class="checkbox_wrap" style="margin-left: 6mm;">
                            <div class="checkbox ${highRiskProducts.includes('완성차 및 관련 부품') ? 'checked' : ''}" style="margin-right: 1mm"></div>
                            <p style="white-space: nowrap;">완성차 및 관련부품</p>
                          </div>

                          <div class="checkbox_wrap" style="margin-left: 6mm;">
                            <div class="checkbox ${highRiskProducts.includes('타이어') ? 'checked' : ''}" style="margin-right: 1mm"></div>
                            <p style="white-space: nowrap;">타이어</p>
                          </div>

                          <div class="checkbox_wrap" style="margin-left: 6mm;">
                            <div class="checkbox ${highRiskProducts.includes('헬멧') ? 'checked' : ''}" style="margin-right: 1mm"></div>
                            <p style="white-space: nowrap;">헬멧</p>
                          </div>
                        </div>

                        <div class="flex" style="margin-top: 3mm;">
                          <div class="checkbox_wrap">
                            <div class="checkbox ${highRiskProducts.includes('철도 및 철로용 신호장치') ? 'checked' : ''}" style="margin-right: 1mm"></div>
                            <p style="white-space: nowrap;">철도 및 철로용 신호장치</p>
                          </div>

                          <div class="checkbox_wrap" style="margin-left: 12mm;">
                            <div class="checkbox ${highRiskProducts.includes('농약 및 제초제') ? 'checked' : ''}" style="margin-right: 1mm"></div>
                            <p style="white-space: nowrap;">농약 및 제초제</p>
                          </div>

                          <div class="checkbox_wrap" style="margin-left: 12mm;">
                            <div class="checkbox ${highRiskProducts.includes('담배') ? 'checked' : ''}" style="margin-right: 1mm"></div>
                            <p style="white-space: nowrap;">담배</p>
                          </div>
                        </div>

                        <div class="flex" style="margin-top: 3mm;">
                          <div class="checkbox_wrap">
                            <div class="checkbox ${highRiskProducts.includes('의약품 및 체내이식형 의료기기') ? 'checked' : ''}" style="margin-right: 1mm"></div>
                            <p style="white-space: nowrap;">의약품 및 체내이식형 의료기기</p>
                          </div>

                          <div class="checkbox_wrap" style="margin-left: 8mm;">
                            <div class="checkbox ${highRiskProducts.includes('혈액 및 인체추출 물질') ? 'checked' : ''}" style="margin-right: 1mm"></div>
                            <p style="white-space: nowrap;">혈액 및 인체추출 물질</p>
                          </div>
                        </div>

                        <div class="flex" style="margin-top: 3mm;">
                          <div class="checkbox_wrap">
                            <div class="checkbox ${highRiskProducts.includes('폭죽, 탄약, 화약 등 폭발 용도로 사용되는 제품') ? 'checked' : ''}" style="margin-right: 1mm"></div>
                            <p style="white-space: nowrap;">폭죽, 탄약, 화약 등 폭발 용도로 사용되는 제품</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style="margin-top: 10mm;">
                <h3>2. 보험가입조건</h3>

                <table style="margin-top: 1mm;">
                  <colgroup>
                    <col style="width: 30%" />
                    <col style="width: 70%" />
                  </colgroup>
                  <tbody>
                    <tr>
                      <th>담  보</th>
                      <th>항목</th>
                    </tr>
                    <tr>
                      <td style="text-align: center; white-space: nowrap;">증권 총 보상한도액</td>
                      <td>
                        <div class="flex">
                          <div class="checkbox_wrap">
                            <div class="checkbox ${totCoverageLimit == 200000000 ? 'checked' : ''}" style="margin-right: 1mm"></div>
                            <p style="white-space: nowrap;">2억</p>
                          </div>

                          <div class="checkbox_wrap" style="margin-left: 12mm;">
                            <div class="checkbox ${totCoverageLimit == 500000000 ? 'checked' : ''}" style="margin-right: 1mm"></div>
                            <p style="white-space: nowrap;">5억</p>
                          </div>

                          <div class="checkbox_wrap" style="margin-left: 12mm;">
                            <div class="checkbox ${totCoverageLimit == 1000000000 ? 'checked' : ''}" style="margin-right: 1mm"></div>
                            <p style="white-space: nowrap;">10억</p>
                          </div>

                          <div class="checkbox_wrap" style="margin-left: 12mm;">
                            <div class="checkbox ${totCoverageLimit == 2000000000 ? 'checked' : ''}" style="margin-right: 1mm"></div>
                            <p style="white-space: nowrap;">20억</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="text-align: center; white-space: nowrap;">중대 (&nbsp;&nbsp;&nbsp;) 재해만을 위한 보장</td>
                      <td>
                        <div class="flex">
                          <div class="checkbox_wrap">
                            <div class="checkbox ${guaranteeDisaterCd == 'indst' ? 'checked' : ''}" style="margin-right: 1mm"></div>
                            <p style="white-space: nowrap;">중대산업재해</p>
                          </div>

                          <div class="checkbox_wrap" style="margin-left: 12mm;">
                            <div class="checkbox ${guaranteeDisaterCd == 'civil' ? 'checked' : ''}" style="margin-right: 1mm"></div>
                            <p style="white-space: nowrap;">중대시민재해</p>
                          </div>

                          <div class="checkbox_wrap" style="margin-left: 12mm;">
                            <div class="checkbox ${guaranteeDisaterCd == 'all' ? 'checked' : ''}" style="margin-right: 1mm"></div>
                            <p style="white-space: nowrap;">둘 다 가입</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style="margin-top: 10mm;">
                <div style="color: red;">
                  본 질문서는 청약서와 함께 보험계약의 일부를 이루게 되며, 기재 내용이 사실과 다를 경우 
                  <span style="text-decoration: underline; word-break: break-all;">보험계약의 효력 또는 보험금 지급에 영향을 미칠 수 있으니</span>
                  , 이점 유의하시어 질문사항에 대해 신중히 답하여 주시기 바랍니다.
                </div>
              </div>

              <div style="width: 70mm; margin-top: 6mm; margin-left: auto;">
                <div style="display: flex; width: fit-content;">
                  <div style="white-space: nowrap;">작&ensp;성&ensp;일&ensp;자&emsp;:&emsp;</div>
                  <div style="white-space: nowrap; border-bottom: 1px solid #030303; width: 169px;">
                    &emsp;&emsp;${joinYear}년&emsp;&emsp;${joinMonth}월&emsp;&emsp;${joinDay}일
                  </div>
                </div>
                <div style="display: flex; margin-top: 3mm; width: fit-content;">
                  <div style="letter-spacing: 0.16mm;">작성자 성명&emsp;:&emsp;</div>
                  <div style="white-space: nowrap; border-bottom: 1px solid #030303; width: 169px;">
                    ${phNm}
                  </div>
                </div>
                <div style="display: flex; margin-top: 3mm; width: fit-content;">
                  <div>서&emsp;&emsp;&emsp;&nbsp;&nbsp;명&emsp;:&emsp;</div>
                  <div style="white-space: nowrap; border-bottom: 1px solid #030303; width: 170px; text-align: right;">
                  </div>
                </div>
              </div>
            </div>

            <!-- <footer
              class="flex justify-between"
              style="color: #57575a; margin-top: auto; padding: 0 12mm"
            >
              <div style="opacity: 0">다음장에 계속▶</div>
              <div>[1/3]</div>
              <div>다음장에 계속▶</div>
            </footer> -->
          </div>
        </div>
        <!-- page_wrap -->
      </div>
      <!-- page -->
    `;
  }
};

module.exports = {
  questionUnder,
};
