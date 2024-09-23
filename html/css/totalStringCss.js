/**
 * 통합가입확인서 css 파일
 * @return {string} pdf변환용 string
 */

const totalStringCss = (fileType, insProdCd, insComCd) => {
  let result = '';

  function targetRowColor(insComCd) {
    let result = '';

    switch (insComCd) {
      case 'MR':
        result = '#333';
        break;

      case 'KB':
        result = '#bbb';
        break;

      case 'DB':
        result = '#333';
        break;

      case 'SM':
        result = '#5bc2e7';
        break;
    }

    return result;
  }

  function targetRowTopColor(insComCd) {
    let result = '';

    switch (insComCd) {
      case 'MR':
        result = '#ee3722';
        break;

      case 'KB':
        result = '#bbb';
        break;

      case 'DB':
        result = 'rgba(0, 133, 74, 1)';
        break;

      case 'SM':
        result = '#5bc2e7';
        break;
    }

    return result;
  }

  switch (fileType) {
    case 'questionUnder':
      if (insComCd == 'MR') {
        result = `
          <style>
            /* style */
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              -moz-box-sizing: border-box;
              border-collapse: collapse;
              line-height: 1.2em;
              font-family: "Noto Sans KR";
            }
            body {
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 0;
              background-color: #f2f2f2;
              font-size: 8.5pt;
              letter-spacing: 0.15mm;       
            }
            ul {
              list-style: none;
            }
            .font_times {
              font-family: "Times New Roman", Times, serif;
            }
            .nanummyeongjo {
              font-family: "NanumMyeongjo";
            }
            .gulim{
              font-family: "굴림";
            }
            .gulim *{
              font-family: "굴림";
            }

            #page {
              position: relative;
              width: 210mm;
              height: 297mm;
              margin: 5mm auto;
              overflow: hidden;
            }
            #page .page_wrap {
              display: flex;
              display: -webkit-flex;
              flex-direction: column;
              padding: 33.55mm 30mm 21.6mm 30mm;
              width: 210mm;
              height: 297mm;
              background: #fff;
              overflow: hidden;
              position:relative;
            }
            #page .page_wrap .content_wrap{
              height:100%;
              overflow: hidden;
            }
            div.subCompany_table_section{
              height:100%;
              max-height: 151mm;
              overflow: hidden;
            }
            div.added_subCompany{
              max-height: 241.85mm;
              height:100%;
              overflow: hidden;
            }

            header{
              position:absolute;
              top:14.5mm;
              right:30mm;
            }

            footer{
              width:calc(100% - 60mm);
              position:absolute;
              bottom:10mm;
              left:30mm;
            }

            h2{
              font-family: 굴림;
              font-size:9.8pt;
              color:white;
              background:black;
              padding:1.8mm 2mm 1.2mm;
              margin:6mm 0 6mm;
              letter-spacing: 0.2mm;
            }

            h3{
              font-family: 굴림;
              font-size:11pt;
              text-decoration: underline;
            }

            table{
              width:100%;
              font-size:9pt;
            }
            table th{
              text-align: left;
              font-size: 10pt;
              font-weight: 500;
              background:#f1f1f1;
              border:0.3mm solid #000;
              padding:1mm 1mm 1mm 2mm;
              letter-spacing: 0.1mm;
            }
            table td{
              border:0.3mm solid #000;
              padding:1mm 1mm 1mm 2mm;
            }
            table.first_table td{
              border:0.3mm solid #000;
              padding:2.5mm 1mm 2.5mm 2mm;
            }

            table.check_table{
              font-size:10pt;
            }
            table.check_table th{
              background:#D9D9D9;
              text-align: center;
            }
            table.check_table td{
              letter-spacing: 0.4mm;
            }
            table.check_table td.check_td{
              text-align: center;
              padding:0;
            }
            table.subCompany_table{}
            table.subCompany_table td{
              border-top:0;
              word-break: break-all;
            }
            table.subCompany_table th:nth-child(1), table.subCompany_table td:nth-child(1){width:11%}
            table.subCompany_table th:nth-child(2), table.subCompany_table td:nth-child(2){width:10%}
            table.subCompany_table th:nth-child(3), table.subCompany_table td:nth-child(3){width:15%}
            table.subCompany_table th:nth-child(4), table.subCompany_table td:nth-child(4){width:17%}
            table.subCompany_table th:nth-child(5), table.subCompany_table td:nth-child(5){width:12%}
            table.subCompany_table th:nth-child(6), table.subCompany_table td:nth-child(6){width:15%}
            table.subCompany_table th:nth-child(7), table.subCompany_table td:nth-child(7){width:10%}
            table.subCompany_table th:nth-child(8), table.subCompany_table td:nth-child(8){width:10%}

            div.added_subCompany table:first-child td{
              border:0.3mm solid #000;
            }


            .checkbox_wrap {
              display: flex;
              display: -webkit-flex;
              align-items: center;
              -webkit-align-items: center;
              -moz-align-items: center;
              -ms-align-items: center;
            }
            .checkbox {
              width: 2.5mm;
              height: 2.5mm;
              border: 0.4mm solid #333;
              margin-right:2mm;
            }
            .checkbox.checked {
              position: relative;
            }
            .checkbox.checked::before {
              content: "✔";
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -55%);
              font-size: 8pt;
            }
            .checkbox_wrap p{
              letter-spacing: 0.2mm;
              line-height: 1.3em;
            }

            .text-center{
              text-align: center;
            }

            .leading-7{
              line-height: 1.75em;
            }
            .leading-7 *{
              line-height: 1.75em;
            }

            .flex {
              display: flex;
              display: -webkit-flex;
            }
            .flex-col {
              flex-direction: column;
              -webkit-flex-direction: column;
              -moz-flex-direction: column;
              -ms-flex-direction: column;
            }
            .justify-between {
              justify-content: space-between;
              -webkit-justify-content: space-between;
              -moz-justify-content: space-between;
              -ms-justify-content: space-between;
            }
            .justify-center {
              justify-content: center;
              -webkit-justify-content: center;
              -moz-justify-content: center;
              -ms-justify-content: center;
            }
            .justify-end {
              justify-content: flex-end;
              -webkit-justify-content: flex-end;
              -moz-justify-content: flex-end;
              -ms-justify-content: flex-end;
            }
            .items-center {
              align-items: center;
              -webkit-align-items: center;
              -moz-align-items: center;
              -ms-align-items: center;
            }
            .items-end {
              align-items: flex-end;
              -webkit-align-items: flex-end;
              -moz-align-items: flex-end;
              -ms-align-items: flex-end;
            }
            .flex-grow-1{
              flex-grow: 1;
              -webkit-box-flex: 1;
              -ms-flex: 1;
            }

            ul.hyphen-list{
              padding-left: 4mm;
            }
            ul.hyphen-list > li{
              list-style: "-";
              padding-left: 2mm;
              line-height: 1.6em;
            }

            ol.number-list{
              padding-left: 4mm;
            }
            ol.number-list > li{
              list-style-type: decimal;
              line-height: 1.6em;
            }

            @page {
              size: A4;
              margin: 0;
            }
            @media print {
              html,
              body {
                width: 210mm;
                height: 297mm;
                background-color: #f2f2f2 !important;
                -webkit-print-color-adjust: exact;
              }
              #page {
                margin: 0;
                border: initial;
                border-radius: initial;
                width: initial;
                min-height: initial;
                box-shadow: initial;
                background: initial;
                page-break-after: always;
              }
            }
          </style>
        `;
      } else if (insComCd == 'DB') {
        result = `
          <style>
            /* style */
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              -moz-box-sizing: border-box;
              border-collapse: collapse;
              line-height: 1.3em;
              font-family: "Noto Sans KR";
              letter-spacing: -0.04mm;
              font-size: 9.5pt;
            }
            body {
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 0;
              background-color: #f2f2f2;
              font-size: 8pt;
              font-weight: 500;
              letter-spacing: 0.1mm;
            }
            ul {
              list-style: none;
            }
            .font_times {
              font-family: "Times New Roman", Times, serif;
            }

            #page {
              position: relative;
              width: 210mm;
              height: 297mm;
              padding: 5mm 0 15mm;
              margin: 0 auto;
            }
            #page .page_wrap {
              /* display: flex;
              display: -webkit-flex;
              flex-direction: column; */
              margin: 0 auto;
              padding: 12mm 8mm;
              width: 190mm;
              height: 277mm;
              background: #fff;
            }

            h1 {
              font-size: 15.5pt;
              margin-bottom: 0mm;
              display: flex;
              display: -webkit-flex;
              align-items: center;
              letter-spacing: 0.4mm;
              white-space: nowrap;
            }

            .header_line {
              display: flex;
              display: -webkit-flex;
              justify-content: end;
              position: relative;
            }
            .header_line .left_line {
              width: 34.5mm;
              height: 1.5mm;
              background: #9aca3b;
              border-radius: 0 10mm 10mm 0;
              position: absolute;
              left: 0;
              top: -0.8mm;
              overflow: hidden;
            }

            .header_line .right_line {
              width: 138mm;
              height: 1.5mm;
              background: #008347;
              border-radius: 10mm 0 0 10mm;
              color: white;
              font-size: 17pt;
              border-right: 0;
              padding-right: 23mm;
            }

            h3 {
              display: flex;
              display: -webkit-flex;
              font-size: 9.5pt;
              font-weight: 900;
              letter-spacing: -0.2mm;
              white-space: nowrap;
            }

            h4 {
              display: flex;
              display: -webkit-flex;
              align-items: center;
              -webkit-align-items: center;
              -moz-align-items: center;
              -ms-align-items: center;
              font-size: 11pt;
              margin-top: 2mm;
              white-space: nowrap;
            }
            h4:before {
              content: "";
              width: 1mm;
              height: 1mm;
              background: #00a48b;
              border-radius: 50%;
              margin-right: 2mm;
            }

            table {
              margin-bottom: 0.5mm;
              width: 100%;
              font-size: 9pt;
              border: 0.3mm solid #3e3e3e;
            }

            table tr th {
              font-size: 9.5pt;
              font-weight: 400;
              border: 0.3mm solid #3e3e3e;
              padding: 0.6mm 1mm;
              text-align: center;
              background: #f1f1f1;
              white-space: nowrap;
            }
            table tr td {
              border: 0.3mm solid #3e3e3e;
              padding: 1mm 4mm;
              font-size: 9.5pt;
            }
            table tr th:first-of-type {
              border-left: 0;
            }
            table tr td:first-child {
              border-left: 0;
            }
            table tr th:last-of-type,
            table tr td:last-of-type {
              border-right: 0;
            }

            table.no_padding_table th {
              padding: 0.1mm 0.1mm;
            }
            table.no_padding_table td {
              padding: 0.1mm 0.1mm;
            }

            table.borderless {
              border: 0;
            }
            table.borderless td {
              border: 0;
              padding: 1mm 0;
            }

            footer {
              padding-top: 1mm;
            }

            footer table {
            }

            .checkbox_wrap {
              display: flex;
              display: -webkit-flex;
              align-items: center;
              -webkit-align-items: center;
              -moz-align-items: center;
              -ms-align-items: center;
            }
            .checkbox {
              width: 1.5mm;
              height: 1.5mm;
              border: 0.4mm solid #333;
              margin-left: 1mm;
            }
            .checkbox.checked {
              position: relative;
            }
            .checkbox.checked::before {
              content: "✔";
              font-size: 11pt;
              position: absolute;
              top: -2.4mm;
              left: 100%;
              transform: translateX(-55%);
            }
            .checkbox.orange {
              border: 0.4mm solid #f98e46;
            }

            .orange_border_box {
              border: 2px dashed #f68b1f;
              padding: 0.8mm 2mm;
              margin-right: -4mm;
            }

            .flex {
              display: flex;
              display: -webkit-flex;
            }
            .flex-col {
              flex-direction: column;
              -webkit-flex-direction: column;
              -moz-flex-direction: column;
              -ms-flex-direction: column;
            }
            .justify-between {
              justify-content: space-between;
              -webkit-justify-content: space-between;
              -moz-justify-content: space-between;
              -ms-justify-content: space-between;
            }
            .justify-center {
              justify-content: center;
              -webkit-justify-content: center;
              -moz-justify-content: center;
              -ms-justify-content: center;
            }
            .justify-end {
              justify-content: flex-end;
              -webkit-box-pack: end;
              -moz-box-pack: end;
              -ms-flex-pack: end;
              -webkit-justify-content: flex-end;
            }
            .items-start {
              align-items: flex-start;
              -webkit-align-items: flex-start;
              -moz-align-items: flex-start;
              -ms-align-items: flex-start;
            }
            .items-center {
              align-items: center;
              -webkit-align-items: center;
              -moz-align-items: center;
              -ms-align-items: center;
            }
            .items-end {
              align-items: flex-end;
              -webkit-align-items: flex-end;
              -moz-align-items: flex-end;
              -ms-align-items: flex-end;
            }

            ul.circle_list {
            }
            ul.circle_list li {
              display: flex;
              display: -webkit-flex;
              align-items: baseline;
              -webkit-align-items: baseline;
              -moz-align-items: baseline;
              -ms-align-items: baseline;
              letter-spacing: -0.15mm;
            }
            ul.circle_list li::before {
              content: "○";
              display: block;
              /* width: 2.5mm;
              height: 2.5mm;
              border-radius: 50%;
              border: 0.1mm solid #555; */

              margin-right: 1mm;
            }

            .fs11 {
              font-size: 11pt;
              line-height: 1.3em;
            }
            .fs11 * {
              font-size: 11pt;
            }
            .bold {
              font-weight: 700;
            }

            @page {
              size: A4;
              margin: 0;
            }
            @media print {
              html,
              body {
                width: 210mm;
                height: 297mm;
                background-color: #f2f2f2 !important;
                -webkit-print-color-adjust: exact;
              }
              #page {
                margin: 0;
                border: initial;
                border-radius: initial;
                width: initial;
                min-height: initial;
                box-shadow: initial;
                background: initial;
                page-break-after: always;
              }
            }
          </style>
        `;
      }
      break;

    case 'questionOver':
      if (insComCd == 'MR') {
        result = `
          <style>
            /* style */
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              -moz-box-sizing: border-box;
              border-collapse: collapse;
              line-height: 1.2em;
              font-family: "Noto Sans KR";
            }
            body {
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 0;
              background-color: #f2f2f2;
              font-size: 8.5pt;
              letter-spacing: 0.15mm;       
            }
            ul {
              list-style: none;
            }
            .font_times {
              font-family: "Times New Roman", Times, serif;
            }
            .nanummyeongjo {
              font-family: "NanumMyeongjo";
            }
            .gulim{
              font-family: "굴림";
            }
            .gulim *{
              font-family: "굴림";
            }

            #page {
              position: relative;
              width: 210mm;
              height: 297mm;
              margin: 5mm auto;
              overflow: hidden;
            }
            #page .page_wrap {
              display: flex;
              display: -webkit-flex;
              flex-direction: column;
              padding: 33.55mm 30mm 21.6mm 30mm;
              width: 210mm;
              height: 297mm;
              background: #fff;
              overflow: hidden;
              position:relative;
            }
            #page .page_wrap .content_wrap{
              height:100%;
              overflow: hidden;
            }
            div.subCompany_table_section{
              height:100%;
              max-height: 151mm;
              overflow: hidden;
            }
            div.added_subCompany{
              max-height: 241.85mm;
              height:100%;
              overflow: hidden;
            }

            header{
              position:absolute;
              top:14.5mm;
              right:30mm;
            }

            footer{
              width:calc(100% - 60mm);
              position:absolute;
              bottom:10mm;
              left:30mm;
            }

            h2{
              font-family: 굴림;
              font-size:9.8pt;
              color:white;
              background:black;
              padding:1.8mm 2mm 1.2mm;
              margin:6mm 0 6mm;
              letter-spacing: 0.2mm;
            }

            h3{
              font-family: 굴림;
              font-size:11pt;
              text-decoration: underline;
            }

            table{
              width:100%;
              font-size:9pt;
            }
            table th{
              text-align: left;
              font-size: 10pt;
              font-weight: 500;
              background:#f1f1f1;
              border:0.3mm solid #000;
              padding:1mm 1mm 1mm 2mm;
              letter-spacing: 0.1mm;
            }
            table td{
              border:0.3mm solid #000;
              padding:1mm 1mm 1mm 2mm;
            }
            table.first_table td{
              border:0.3mm solid #000;
              padding:2.5mm 1mm 2.5mm 2mm;
            }

            table.check_table{
              font-size:10pt;
            }
            table.check_table th{
              background:#D9D9D9;
              text-align: center;
            }
            table.check_table td{
              letter-spacing: 0.4mm;
            }
            table.check_table td.check_td{
              text-align: center;
              padding:0;
            }
            table.subCompany_table{}
            table.subCompany_table td{
              border-top:0;
              word-break: break-all;
            }
            table.subCompany_table th:nth-child(1), table.subCompany_table td:nth-child(1){width:11%}
            table.subCompany_table th:nth-child(2), table.subCompany_table td:nth-child(2){width:10%}
            table.subCompany_table th:nth-child(3), table.subCompany_table td:nth-child(3){width:15%}
            table.subCompany_table th:nth-child(4), table.subCompany_table td:nth-child(4){width:17%}
            table.subCompany_table th:nth-child(5), table.subCompany_table td:nth-child(5){width:12%}
            table.subCompany_table th:nth-child(6), table.subCompany_table td:nth-child(6){width:15%}
            table.subCompany_table th:nth-child(7), table.subCompany_table td:nth-child(7){width:10%}
            table.subCompany_table th:nth-child(8), table.subCompany_table td:nth-child(8){width:10%}

            div.added_subCompany table:first-child td{
              border:0.3mm solid #000;
            }


            .checkbox_wrap {
              display: flex;
              display: -webkit-flex;
              align-items: center;
              -webkit-align-items: center;
              -moz-align-items: center;
              -ms-align-items: center;
            }
            .checkbox {
              width: 2.5mm;
              height: 2.5mm;
              border: 0.4mm solid #333;
              margin-right:2mm;
            }
            .checkbox.checked {
              position: relative;
            }
            .checkbox.checked::before {
              content: "✔";
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -55%);
              font-size: 8pt;
            }
            .checkbox_wrap p{
              letter-spacing: 0.2mm;
              line-height: 1.3em;
            }

            .text-center{
              text-align: center;
            }

            .leading-7{
              line-height: 1.75em;
            }
            .leading-7 *{
              line-height: 1.75em;
            }

            .flex {
              display: flex;
              display: -webkit-flex;
            }
            .flex-col {
              flex-direction: column;
              -webkit-flex-direction: column;
              -moz-flex-direction: column;
              -ms-flex-direction: column;
            }
            .justify-between {
              justify-content: space-between;
              -webkit-justify-content: space-between;
              -moz-justify-content: space-between;
              -ms-justify-content: space-between;
            }
            .justify-center {
              justify-content: center;
              -webkit-justify-content: center;
              -moz-justify-content: center;
              -ms-justify-content: center;
            }
            .justify-end {
              justify-content: flex-end;
              -webkit-justify-content: flex-end;
              -moz-justify-content: flex-end;
              -ms-justify-content: flex-end;
            }
            .items-center {
              align-items: center;
              -webkit-align-items: center;
              -moz-align-items: center;
              -ms-align-items: center;
            }
            .items-end {
              align-items: flex-end;
              -webkit-align-items: flex-end;
              -moz-align-items: flex-end;
              -ms-align-items: flex-end;
            }
            .flex-grow-1{
              flex-grow: 1;
              -webkit-box-flex: 1;
              -ms-flex: 1;
            }

            ul.hyphen-list{
              padding-left: 4mm;
            }
            ul.hyphen-list > li{
              list-style: "-";
              padding-left: 2mm;
              line-height: 1.6em;
            }

            ol.number-list{
              padding-left: 4mm;
            }
            ol.number-list > li{
              list-style-type: decimal;
              line-height: 1.6em;
            }

            @page {
              size: A4;
              margin: 0;
            }
            @media print {
              html,
              body {
                width: 210mm;
                height: 297mm;
                background-color: #f2f2f2 !important;
                -webkit-print-color-adjust: exact;
              }
              #page {
                margin: 0;
                border: initial;
                border-radius: initial;
                width: initial;
                min-height: initial;
                box-shadow: initial;
                background: initial;
                page-break-after: always;
              }
            }
          </style>
        `;
      } else if (insComCd == 'DB') {
        result = `
          <style>
            /* style */
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              -moz-box-sizing: border-box;
              border-collapse: collapse;
              line-height: 1.3em;
              font-family: "Noto Sans KR";
              letter-spacing: -0.04mm;
              font-size: 9.5pt;
            }
            body {
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 0;
              background-color: #f2f2f2;
              font-size: 8pt;
              font-weight: 500;
              letter-spacing: 0.1mm;
            }
            ul {
              list-style: none;
            }
            .font_times {
              font-family: "Times New Roman", Times, serif;
            }

            #page {
              position: relative;
              width: 210mm;
              height: 297mm;
              padding: 5mm 0 15mm;
              margin: 0 auto;
              overflow: hidden;
            }
            #page .page_wrap {
              /* display: flex;
              display: -webkit-flex;
              flex-direction: column; */
              margin: 0 auto;
              padding: 8mm 8mm;
              width: 190mm;
              height: 277mm;
              background: #fff;
              overflow: hidden;
            }
            #page .page_wrap .content_wrap{
              height:230mm;
              overflow: hidden;
              padding:6mm 8.5mm 0;
            }
            .inner{
              height: 100%; 
              border: 0.5mm solid #030303; 
              padding: 1mm 1mm;
            }
            div.subCompany_table_section{
              height:100%;
              max-height: 137mm;
              overflow: hidden;
            }

            div.added_subCompany{
              max-height: 228mm;
              height:100%;
              overflow: hidden;
            }

            div.added_subCompany table:first-child td{
              border:0.3mm solid #3e3e3e;
            }

            h1 {
              font-size: 15.5pt;
              margin-bottom: 0mm;
              display: flex;
              display: -webkit-flex;
              align-items: center;
              letter-spacing: 0.4mm;
              white-space: nowrap;
            }

            .header_line {
              display: flex;
              display: -webkit-flex;
              justify-content: end;
              position: relative;
            }
            .header_line .left_line {
              width: 34.5mm;
              height: 1.5mm;
              background: #9aca3b;
              border-radius: 0 10mm 10mm 0;
              position: absolute;
              left: 0;
              top: -0.8mm;
              overflow: hidden;
            }

            .header_line .right_line {
              width: 138mm;
              height: 1.5mm;
              background: #008347;
              border-radius: 10mm 0 0 10mm;
              color: white;
              font-size: 17pt;
              border-right: 0;
              padding-right: 23mm;
            }

            h3 {
              display: flex;
              display: -webkit-flex;
              font-size: 9.5pt;
              font-weight: 900;
              letter-spacing: -0.2mm;
              white-space: nowrap;
            }

            h4 {
              display: flex;
              display: -webkit-flex;
              align-items: center;
              -webkit-align-items: center;
              -moz-align-items: center;
              -ms-align-items: center;
              font-size: 11pt;
              margin-top: 2mm;
              white-space: nowrap;
            }
            h4:before {
              content: "";
              width: 1mm;
              height: 1mm;
              background: #00a48b;
              border-radius: 50%;
              margin-right: 2mm;
            }

            table {
              margin-bottom: 0.5mm;
              width: 100%;
              font-size: 9pt;
              border: 0.3mm solid #3e3e3e;
            }

            table tr th {
              font-size: 9.5pt;
              font-weight: 400;
              border: 0.3mm solid #3e3e3e;
              padding: 0.6mm 1mm;
              text-align: center;
              background: #f1f1f1;
              white-space: nowrap;
            }
            table tr td {
              border: 0.3mm solid #3e3e3e;
              padding: 1mm 4mm;
              font-size: 9.5pt;
            }
            table.etc_table tr td {
              padding: 0.35mm 4mm;
            }
            table tr th:first-of-type {
              border-left: 0;
            }
            table tr td:first-child {
              border-left: 0;
            }
            table tr th:last-of-type,
            table tr td:last-of-type {
              border-right: 0;
            }
            table tr td.checked {
              position: relative;
            }
            table tr td.checked::before {
              content: "✔";
              font-size: 11pt;
              position: absolute;
              top: -0.3mm;
              left: 100%;
              transform: translateX(-150%);
            }

            table.no_padding_table th {
              padding: 0.1mm 0.1mm;
            }
            table.no_padding_table td {
              padding: 0.1mm 0.1mm;
            }

            table.borderless {
              border: 0;
            }
            table.borderless td {
              border: 0;
              padding: 1mm 0;
            }

            table.subCompany_table{
              margin:0;
              border:0;
            }
            table.subCompany_table th{
              width:12.5%;
            }
            table.subCompany_table th:first-child, table.subCompany_table td:first-child{
              border-left:0.3mm solid #3e3e3e;
            }
            table.subCompany_table th:last-child, table.subCompany_table td:last-child{
              border-right:0.3mm solid #3e3e3e;
            }
            table.subCompany_table td{
              border-top:0;
              word-break: break-all;
              width:12.5%;
              padding: 1mm 1mm;
            }

            footer {
              /* padding-top: 1mm; */
              position: absolute;
              bottom: 24mm;
              left: 0;
              right: 0;
              padding: 4mm;
              text-align: center;
            }

            footer table {
            }

            .checkbox_wrap {
              display: flex;
              display: -webkit-flex;
              align-items: center;
              -webkit-align-items: center;
              -moz-align-items: center;
              -ms-align-items: center;
            }
            .checkbox {
              width: 1.5mm;
              height: 1.5mm;
              border: 0.4mm solid #333;
              margin-left: 1mm;
            }
            .checkbox.checked {
              position: relative;
            }
            .checkbox.checked::before {
              content: "✔";
              font-size: 11pt;
              position: absolute;
              top: -2.4mm;
              left: 100%;
              transform: translateX(-55%);
            }
            .checkbox.orange {
              border: 0.4mm solid #f98e46;
            }

            .orange_border_box {
              border: 2px dashed #f68b1f;
              padding: 0.8mm 2mm;
              margin-right: -4mm;
            }

            .flex {
              display: flex;
              display: -webkit-flex;
            }
            .flex-col {
              flex-direction: column;
              -webkit-flex-direction: column;
              -moz-flex-direction: column;
              -ms-flex-direction: column;
            }
            .justify-between {
              justify-content: space-between;
              -webkit-justify-content: space-between;
              -moz-justify-content: space-between;
              -ms-justify-content: space-between;
            }
            .justify-center {
              justify-content: center;
              -webkit-justify-content: center;
              -moz-justify-content: center;
              -ms-justify-content: center;
            }
            .justify-end {
              justify-content: flex-end;
              -webkit-box-pack: end;
              -moz-box-pack: end;
              -ms-flex-pack: end;
              -webkit-justify-content: flex-end;
            }
            .items-start {
              align-items: flex-start;
              -webkit-align-items: flex-start;
              -moz-align-items: flex-start;
              -ms-align-items: flex-start;
            }
            .items-center {
              align-items: center;
              -webkit-align-items: center;
              -moz-align-items: center;
              -ms-align-items: center;
            }
            .items-end {
              align-items: flex-end;
              -webkit-align-items: flex-end;
              -moz-align-items: flex-end;
              -ms-align-items: flex-end;
            }

            ul.circle_list {
            }
            ul.circle_list li {
              display: flex;
              display: -webkit-flex;
              align-items: baseline;
              -webkit-align-items: baseline;
              -moz-align-items: baseline;
              -ms-align-items: baseline;
              letter-spacing: -0.15mm;
            }
            ul.circle_list li::before {
              content: "○";
              display: block;
              /* width: 2.5mm;
              height: 2.5mm;
              border-radius: 50%;
              border: 0.1mm solid #555; */

              margin-right: 1mm;
            }

            .fs11 {
              font-size: 11pt;
              line-height: 1.3em;
            }
            .fs11 * {
              font-size: 11pt;
            }
            .bold {
              font-weight: 700;
            }

            @page {
              size: A4;
              margin: 0;
            }
            @media print {
              html,
              body {
                width: 210mm;
                height: 297mm;
                background-color: #f2f2f2 !important;
                -webkit-print-color-adjust: exact;
              }
              #page {
                margin: 0;
                border: initial;
                border-radius: initial;
                width: initial;
                min-height: initial;
                box-shadow: initial;
                background: initial;
                page-break-after: always;
              }
            }
          </style>
          `;
      }
      break;

    case 'rateQuotation':
      if (insComCd == 'MR') {
        result = `
          <style>
            /* style */
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              -moz-box-sizing: border-box;
              border-collapse: collapse;
              line-height: 1.2em;
              font-family: "Noto Sans KR";
            }
            body {
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 0;
              background-color: #f2f2f2;
              font-size: 10pt;
              
            }
            ul {
              list-style: none;
            }
            .font_times {
              font-family: "Times New Roman", Times, serif;
            }
            .nanummyeongjo {
              font-family: "NanumMyeongjo";
            }

            #page {
              position: relative;
              width: 210mm;
              height: 297mm;
              margin: 5mm auto;
            }
            #page .page_wrap {
              display: flex;
              display: -webkit-flex;
              flex-direction: column;
              margin: 0 auto;
              padding: 14.5mm 30mm 5mm 30mm;
              width: 210mm;
              height: 297mm;
              background: #fff;
            }

            div.ins_logo {
              background-repeat: no-repeat;
              background-size: 100% auto;
              background-position: left 0;
            }

            .db div.ins_logo {
              width: 45mm;
              height: 12mm;
              background-image: url("https://insboon-assets.s3.ap-northeast-2.amazonaws.com/form_db_logo.svg");
              background-position: -10px center;
            }

            h1 {
            }

            h3 {
              margin-bottom: 1mm;
            }
            dl{
              display: flex;
              display: -webkit-flex;
              font-size: 10.5pt;
              letter-spacing: 0.1mm;

            }
            dl dt{
              flex-shrink: 0;
              font-weight: 900;
              margin-right:6mm;
              line-height: 1.6em;
            }
            dl dd{
              display: flex;
              display: -webkit-flex;
              line-height: 1.6em;
              letter-spacing: 0.14mm;
            }
            dl dd *{
              line-height: 1.6em;
              letter-spacing: 0.14mm;
            }

            ul{}
            ul li{
              margin-bottom:2.4mm;
            }

            .checkbox_wrap {
              display: flex;
              display: -webkit-flex;
              align-items: center;
              -webkit-align-items: center;
              -moz-align-items: center;
              -ms-align-items: center;
            }
            .checkbox {
              width: 2.3mm;
              height: 1.7mm;
              border: 0.4mm solid #333;
              margin-right:2mm;
            }
            .checkbox.checked {
              position: relative;
            }
            .checkbox.checked::before {
              content: "✔";
              position: absolute;
              top: -2.5mm;
              left: 50%;
              transform: translateX(-50%);
              font-size: 8pt;
            }
            .checkbox_wrap p{
              font-size:10.5pt;
              letter-spacing: 0.2mm;
              line-height: 1.3em;
            }

            .flex {
              display: flex;
              display: -webkit-flex;
            }
            .direction-column {
              flex-direction: column;
              -webkit-flex-direction: column;
              -moz-flex-direction: column;
              -ms-flex-direction: column;
            }
            .justify-between {
              justify-content: space-between;
              -webkit-justify-content: space-between;
              -moz-justify-content: space-between;
              -ms-justify-content: space-between;
            }
            .justify-center {
              justify-content: center;
              -webkit-justify-content: center;
              -moz-justify-content: center;
              -ms-justify-content: center;
            }
            .justify-end {
              justify-content: flex-end;
              -webkit-justify-content: flex-end;
              -moz-justify-content: flex-end;
              -ms-justify-content: flex-end;
            }
            .items-center {
              align-items: center;
              -webkit-align-items: center;
              -moz-align-items: center;
              -ms-align-items: center;
            }
            .items-end {
              align-items: flex-end;
              -webkit-align-items: flex-end;
              -moz-align-items: flex-end;
              -ms-align-items: flex-end;
            }

            @page {
              size: A4;
              margin: 0;
            }
            @media print {
              html,
              body {
                width: 210mm;
                height: 297mm;
                background-color: #f2f2f2 !important;
                -webkit-print-color-adjust: exact;
              }
              #page {
                margin: 0;
                border: initial;
                border-radius: initial;
                width: initial;
                min-height: initial;
                box-shadow: initial;
                background: initial;
                page-break-after: always;
              }
            }
          </style>
        `;
      } else if (insComCd == 'DB') {
        result = `
          <style>
            /* style */
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              -moz-box-sizing: border-box;
              border-collapse: collapse;
              line-height: 1.2;
              font-family: "Noto Sans KR";
            }
            body {
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 0;
              background-color: #f2f2f2;
              font-size: 8pt;
            }
            ul {
              list-style: none;
            }
            .font_times {
              font-family: "Times New Roman", Times, serif;
            }
            .nanummyeongjo {
              font-family: "NanumMyeongjo";
            }

            #page {
              position: relative;
              width: 210mm;
              height: 297mm;
              padding: 0 0 15mm;
              margin: 0 auto;
            }
            #page .page_wrap {
              display: flex;
              display: -webkit-flex;
              flex-direction: column;
              margin: 0 auto;
              padding: 8mm 5mm 5mm;
              width: 210mm;
              height: 297mm;
              background: #fff;
            }

            div.ins_logo {
              background-repeat: no-repeat;
              background-size: 100% auto;
              background-position: left 0;
            }

            .meritz div.ins_logo {
              width: 55mm;
              height: 11mm;
              background-image: url("https://insboon-assets.s3.ap-northeast-2.amazonaws.com/pdf/logo_meritz.png");
            }
            .db div.ins_logo {
              width: 45mm;
              height: 12mm;
              background-image: url("https://insboon-assets.s3.ap-northeast-2.amazonaws.com/form_db_logo.svg");
              background-position: -10px center;
            }
            .kb div.ins_logo {
              width: 50mm;
              height: 9mm;
              background-image: url("https://insboon-assets.s3.ap-northeast-2.amazonaws.com/kb_logo.png");
              margin-top: 4mm;
            }
            .samsung div.ins_logo {
              width: 30mm;
              height: 10mm;
              background-image: url("https://insboon-assets.s3.ap-northeast-2.amazonaws.com/pdf/logo_samsung.png");
            }


            h1 {
            }

            h3 {
              margin-bottom: 1mm;
            }
            table {
              width: 100%;
            }
            .meritz table {
              border-top: 0.55mm solid #ee3722;
            }
            .db table {
              border-top: 0.55mm solid rgba(0, 133, 74, 1);
            }

            table tr th {
              font-size: 10pt;
              font-weight: bold;
              border: 0.3mm solid #ebebec;
              padding: 2mm 2mm;
              text-align: left;
            }
            table tr td {
              font-size: 9.5pt;
              border: 0.3mm solid #ebebec;
              padding: 2mm 2mm;
            }
            table tr th:first-of-type {
              border-left: 0;
            }
            table tr td:first-child {
              border-left: 0;
            }
            table tr th:last-of-type,
            table tr td:last-of-type {
              border-right: 0;
            }

            .meritz table tr th {
              background-color: #ddd;
            }
            .db table tr th {
              background-color: #f1f7e4;
            }

            footer {
              border-top: 0.55mm solid rgba(0, 133, 74, 1);
              padding-top: 1mm;
            }

            .checkbox_wrap {
              display: flex;
              display: -webkit-flex;
              align-items: center;
              -webkit-align-items: center;
              -moz-align-items: center;
              -ms-align-items: center;
            }
            .checkbox {
              width: 2.5mm;
              height: 2.5mm;
              border: 0.4mm solid #333;
            }
            .checkbox.checked {
              position: relative;
            }
            .checkbox.checked::before {
              content: "✔";
              font-size: 7pt;
              position: absolute;
              top: -1.5px;
              left: 50%;
              transform: translateX(-50%);
            }

            .flex {
              display: flex;
              display: -webkit-flex;
            }
            .direction-column {
              flex-direction: column;
              -webkit-flex-direction: column;
              -moz-flex-direction: column;
              -ms-flex-direction: column;
            }
            .justify-between {
              justify-content: space-between;
              -webkit-justify-content: space-between;
              -moz-justify-content: space-between;
              -ms-justify-content: space-between;
            }
            .justify-center {
              justify-content: center;
              -webkit-justify-content: center;
              -moz-justify-content: center;
              -ms-justify-content: center;
            }
            .justify-end {
              justify-content: flex-end;
              -webkit-justify-content: flex-end;
              -moz-justify-content: flex-end;
              -ms-justify-content: flex-end;
            }
            .items-center {
              align-items: center;
              -webkit-align-items: center;
              -moz-align-items: center;
              -ms-align-items: center;
            }
            .items-end {
              align-items: flex-end;
              -webkit-align-items: flex-end;
              -moz-align-items: flex-end;
              -ms-align-items: flex-end;
            }

            @page {
              size: A4;
              margin: 0;
            }
            @media print {
              html,
              body {
                width: 210mm;
                height: 297mm;
                background-color: #f2f2f2 !important;
                -webkit-print-color-adjust: exact;
              }
              #page {
                margin: 0;
                border: initial;
                border-radius: initial;
                width: initial;
                min-height: initial;
                box-shadow: initial;
                background: initial;
                page-break-after: always;
              }
            }
          </style>
        `;
      }
      break;

    case 'costNotice':
      result = `
        <style>
          /* style */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -moz-box-sizing: border-box;
            border-collapse: collapse;
            line-height: 1.2;
            font-family: "Noto Sans KR";
          }
          body {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            background-color: #f2f2f2;
            font-size: 8pt;
          }
          ul {
            list-style: none;
          }
          .font_times {
            font-family: "Times New Roman", Times, serif;
          }
          .nanummyeongjo {
            font-family: "NanumMyeongjo";
          }

          #page {
            position: relative;
            width: 210mm;
            height: 297mm;
            padding: 0 0 15mm;
            margin: 0 auto 10mm;
          }
          #page .page_wrap {
            display: flex;
            display: -webkit-flex;
            flex-direction: column;
            margin: 0 auto;
            padding: 8mm 5mm 5mm;
            width: 210mm;
            height: 297mm;
            background: #fff;
          }

          div.ins_logo {
            background-repeat: no-repeat;
            background-size: 100% auto;
            background-position: left 0;
          }

          .meritz div.ins_logo {
            width: 55mm;
            height: 11mm;
            background-image: url("https://insboon-assets.s3.ap-northeast-2.amazonaws.com/pdf/logo_meritz.png");
          }
          .db div.ins_logo {
            width: 45mm;
            height: 12mm;
            background-image: url("https://insboon-assets.s3.ap-northeast-2.amazonaws.com/form_db_logo.svg");
            background-position: -10px center;
          }
          .kb div.ins_logo {
            width: 50mm;
            height: 9mm;
            background-image: url("https://insboon-assets.s3.ap-northeast-2.amazonaws.com/kb_logo.png");
            margin-top: 4mm;
          }
          .samsung div.ins_logo {
            width: 30mm;
            height: 10mm;
            background-image: url("https://insboon-assets.s3.ap-northeast-2.amazonaws.com/pdf/logo_samsung.png");
          }

          h1 {
          }

          h3 {
            margin-bottom: 1mm;
          }
          table {
            width: 100%;
          }
          .meritz table {
            border-top: 0.55mm solid #ee3722;
          }
          .db table {
            border-top: 0.55mm solid rgba(0, 133, 74, 1);
          }

          table tr th {
            font-size: 10pt;
            font-weight: bold;
            border: 0.3mm solid #ebebec;
            padding: 2.5mm 2mm;
            text-align: left;
          }
          table tr td {
            font-size: 9.5pt;
            border: 0.3mm solid #ebebec;
            padding: 2.5mm 2mm;
          }
          table tr th:first-of-type {
            border-left: 0;
          }
          table tr td:first-child {
            border-left: 0;
          }
          table tr th:last-of-type,
          table tr td:last-of-type {
            border-right: 0;
          }

          .meritz table tr th {
            background-color: #ddd;
          }
          .db table tr th {
            background-color: #f1f7e4;
          }
          .meritz span.ins_company::before {
            display: block;
            content: "메리츠화재해상보험";
          }
          .db span.ins_company::before {
            display: block;
            content: "DB손해보험";
          }
          .kb span.ins_company::before {
            display: block;
            content: "KB손해보험";
          }
          .samsung span.ins_company::before {
            display: block;
            content: "삼성화재해상보험";
          }

          .etc_box {
            border-top: 1mm solid #ddd;
            border-bottom: 1mm solid #ddd;
            padding: 3mm 2mm;
            margin-bottom: 4mm;
          }
          .etc_box ul {
          }
          .etc_box ul li {
            display: flex;
            gap: 2px;
          }
          .etc_box ul li::before {
            content: "*";
            display: block;
            padding-top: 0.3mm;
          }

          footer {
          }

          .checkbox_wrap {
            display: flex;
            display: -webkit-flex;
            align-items: center;
            -webkit-align-items: center;
            -moz-align-items: center;
            -ms-align-items: center;
          }
          .checkbox {
            width: 2.5mm;
            height: 2.5mm;
            border: 0.4mm solid #333;
          }
          .checkbox.checked {
            position: relative;
          }
          .checkbox.checked::before {
            content: "✔";
            font-size: 7pt;
            position: absolute;
            top: -1.5px;
            left: 50%;
            transform: translateX(-50%);
          }

          .flex {
            display: flex;
            display: -webkit-flex;
          }
          .direction-column {
            flex-direction: column;
            -webkit-flex-direction: column;
            -moz-flex-direction: column;
            -ms-flex-direction: column;
          }
          .justify-between {
            justify-content: space-between;
            -webkit-justify-content: space-between;
            -moz-justify-content: space-between;
            -ms-justify-content: space-between;
          }
          .justify-center {
            justify-content: center;
            -webkit-justify-content: center;
            -moz-justify-content: center;
            -ms-justify-content: center;
          }
          .justify-end {
            justify-content: flex-end;
            -webkit-justify-content: flex-end;
            -moz-justify-content: flex-end;
            -ms-justify-content: flex-end;
          }
          .items-center {
            align-items: center;
            -webkit-align-items: center;
            -moz-align-items: center;
            -ms-align-items: center;
          }
          .items-end {
            align-items: flex-end;
            -webkit-align-items: flex-end;
            -moz-align-items: flex-end;
            -ms-align-items: flex-end;
          }

          @page {
            size: A4;
            margin: 0;
          }
          @media print {
            html,
            body {
              width: 210mm;
              height: 297mm;
              background-color: #f2f2f2 !important;
              -webkit-print-color-adjust: exact;
            }
            #page {
              margin: 0;
              border: initial;
              border-radius: initial;
              width: initial;
              min-height: initial;
              box-shadow: initial;
              background: initial;
              page-break-after: always;
            }
          }
        </style>
      `;
      break;

    case 'join':
    default:
      switch (insProdCd) {
        case 'ccali':
          result = `
            <style>
                  /* style */
                  * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    border-collapse: collapse;
                    line-height: 1.2;
                    font-family: "Noto Sans KR";
                  }
                  body {
                    width: 100%;
                    height: 100%;
                    margin: 0;
                    padding: 0;
                    background-color: #f2f2f2;
                    font-size: 8pt;
                  }
                  ul {
                    list-style: none;
                  }
                  .font_times {
                    font-family: "Times New Roman", Times, serif;
                  }
        
                  #page {
                    position: relative;
                    width: 210mm;
                    height: 292mm;
                    padding: 5mm 0 15mm;
                    margin: 0 auto;
                  }
                  #page .page_wrap {
                    display: -webkit-flex; 
                    -webkit-flex-wrap: wrap; 
                    display: flex;
                    -webkit-box-orient: vertical;
                    -moz-box-orient: vertical;
                    -webkit-flex-direction: column;
                    -moz-flex-direction: column;
                    -ms-flex-direction: column;
                    flex-direction: column;
                    margin: 0 auto;
                    padding: 8mm 2.5mm 2.5mm;
                    width: 210mm;
                    height: 292mm;
                    background: #fff;
                  }
        
                  div.ins_logo {
                    background-repeat: no-repeat;
                    background-size: 100% auto;
                    background-position: left 0;
                  }
        
                  .meritz div.ins_logo {
                    width: 55mm;
                    height: 11mm;
                    background-image: url("https://insboon-assets.s3.ap-northeast-2.amazonaws.com/pdf/logo_meritz.png");
                  }
                  .db div.ins_logo {
                    width: 45mm;
                    height: 12mm;
                    background-image: url("https://insboon-assets.s3.ap-northeast-2.amazonaws.com/form_db_logo.svg");
                    background-position: -10px center;
                  }
                  .kb div.ins_logo {
                    width: 50mm;
                    height: 9mm;
                    background-image: url("https://insboon-assets.s3.ap-northeast-2.amazonaws.com/kb_logo.png");
                    margin-top: 4mm;
                  }
                  .samsung div.ins_logo {
                    width: 30mm;
                    height: 10mm;
                    background-image: url("https://insboon-assets.s3.ap-northeast-2.amazonaws.com/pdf/logo_samsung.png");
                  }
        
                  h1 {
                  }
        
                  h3 {
                    margin-bottom: 1mm;
                  }
                  table {
                    width: 100%;
                  }
                  .meritz table {
                    border-top: 0.55mm solid #ee3722;
                  }
                  .db table {
                    border-top: 0.55mm solid rgba(0, 133, 74, 1);
                  }
        
                  table tr th {
                    font-size: 11pt;
                    font-weight: bold;
                    border: 0.3mm solid #ebebec;
                    padding: 2.5mm 2mm;
                    text-align: center;
                  }
                  table tr td {
                    font-size: 10.5pt;
                    border: 0.3mm solid #ebebec;
                    padding: 2.5mm 2mm;
                    text-align: center;
                  }
                  table tr th:first-of-type {
                    border-left: 0;
                  }
                  table tr td:first-child {
                    border-left: 0;
                  }
                  table tr th:last-of-type,
                  table tr td:last-of-type {
                    border-right: 0;
                  }
        
                  .meritz table tr th {
                    background-color: #ddd;
                  }
                  .db table tr th {
                    background-color: #f1f7e4;
                  }
                  .meritz span.ins_company::before {
                    display: block;
                    content: "메리츠화재해상보험";
                  }
                  .db span.ins_company::before {
                    display: block;
                    content: "DB손해보험";
                  }
                  .kb span.ins_company::before {
                    display: block;
                    content: "KB손해보험";
                  }
                  .samsung span.ins_company::before {
                    display: block;
                    content: "삼성화재해상보험";
                  }
        
                  .etc_box {
                    border-top: 1mm solid #ddd;
                    border-bottom: 1mm solid #ddd;
                    padding: 3mm 2mm;
                    margin-bottom: 4mm;
                  }
                  .etc_box ul {
                  }
                  .etc_box ul li {
                    display: -webkit-flex; 
                    -webkit-flex-wrap: wrap; 
                    display: flex;
                    gap: 2px;
                  }
                  .etc_box ul li::before {
                    content: "*";
                    display: block;
                    padding-top: 0.3mm;
                  }
        
                  footer {
                    display: -webkit-flex; 
                    -webkit-flex-wrap: wrap; 
                    display: flex;
                  }
        
                  footer table {
                    width: 45%;
                  }
        
                  footer div.sign_wrap {
                    display: -webkit-flex; 
                    -webkit-flex-wrap: wrap; 
                    display: flex;
                    -webkit-box-align: end;
                    -moz-align-items: flex-end;
                    -ms-flex-align: end;
                    align-items: flex-end;
                    -webkit-box-align: center;
                    -moz-align-items: center;
                    -ms-flex-align: center;
                    align-items: center;
                    font-size: 9pt;
                    margin-left: auto;
                  }
                  footer div.sign_wrap * {
                    font-family: "Noto Sans KR" !important;
                  }
                  footer div.sign_wrap p {
                    color: #333;
                    margin-right: -3mm;
                  }
                  footer div.sign_wrap p span {
                    line-height: 1.3em;
                  }
                  footer div.sign_wrap p img {
                    display: block;
                    width: 140px;
                    /* opacity: 0.6; */
                  }
        
                  .meritz span.ins_call::before {
                    display: block;
                    content: "1566-7711";
                  }
                  .db span.ins_call::before {
                    display: block;
                    content: "1588-0100";
                  }
                  .kb span.ins_call::before {
                    display: block;
                    content: "1544-0114";
                  }
                  .samsung span.ins_call::before {
                    display: block;
                    content: "1588-5114";
                  }
        
                  @page {
                    size: A4;
                    margin: 0;
                  }
                  @media print {
                    html,
                    body {
                      width: 210mm;
                      height: 297mm;
                      background-color: #fff !important;
                      -webkit-print-color-adjust: exact;
                    }
                    #page {
                      margin: 0;
                      border: initial;
                      border-radius: initial;
                      width: initial;
                      min-height: initial;
                      box-shadow: initial;
                      background: initial;
                      page-break-after: always;
                    }
                  }
                </style>
              `;
          break;
      }

      break;
  }

  return result;
};

module.exports = {
  totalStringCss,
};
