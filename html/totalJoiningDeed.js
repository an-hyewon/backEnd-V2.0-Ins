/**
 * 통합가입확인서
 * @return {string} pdf변환용 string
 */
const { totalStringCss } = require('./css/totalStringCss');
const { totalJoiningDeedCcali } = require('./body/totalJoiningDeedCcali');

const totalJoiningDeed = (data) => {
  const {
    insProdCd, // 보험상품코드
    insComCd, // 보험사코드
    joinDay, // 가입일
  } = data;

  let totalElement = '';
  let insProdNmTitle = '';

  console.log('insertData', data);

  switch (insProdCd) {
    case 'ccali':
      totalElement = totalJoiningDeedCcali(data);
      insProdNmTitle = '기업중대사고 배상책임보험';
      break;

    default:
      totalElement = '';
      insProdNmTitle = '';
      break;
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${insProdNmTitle} 가입확인서</title>

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
          ${totalStringCss('join', insProdCd, insComCd)}
      </head>
      <body>
        ${totalElement}
      </body>
    </html>
  `;
};

module.exports = {
  totalJoiningDeed,
};
