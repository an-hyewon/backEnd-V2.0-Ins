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

const questionOver = (data) => {
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

  let subCompanyTable = ``;
  if (insComCd == 'DB' && subCompanyJoinYn == 'Y') {
    for (let index = 0; index < subCompanyList.length; index++) {
      const element = subCompanyList[index];
      subCompanyTable += `
        <table class="subCompany_table">
          <tbody>
            <tr>
              <td style="text-align: center;">
                ${element.subCompanyFranNm}
              </td>
              <td style="text-align: center;">
                ${element.subCompanyAddress}
              </td>
              <td style="text-align: center;">
                ${element.ccaliBizLargeTypeNm}-${element.ccaliBizTypeNm}
              </td>
              <td style="text-align: center;">
                ${element.ntsBizLargeTypeNm}-${element.ntsBizTypeNm}
              </td>
              <td style="text-align: center;">
                ${element.employeeCnt == null ? '' : costFomatter(element.employeeCnt)}
              </td>
              <td style="text-align: center;">
                ${element.externalEmployeeCnt == null ? '' : costFomatter(element.externalEmployeeCnt)}
              </td>
              <td style="text-align: center;">
                ${element.totAnnualWages == null ? '' : costFomatter(element.totAnnualWages)}
              </td>
              <td style="text-align: center;">
                ${element.salesCost == null ? '' : costFomatter(element.salesCost)}
              </td>
            </tr>
          </tbody>
        </table>
      `;
    }
  } else if (insComCd == 'DB') {
    for (let index = 0; index < 5; index++) {
      subCompanyTable += `
        <table class="subCompany_table">
          <tbody>
            <tr>
              <td style="text-align: center;">
                &nbsp;
              </td>
              <td style="text-align: center;">
                &nbsp;
              </td>
              <td style="text-align: center;">
                &nbsp;
              </td>
              <td style="text-align: center;">
                &nbsp;
              </td>
              <td style="text-align: center;">
                &nbsp;
              </td>
              <td style="text-align: center;">
                &nbsp;
              </td>
              <td style="text-align: center;">
                &nbsp;
              </td>
              <td style="text-align: center;">
                &nbsp;
              </td>
            </tr>
          </tbody>
        </table>
      `;
    }
  } else if (insComCd == 'MR' && subCompanyJoinYn == 'Y') {
    for (let index = 0; index < subCompanyList.length; index++) {
      const element = subCompanyList[index];
      subCompanyTable += `
        <table class="gulim subCompany_table">
          <tbody>
            <tr>
              <td>${element.subCompanyFranNm}</td>
              <td>${element.subCompanyAddress}</td>
              <td>${element.ccaliBizLargeTypeNm}-${element.ccaliBizTypeNm}</td>
              <td>${element.ntsBizLargeTypeNm}-${element.ntsBizTypeNm}</td>
              <td>${element.employeeCnt == null ? '' : costFomatter(element.employeeCnt)}</td>
              <td>${element.externalEmployeeCnt == null ? '' : costFomatter(element.externalEmployeeCnt)}</td>
              <td>${element.totAnnualWages == null ? '' : costFomatter(element.totAnnualWages)}</td>
              <td>${element.salesCost == null ? '' : costFomatter(element.salesCost)}</td>
            </tr>
          </tbody>
        </table>
      `;
    }
  } else if (insComCd == 'MR') {
    for (let index = 0; index < 2; index++) {
      subCompanyTable += `
        <table class="gulim subCompany_table">
          <tbody>
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
      `;
    }
  }

  if (insComCd == 'MR') {
    return `
      <script>
        if (typeof window !== 'undefined') {
          window.addEventListener('load', () => {
            const body = document.getElementsByTagName('body')[0];
            let subCompanyPage = document.querySelector('.subCompany_page');
            const subCompanyContentWrap =
              subCompanyPage.querySelector('.content_wrap');
            const subCompanyList = subCompanyPage.querySelector(
              '.subCompany_table_section',
            );

            const computedStyle = window.getComputedStyle(subCompanyList);
            const subCompanyListMaxHeight = Number(
              computedStyle.getPropertyValue('max-height').replace('px', ''),
            );

            function splitContent() {
              let contentElements = Array.from(subCompanyList.children);
              let currentHeight = subCompanyContentWrap.scrollHeight;

              if (subCompanyList.scrollHeight > subCompanyListMaxHeight) {
                let newPage = createNewPage();

                while (subCompanyList.scrollHeight > subCompanyListMaxHeight) {
                  let element = contentElements.pop();
                  newPage.querySelector('.added_subCompany').prepend(element);
                }

                // 새로운 page를 기존 page들 사이에 삽입
                insertPageInOrder(subCompanyPage, newPage);

                const addedSubCompanyPage = document.querySelector(".added_subCompany_page");
                const addedSubCompanySection = addedSubCompanyPage.querySelector('.added_subCompany');
                const addedSubCompanySectionElements = Array.from(addedSubCompanySection.children);
                const addedSubCompanySectionComputedStyle = window.getComputedStyle(addedSubCompanySection);
                const addedSubCompanySectionMaxHeight = Number(
                      addedSubCompanySectionComputedStyle.getPropertyValue('max-height').replace('px', ''),
                );
                console.log(addedSubCompanySectionMaxHeight);              
                console.log(addedSubCompanySection.scrollHeight);
                
                // 추가된 자회사 페이지 넘었을경우
                if(addedSubCompanySection.scrollHeight > addedSubCompanySectionMaxHeight){
                  let addedNewPage = createNewPage();

                  while(addedSubCompanySection.scrollHeight > addedSubCompanySectionMaxHeight){
                    let element = addedSubCompanySectionElements.pop();
                    addedNewPage.querySelector('.added_subCompany').prepend(element);
                  }

                  // 새로운 page를 기존 page들 사이에 삽입
                  insertPageInOrder(addedSubCompanyPage, addedNewPage);
                }
                  
                const addedSubCompanyPages = document.querySelectorAll(".added_subCompany_page");

                for(let i = 0; i < addedSubCompanyPages.length; i++) {
                  let addedSubCompanyPage = addedSubCompanyPages[i];
                  let addedSubCompanySection = addedSubCompanyPage.querySelector('.added_subCompany');
                  let addedSubCompanySectionElements = Array.from(addedSubCompanySection.children);
                  let addedSubCompanySectionComputedStyle = window.getComputedStyle(addedSubCompanySection);
                  let addedSubCompanySectionMaxHeight = Number(
                      addedSubCompanySectionComputedStyle.getPropertyValue('max-height').replace('px', ''),
                  );

                  if(addedSubCompanySection.scrollHeight - 1 > addedSubCompanySectionMaxHeight){
                    let addedNewPage = createNewPage();

                    while(addedSubCompanySection.scrollHeight - 1 > addedSubCompanySectionMaxHeight){
                      let element = addedSubCompanySectionElements.pop();
                      addedNewPage.querySelector('.added_subCompany').prepend(element);
                    }

                    // 새로운 page를 기존 page들 사이에 삽입
                    insertPageInOrder(addedSubCompanyPage, addedNewPage);
                  }
                }

                // 페이지 넘버링
                updatePageNumbersAndFooters();
              }
            }

            // 새로운 page을 만드는 함수
            function createNewPage() {
              let newPage = document.createElement('div');
              newPage.id = 'page';
              newPage.classList.add("added_subCompany_page");

              let newPageWrap = document.createElement('div');
              newPageWrap.classList.add('page_wrap');

              // 기존 구조 복사
              let newHeader = document
                .getElementsByTagName('header')[0]
                .cloneNode(true);

              let newContentWrap = document.createElement('div');
              newContentWrap.classList.add('content_wrap');

              let newSubCompanyList = document.createElement('div');
              // newSubCompanyList.classList.add('subCompany_table_section');
              newSubCompanyList.classList.add('added_subCompany');

              let newFooter = document
                .getElementsByTagName('footer')[0]
                .cloneNode(true);

              // 새로운 페이지 구조 조립
              newContentWrap.appendChild(newSubCompanyList);

              newPageWrap.appendChild(newHeader);
              newPageWrap.appendChild(newContentWrap);
              newPageWrap.appendChild(newFooter);

              newPage.appendChild(newPageWrap);

              return newPage;
            }

            function insertPageInOrder(currentPage, newPage) {
              // 현재의 page 다음에 새로운 page를 삽입
              if (currentPage.nextElementSibling) {
                body.insertBefore(newPage, currentPage.nextElementSibling);
              }
            }

            // 모든 page_wrap에 번호를 부여하고 footer에 index/total 추가하는 함수
            function updatePageNumbersAndFooters() {
              const pages = document.querySelectorAll('#page');
              const totalPages = pages.length; // 총 page 개수

              pages.forEach((page, index) => {
                let footerPageNumber = page.querySelector('footer .page_number');

                // 푸터 page_number에 index/total 형태로 추가
                footerPageNumber.textContent = (index + 1) + "/" + totalPages;
              });
            }

            updatePageNumbersAndFooters();

            splitContent();
          });
        }
      </script>
      <div id="page">
        <div class="page_wrap">
          <header>
            <div style="text-align:right;"">
              <img src="https://insboon-assets.s3.ap-northeast-2.amazonaws.com/meritz/logo_meritz_korean.png" alt="메리츠화재" width="145" height="72" style="margin: -0.5mm -0.8mm 0 0" />
            </div>  
          </header>

          <div class="content_wrap">
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
              <div style="text-align: center; margin-bottom:5mm;" class="page_number"></div>
              <div style="height:3mm; background:linear-gradient(90deg, black, white)"></div>
          </footer>
        </div>
      </div>
      <!-- #page1 -->

      <div id="page">
        <div class="page_wrap">
          <header>
            <div style="text-align:right;"">
              <img src="https://insboon-assets.s3.ap-northeast-2.amazonaws.com/meritz/logo_meritz_korean.png" alt="메리츠화재" width="145" height="72" style="margin: -0.5mm -0.8mm 0 0" />
            </div>  
          </header>

          <div class="content_wrap">
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
                    <td class="check_td">${responseArray.includes(49) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">1회</td>
                    <td class="check_td">${responseArray.includes(50) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">2회</td>
                    <td class="check_td">${responseArray.includes(51) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">3회 이상</td>
                    <td class="check_td">${responseArray.includes(52) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td rowspan="4">(2) 소송 여부</td>
                    <td rowspan="4" class="leading-7">
                        현재 산업안전보건법 또는<br/>
                        중대재해처벌법 관련 계류중인 소송 여부
                    </td>
                    <td class="text-center">없음</td>
                    <td class="check_td">${responseArray.includes(53) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">1회</td>
                    <td class="check_td">${responseArray.includes(54) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">2회</td>
                    <td class="check_td">${responseArray.includes(55) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">3회 이상</td>
                    <td class="check_td">${responseArray.includes(56) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td rowspan="4">(3) 산재 사망</td>
                    <td rowspan="4" class="leading-7">
                        최근 3년내 산업재해 관련 사망자 여부<br/>
                        (3년 누적기준)
                    </td>
                    <td class="text-center">없음</td>
                    <td class="check_td">${responseArray.includes(57) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">3명 이하</td>
                    <td class="check_td">${responseArray.includes(58) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">10명 이하</td>
                    <td class="check_td">${responseArray.includes(59) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">11명 이상</td>
                    <td class="check_td">${responseArray.includes(60) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td rowspan="4">(4) 산재 부상</td>
                    <td rowspan="4" class="leading-7">
                        최근 3년내 산업재해 관련 부상인원 여부<br/>
                        (3년 누적기준)
                    </td>
                    <td class="text-center">10명 이하</td>
                    <td class="check_td">${responseArray.includes(61) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">30명 이하</td>
                    <td class="check_td">${responseArray.includes(62) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">50명 이하</td>
                    <td class="check_td">${responseArray.includes(63) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">51명 이상</td>
                    <td class="check_td">${responseArray.includes(64) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td rowspan="4">(5) 산재 질병</td>
                    <td rowspan="4" class="leading-7">
                        최근 3년내 산업재해 관련 질병 인원 여부<br/>
                        (3년 누적기준)
                    </td>
                    <td class="text-center">5명 이하</td>
                    <td class="check_td">${responseArray.includes(65) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">10명 이하</td>
                    <td class="check_td">${responseArray.includes(66) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">20명 이하</td>
                    <td class="check_td">${responseArray.includes(67) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">21명 이상</td>
                    <td class="check_td">${responseArray.includes(68) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td rowspan="4">(6) 근로자 연령</td>
                    <td rowspan="4">
                      전체근로자 중 60대 이상 근로자 비중
                    </td>
                    <td class="text-center">20% 미만</td>
                    <td class="check_td">${responseArray.includes(69) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">30% 미만</td>
                    <td class="check_td">${responseArray.includes(70) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">40% 미만</td>
                    <td class="check_td">${responseArray.includes(71) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">40% 이상</td>
                    <td class="check_td">${responseArray.includes(72) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td rowspan="4">(7) 근로성숙도
                      <div style="margin:1mm 0 0 7mm">(1년)</div>
                    </td>
                    <td rowspan="4">
                      전체근로자 중 1년 미만 근로자 비중
                    </td>
                    <td class="text-center">10% 미만</td>
                    <td class="check_td">${responseArray.includes(73) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">15% 미만</td>
                    <td class="check_td">${responseArray.includes(74) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">20% 미만</td>
                    <td class="check_td">${responseArray.includes(75) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">20% 이상</td>
                    <td class="check_td">${responseArray.includes(76) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td rowspan="4">(8) 직원 안전교육</td>
                    <td rowspan="4">
                      산업안전보건법 대비 교육시간
                    </td>
                    <td class="text-center">3배 이상</td>
                    <td class="check_td">${responseArray.includes(77) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">2배 이상</td>
                    <td class="check_td">${responseArray.includes(78) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">1배 초과</td>
                    <td class="check_td">${responseArray.includes(79) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">1배 이하</td>
                    <td class="check_td">${responseArray.includes(80) ? '✔' : ''}</td>
                  </tr>
                </tbody>
              </table>
            </div>          
          </div>
          <!-- content_wrap -->
          <footer style="margin-top: auto;">
              <div style="text-align: center; margin-bottom:5mm;" class="page_number"></div>
              <div style="height:3mm; background:linear-gradient(90deg, black, white)"></div>
          </footer>
        </div>
      </div>
      <!-- #page2 -->

      <div id="page">
        <div class="page_wrap">
          <header>
            <div style="text-align:right;"">
              <img src="https://insboon-assets.s3.ap-northeast-2.amazonaws.com/meritz/logo_meritz_korean.png" alt="메리츠화재" width="145" height="72" style="margin: -0.5mm -0.8mm 0 0" />
            </div>  
          </header>

          <div class="content_wrap">
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
                    <td class="check_td">${responseArray.includes(81) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">실시O, 작성X</td>
                    <td class="check_td">${responseArray.includes(82) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">실시X, 작성O</td>
                    <td class="check_td">${responseArray.includes(83) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">실시X, 작성X</td>
                    <td class="check_td">${responseArray.includes(84) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td rowspan="4">(10) 자율점검표</td>
                    <td rowspan="4">
                      자율점검표 작성 및 긍정 비중
                    </td>
                    <td class="text-center" style="font-size:8.5pt;">긍정비율 90% 이상</td>
                    <td class="check_td">${responseArray.includes(85) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center" style="font-size:8.5pt;">긍정비율 70% 이상</td>
                    <td class="check_td">${responseArray.includes(86) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center" style="font-size:8.5pt;">긍정비율 50% 이상</td>
                    <td class="check_td">${responseArray.includes(87) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center" style="font-size:8.5pt;">긍정비율 50% 미만</td>
                    <td class="check_td">${responseArray.includes(88) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td rowspan="4" class="leading-7">(11) 하청 근로자 &ensp;&ensp;비중</td>
                    <td rowspan="4">
                      전체 근로자 대비 외부하청 근로자 비중
                    </td>
                    <td>10% 미만</td>
                    <td class="check_td">${responseArray.includes(89) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td>20% 미만</td>
                    <td class="check_td">${responseArray.includes(90) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td>30% 미만</td>
                    <td class="check_td">${responseArray.includes(91) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td>30% 이상</td>
                    <td class="check_td">${responseArray.includes(92) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td rowspan="4" class="leading-7">(12) 안전보건점검 &ensp;&ensp;횟수</td>
                    <td rowspan="4">
                      보건 및 안전관리에 대한 자율점검*
                    </td>
                    <td>1년에 4회 이상</td>
                    <td class="check_td">${responseArray.includes(93) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td>1년에 3회</td>
                    <td class="check_td">${responseArray.includes(94) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td>1년에 2회</td>
                    <td class="check_td">${responseArray.includes(95) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td>1년에 1회</td>
                    <td class="check_td">${responseArray.includes(96) ? '✔' : ''}</td>
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
                    <td class="check_td">${responseArray.includes(97) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">1회</td>
                    <td class="check_td">${responseArray.includes(98) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">2회</td>
                    <td class="check_td">${responseArray.includes(99) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">3회 이상</td>
                    <td class="check_td">${responseArray.includes(100) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td rowspan="4">(2) 소송 여부</td>
                    <td rowspan="4" class="leading-7">
                      현재 관련법 또는 중대재해처벌법 관련<br/>
                      계류중인 소송 여부
                    </td>
                    <td class="text-center">없음</td>
                    <td class="check_td">${responseArray.includes(101) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">1건</td>
                    <td class="check_td">${responseArray.includes(102) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">2건</td>
                    <td class="check_td">${responseArray.includes(103) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">3건 이상</td>
                    <td class="check_td">${responseArray.includes(104) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td rowspan="2">(3) 시민 사망</td>
                    <td rowspan="2">
                      최근 3년내 시민재해 관련 사망자 여부
                    </td>
                    <td class="text-center">없음</td>
                    <td class="check_td">${responseArray.includes(105) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">3명 이하</td>
                    <td class="check_td">${responseArray.includes(106) ? '✔' : ''}</td>
                  </tr>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- content_wrap -->
          <footer style="margin-top: auto;">
              <div style="text-align: center; margin-bottom:5mm;" class="page_number"></div>
              <div style="height:3mm; background:linear-gradient(90deg, black, white)"></div>
          </footer>
        </div>
      </div>
      <!-- #page3 -->

      <div id="page">
        <div class="page_wrap">
          <header>
            <div style="text-align:right;"">
              <img src="https://insboon-assets.s3.ap-northeast-2.amazonaws.com/meritz/logo_meritz_korean.png" alt="메리츠화재" width="145" height="72" style="margin: -0.5mm -0.8mm 0 0" />
            </div>  
          </header>

          <div class="content_wrap">
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
                    <td class="check_td">${responseArray.includes(107) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">11명 이상</td>
                    <td class="check_td">${responseArray.includes(108) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td rowspan="4">(4) 시민 부상</td>
                    <td rowspan="4" class="leading-7">
                      최근 3년내 시민재해 관련 부상 인원<br/> 여부
                    </td>
                    <td class="text-center">10명 이하</td>
                    <td class="check_td">${responseArray.includes(109) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">30명 이하</td>
                    <td class="check_td">${responseArray.includes(110) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">50명 이하</td>
                    <td class="check_td">${responseArray.includes(111) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">51명 이상</td>
                    <td class="check_td">${responseArray.includes(112) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td rowspan="4" class="leading-7">(5) 시민 질병</td>
                    <td rowspan="4" class="leading-7">
                      최근 3년내 시민지해 관련 질병 인원<br/>
                      여부
                    </td>
                    <td class="text-center">5명 이하</td>
                    <td class="check_td">${responseArray.includes(113) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">10명 이하</td>
                    <td class="check_td">${responseArray.includes(114) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">20명 이하</td>
                    <td class="check_td">${responseArray.includes(115) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">21명 이상</td>
                    <td class="check_td">${responseArray.includes(116) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td rowspan="4" class="leading-7">(6) 조직 및 인원</td>
                    <td rowspan="4">
                      중대시민재해를 전담하는 조직 여부
                    </td>
                    <td class="text-center" style="font-size:8pt;">전담부서, 전담직원 O</td>
                    <td class="check_td">${responseArray.includes(117) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center" style="font-size:8pt;">겸직부서, 전담직원 O</td>
                    <td class="check_td">${responseArray.includes(118) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center" style="font-size:8pt;">겸직부서, 겸직직원 O</td>
                    <td class="check_td">${responseArray.includes(119) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center" style="font-size:8pt;">해당 없음</td>
                    <td class="check_td">${responseArray.includes(120) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td rowspan="4" class="leading-7">(7) 안전보건점검 &ensp;&ensp;횟수</td>
                    <td rowspan="4">
                      보건 및 안전관리에 대한 자율점검*
                    </td>
                    <td class="text-center">1년에 4회 이상</td>
                    <td class="check_td">${responseArray.includes(121) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">1년에 3회</td>
                    <td class="check_td">${responseArray.includes(122) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">1년에 2회</td>
                    <td class="check_td">${responseArray.includes(123) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center">1년에 1회</td>
                    <td class="check_td">${responseArray.includes(124) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td rowspan="4" class="leading-7">(8) 모의훈련</td>
                    <td rowspan="4">
                      응급사태 매뉴얼 보유 및 모의 훈련 실시
                    </td>
                    <td class="text-center" style="font-size:8pt;">매뉴얼 O, 훈련 O</td>
                    <td class="check_td">${responseArray.includes(126) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center" style="font-size:8pt;">매뉴얼 X, 훈련 O</td>
                    <td class="check_td">${responseArray.includes(125) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center" style="font-size:8pt;">매뉴얼 O, 훈련 X</td>
                    <td class="check_td">${responseArray.includes(127) ? '✔' : ''}</td>
                  </tr>
                  <tr>
                    <td class="text-center" style="font-size:8pt;">매뉴얼 X, 훈련 X</td>
                    <td class="check_td">${responseArray.includes(128) ? '✔' : ''}</td>
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
              <div style="text-align: center; margin-bottom:5mm;" class="page_number"></div>
              <div style="height:3mm; background:linear-gradient(90deg, black, white)"></div>
          </footer>
        </div>
      </div>
      <!-- #page4 -->

      <div id="page" class="subCompany_page">
        <div class="page_wrap">
          <header>
            <div style="text-align:right;"">
              <img src="https://insboon-assets.s3.ap-northeast-2.amazonaws.com/meritz/logo_meritz_korean.png" alt="메리츠화재" width="145" height="72" style="margin: -0.5mm -0.8mm 0 0" />
            </div>  
          </header>

          <div class="content_wrap">
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
                  <td><div class="flex justify-between" style="padding-right: 5mm;">담보 (<span>${subCompanyJoinYn == 'Y' ? '✔' : ''}</span>), 부담보 (<span>${subCompanyJoinYn == 'Y' ? '' : '✔'}</span>)</div></td>
                </tr>
              </tbody>
            </table>

            <div class="gulim" style="font-size: 10pt;"><span style="font-size: 8pt;">✽</span>자회사 담보시, 그 세부현황을 기재해주십시오.</div>
            <div style="margin-bottom:1mm">
              <table class="gulim subCompany_table">
                <tbody>
                  <tr>
                    <th style="font-size:9pt;" class="text-center">자회사명</th>
                    <th style="font-size:9pt;" class="text-center">소재지</th>
                    <th style="font-size:9pt;" class="text-center leading-7">업종 분류<br/>
                    (산재 기준)</th>
                    <th style="font-size:9pt;" class="text-center leading-7">업종 분류<br/>
                      (국세청 기준)</th>
                    <th style="font-size:9pt;" class="text-center leading-7">
                      소속<br/>
                      근로자수
                    </th>
                    <th style="font-size:9pt;" class="text-center leading-7">
                      소속 외<br/>
                      근로자수
                    </th>
                    <th style="font-size:9pt;" class="text-center leading-7">
                      연임금<br/>
                      총액
                    </th>
                    <th style="font-size:9pt;" class="text-center">
                      매출액
                    </th>
                  </tr>
                </tbody>
              </table>
              
              <div class="subCompany_table_section">
                ${subCompanyTable}
                <div class="leading-7" style="font-size: 9pt; letter-spacing: 0.35mm;">
                  * 자회사: 직접적이든 또는 다른 자회사를 통한 간접이든 관계없이 법인이 발행한 주식(의결권이 없는<br/>
                  &ensp;&ensp;주식은 제외합니다.) 총수의 50%를 초과하는 주식을 소유하고 있는 법인을 말합니다
                </div>
              </div>
            </div>

          </div>
          <!-- content_wrap -->
          <footer style="margin-top: auto;">
              <div style="text-align: center; margin-bottom:5mm;" class="page_number"></div>
              <div style="height:3mm; background:linear-gradient(90deg, black, white)"></div>
          </footer>
        </div>  
      </div>
      <!-- #page5 -->

      <div id="page">
        <div class="page_wrap">
          <header>
            <div style="text-align:right;"">
              <img src="https://insboon-assets.s3.ap-northeast-2.amazonaws.com/meritz/logo_meritz_korean.png" alt="메리츠화재" width="145" height="72" style="margin: -0.5mm -0.8mm 0 0" />
            </div>  
          </header>

          <div class="content_wrap">
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
                      <div class="checkbox checked"></div>
                      <p>아니오</p>
                    </div>
                  </div>
                )</div>
              </div>

              <div class="gulim leading-7" style="font-size: 10pt; font-weight: 700; background:#D9D9D9; padding:1mm 2mm; letter-spacing: -0.1mm;">
                (만일, 예로 답하신 경우, 해당 사항을 자세히 기재해 주시기 바랍니다.)
                <div style="font-size:9pt; font-weight: 500; letter-spacing: 0.05mm; margin-top: 12mm;">(*)중대재해사고:사망자1명이상 또는 중대부상자(치료가 6개월이상소요) 2명이상 등이 발생한 사고</div>
              </div>
            </div>


          </div>
          <!-- content_wrap -->
          <footer style="margin-top: auto;">
              <div style="text-align: center; margin-bottom:5mm;" class="page_number"></div>
              <div style="height:3mm; background:linear-gradient(90deg, black, white)"></div>
          </footer>
        </div>
      </div>
      <!-- #page6 -->

      <div id="page">
        <div class="page_wrap">
          <header>
            <div style="text-align:right;"">
              <img src="https://insboon-assets.s3.ap-northeast-2.amazonaws.com/meritz/logo_meritz_korean.png" alt="메리츠화재" width="145" height="72" style="margin: -0.5mm -0.8mm 0 0" />
            </div>  
          </header>

          <div class="content_wrap">
            <h2><span style="font-size:10pt;">Ⅸ</span>. 가입희망 보험조건</h2>

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
                          <div class="checkbox ${perAccidentCoverageLimit == 500000000 ? 'checked' : ''}"></div>
                          <p>5억,</p>
                        </div>
                        <div class="checkbox_wrap">
                          <div class="checkbox ${perAccidentCoverageLimit == 1000000000 ? 'checked' : ''}"></div>
                          <p>10억,</p>
                        </div>
                        <div class="checkbox_wrap">
                          <div class="checkbox ${perAccidentCoverageLimit == 2000000000 ? 'checked' : ''}"></div>
                          <p>20억,</p>
                        </div>
                        <div class="checkbox_wrap">
                          <div class="checkbox ${perAccidentCoverageLimit == 3000000000 ? 'checked' : ''}"></div>
                          <p>30억,</p>
                        </div>
                        <div class="checkbox_wrap">
                          <div class="checkbox ${perAccidentCoverageLimit == 5000000000 ? 'checked' : ''}"></div>
                          <p>50억,</p>
                        </div>
                        <div class="checkbox_wrap">
                          <div class="checkbox ${perAccidentCoverageLimit == 10000000000 ? 'checked' : ''}"></div>
                          <p>100억</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="text-center">총보상한도</td>
                    <td>
                      <div class="flex justify-between" style="padding:0 2mm;">
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
                          <p>20억,</p>
                        </div>
                        <div class="checkbox_wrap">
                          <div class="checkbox ${totCoverageLimit == 3000000000 ? 'checked' : ''}"></div>
                          <p>30억,</p>
                        </div>
                        <div class="checkbox_wrap">
                          <div class="checkbox ${totCoverageLimit == 5000000000 ? 'checked' : ''}"></div>
                          <p>50억,</p>
                        </div>
                        <div class="checkbox_wrap">
                          <div class="checkbox ${totCoverageLimit == 10000000000 ? 'checked' : ''}"></div>
                          <p>100억</p>
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
                          <div class="checkbox ${responseArray.includes(20) ? 'checked' : ''}"></div>
                          <p>가입</p>
                        </div>
                        <div class="checkbox_wrap">
                          <div class="checkbox ${responseArray.includes(21) ? 'checked' : ''}"></div>
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
                          <div class="checkbox ${responseArray.includes(27) ? 'checked' : ''}"></div>
                          <p>가입</p>
                        </div>
                        <div class="checkbox_wrap">
                          <div class="checkbox ${responseArray.includes(26) ? 'checked' : ''}"></div>
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
                          <div class="checkbox ${responseArray.includes(29) ? 'checked' : ''}"></div>
                          <p>가입</p>
                        </div>
                        <div class="checkbox_wrap">
                          <div class="checkbox ${responseArray.includes(28) ? 'checked' : ''}"></div>
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
                          <div class="checkbox ${responseArray.includes(24) ? 'checked' : ''}"></div>
                          <p>가입</p>
                        </div>
                        <div class="checkbox_wrap">
                          <div class="checkbox ${responseArray.includes(25) ? 'checked' : ''}"></div>
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
                    <td>대윈권 포기</td>
                    <td>
                      <div class="flex">
                        <div class="checkbox_wrap" style="width: 40mm;">
                          <div class="checkbox ${responseArray.includes(31) ? 'checked' : ''}"></div>
                          <p>가입</p>
                        </div>
                        <div class="checkbox_wrap">
                          <div class="checkbox ${responseArray.includes(30) ? 'checked' : ''}"></div>
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
                    <span class="text-center" style="width: 20mm;">${joinYear}</span>년<span class="text-center" style="width: 10mm;">${joinMonth}</span>월<span class="text-center" style="width: 10mm;">${joinDay}</span>일
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
              <div style="text-align: center; margin-bottom:5mm;" class="page_number"></div>
              <div style="height:3mm; background:linear-gradient(90deg, black, white)"></div>
          </footer>
        </div>
      </div>
      <!-- page7 -->
    `;
  } else {
    return `
      <script>
        if (typeof window !== 'undefined') {
          window.addEventListener('load', () => {
            const body = document.getElementsByTagName('body')[0];
            let subCompanyPage = document.querySelector('.subCompany_page');
            const subCompanyList = subCompanyPage.querySelector(
              '.subCompany_table_section',
            );

            const computedStyle = window.getComputedStyle(subCompanyList);
            const subCompanyListMaxHeight = Number(
              computedStyle.getPropertyValue('max-height').replace('px', ''),
            );

            function splitContent() {
              let contentElements = Array.from(subCompanyList.children);

              if (subCompanyList.scrollHeight > subCompanyListMaxHeight) {
                let newPage = createNewPage();

                while (subCompanyList.scrollHeight - 1 > subCompanyListMaxHeight) {
                  let element = contentElements.pop();
                  newPage.querySelector('.added_subCompany').prepend(element);
                }

                // 새로운 page를 기존 page들 사이에 삽입
                insertPageInOrder(subCompanyPage, newPage);

                const addedSubCompanyPage = document.querySelector(".added_subCompany_page");
                const addedSubCompanySection = addedSubCompanyPage.querySelector('.added_subCompany');
                const addedSubCompanySectionElements = Array.from(addedSubCompanySection.children);
                const addedSubCompanySectionComputedStyle = window.getComputedStyle(addedSubCompanySection);
                const addedSubCompanySectionMaxHeight = Number(
                      addedSubCompanySectionComputedStyle.getPropertyValue('max-height').replace('px', ''),
                );

                console.log(addedSubCompanyPage);
                console.log(addedSubCompanySection);
                console.log(addedSubCompanySectionElements);
                console.log(addedSubCompanySection.scrollHeight);
                console.log(addedSubCompanySectionMaxHeight);
                
                // 추가된 자회사 페이지 넘었을경우
                if(addedSubCompanySection.scrollHeight > addedSubCompanySectionMaxHeight){
                  let addedNewPage = createNewPage();

                  while(addedSubCompanySection.scrollHeight - 1 > addedSubCompanySectionMaxHeight){
                    let element = addedSubCompanySectionElements.pop();
                    addedNewPage.querySelector('.added_subCompany').prepend(element);
                  }

                  // 새로운 page를 기존 page들 사이에 삽입
                  insertPageInOrder(addedSubCompanyPage, addedNewPage);
                }
                  
                const addedSubCompanyPages = document.querySelectorAll(".added_subCompany_page");

                for(let i = 0; i < addedSubCompanyPages.length; i++) {
                  let addedSubCompanyPage = addedSubCompanyPages[i];
                  let addedSubCompanySection = addedSubCompanyPage.querySelector('.added_subCompany');
                  let addedSubCompanySectionElements = Array.from(addedSubCompanySection.children);
                  let addedSubCompanySectionComputedStyle = window.getComputedStyle(addedSubCompanySection);
                  let addedSubCompanySectionMaxHeight = Number(
                      addedSubCompanySectionComputedStyle.getPropertyValue('max-height').replace('px', ''),
                  );

                  if(addedSubCompanySection.scrollHeight - 1 > addedSubCompanySectionMaxHeight){
                    let addedNewPage = createNewPage();

                    while(addedSubCompanySection.scrollHeight - 1 > addedSubCompanySectionMaxHeight){
                      let element = addedSubCompanySectionElements.pop();
                      addedNewPage.querySelector('.added_subCompany').prepend(element);
                    }

                    // 새로운 page를 기존 page들 사이에 삽입
                    insertPageInOrder(addedSubCompanyPage, addedNewPage);
                  }
                }

                // 페이지 넘버링
                updatePageNumbersAndFooters();
              }
            }

            // 새로운 page을 만드는 함수
            function createNewPage() {
              let newPage = document.createElement('div');
              newPage.id = 'page';
              newPage.classList.add("added_subCompany_page");

              let newPageWrap = document.createElement('div');
              newPageWrap.classList.add('page_wrap');

              let newInner = document.createElement('div');
              newInner.classList.add("inner");

              // 기존 구조 복사
              let newHeader = document
                .getElementsByTagName('header')[0]
                .cloneNode(true);

              let newContentWrap = document.createElement('div');
              newContentWrap.classList.add('content_wrap');

              let newSubCompanyList = document.createElement('div');
              // newSubCompanyList.classList.add('subCompany_table_section');
              newSubCompanyList.classList.add('added_subCompany');

              let newFooter = document
                .getElementsByTagName('footer')[0]
                .cloneNode(true);

              // 새로운 페이지 구조 조립
              newContentWrap.appendChild(newSubCompanyList);

              newInner.appendChild(newHeader);
              newInner.appendChild(newContentWrap);

              newPageWrap.appendChild(newInner);

              newPage.appendChild(newPageWrap);
              newPage.appendChild(newFooter);

              return newPage;
            }

            function insertPageInOrder(currentPage, newPage) {
              // 현재의 page 다음에 새로운 page를 삽입
              if (currentPage.nextElementSibling) {
                body.insertBefore(newPage, currentPage.nextElementSibling);
              }
            }

            // 모든 page_wrap에 번호를 부여하고 footer에 index 추가하는 함수
            function updatePageNumbersAndFooters() {
              const pages = document.querySelectorAll('#page');

              pages.forEach((page, index) => {
                let footerPageNumber = page.querySelector('footer .page_number');

                // 푸터 page_number에 index/total 형태로 추가
                footerPageNumber.textContent = index + 1;
              });
            }

            updatePageNumbersAndFooters();

            splitContent();
          });
        }
      </script>

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

            <div class="content_wrap" style="padding: 0 8.5mm">
              <h2
                style="
                  font-size: 20pt;
                  font-weight: 600;
                  color: #18178e;
                  text-align: center;
                  margin-bottom: 1.5mm;
                "
              >
                기업중대사고배상책임보험 질문서
              </h2>
              <h2
                style="
                  font-size: 11pt;
                  font-weight: 600;
                  text-align: center;
                  margin-bottom: 10mm;
                "
              >
                (Corporate Serious Accidents Liability Insurance Inquiry Form)
              </h2>

              <h3>(주)DB손해보험 귀중</h3>

              <div 
                style="
                  margin-top: 6mm;
                  margin-bottom: 12mm;
                  border: 1px solid #030303;
                  letter-spacing: 0.2mm;
                  line-height: 1.6rem;
                  font-size: 10pt;
                  padding: 0.5mm;
                "
              >
                본 질문서는 청약서와 함께 보험계약의 일부를 이루게 되며, 
                기재 내용이 사실과 다를 경우 보험계약의 효력 또는 보험금 지급에 영향을 미칠 수 있으니, 
                이점 유의하시어 질문사항에 대해 신중히 답하여 주시기 바랍니다.
              </div>

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
                    <th colspan="2">법인의 국적</th>
                    <td>${insuredCorpNationality == null ? '' : insuredCorpNationality}</td>
                  </tr>
                  <tr>
                    <th colspan="2">법인 설립일</th>
                    <td>${insuredCorpFoundationYmd == null ? '' : dayjs(insuredCorpFoundationYmd).format('YYYY.MM.DD')}</td>
                  </tr>
                  <tr>
                    <th rowspan="2">업종 대분류</th>
                    <th>(산재가입기준)</th>
                    <td>${ccaliBizLargeTypeNm}</td>
                  </tr>
                  <tr>
                    <th>(국세청기준)</th>
                    <td>${ntsBizLargeTypeNm}</td>
                  </tr>
                  <tr>
                    <th rowspan="2">업종 소분류</th>
                    <th>(산재가입기준)</th>
                    <td>${ccaliBizTypeNm}</td>
                  </tr>
                  <tr>
                    <th>(국세청기준)</th>
                    <td>${ntsBizTypeNm}</td>
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
                    <th colspan="2">법인 번호</th>
                    <td>${insuredCorpNo == null ? '' : corpFomatter(insuredCorpNo)}</td>
                  </tr>
                </tbody>
              </table>
              <div style="margin-top: 1.5mm;">
                <p style="white-space: nowrap;">* 재무재표상 총 매출액 기준, 단 중앙행정기관 및 지방자치단체인 경우 프로그램 총원가(사업 총원가)를 기재</p>
              </div>

              <div style="margin-top: 12mm;">
                <h3>2. 근로자 정보&ensp;<span style="text-decoration: underline; white-space: nowrap;">(상시근로자 기준* 작성, 하도급, 파견 근로자 등 있는 경우 소속 외 근로자 작성 필수)</span></h3>

                <table style="margin-top: 1mm;">
                  <colgroup>
                    <col style="width: 30%" />
                    <col style="width: 70%" />
                  </colgroup>
                  <tbody>
                    <tr>
                      <th>구&ensp;분</th>
                      <th>내&ensp;용</th>
                    </tr>
                    <tr>
                      <td style="text-align: center; white-space: nowrap;">소속 근로자 수</td>
                      <td>${costFomatter(regularEmployeeCnt)}</td>
                    </tr>
                    <tr>
                      <td style="text-align: center; white-space: nowrap;">소속 외 근로자** 수</td>
                      <td>${costFomatter(dispatchedEmployeeCnt + subcontractEmployeeCnt)}</td>
                    </tr>
                    <tr>
                      <td style="text-align: center; white-space: nowrap;">총 근로자 수</td>
                      <td>${costFomatter(totEmployeeCnt)}</td>
                    </tr>
                    <tr>
                      <td style="text-align: center; white-space: nowrap;">연임금 총액***</td>
                      <td>${costFomatter(totAnnualWages)}</td>
                    </tr>
                  </tbody>
                </table>
                <div style="margin-top: 1.5mm;">
                  <p style="white-space: nowrap;">* 상시근로자 기준 : 고용형태 공시제도 참고&nbsp;<span style="color: rgb(74, 125, 255); white-space: nowrap;">(https://www.work.go.kr/gongsi)</span></p>
                  <p style="white-space: nowrap; margin-top: 2mm;">&emsp;- 홈페이지 내 경로 : 고용형태공시제 안내 - 공시관련 세부내용 - 상시근로자 개념 및 산정방법</p>
                  <p style="white-space: nowrap; margin-top: 2mm;">&emsp;- 상시 300인 이상인 경우 공시 대상으로 위 홈페이지에서 조회 가능, 상시 300인 미만 시 위 기준 준용하여 작성</p>
                  <p style="white-space: nowrap; margin-top: 2mm;">** 소속 외 근로자: 보험가입 사업주가 사업(장)에서 사용하는 다른 사업주 소속의 파견, 하도급 용역 등의 근로자</p>
                  <p style="white-space: nowrap; margin-top: 2mm;">*** 연임금 총액: 소속 근로자수 임금총액을 원칙으로 하되, 소속 외 근로자수 포함인 경우에는 해당 기준을 명기</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- page_wrap -->
        <footer>
          <div class="page_number"></div>
        </footer>
      </div>
      <!-- page -->


      <!-- page 2 -->
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

            <div class="content_wrap" style="padding: 2mm 8.5mm 0">
              <h3>3. 특별약관 가입</h3>
              <table style="margin-top: 1mm;">
                <colgroup>
                  <col style="width: 30%" />
                  <col style="width: 70%" />
                </colgroup>
                <tbody>
                  <tr>
                    <th>담&ensp;보</th>
                    <th>항목</th>
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
                  <tr>
                    <td style="text-align: center; white-space: nowrap;">징벌적 손해배상책임</td>
                    <td style="white-space: nowrap;">필수가입</td>
                  </tr>
                  <tr>
                    <td style="text-align: center; white-space: nowrap;">중대사고 형사방어비용</td>
                    <td>
                      <div class="flex">
                        <div class="checkbox_wrap">
                          <div class="checkbox ${responseArray.includes(20) ? 'checked' : ''}"></div>
                          <p style="white-space: nowrap;">예</p>
                        </div>

                        <div class="checkbox_wrap" style="margin-left: 14mm;">
                          <div class="checkbox ${responseArray.includes(21) ? 'checked' : ''}" style="margin-right: 1mm"></div>
                          <p style="white-space: nowrap;">아니오</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="text-align: center; white-space: nowrap;">위기관리실행비용</td>
                    <td>
                      <div class="flex">
                        <div class="checkbox_wrap">
                          <div class="checkbox ${responseArray.includes(22) || responseArray.includes(171) ? 'checked' : ''}"></div>
                          <p style="white-space: nowrap;">예</p>
                        </div>

                        <div class="checkbox_wrap" style="margin-left: 14mm;">
                          <div class="checkbox ${responseArray.includes(23) && responseArray.includes(172) ? 'checked' : ''}" style="margin-right: 1mm"></div>
                          <p style="white-space: nowrap;">아니오</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="text-align: center; white-space: nowrap;">민사상 배상책임 부담보</td>
                    <td>
                      <div class="flex">
                        <div class="checkbox_wrap">
                          <div class="checkbox ${responseArray.includes(24) ? 'checked' : ''}"></div>
                          <p style="white-space: nowrap;">예</p>
                        </div>

                        <div class="checkbox_wrap" style="margin-left: 14mm;">
                          <div class="checkbox ${responseArray.includes(25) ? 'checked' : ''}" style="margin-right: 1mm"></div>
                          <p style="white-space: nowrap;">아니오</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="text-align: center; white-space: nowrap;">공중교통수단 보장확대</td>
                    <td>
                      <div class="flex">
                        <div class="checkbox_wrap">
                          <div class="checkbox ${responseArray.includes(26) ? 'checked' : ''}" style="margin-right: 1mm"></div>
                          <p style="white-space: nowrap;">아니오</p>
                        </div>

                        <div class="checkbox_wrap" style="margin-left: 14mm;">
                          <div class="checkbox ${responseArray.includes(27) ? 'checked' : ''}" style="margin-right: 1mm"></div>
                          <p style="white-space: nowrap;">예</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="text-align: center; white-space: nowrap;">오염손해 보장확대</td>
                    <td>
                      <div class="flex">
                        <div class="checkbox_wrap">
                          <div class="checkbox ${responseArray.includes(28) ? 'checked' : ''}" style="margin-right: 1mm"></div>
                          <p style="white-space: nowrap;">아니오</p>
                        </div>

                        <div class="checkbox_wrap" style="margin-left: 14mm;">
                          <div class="checkbox ${responseArray.includes(29) ? 'checked' : ''}" style="margin-right: 1mm"></div>
                          <p style="white-space: nowrap;">예</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="text-align: center; white-space: nowrap;">대위권 포기</td>
                    <td>
                      <div class="flex">
                        <div class="checkbox_wrap">
                          <div class="checkbox ${responseArray.includes(30) ? 'checked' : ''}" style="margin-right: 1mm"></div>
                          <p style="white-space: nowrap;">아니오</p>
                        </div>

                        <div class="checkbox_wrap" style="margin-left: 14mm;">
                          <div class="checkbox ${responseArray.includes(31) ? 'checked' : ''}" style="margin-right: 1mm"></div>
                          <p style="white-space: nowrap;">예</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div style="margin-top: 1.5mm;">
                <p style="white-space: nowrap;">* 전체담보 중 보험료(요율)와 직접적으로 관련이 있는 담보 표기(필수담보는 반드시 가입필요)</p>
              </div>

              <div style="margin-top: 12mm;">
                <h3>4. 보험가입조건</h3>

                <table style="margin-top: 1mm;">
                  <colgroup>
                    <col style="width: 30%" />
                    <col style="width: 70%" />
                  </colgroup>
                  <tbody>
                    <tr>
                      <th>담&ensp;보</th>
                      <th>항목</th>
                    </tr>
                    <tr>
                      <td style="text-align: center; white-space: nowrap;">보험담보지역</td>
                      <td>
                        <div class="flex">
                          <div class="checkbox_wrap">
                            <div class="checkbox ${guaranteeRegionCd == 'D' ? 'checked' : ''}" style="margin-right: 1mm"></div>
                            <p style="white-space: nowrap;">국내</p>
                          </div>
    
                          <div class="checkbox_wrap" style="margin-left: 12mm;">
                            <div class="checkbox ${guaranteeRegionCd == 'W' ? 'checked' : ''}" style="margin-right: 1mm"></div>
                            <p style="white-space: nowrap;">전세계(북미제외)</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="text-align: center; white-space: nowrap;">사고당 보상한도</td>
                      <td style="padding: 1mm 13mm;">
                        <div class="flex">
                          <div class="checkbox_wrap">
                            <div class="checkbox ${perAccidentCoverageLimit == 500000000 ? 'checked' : ''}"></div>
                            <p style="white-space: nowrap;">5억</p>
                          </div>
    
                          <div class="checkbox_wrap" style="margin-left: 4mm;">
                            <div class="checkbox ${perAccidentCoverageLimit == 1000000000 ? 'checked' : ''}" style="margin-right: 1mm"></div>
                            <p style="white-space: nowrap;">10억</p>
                          </div>

                          <div class="checkbox_wrap" style="margin-left: 4mm;">
                            <div class="checkbox ${perAccidentCoverageLimit == 2000000000 ? 'checked' : ''}"></div>
                            <p style="white-space: nowrap;">20억</p>
                          </div>
    
                          <div class="checkbox_wrap" style="margin-left: 4mm;">
                            <div class="checkbox ${perAccidentCoverageLimit == 3000000000 ? 'checked' : ''}" style="margin-right: 1mm"></div>
                            <p style="white-space: nowrap;">30억</p>
                          </div>

                          <div class="checkbox_wrap" style="margin-left: 4mm;">
                            <div class="checkbox ${perAccidentCoverageLimit == 5000000000 ? 'checked' : ''}"></div>
                            <p style="white-space: nowrap;">50억</p>
                          </div>
    
                          <div class="checkbox_wrap" style="margin-left: 4mm;">
                            <div class="checkbox ${perAccidentCoverageLimit == 10000000000 ? 'checked' : ''}" style="margin-right: 1mm"></div>
                            <p style="white-space: nowrap;">100억</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="text-align: center; white-space: nowrap;">총 보상한도</td>
                      <td style="padding: 1mm 13mm;">
                        <div class="flex">
                          <div class="checkbox_wrap">
                            <div class="checkbox ${totCoverageLimit == 500000000 ? 'checked' : ''}"></div>
                            <p style="white-space: nowrap;">5억</p>
                          </div>
    
                          <div class="checkbox_wrap" style="margin-left: 4mm;">
                            <div class="checkbox ${totCoverageLimit == 1000000000 ? 'checked' : ''}" style="margin-right: 1mm"></div>
                            <p style="white-space: nowrap;">10억</p>
                          </div>

                          <div class="checkbox_wrap" style="margin-left: 4mm;">
                            <div class="checkbox ${totCoverageLimit == 2000000000 ? 'checked' : ''}"></div>
                            <p style="white-space: nowrap;">20억</p>
                          </div>
    
                          <div class="checkbox_wrap" style="margin-left: 4mm;">
                            <div class="checkbox ${totCoverageLimit == 3000000000 ? 'checked' : ''}" style="margin-right: 1mm"></div>
                            <p style="white-space: nowrap;">30억</p>
                          </div>

                          <div class="checkbox_wrap" style="margin-left: 4mm;">
                            <div class="checkbox ${totCoverageLimit == 5000000000 ? 'checked' : ''}"></div>
                            <p style="white-space: nowrap;">50억</p>
                          </div>
    
                          <div class="checkbox_wrap" style="margin-left: 4mm;">
                            <div class="checkbox ${totCoverageLimit == 10000000000 ? 'checked' : ''}" style="margin-right: 1mm"></div>
                            <p style="white-space: nowrap;">100억</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div style="margin-top: 1.5mm;">
                  <p style="white-space: nowrap;">* 보상한도는 담보별 적용이 아니라 계약 전체로 적용됩니다.</p>
                  <p style="white-space: nowrap; margin-top: 2mm;">* Sub-Limit : 중대사고 형사방어비용 - 보상한도의 30%, 위기관리실행비용 - 보상한도의 5%(단, 최대 1 억원)</p>
                  <p style="white-space: nowrap; margin-top: 2mm;">* 자기부담금 없습니다. (단, 징벌적 손해배상책임은 20% 적용)</p>
                </div>
              </div>

              <div style="margin-top: 24mm;">
                <div
                  style="
                    letter-spacing: 0.2mm;
                    line-height: 1.6rem;
                    padding: 0.5mm;
                  "
                >
                  본 질문서는 청약서와 함께 보험계약의 일부를 이루게 되며, 기재 내용이 사실과 다를 경우 
                  <span style="text-decoration: underline; word-break: break-all; font-weight: bold; font-size: 10pt;">보험계약의 효력 또는 보험금 지급에 영향을 미칠 수 있으니</span>
                  , 이점 유의하시어 질문사항에 대해 신중히 답하여 주시기 바랍니다.
                </div>
              </div>

              <div style="width: 70mm; margin-top: 8mm; margin-left: auto;">
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

              <div style="margin-top: 6mm;">
                <p style="white-space: nowrap;">※ 법인의 경우 서명은 담당자 사인이 아닌 회사 직인으로 날인 바랍니다.</p>
                <p style="white-space: nowrap; margin-top: 2mm;">※ 자회사를 동시에 가입하실 경우 '별첨 1. 자회사 현황'을 작성하여 주시기 바랍니다.</p>
                <p style="white-space: nowrap; margin-top: 2mm;">※ '별첨 2. 중대산업재해 추가 정보','별첨 3. 중대시민재해 추가 정보'는 보험료 할인에 영향을 미칩니다.</p>
              </div>
            </div>
            </div>
          </div>
          <footer>
            <div class="page_number"></div>
          </footer>
        </div>
        <!-- page_wrap -->
      </div>
      <!-- page 2 -->


      <!-- page 3 -->
      <div id="page" class="db subCompany_page">
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

            <div class="content_wrap" style="padding: 6mm 8.5mm 0">
              <h3>&ensp;별첨 1. 자회사 현황</h3>
              
              <table style="margin-top: 1mm;">
                <colgroup>
                  <col style="width: 50%" />
                  <col style="width: 50%" />
                </colgroup>
                <tbody>
                  <tr>
                    <th>구분</th>
                    <th>가입여부</th>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">자회사 가입여부</td>
                    <td style="padding: 1mm 0 1mm 22mm">
                      <div class="flex">
                        <div class="checkbox_wrap">
                          <div class="checkbox ${subCompanyJoinYn == 'Y' ? 'checked' : ''}"></div>
                          <p style="white-space: nowrap;">예</p>
                        </div>

                        <div class="checkbox_wrap" style="margin-left: 14mm;">
                          <div class="checkbox ${subCompanyJoinYn == 'Y' ? '' : 'checked'}" style="margin-right: 1mm"></div>
                          <p style="white-space: nowrap;">아니오</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div style="margin-top: 1.5mm;">
                <p style="white-space: nowrap; letter-spacing: -0.3px;">&emsp;* 자회사: 직접적이든 또는 다른 자회사를 통한 간접이든 관계없이 법인이 발행한 주식(의결권이 없는 주식은 제외합니다.)</p>
                <p style="white-space: nowrap; margin-top: 2mm;">&ensp;&ensp;&ensp;총수의 50%를 초과하는 주식을 소유하고 있는 법인을 말합니다</p>
                <p style="white-space: nowrap; margin-top: 2mm; font-size: 10.5pt; font-weight: bold;">&ensp;&nbsp;※ 자회사 담보시 아래 세부현황 기재해 주시기 바랍니다.</p>
              </div>

              <div style="white-space: nowrap; margin-top: 10mm; font-size: 10.5pt;">【자회사 세부사항】</div>
              <div style="text-align: right; padding-right: 18mm;">(단위: 백만원)</div>
              <table style="margin-top: 1mm;" class="subCompany_table">
                <tbody>
                  <tr>
                    <th>자회사명</th>
                    <th>소재지</th>
                    <th>
                      업종<br />
                      대분류-<br />
                      중분류<br />
                      (산재<br />
                      가입기준)
                    </th>
                    <th>
                      업종<br />
                      대분류-<br />
                      중분류<br />
                      (국세청<br />
                      업종코드<br />
                      기준)
                    </th>
                    <th>
                      소속<br />
                      근로자수
                    </th>
                    <th>
                      소속 외<br />
                      근로자수
                    </th>
                    <th>연임금 총액</th>
                    <th>매출액</th>
                  </tr>
                </tbody>
              </table>

              <div class="subCompany_table_section">
                ${subCompanyTable}
              </div>
            </div>
          </div>
        </div>
        <!-- page_wrap -->
        <footer>
          <div class="page_number"></div>
        </footer>
      </div>
      <!-- page 3 -->


      <!-- page 4 -->
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

            <div class="content_wrap" style="padding: 6mm 8.5mm 0">
              <h3>&ensp;별첨 2. 중대산업재해 추가 정보</h3>
              
              <table class="etc_table" style="margin-top: 6mm;">
                <colgroup>
                  <col style="width: 15%" />
                  <col style="width: 55%" />
                  <col style="width: 35%" />
                  <col style="width: 5%" />
                </colgroup>
                <tbody>
                  <tr>
                    <th>구&ensp;분</th>
                    <th>내&ensp;용</th>
                    <th colspan="2">응&ensp;답</th>
                  </tr>
                  <tr>
                    <td rowspan="4" style="white-space: nowrap;">(1) 관련법 위반</td>
                    <td rowspan="4" style="white-space: nowrap;">
                      최근3년내 산업안전보건법 또는<br />
                      중대재해처벌법(산업재해) 위반 여부
                    </td>
                    <td style="white-space: nowrap; text-align: center;">없음</td>
                    <td class="${responseArray.includes(49) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">1 회</td>
                    <td class="${responseArray.includes(50) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">2 회</td>
                    <td class="${responseArray.includes(51) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">3 회 이상</td>
                    <td class="${responseArray.includes(52) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>

                  <tr>
                    <td rowspan="4" style="white-space: nowrap;">(2) 소송 여부</td>
                    <td rowspan="4" style="white-space: nowrap;">
                      현재 산업안전보건법 또는 중대재해처벌법 관련<br />
                      계류중인 소송 여부
                    </td>
                    <td style="white-space: nowrap; text-align: center;">없음</td>
                    <td class="${responseArray.includes(53) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">1 건</td>
                    <td class="${responseArray.includes(54) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">2 건</td>
                    <td class="${responseArray.includes(55) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">3 건 이상</td>
                    <td class="${responseArray.includes(56) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>

                  <tr>
                    <td rowspan="4" style="white-space: nowrap;">(3) 산재 사망</td>
                    <td rowspan="4" style="white-space: nowrap;">
                      최근 3년내 산업재해 관련 사망자 여부 (3년 누적기준)
                    </td>
                    <td style="white-space: nowrap; text-align: center;">없음</td>
                    <td class="${responseArray.includes(57) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">3 명 이하</td>
                    <td class="${responseArray.includes(58) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">10 명 이하</td>
                    <td class="${responseArray.includes(59) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">11 명 이상</td>
                    <td class="${responseArray.includes(60) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>

                  <tr>
                    <td rowspan="4" style="white-space: nowrap;">(4) 산재 부상</td>
                    <td rowspan="4" style="white-space: nowrap;">
                      최근 3년내 산업재해 관련 부상 인원 여부 (3년 누적기준)
                    </td>
                    <td style="white-space: nowrap; text-align: center;">10 명 이하</td>
                    <td class="${responseArray.includes(61) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">30 명 이하</td>
                    <td class="${responseArray.includes(62) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">50 명 이하</td>
                    <td class="${responseArray.includes(63) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">51 명 이상</td>
                    <td class="${responseArray.includes(64) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>

                  <tr>
                    <td rowspan="4" style="white-space: nowrap;">(5) 산재 질병</td>
                    <td rowspan="4" style="white-space: nowrap;">
                      최근 3년내 산업재해 관련 질병 인원 여부 (3년 누적기준)
                    </td>
                    <td style="white-space: nowrap; text-align: center;">5명 이하</td>
                    <td class="${responseArray.includes(65) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">10 명 이하</td>
                    <td class="${responseArray.includes(66) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">20 명 이하</td>
                    <td class="${responseArray.includes(67) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">21 명 이하</td>
                    <td class="${responseArray.includes(68) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td rowspan="4" style="white-space: nowrap;">(6) 근로자 연령</td>
                    <td rowspan="4" style="white-space: nowrap;">
                      전체 근로자 중 60 대 이상 근로자 비중
                    </td>
                    <td style="white-space: nowrap; text-align: center;">20% 미만</td>
                    <td class="${responseArray.includes(69) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">30% 미만</td>
                    <td class="${responseArray.includes(70) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">40% 미만</td>
                    <td class="${responseArray.includes(71) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">40% 이상</td>
                    <td class="${responseArray.includes(72) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td rowspan="4" style="white-space: nowrap;">
                      (7) 근로성숙도<br />
                      (1년)
                    </td>
                    <td rowspan="4" style="white-space: nowrap;">
                      전체 근로자 중 1 년 미만 근로자 비중
                    </td>
                    <td style="white-space: nowrap; text-align: center;">10% 미만</td>
                    <td class="${responseArray.includes(73) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">15% 미만</td>
                    <td class="${responseArray.includes(74) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">20% 미만</td>
                    <td class="${responseArray.includes(75) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">20% 이상</td>
                    <td class="${responseArray.includes(76) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td rowspan="4" style="white-space: nowrap;">(8) 직원 안전교육</td>
                    <td rowspan="4" style="white-space: nowrap;">
                      산업안전보건법 대비 교육시간
                    </td>
                    <td style="white-space: nowrap; text-align: center;">3 배 이상</td>
                    <td class="${responseArray.includes(77) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">2 배 이상</td>
                    <td class="${responseArray.includes(78) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">1 배 초과</td>
                    <td class="${responseArray.includes(79) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">1 배 이하</td>
                    <td class="${responseArray.includes(80) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td rowspan="4" style="white-space: nowrap;">(9) 외주 안전교육</td>
                    <td rowspan="4" style="white-space: nowrap;">
                      하청직원 작업 전 (1) 안전교육 실시, (2) 점검표 작성
                    </td>
                    <td style="white-space: nowrap; text-align: center;">실시O, 작성O</td>
                    <td class="${responseArray.includes(81) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">실시O, 작성X</td>
                    <td class="${responseArray.includes(82) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">실시X, 작성O</td>
                    <td class="${responseArray.includes(83) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">실시X, 작성X</td>
                    <td class="${responseArray.includes(84) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td rowspan="3" style="white-space: nowrap; text-align: center;">(10) 자율점검표</td>
                    <td rowspan="3" style="white-space: nowrap;">
                      자율점검표 작성 및 긍정 비중
                    </td>
                    <td style="white-space: nowrap; text-align: center;">긍정비율 90% 이상</td>
                    <td class="${responseArray.includes(85) ? 'checked' : ''}" class="checked" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">긍정비율 70% 이상</td>
                    <td class="${responseArray.includes(86) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">긍정비율 50% 이상</td>
                    <td class="${responseArray.includes(87) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <!-- page_wrap -->
        <footer>
          <div class="page_number"></div>
        </footer>
      </div>
      <!-- page 4 -->


      <!-- page 5 -->
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

            <div class="content_wrap" style="padding: 6mm 8.5mm 0">
              <table class="etc_table" style="margin-top: 6mm;">
                <colgroup>
                  <col style="width: 15%" />
                  <col style="width: 55%" />
                  <col style="width: 35%" />
                  <col style="width: 5%" />
                </colgroup>
                <tbody>
                  <tr>
                    <td></td>
                    <td></td>
                    <td style="white-space: nowrap; text-align: center;">긍정비율 50% 미만</td>
                    <td class="${responseArray.includes(88) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td rowspan="4" style="white-space: nowrap;">(11) 하청근로자 비중</td>
                    <td rowspan="4" style="white-space: nowrap;">
                      전체 근로자 대비 외부하청 근로자 비중
                    </td>
                    <td style="white-space: nowrap; text-align: center;">10% 미만</td>
                    <td class="${responseArray.includes(89) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">20% 미만</td>
                    <td class="${responseArray.includes(90) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">30% 미만</td>
                    <td class="${responseArray.includes(91) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">30% 이상</td>
                    <td class="${responseArray.includes(92) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>

                  <tr>
                    <td rowspan="4" style="white-space: nowrap;">(12) 안전보건 점검 횟수</td>
                    <td rowspan="4" style="white-space: nowrap;">
                      보건 및 안전관리에 대한 자율점검*
                    </td>
                    <td style="white-space: nowrap; text-align: center;">1 년에 4회 이상</td>
                    <td class="${responseArray.includes(93) ? 'checked' : ''}" class="checked" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">1 년에 3회</td>
                    <td class="${responseArray.includes(94) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">1 년에 2회</td>
                    <td class="${responseArray.includes(95) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">1 년에 1회</td>
                    <td class="${responseArray.includes(96) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                </tbody>
              </table>

              <div style="margin-top: 14mm; white-space: nowrap;">* 자율점검표</div>

              <table style="margin-top: 1mm;">
                <colgroup>
                  <col style="width: 100%" />
                </colgroup>
                <tbody>
                  <tr>
                    <td>
                      <div style="white-space: nowrap; line-height: 220%;">1. 고용노동부 제공 자율점검표를 우선 적용하고, 해당 업종은 업종우선 - 폐기물처리업 자율점검표</div>
                      <div style="white-space: nowrap; line-height: 220%;">&ensp;&ensp;- 창고 및 운수업 자율점검표</div>
                      <div style="white-space: nowrap; line-height: 220%;">&ensp;&ensp;- 건설업 자율점검표</div>
                      <div style="white-space: nowrap; line-height: 220%;">&ensp;&ensp;- 중소기업 안전보건관리 자율점검표 - 안전보건관리체계 구축 가이드북</div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div style="white-space: nowrap; line-height: 220%;">2. 기업자체 자율점검표는 평가항목이 50 개 이상인 것만 인정</div>
                      <div style="white-space: nowrap; line-height: 220%;">&ensp;&ensp;(문서화가 되어 있어야 하며, Y/N 등 최소 평가기준 충족 필요)</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <!-- page_wrap -->
        <footer>
          <div class="page_number"></div>
        </footer>
      </div>
      <!-- page 5 -->

      <!-- page 6 -->
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

            <div class="content_wrap" style="padding: 6mm 8.5mm 0">
              <h3>&ensp;별첨 3. 중대시민재해 추가 정보</h3>
              
              <table class="etc_table" style="margin-top: 6mm;">
                <colgroup>
                  <col style="width: 15%" />
                  <col style="width: 55%" />
                  <col style="width: 35%" />
                  <col style="width: 5%" />
                </colgroup>
                <tbody>
                  <tr>
                    <th>구&ensp;분</th>
                    <th>내&ensp;용</th>
                    <th colspan="2">응&ensp;답</th>
                  </tr>
                  <tr>
                    <td rowspan="4" style="white-space: nowrap;">(1) 관련법* 위반</td>
                    <td rowspan="4" style="white-space: nowrap;">
                      최근 3년내 관련법* 또는<br />
                      중대재해처벌법 위반 여부
                    </td>
                    <td style="white-space: nowrap; text-align: center;">없음</td>
                    <td class="${responseArray.includes(97) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">1 회</td>
                    <td class="${responseArray.includes(98) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">2 회</td>
                    <td class="${responseArray.includes(99) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">3 회 이상</td>
                    <td class="${responseArray.includes(100) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>

                  <tr>
                    <td rowspan="4" style="white-space: nowrap;">(2) 소송 여부</td>
                    <td rowspan="4" style="white-space: nowrap;">
                      현재 산업안전보건법 또는 중대재해처벌법 관련<br />
                      계류중인 소송 여부
                    </td>
                    <td style="white-space: nowrap; text-align: center;">없음</td>
                    <td class="${responseArray.includes(101) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">1 건</td>
                    <td class="${responseArray.includes(102) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">2 건</td>
                    <td class="${responseArray.includes(103) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">3 건 이상</td>
                    <td class="${responseArray.includes(104) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>

                  <tr>
                    <td rowspan="4" style="white-space: nowrap;">(3) 시민 사망</td>
                    <td rowspan="4" style="white-space: nowrap;">
                      최근 3년내 시민재해 관련 사망자 여부
                    </td>
                    <td style="white-space: nowrap; text-align: center;">없음</td>
                    <td class="${responseArray.includes(105) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">3 명 이하</td>
                    <td class="${responseArray.includes(106) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">10 명 이하</td>
                    <td class="${responseArray.includes(107) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">11 명 이상</td>
                    <td class="${responseArray.includes(108) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>

                  <tr>
                    <td rowspan="4" style="white-space: nowrap;">(4) 시민 부상</td>
                    <td rowspan="4" style="white-space: nowrap;">
                      최근 3년내시민재해관련부상<br />
                      인원 여부
                    </td>
                    <td style="white-space: nowrap; text-align: center;">10 명 이하</td>
                    <td class="${responseArray.includes(109) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">30 명 이하</td>
                    <td class="${responseArray.includes(110) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">50 명 이하</td>
                    <td class="${responseArray.includes(111) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">51 명 이상</td>
                    <td class="${responseArray.includes(112) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>

                  <tr>
                    <td rowspan="4" style="white-space: nowrap;">(5) 시민 질병</td>
                    <td rowspan="4" style="white-space: nowrap;">
                      최근 3년내시민재해관련질병<br />
                      인원 여부
                    </td>
                    <td style="white-space: nowrap; text-align: center;">5명 이하</td>
                    <td class="${responseArray.includes(113) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">10 명 이하</td>
                    <td class="${responseArray.includes(114) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">20 명 이하</td>
                    <td class="${responseArray.includes(115) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">21 명 이상</td>
                    <td class="${responseArray.includes(116) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>

                  <tr>
                    <td rowspan="4" style="white-space: nowrap;">(6) 조직 및 인원</td>
                    <td rowspan="4" style="white-space: nowrap;">
                      중대시민재해를 전담하는 조직 여부
                    </td>
                    <td style="white-space: nowrap; text-align: center;">전담부서, 전담직원 O</td>
                    <td class="${responseArray.includes(117) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">겸직부서, 전담직원 O</td>
                    <td class="${responseArray.includes(118) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">겸직부서, 겸직직원 O</td>
                    <td class="${responseArray.includes(119) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">부서배정 및 직원배정 없음</td>
                    <td class="${responseArray.includes(120) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  
                  <tr>
                    <td rowspan="4" style="white-space: nowrap;">
                      (7) 안전보건점검횟수
                    </td>
                    <td rowspan="4" style="white-space: nowrap;">
                      보건 및 안전관리에 대한 자율점검*
                    </td>
                    <td style="white-space: nowrap; text-align: center;">1년에 4회 이상</td>
                    <td class="${responseArray.includes(121) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">1년에 3회</td>
                    <td class="${responseArray.includes(122) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">1년에 2회</td>
                    <td class="${responseArray.includes(123) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">1년에 1회</td>
                    <td class="${responseArray.includes(124) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>

                  <tr>
                    <td rowspan="4" style="white-space: nowrap;">(8) 모의훈련</td>
                    <td rowspan="4" style="white-space: nowrap;">
                      응급사태 매뉴얼 보유 및 모의 훈련<br />
                      실시
                    </td>
                    <td style="white-space: nowrap; text-align: center;">매뉴얼 X, 모의훈련 O</td>
                    <td class="${responseArray.includes(125) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">매뉴얼 O, 모의훈련 O</td>
                    <td class="${responseArray.includes(126) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">매뉴얼 O, 모의훈련 X</td>
                    <td class="${responseArray.includes(127) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">매뉴얼 X, 모의훈련 X</td>
                    <td class="${responseArray.includes(128) ? 'checked' : ''}" style="white-space: nowrap; text-align: center;"></td>
                  </tr>
                </tbody>
              </table>

              <div style="line-height: 220%;">* 관련법 범위: 제조물책임법, 실내공기질관리법, 시설물의 안전 및 유지관리에 관한 특별법, 다중이용업소의 안전관리에 관한 특별법</div>
            </div>
          </div>
        </div>
        <!-- page_wrap -->
        <footer>
          <div class="page_number"></div>
        </footer>
      </div>
      <!-- page 6 -->


      <!-- page 7 -->
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

            <div class="content_wrap" style="padding: 16mm 8.5mm 0">
              <div style="white-space: nowrap;">*자율점검표</div>

              <table style="margin-top: 1mm;">
                <colgroup>
                  <col style="width: 100%" />
                </colgroup>
                <tbody>
                  <tr>
                    <td style="white-space: nowrap;">- 환경부 제공, 중대재해처벌법 해설, 중대시민재해(원료, 제조물) 점검표</td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap;">&ensp;&ensp;- 환경부 제공, 중대재해처벌법 해설, 중대시민재해(원료, 제조물) 점검표</td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap;">&ensp;&ensp;- 국토교통부 제공, 중대재해처벌법 해설, 중대시민재해(시설물) 점검표</td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap;">&ensp;&ensp;- 다중이용업소 안전관리 등 세부점검표</td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap;">&ensp;&ensp;- 다중이용업소의 안전관리에 관한 특별법 시행규칙 별지제 10 호 서식</td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap;">&ensp;&ensp;- 다중이용업소 실내공기질 점검표</td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap;">&ensp;&ensp;- 고용노동부 제공, 자율점검표</td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap;">&ensp;&ensp;- 폐기물처리업 자율점검표</td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap;">&ensp;&ensp;- 창고 및 운수업 자율점검표</td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap;">&ensp;&ensp;- 건설업 자율점검표</td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap;">&ensp;&ensp;- 중소기업 안전보건관리 자율점검표</td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap;">&ensp;&ensp;- 안전보건관리체계 구축 가이드북</td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap;">2. 기업자체 자율점검표는 평가항목이 50 개 이상인 것만 인정</td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap;">&ensp;&ensp;(문서화가 되어 있어야 하며, Y/N 등 최소 평가기준 충족 필요)</td>
                  </tr>
                </tbody>
              </table>

              <div style="white-space: nowrap; margin-top: 8mm;">※ 업종 대분류가 제조업인 경우 아래 내용을 추가로 기재하여 주시기 바랍니다.</div>

              <table style="margin-top: 1mm;">
                <colgroup>
                  <col style="width: 30%;" />
                  <col style="width: 70%;" />
                </colgroup>
                <tbody>
                  <tr>
                    <td style="white-space: nowrap; text-align: center;">제품 및 원재료명</td>
                    <td>${productType == null ? '' : productType}</td>
                  </tr>
                  <tr>
                    <td style="text-align: center;">
                      고위험 품목 포함여부<br />
                      (해당란에 반드시 V 자 표시해<br />
                      주시기 바랍니다)
                    </td>
                    <td>
                      <div class="flex" style="padding-left: 16mm;">
                        <div class="checkbox_wrap">
                          <div class="checkbox ${highRiskProducts.includes('항공기 및 관련 부품') ? 'checked' : ''}" style="margin-right: 1mm"></div>
                          <p style="white-space: nowrap;">항공기 및 관련 부품,</p>
                        </div>

                        <div class="checkbox_wrap" style="margin-left: 2mm;">
                          <div class="checkbox ${highRiskProducts.includes('완성차 및 관련 부품') ? 'checked' : ''}" style="margin-right: 1mm"></div>
                          <p style="white-space: nowrap;">완성차 및 관련 부품</p>
                        </div>
                      </div>

                      <div class="flex" style="margin-top: 3mm; padding-left: 16mm;">
                        <div class="checkbox_wrap">
                          <div class="checkbox ${highRiskProducts.includes('타이어') ? 'checked' : ''}" style="margin-right: 1mm"></div>
                          <p style="white-space: nowrap;">타이어,</p>
                        </div>

                        <div class="checkbox_wrap" style="margin-left: 2mm;">
                          <div class="checkbox ${highRiskProducts.includes('헬멧') ? 'checked' : ''}" style="margin-right: 1mm"></div>
                          <p style="white-space: nowrap;">헬맷,</p>
                        </div>

                        <div class="checkbox_wrap" style="margin-left: 2mm;">
                          <div class="checkbox ${highRiskProducts.includes('철도 및 철로용 신호장치') ? 'checked' : ''}" style="margin-right: 1mm"></div>
                          <p style="white-space: nowrap;">철도 및 철로용 신호장치,</p>
                        </div>
                      </div>

                      <div class="flex" style="margin-top: 3mm; padding-left: 10mm;">
                        <div class="checkbox_wrap">
                          <div class="checkbox ${highRiskProducts.includes('의약품 및 체내이식형 의료기기') ? 'checked' : ''}" style="margin-right: 1mm"></div>
                          <p style="white-space: nowrap;">의약품 및 의료기기,</p>
                        </div>

                        <div class="checkbox_wrap" style="margin-left: 2mm;">
                          <div class="checkbox ${highRiskProducts.includes('담배') ? 'checked' : ''}" style="margin-right: 1mm"></div>
                          <p style="white-space: nowrap;">담배,</p>
                        </div>

                        <div class="checkbox_wrap" style="margin-left: 2mm;">
                          <div class="checkbox ${highRiskProducts.includes('혈액 및 인체추출 물질') ? 'checked' : ''}" style="margin-right: 1mm"></div>
                          <p style="white-space: nowrap;">혈액 등 인체추출 물질,</p>
                        </div>
                      </div>

                      <div class="flex" style="margin-top: 3mm; padding-left: 6mm;">
                        <div class="checkbox_wrap">
                          <div class="checkbox ${highRiskProducts.includes('농약 및 제초제') ? 'checked' : ''}" style="margin-right: 1mm"></div>
                          <p style="white-space: nowrap;">농약 및 제초제,</p>
                        </div>

                        <div class="checkbox_wrap" style="margin-left: 2mm;">
                          <div class="checkbox ${highRiskProducts.includes('폭죽, 탄약, 화약 등 폭발 용도로 사용되는 제품') ? 'checked' : ''}" style="margin-right: 1mm"></div>
                          <p style="white-space: nowrap;">폭죽, 탄약, 화약 등 폭발 용도로 사용되는 제품</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <!-- page_wrap -->
        <footer>
          <div class="page_number"></div>
        </footer>
      </div>
      <!-- page 7 -->
    `;
  }
};

module.exports = {
  questionOver,
};
