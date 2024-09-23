/**
 * pdf 서류
 * @return {string} pdf변환용 string
 */
const { totalStringCss } = require('./css/totalStringCss');
const { questionUnder } = require('./body/questionUnder');
const { questionOver } = require('./body/questionOver');
const { costNotice } = require('./body/costNotice');
const { rateQuotation } = require('./body/rateQuotation');

const totalFile = (data) => {
  const {
    fileType, // 서류 종류
    instalmentNo, // 분납 횟수
    insProdCd, // 보험상품코드
    insComCd, // 보험사코드
  } = data;

  let fileElement = '';
  let fileTitle = '';

  console.log('insertData', data);

  switch (fileType) {
    case 'questionUnder':
      fileElement = questionUnder(data);
      if (insComCd == 'MR') {
        fileTitle = '기업 중대사고 배상책임보험_보험가입용 설문서';
      } else {
        fileTitle = '기업중대사고 배상책임보험 질문서 50인 미만 사업장용';
      }
      break;

    case 'questionOver':
      fileElement = questionOver(data);
      if (insComCd == 'MR') {
        fileTitle = '기업 중대사고 배상책임보험_보험가입용 설문서';
      } else {
        fileTitle = '기업중대사고 배상책임보험 질문서 50인 이상 사업장용';
      }
      break;

    case 'rateQuotation':
      fileElement = rateQuotation(data);
      if (insComCd == 'MR') {
        fileTitle = 'Quoting Offer for 기업중대사고배상책임보험';
      } else {
        fileTitle = '요율구득 요청서';
      }
      break;

    case 'costNotice':
      fileElement = costNotice(data);
      fileTitle = '보험료 안내문';
      break;

    default:
      fileElement = '';
      fileTitle = '';
      break;
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${fileTitle}</title>

        <!-- googlefont Noto Sans KR -->
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <!-- googlefont Roboto -->
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
          rel="stylesheet"
        />
          ${totalStringCss(fileType, insProdCd, insComCd)}
      </head>
      <body>
        ${fileElement}
      </body>
    </html>
  `;
};

module.exports = {
  totalFile,
};
