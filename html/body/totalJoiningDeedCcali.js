/**
 * 통합가입확인서 Body Element
 * @return {string} pdf변환용 string
 */
const dayjs = require('dayjs');

// 금액형식
const costFomatter = (num) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '';
};

const getInsComClass = (insComCd) => {
  let result = '';

  switch (insComCd) {
    case 'MR':
      result = 'meritz';
      break;

    case 'DB':
      result = 'db';
      break;

    case 'KB':
      result = 'kb';
      break;

    case 'SM':
      result = 'samsung';
      break;

    default:
      result = 'done';
      break;
  }

  return result;
};

const totalJoiningDeedCcali = (data) => {
  const {
    id,
    insProdCd,
    insProdFullNm, // 보험상품명 전체
    insProdTermsUrl,
    insJoinFileUrl,
    insStockNo,
    insComCd,
    insComNm,
    insComFullNm,
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
  } = data;

  let realPhNm = '(주)넥솔';
  realPhNm = '(주)우리카드';
  if (joinAccount == 'SK엠앤서비스') {
    realPhNm = 'SK엠앤서비스(주)';
  }

  let insStartYmd = dayjs(insStartDt).format('YYYY-MM-DD');
  let insStartTime = dayjs(insStartDt).format('HH:mm');
  let insEndYmd = dayjs(insEndDt).format('YYYY-MM-DD');
  let insEndTime = dayjs(insEndDt).format('HH:mm');
  if (insStartTime == '00:00') {
    insEndYmd = dayjs(insEndDt).subtract(1, 'day').format('YYYY-MM-DD');
    insEndTime = '24:00';
  }

  let perAccidentCoverageLimitKor = '';
  if (perAccidentCoverageLimit == 200000000) {
    perAccidentCoverageLimitKor = '2억원';
  } else if (perAccidentCoverageLimit == 500000000) {
    perAccidentCoverageLimitKor = '5억원';
  } else if (perAccidentCoverageLimit == 1000000000) {
    perAccidentCoverageLimitKor = '10억원';
  } else if (perAccidentCoverageLimit == 2000000000) {
    perAccidentCoverageLimitKor = '20억원';
  } else if (perAccidentCoverageLimit == 3000000000) {
    perAccidentCoverageLimitKor = '30억원';
  } else if (perAccidentCoverageLimit == 5000000000) {
    perAccidentCoverageLimitKor = '50억원';
  } else if (perAccidentCoverageLimit == 10000000000) {
    perAccidentCoverageLimitKor = '100억원';
  }
  let totCoverageLimitKor = '';
  if (totCoverageLimit == 200000000) {
    totCoverageLimitKor = '2억원';
  } else if (totCoverageLimit == 500000000) {
    totCoverageLimitKor = '5억원';
  } else if (totCoverageLimit == 1000000000) {
    totCoverageLimitKor = '10억원';
  } else if (totCoverageLimit == 2000000000) {
    totCoverageLimitKor = '20억원';
  } else if (totCoverageLimit == 3000000000) {
    totCoverageLimitKor = '30억원';
  } else if (totCoverageLimit == 5000000000) {
    totCoverageLimitKor = '50억원';
  } else if (totCoverageLimit == 10000000000) {
    totCoverageLimitKor = '100억원';
  }

  return `
    <div id="page" class="db">
      <div class="page_wrap">
        <header style="margin-bottom: 4mm">
          <div
            style="
              display: -webkit-flex; 
              -webkit-flex-wrap: wrap; 
              display: flex;
              -webkit-box-align: center;
              -moz-align-items: center;
              -ms-flex-align: center;
              align-items: center;
              margin-bottom: 2mm;
            "
          >
            <img
              src="https://insboon-assets.s3.ap-northeast-2.amazonaws.com/db/db_logo_promise.png"
              width="131"
              height="41"
            />

            <div 
              style="
                width: 80mm;
                margin-left: 9mm;
              "
            >
              <span
                style="
                  display: inline-block;
                  font-size: 11pt;
                  color: white;
                  background-color: #008449;
                  padding: 0.11mm 20mm 1mm 3mm;
                  font-weight: 400;
                  border-radius: 0 20mm 20mm 0;
                "
                >가입증명서</span
              >
              <h1
                style="
                  font-size: 19pt;
                  font-weight: 600;
                  letter-spacing: -0.1mm;
                  padding-left: 1mm;
                "
              >
                ${insProdFullNm}
              </h1>
            </div>
          </div>

          <img 
            src="https://insboon-assets.s3.ap-northeast-2.amazonaws.com/db/db_line.png"
            width="771"
            height="10"
          />
        </header>

        <div class="content_wrap">
          <table>
            <colgroup>
              <col style="width: 27.5%" />
            </colgroup>
            <tbody>
              <tr>
                <th>
                  <div style="letter-spacing: 0.3em; padding-left: 0.3em">
                    증권번호
                  </div>
                </th>
                <td>
                  ${insStockNo}
                </td>
              </tr>
              <tr>
                <th>
                  <div style="letter-spacing: 0.3em; padding-left: 0.3em">
                    보험기간
                  </div>
                </th>
                <td>
                  ${insStartYmd} (${insStartTime}) ~ ${insEndYmd} (${insEndTime})
                </td>
              </tr>
              <tr>
                <th>
                  <div style="letter-spacing: 0.9em; padding-left: 0.9em">
                    목적물<br />
                    소재지
                  </div>
                </th>
                <td>
                  ${insuredAddress}
                </td>
              </tr>
              <tr>
                <th>
                  <div style="letter-spacing: 2.5em; padding-left: 2.5em">
                    업종
                  </div>
                </th>
                <td>
                  (${ccaliBizTypeCd}) ${ccaliBizTypeNm}
                </td>
              </tr>
              <tr>
                <th>
                  <div>(대표)보험계약자</div>
                </th>
                <td>
                  ${realPhNm}
                </td>
              </tr>
              <tr>
                <th>
                  <div style="letter-spacing: 0.3em; padding-left: 0.3em">
                    피보험자
                  </div>
                </th>
                <td>
                  ${insuredBizNo} / ${insuredFranNm}
                </td>
              </tr>
              <tr>
                <th>
                  <div style="letter-spacing: 0.3em; padding-left: 0.3em">
                    피보험자<br />
                    연락처
                  </div>
                </th>
                <td>
                  ${corpManagerPhoneNo != null && corpManagerPhoneNo != '' ? corpManagerPhoneNo : insuredPhoneNo}
                </td>
              </tr>
              <tr>
                <th>
                  <div>보상한도액</div>
                </th>
                <td style="padding: 0">
                  <table style="border: 0">
                    <colgroup>
                      <col style="width: 33%" />
                      <col style="width: 33%" />
                      <col style="width: 34%" />
                    </colgroup>
                    <tbody>
                      <tr>
                        <th
                          style="
                            font-weight: 500;
                            background: #f7f7f4;
                            padding: 2mm;
                          "
                        >
                          1사고당
                        </th>
                        <th
                          style="
                            font-weight: 500;
                            background: #f7f7f4;
                            padding: 2mm;
                          "
                        >
                          총보상한도액
                        </th>
                        <th
                          style="
                            font-weight: 500;
                            background: #f7f7f4;
                            padding: 2mm;
                          "
                        >
                          공제금액
                        </th>
                      </tr>
                      <tr>
                        <td style="border-bottom: 0">${perAccidentCoverageLimitKor}</td>
                        <td style="border-bottom: 0">${totCoverageLimitKor}</td>
                        <td style="border-bottom: 0">${deductibleInsCost == 0 ? '없음' : Number(deductibleInsCost / 10000) + '만원'}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <th>
                  <div style="letter-spacing: 0.1em; padding-left: 0.1em">
                    보험료
                  </div>
                </th>
                <td>${costFomatter(totInsCost)}원</td>
              </tr>
            </tbody>
          </table>

          <div
            style="
              font-size: 13pt;
              line-height: 1.8em;
              letter-spacing: 0.11em;
              padding: 11mm 13mm;
            "
          >
            위 피보험자는 기업중대사고 배상책임보험에 가입하였으므로 이
            보험의<br />
            보상하는 손해로 인하여 타인에 대한 법률상 배상책임손해를
            피보험자가<br />
            부담하는 경우 보험약관에 의거 당사가 이를 보상하여 드립니다.
          </div>
        </div>
        <!-- //content_wrap -->
        <div style="margin-top: auto">
          <div class="etc_box">
            <div style="font-size: 10pt; margin-bottom: 1mm">[기타사항]</div>
            <ul>
              <li>
                담보별 상세 보장 내역 등은 반드시 증권과 약관을 확인해 주시기
                바랍니다.
              </li>
              <li>
                이 증명서는 보험가입 사실을 확인하는 용도로만 사용 가능하며,
                보험계약과 관련된 모든 사항은 해당 보험 증권 및 약관을 따릅니다.
              </li>
              <li>
                사고접수 또는 보험금 청구관련 문의는 아래 콜센터로 문의
                바랍니다.
              </li>
            </ul>
          </div>
          <footer>
            <table style="margin: 0; border-top: 0">
              <colgroup>
                <col style="width: 55%" />
                <col style="width: 45%" />
              </colgroup>
              <tbody>
                <tr>
                  <th style="padding: 0.5mm 2mm">
                    (주)넥솔 보험대리점<br />
                    손해보험협회 등록번호
                  </th>
                  <td style="font-size: 10pt; padding: 0.5mm 2mm">
                    20200600063
                  </td>
                </tr>
                <tr>
                  <th style="padding: 0.5mm 2mm">고객콜센터</th>
                  <td style="font-size: 10pt; padding: 0.5mm 2mm">1522-9323</td>
                </tr>
                <tr>
                  <th style="padding: 0.5mm 2mm">
                    <span class="ins_company"></span>
                    고객콜센터
                  </th>
                  <td style="font-size: 10pt; padding: 0.5mm 2mm">
                    <span class="ins_call"></span>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="sign_wrap">
              <p>
                <img
                  src="https://insboon-assets.s3.ap-northeast-2.amazonaws.com/pdf/logo_nexsol.png"
                />
                <span style="display: block; letter-spacing: 5.7mm">
                  보험대리점
                </span>
                <span style="display: block; letter-spacing: 3.2mm">
                  주식회사 넥솔
                </span>
                <span style="display: block; letter-spacing: 0.49mm">
                  대표이사 이춘우, 손성일
                </span>
              </p>
              <img
                src="https://insboon-assets.s3.ap-northeast-2.amazonaws.com/pdf/sign_ceo.png"
                style="height: 62px; width: 62px;"
              />
            </div>
            <!-- .sign_wrap -->
          </footer>
          <p style="text-align: right">발행일자 : ${dayjs(payDt).format('YYYY년 MM월 DD일')}</p>
        </div>
      </div>
      <!-- //page_wrap -->
    </div>
    <!-- //page -->
    `;
};

module.exports = {
  totalJoiningDeedCcali,
};
