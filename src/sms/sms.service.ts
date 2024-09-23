import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dayjs from 'dayjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as qs from 'qs';
import { costFormatter } from 'src/common/utils/formatter-utils';
import { CommonService } from 'src/common/common.service';
import { SmsSendLogs } from './entities/sms-send-logs.entity';
import { MessageType } from './entities/message-type.entity';
import { MessageContentCd } from './entities/message-content-cd.entity';
import { AlimtalkTemplate } from './entities/alimtalk-template.entity';
import { AlimtalkTemplateButton } from './entities/alimtalk-template-button.entity';
import { MessageContentAlimtalkTemplateMap } from './entities/message-content-alimtalk-template-map.entity';
import { SendAlimtalkReqDto } from './dto/send-alimtalk-req.dto';
import { SendSmsCodeReqDto } from './dto/send-sms-code-req.dto';
import { SendSmsReqDto } from './dto/send-sms-req.dto';
import { SelectSmsContentReqDto } from './dto/select-sms-content-req.dto';
import { JoinService } from 'src/insurance/join/join.service';

@Injectable()
export class SmsService {
  constructor(
    private readonly commonService: CommonService,
    private readonly joinService: JoinService,
    @InjectRepository(SmsSendLogs)
    private smsSendLogsRepository: Repository<SmsSendLogs>,
    @InjectRepository(MessageType)
    private messageTypeRepository: Repository<MessageType>,
    @InjectRepository(MessageContentCd)
    private messageContentCdLogsRepository: Repository<MessageContentCd>,
    @InjectRepository(AlimtalkTemplate)
    private alimtalkTemplateRepository: Repository<AlimtalkTemplate>,
    @InjectRepository(AlimtalkTemplateButton)
    private alimtalkTemplateButtonRepository: Repository<AlimtalkTemplateButton>,
    @InjectRepository(MessageContentAlimtalkTemplateMap)
    private messageContentAlimtalkTemplateMapRepository: Repository<MessageContentAlimtalkTemplateMap>,
  ) {}

  async updateAlimtalkTemplate() {
    let statusCode = 201000;
    let returnMsg = 'ok';
    let result = {
      sms: {},
    };

    const templt1 = {
      templtContent:
        '안녕하세요? #{상호명} 님\n㈜넥솔 bo:on입니다.\n#{상품명}\n정상 가입되었습니다.\n[증권번호 #{증권번호}]\n\n아래 버튼을 통해 해당 가입확인서를 확인 바랍니다.\n#{중간내용}\n기타 궁금하신 사항은 아래 문의처로 연락 바랍니다.\n\n※문의처\n#{고객센터 이름} #{고객센터 번호}\n#{고객센터 운영시간}',
      templtName: '유료 가입 완료(가입확인서)2',
      templateType: 'AD',
      templateEmType: 'NONE',
      templateExtra: '',
      templateAdvert:
        '채널 추가하고 이 채널의 광고와 마케팅 메시지를 카카오톡으로 받기',
      templtTitle: '',
      templtSubtitle: '',
      templtImageName: '',
      templtImageUrl: '',
      block: 'N',
      dormant: 'N',
      securityFlag: 'N',
      status: 'R',
      inspStatus: 'APR',
      senderKey: '279d76101751300075e23ca4a3610ed67952b84a',
      buttons: [
        {
          ordering: '1',
          name: '채널 추가',
          linkType: 'AC',
          linkTypeName: '채널 추가',
          linkMo: '',
          linkPc: '',
          linkIos: '',
          linkAnd: '',
        },
        {
          ordering: '2',
          name: '가입확인서 확인하기',
          linkType: 'WL',
          linkTypeName: '웹링크',
          linkMo: 'https://#{가입확인서 url}',
          linkPc: 'https://#{가입확인서 url}',
          linkIos: '',
          linkAnd: '',
        },
        {
          ordering: '3',
          name: '약관보기',
          linkType: 'WL',
          linkTypeName: '웹링크',
          linkMo: 'https://#{상품 약관 url}',
          linkPc: 'https://#{상품 약관 url}',
          linkIos: '',
          linkAnd: '',
        },
      ],
      cdate: '2024-07-10 11:34:07',
      templtCode: 'TT_7927',
      comments: [
        {
          cdate: '2024-07-10 14:53:15',
          name: '검수자',
          id: '3465230',
          userName: '검수자',
          commentContent: '',
          createdAt: '2024-07-10 14:53:15',
          status: 'APR',
        },
      ],
    };
    const templt2 = {
      templtContent:
        '안녕하세요? #{상호명} 님\n㈜넥솔 bo:on입니다.\n#{상품명}\n정상 가입되었습니다.\n[증권번호 #{증권번호}]\n\n아래 버튼을 통해 해당 증권을 확인 바랍니다.\n#{중간내용}\n기타 궁금하신 사항은 아래 문의처로 연락 바랍니다.\n\n※문의처\n#{고객센터 이름} #{고객센터 번호}\n#{고객센터 운영시간}',
      templtName: '유료 가입 완료(증권)-개인2',
      templateType: 'AD',
      templateEmType: 'NONE',
      templateExtra: '',
      templateAdvert:
        '채널 추가하고 이 채널의 광고와 마케팅 메시지를 카카오톡으로 받기',
      templtTitle: '',
      templtSubtitle: '',
      templtImageName: '',
      templtImageUrl: '',
      block: 'N',
      dormant: 'N',
      securityFlag: 'N',
      status: 'R',
      inspStatus: 'APR',
      senderKey: '279d76101751300075e23ca4a3610ed67952b84a',
      buttons: [
        {
          ordering: '1',
          name: '채널 추가',
          linkType: 'AC',
          linkTypeName: '채널 추가',
          linkMo: '',
          linkPc: '',
          linkIos: '',
          linkAnd: '',
        },
        {
          ordering: '2',
          name: '증권 확인하기',
          linkType: 'WL',
          linkTypeName: '웹링크',
          linkMo: 'https://#{증권 url}',
          linkPc: 'https://#{증권 url}',
          linkIos: '',
          linkAnd: '',
        },
        {
          ordering: '3',
          name: '약관보기',
          linkType: 'WL',
          linkTypeName: '웹링크',
          linkMo: 'https://#{상품 약관 url}',
          linkPc: 'https://#{상품 약관 url}',
          linkIos: '',
          linkAnd: '',
        },
      ],
      cdate: '2024-07-10 11:34:53',
      templtCode: 'TT_7928',
      comments: [
        {
          cdate: '2024-07-10 14:53:21',
          name: '검수자',
          id: '3465233',
          userName: '검수자',
          commentContent: '',
          createdAt: '2024-07-10 14:53:21',
          status: 'APR',
        },
      ],
    };
    const templt3 = {
      templtContent:
        '안녕하세요? #{상호명} 님\n㈜넥솔 bo:on입니다.\n#{상품명}\n정상 가입되었습니다.\n[증권번호 #{증권번호}]\n\n아래 버튼을 통해 해당 증권을 확인 바랍니다.\n법인사업자로 가입시 사업자번호 6자리 입력 후 확인 가능합니다.\n#{중간내용}\n기타 궁금하신 사항은 아래 문의처로 연락 바랍니다.\n\n※문의처\n#{고객센터 이름} #{고객센터 번호}\n#{고객센터 운영시간}',
      templtName: '메리츠 유료 가입 완료(증권)-법인2',
      templateType: 'AD',
      templateEmType: 'NONE',
      templateExtra: '',
      templateAdvert:
        '채널 추가하고 이 채널의 광고와 마케팅 메시지를 카카오톡으로 받기',
      templtTitle: '',
      templtSubtitle: '',
      templtImageName: '',
      templtImageUrl: '',
      block: 'N',
      dormant: 'N',
      securityFlag: 'N',
      status: 'R',
      inspStatus: 'APR',
      senderKey: '279d76101751300075e23ca4a3610ed67952b84a',
      buttons: [
        {
          ordering: '1',
          name: '채널 추가',
          linkType: 'AC',
          linkTypeName: '채널 추가',
          linkMo: '',
          linkPc: '',
          linkIos: '',
          linkAnd: '',
        },
        {
          ordering: '2',
          name: '증권 확인하기',
          linkType: 'WL',
          linkTypeName: '웹링크',
          linkMo: 'https://#{증권 url}',
          linkPc: 'https://#{증권 url}',
          linkIos: '',
          linkAnd: '',
        },
        {
          ordering: '3',
          name: '약관보기',
          linkType: 'WL',
          linkTypeName: '웹링크',
          linkMo: 'https://#{상품 약관 url}',
          linkPc: 'https://#{상품 약관 url}',
          linkIos: '',
          linkAnd: '',
        },
      ],
      cdate: '2024-07-10 11:36:00',
      templtCode: 'TT_7929',
      comments: [
        {
          cdate: '2024-07-10 14:53:28',
          name: '검수자',
          id: '3465235',
          userName: '검수자',
          commentContent: '',
          createdAt: '2024-07-10 14:53:28',
          status: 'APR',
        },
      ],
    };
    const templt4 = {
      templtContent:
        '안녕하세요? #{상호명} 님\n㈜넥솔 bo:on입니다.\n#{상품명}\n보험료 #{보험료} 입금이 확인되어 가입처리가 완료되었습니다.\n[증권번호 #{증권번호}]\n\n아래 버튼을 통해 해당 가입확인서를 확인 바랍니다.\n#{중간내용}\n기타 궁금하신 사항은 아래 문의처로 연락 바랍니다.\n\n※문의처\n#{고객센터 이름} #{고객센터 번호}\n#{고객센터 운영시간}',
      templtName: '유료 가입 무통장입금 확인(가입확인서)2',
      templateType: 'AD',
      templateEmType: 'NONE',
      templateExtra: '',
      templateAdvert:
        '채널 추가하고 이 채널의 광고와 마케팅 메시지를 카카오톡으로 받기',
      templtTitle: '',
      templtSubtitle: '',
      templtImageName: '',
      templtImageUrl: '',
      block: 'N',
      dormant: 'N',
      securityFlag: 'N',
      status: 'R',
      inspStatus: 'APR',
      senderKey: '279d76101751300075e23ca4a3610ed67952b84a',
      buttons: [
        {
          ordering: '1',
          name: '채널 추가',
          linkType: 'AC',
          linkTypeName: '채널 추가',
          linkMo: '',
          linkPc: '',
          linkIos: '',
          linkAnd: '',
        },
        {
          ordering: '2',
          name: '가입확인서 확인하기',
          linkType: 'WL',
          linkTypeName: '웹링크',
          linkMo: 'https://#{가입확인서 url}',
          linkPc: 'https://#{가입확인서 url}',
          linkIos: '',
          linkAnd: '',
        },
        {
          ordering: '3',
          name: '약관보기',
          linkType: 'WL',
          linkTypeName: '웹링크',
          linkMo: 'https://#{상품 약관 url}',
          linkPc: 'https://#{상품 약관 url}',
          linkIos: '',
          linkAnd: '',
        },
      ],
      cdate: '2024-07-10 11:36:45',
      templtCode: 'TT_7931',
      comments: [
        {
          cdate: '2024-07-10 14:53:32',
          name: '검수자',
          id: '3465237',
          userName: '검수자',
          commentContent: '',
          createdAt: '2024-07-10 14:53:32',
          status: 'APR',
        },
      ],
    };
    const templt5 = {
      templtContent:
        '안녕하세요? #{상호명} 님\n㈜넥솔 bo:on입니다.\n#{상품명}\n요청하신 #{변경항목}이/가 변경이 완료처리 되었습니다.\n[증권번호 #{증권번호}]\n\n아래 버튼을 통해 해당 가입확인서를 확인 바랍니다.\n#{중간내용}\n기타 궁금하신 사항은 아래 문의처로 연락 바랍니다.\n\n※문의처\n#{고객센터 이름} #{고객센터 번호}\n#{고객센터 운영시간}',
      templtName: '유료 가입 유효건 배서 완료(가입확인서)2',
      templateType: 'AD',
      templateEmType: 'NONE',
      templateExtra: '',
      templateAdvert:
        '채널 추가하고 이 채널의 광고와 마케팅 메시지를 카카오톡으로 받기',
      templtTitle: '',
      templtSubtitle: '',
      templtImageName: '',
      templtImageUrl: '',
      block: 'N',
      dormant: 'N',
      securityFlag: 'N',
      status: 'R',
      inspStatus: 'APR',
      senderKey: '279d76101751300075e23ca4a3610ed67952b84a',
      buttons: [
        {
          ordering: '1',
          name: '채널 추가',
          linkType: 'AC',
          linkTypeName: '채널 추가',
          linkMo: '',
          linkPc: '',
          linkIos: '',
          linkAnd: '',
        },
        {
          ordering: '2',
          name: '가입확인서 확인하기',
          linkType: 'WL',
          linkTypeName: '웹링크',
          linkMo: 'https://#{가입확인서 url}',
          linkPc: 'https://#{가입확인서 url}',
          linkIos: '',
          linkAnd: '',
        },
        {
          ordering: '3',
          name: '약관보기',
          linkType: 'WL',
          linkTypeName: '웹링크',
          linkMo: 'https://#{상품 약관 url}',
          linkPc: 'https://#{상품 약관 url}',
          linkIos: '',
          linkAnd: '',
        },
      ],
      cdate: '2024-07-10 11:38:05',
      templtCode: 'TT_7932',
      comments: [
        {
          cdate: '2024-07-10 14:53:39',
          name: '검수자',
          id: '3465239',
          userName: '검수자',
          commentContent: '',
          createdAt: '2024-07-10 14:53:39',
          status: 'APR',
        },
      ],
    };
    const templt6 = {
      templtContent:
        '안녕하세요? #{상호명} 님\n㈜넥솔 bo:on입니다.\n#{상품명}\n요청하신 #{변경항목}이/가 변경이 완료처리 되었습니다.\n[증권번호 #{증권번호}]\n\n아래 버튼을 통해 해당 증권을 확인 바랍니다.\n#{중간내용}\n기타 궁금하신 사항은 아래 문의처로 연락 바랍니다.\n\n※문의처\n#{고객센터 이름} #{고객센터 번호}\n#{고객센터 운영시간}',
      templtName: '유료 가입 유효건 배서 완료(증권)-개인2',
      templateType: 'AD',
      templateEmType: 'NONE',
      templateExtra: '',
      templateAdvert:
        '채널 추가하고 이 채널의 광고와 마케팅 메시지를 카카오톡으로 받기',
      templtTitle: '',
      templtSubtitle: '',
      templtImageName: '',
      templtImageUrl: '',
      block: 'N',
      dormant: 'N',
      securityFlag: 'N',
      status: 'R',
      inspStatus: 'APR',
      senderKey: '279d76101751300075e23ca4a3610ed67952b84a',
      buttons: [
        {
          ordering: '1',
          name: '채널 추가',
          linkType: 'AC',
          linkTypeName: '채널 추가',
          linkMo: '',
          linkPc: '',
          linkIos: '',
          linkAnd: '',
        },
        {
          ordering: '2',
          name: '증권 확인하기',
          linkType: 'WL',
          linkTypeName: '웹링크',
          linkMo: 'https://#{증권 url}',
          linkPc: 'https://#{증권 url}',
          linkIos: '',
          linkAnd: '',
        },
        {
          ordering: '3',
          name: '약관보기',
          linkType: 'WL',
          linkTypeName: '웹링크',
          linkMo: 'https://#{상품 약관 url}',
          linkPc: 'https://#{상품 약관 url}',
          linkIos: '',
          linkAnd: '',
        },
      ],
      cdate: '2024-07-10 12:55:15',
      templtCode: 'TT_7943',
      comments: [
        {
          cdate: '2024-07-10 14:59:05',
          name: '검수자',
          id: '3465304',
          userName: '검수자',
          commentContent: '',
          createdAt: '2024-07-10 14:59:05',
          status: 'APR',
        },
      ],
    };
    const templt7 = {
      templtContent:
        '안녕하세요? #{상호명} 님\n㈜넥솔 bo:on입니다.\n#{상품명}\n요청하신 #{변경항목}이/가 변경이 완료처리 되었습니다.\n[증권번호 #{증권번호}]\n\n아래 버튼을 통해 해당 증권을 확인 바랍니다.\n법인사업자로 가입시 사업자번호 6자리 입력 후 확인 가능합니다.\n#{중간내용}\n기타 궁금하신 사항은 아래 문의처로 연락 바랍니다.\n\n※문의처\n#{고객센터 이름} #{고객센터 번호}\n#{고객센터 운영시간}',
      templtName: '메리츠 유료 가입 유효건 배서 완료(증권)-법인2',
      templateType: 'AD',
      templateEmType: 'NONE',
      templateExtra: '',
      templateAdvert:
        '채널 추가하고 이 채널의 광고와 마케팅 메시지를 카카오톡으로 받기',
      templtTitle: '',
      templtSubtitle: '',
      templtImageName: '',
      templtImageUrl: '',
      block: 'N',
      dormant: 'N',
      securityFlag: 'N',
      status: 'R',
      inspStatus: 'APR',
      senderKey: '279d76101751300075e23ca4a3610ed67952b84a',
      buttons: [
        {
          ordering: '1',
          name: '채널 추가',
          linkType: 'AC',
          linkTypeName: '채널 추가',
          linkMo: '',
          linkPc: '',
          linkIos: '',
          linkAnd: '',
        },
        {
          ordering: '2',
          name: '증권 확인하기',
          linkType: 'WL',
          linkTypeName: '웹링크',
          linkMo: 'https://#{증권 url}',
          linkPc: 'https://#{증권 url}',
          linkIos: '',
          linkAnd: '',
        },
        {
          ordering: '3',
          name: '약관보기',
          linkType: 'WL',
          linkTypeName: '웹링크',
          linkMo: 'https://#{상품 약관 url}',
          linkPc: 'https://#{상품 약관 url}',
          linkIos: '',
          linkAnd: '',
        },
      ],
      cdate: '2024-07-10 12:56:04',
      templtCode: 'TT_7945',
      comments: [
        {
          cdate: '2024-07-10 15:02:04',
          name: '검수자',
          id: '3465309',
          userName: '검수자',
          commentContent: '',
          createdAt: '2024-07-10 15:02:04',
          status: 'APR',
        },
      ],
    };
    const templt8 = {
      templtContent:
        '안녕하세요? #{상호명} 님\n#{신청일} #{제휴처}을/를 통해 신청하신 #{상품명} 가입확인서 발송드립니다.\n[증권번호 #{증권번호}]\n\n아래 버튼을 통해 해당 가입확인서를 확인 바랍니다.\n#{중간내용}\n기타 궁금하신 사항은 아래 문의처로 연락 바랍니다.\n\n※문의처\n#{고객센터 이름} #{고객센터 번호}\n#{고객센터 운영시간}',
      templtName: '무료 가입확인서 요청2',
      templateType: 'AD',
      templateEmType: 'NONE',
      templateExtra: '',
      templateAdvert:
        '채널 추가하고 이 채널의 광고와 마케팅 메시지를 카카오톡으로 받기',
      templtTitle: '',
      templtSubtitle: '',
      templtImageName: '',
      templtImageUrl: '',
      block: 'N',
      dormant: 'N',
      securityFlag: 'N',
      status: 'R',
      inspStatus: 'APR',
      senderKey: '279d76101751300075e23ca4a3610ed67952b84a',
      buttons: [
        {
          ordering: '1',
          name: '채널 추가',
          linkType: 'AC',
          linkTypeName: '채널 추가',
          linkMo: '',
          linkPc: '',
          linkIos: '',
          linkAnd: '',
        },
        {
          ordering: '2',
          name: '가입확인서 확인하기',
          linkType: 'WL',
          linkTypeName: '웹링크',
          linkMo: 'https://#{가입확인서 url}',
          linkPc: 'https://#{가입확인서 url}',
          linkIos: '',
          linkAnd: '',
        },
        {
          ordering: '3',
          name: '약관보기',
          linkType: 'WL',
          linkTypeName: '웹링크',
          linkMo: 'https://#{상품 약관 url}',
          linkPc: 'https://#{상품 약관 url}',
          linkIos: '',
          linkAnd: '',
        },
      ],
      cdate: '2024-07-10 12:57:02',
      templtCode: 'TT_7946',
      comments: [
        {
          cdate: '2024-07-10 15:03:00',
          name: '검수자',
          id: '3465314',
          userName: '검수자',
          commentContent:
            '안녕하세요. 카카오톡 알림톡 검수 담당자입니다.\r\n\r\n신청하신 메시지 확인하여 승인되었습니다.\r\n\r\n참고로 승인 이후 발송되는 메시지의 책임은 발송자에게 있으며, 이후 어뷰징 확인 또는 신고가 다수 접수될 경우 해당 프로필에 대한 차단이 이루어집니다. \r\n차단된 프로필은 사업자등록번호 기준으로 관리되기에 해당 사업자등록번호로는 영구적으로 알림톡 사용이 불가한 점 참고하여 알림톡 운영 바랍니다.\r\n\r\n감사합니다.',
          createdAt: '2024-07-10 15:03:00',
          status: 'APR',
        },
      ],
    };
    const templt9 = {
      templtContent:
        '안녕하세요? #{상호명} 님\n㈜넥솔 bo:on입니다.\n#{신청일} #{제휴처}을/를 통해 가입하신 #{상품명} 가입확인서 발송드립니다.\n[증권번호 #{증권번호}]\n\n아래 버튼을 통해 해당 가입확인서를 확인 바랍니다.\n#{중간내용}\n기타 궁금하신 사항은 아래 문의처로 연락 바랍니다.\n\n※문의처\n#{고객센터 이름} #{고객센터 번호}\n#{고객센터 운영시간}',
      templtName: '유료 가입확인서 요청2',
      templateType: 'AD',
      templateEmType: 'NONE',
      templateExtra: '',
      templateAdvert:
        '채널 추가하고 이 채널의 광고와 마케팅 메시지를 카카오톡으로 받기',
      templtTitle: '',
      templtSubtitle: '',
      templtImageName: '',
      templtImageUrl: '',
      block: 'N',
      dormant: 'N',
      securityFlag: 'N',
      status: 'R',
      inspStatus: 'APR',
      senderKey: '279d76101751300075e23ca4a3610ed67952b84a',
      buttons: [
        {
          ordering: '1',
          name: '채널 추가',
          linkType: 'AC',
          linkTypeName: '채널 추가',
          linkMo: '',
          linkPc: '',
          linkIos: '',
          linkAnd: '',
        },
        {
          ordering: '2',
          name: '가입확인서 확인하기',
          linkType: 'WL',
          linkTypeName: '웹링크',
          linkMo: 'https://#{가입확인서 url}',
          linkPc: 'https://#{가입확인서 url}',
          linkIos: '',
          linkAnd: '',
        },
        {
          ordering: '3',
          name: '약관보기',
          linkType: 'WL',
          linkTypeName: '웹링크',
          linkMo: 'https://#{상품 약관 url}',
          linkPc: 'https://#{상품 약관 url}',
          linkIos: '',
          linkAnd: '',
        },
      ],
      cdate: '2024-07-10 12:57:37',
      templtCode: 'TT_7948',
      comments: [
        {
          cdate: '2024-07-10 15:03:06',
          name: '검수자',
          id: '3465315',
          userName: '검수자',
          commentContent: '',
          createdAt: '2024-07-10 15:03:06',
          status: 'APR',
        },
      ],
    };
    const templt10 = {
      templtContent:
        '안녕하세요? #{상호명} 님\n㈜넥솔 bo:on입니다.\n#{신청일} #{제휴처}을/를 통해 가입하신 #{상품명} 증권 발송드립니다.\n[증권번호 #{증권번호}]\n\n아래 버튼을 통해 해당 증권을 확인 바랍니다.\n#{중간내용}\n기타 궁금하신 사항은 아래 문의처로 연락 바랍니다.\n\n※문의처\n#{고객센터 이름} #{고객센터 번호}\n#{고객센터 운영시간}',
      templtName: '유료 증권 요청2',
      templateType: 'AD',
      templateEmType: 'NONE',
      templateExtra: '',
      templateAdvert:
        '채널 추가하고 이 채널의 광고와 마케팅 메시지를 카카오톡으로 받기',
      templtTitle: '',
      templtSubtitle: '',
      templtImageName: '',
      templtImageUrl: '',
      block: 'N',
      dormant: 'N',
      securityFlag: 'N',
      status: 'R',
      inspStatus: 'APR',
      senderKey: '279d76101751300075e23ca4a3610ed67952b84a',
      buttons: [
        {
          ordering: '1',
          name: '채널 추가',
          linkType: 'AC',
          linkTypeName: '채널 추가',
          linkMo: '',
          linkPc: '',
          linkIos: '',
          linkAnd: '',
        },
        {
          ordering: '2',
          name: '증권 확인하기',
          linkType: 'WL',
          linkTypeName: '웹링크',
          linkMo: 'https://#{증권 url}',
          linkPc: 'https://#{증권 url}',
          linkIos: '',
          linkAnd: '',
        },
        {
          ordering: '3',
          name: '약관보기',
          linkType: 'WL',
          linkTypeName: '웹링크',
          linkMo: 'https://#{상품 약관 url}',
          linkPc: 'https://#{상품 약관 url}',
          linkIos: '',
          linkAnd: '',
        },
      ],
      cdate: '2024-07-10 13:00:25',
      templtCode: 'TT_7949',
      comments: [
        {
          cdate: '2024-07-10 15:03:12',
          name: '검수자',
          id: '3465316',
          userName: '검수자',
          commentContent: '',
          createdAt: '2024-07-10 15:03:12',
          status: 'APR',
        },
      ],
    };
    const templt11 = {
      templtContent:
        '[보온 안내]\n※ #{보험상품명}\n#{법} 의거 기간만료 및 갱신안내\n\n#{상호명} 님, #{제휴처}을/를 통해 가입하신 #{보험상품명} 보험만료일이 #{보험만료일}까지 입니다.\n의무보험은 보험기간이 유지되지 않으면 과태료를 받으실 수 있습니다.\n아직 갱신을 하지 않으셨다면 아래 가입 바로가기를 눌러 바로 간편하게 가입 가능합니다.\n#{중간내용}\n* 보험가입시 알아두실 사항\n ⊙ 해약환급금(또는 만기시 보험금이나 사고보험금)에 기타지급금을 합하여 5천만원까지(해당 보험회사의 모든 상품을 합산) 예금자 보호합니다.\n ⊙ 보험계약자가 기존에 체결했던 보험계약을 해지하고 다른 보험계약을 체결하면 보험인수가 거절되거나 보험료가 인상되거나 보장내용이 달라 질 수 있습니다. 또한 지급한도, 면책사항 등에 따라 보험금 지급이 제한될 수 있습니다.\n ⊙ 보험계약전 상품설명서 및 약관을 꼭 읽어보시기 바랍니다.\n(주)넥솔 준법감시인 심의필 #{심의필}\n* 수신거부 : #{고객센터 이름} #{고객센터 번호}',
      templtName: '재난다중 만료 안내2',
      templateType: 'AD',
      templateEmType: 'IMAGE',
      templateExtra: '',
      templateAdvert:
        '채널 추가하고 이 채널의 광고와 마케팅 메시지를 카카오톡으로 받기',
      templtTitle: '',
      templtSubtitle: '',
      templtImageName: 'TT_7951_5c8464ccd30f3733e4fd7b42e8398720.jpg',
      templtImageUrl:
        'https://mud-kage.kakao.com/dn/bVEXMy/btsIt2ABW6I/laskYW2b8Qux7Ok5cDDVaK/img_l.jpg',
      block: 'N',
      dormant: 'N',
      securityFlag: 'N',
      status: 'R',
      inspStatus: 'APR',
      senderKey: '279d76101751300075e23ca4a3610ed67952b84a',
      buttons: [
        {
          ordering: '1',
          name: '채널 추가',
          linkType: 'AC',
          linkTypeName: '채널 추가',
          linkMo: '',
          linkPc: '',
          linkIos: '',
          linkAnd: '',
        },
        {
          ordering: '2',
          name: '가입 바로가기',
          linkType: 'WL',
          linkTypeName: '웹링크',
          linkMo: 'https://#{가입 url}',
          linkPc: 'https://#{가입 url}',
          linkIos: '',
          linkAnd: '',
        },
      ],
      cdate: '2024-07-10 13:04:18',
      templtCode: 'TT_7951',
      comments: [
        {
          cdate: '2024-07-10 15:03:29',
          name: '검수자',
          id: '3465318',
          userName: '검수자',
          commentContent: '',
          createdAt: '2024-07-10 15:03:29',
          status: 'APR',
        },
      ],
    };
    const templt12 = {
      templtContent:
        '[#{상품명} 보험료 조회 안내]\n안녕하세요. #{계약자} 님\n#{상품명}\n보험료 조회 신청이 정상 접수되었습니다.\n보험료 확인까지는 영업일 기준 3일~5일의 시간이 소요됩니다.\n보험료가 확인 되면 다시 안내 예정입니다.\n#{중간내용}\n기타 궁금하신 사항은 아래 문의처로 연락 바랍니다.\n\n※문의처\n#{고객센터 이름} #{고객센터 번호}\n#{고객센터 운영시간}',
      templtName: '보험료 조회 신청 완료',
      templateType: 'AD',
      templateEmType: 'NONE',
      templateExtra: '',
      templateAdvert:
        '채널 추가하고 이 채널의 광고와 마케팅 메시지를 카카오톡으로 받기',
      templtTitle: '',
      templtSubtitle: '',
      templtImageName: '',
      templtImageUrl: '',
      block: 'N',
      dormant: 'N',
      securityFlag: 'N',
      status: 'R',
      inspStatus: 'APR',
      senderKey: '279d76101751300075e23ca4a3610ed67952b84a',
      buttons: [
        {
          ordering: '1',
          name: '채널 추가',
          linkType: 'AC',
          linkTypeName: '채널 추가',
          linkMo: '',
          linkPc: '',
          linkIos: '',
          linkAnd: '',
        },
        {
          ordering: '2',
          name: '보험료 조회 신청정보 확인',
          linkType: 'WL',
          linkTypeName: '웹링크',
          linkMo: 'https://#{신청내역 url}',
          linkPc: 'https://#{신청내역 url}',
          linkIos: '',
          linkAnd: '',
        },
      ],
      cdate: '2024-08-05 11:35:22',
      templtCode: 'TU_1812',
      comments: [
        {
          cdate: '2024-08-05 15:20:41',
          name: '검수자',
          id: '3525500',
          userName: '검수자',
          commentContent: '',
          createdAt: '2024-08-05 15:20:41',
          status: 'APR',
        },
      ],
    };
    const templt13 = {
      templtContent:
        '[#{상품명} 보험료 안내]\n안녕하세요. #{계약자} 님\n#{상품명}\n보험료 확인이 완료되었습니다.\n\n아래 버튼을 통해 보험료를 확인해 주세요.\n보험료 확인 후 가입까지 진행 가능합니다.\n#{중간내용}\n기타 궁금하신 사항은 아래 문의처로 연락 바랍니다.\n\n※문의처\n#{고객센터 이름} #{고객센터 번호}\n#{고객센터 운영시간}',
      templtName: '보험료 안내',
      templateType: 'AD',
      templateEmType: 'NONE',
      templateExtra: '',
      templateAdvert:
        '채널 추가하고 이 채널의 광고와 마케팅 메시지를 카카오톡으로 받기',
      templtTitle: '',
      templtSubtitle: '',
      templtImageName: '',
      templtImageUrl: '',
      block: 'N',
      dormant: 'N',
      securityFlag: 'N',
      status: 'R',
      inspStatus: 'APR',
      senderKey: '279d76101751300075e23ca4a3610ed67952b84a',
      buttons: [
        {
          ordering: '1',
          name: '채널 추가',
          linkType: 'AC',
          linkTypeName: '채널 추가',
          linkMo: '',
          linkPc: '',
          linkIos: '',
          linkAnd: '',
        },
        {
          ordering: '2',
          name: '보험료 확인하기',
          linkType: 'WL',
          linkTypeName: '웹링크',
          linkMo: 'https://#{보험료 확인 url}',
          linkPc: 'https://#{보험료 확인 url}',
          linkIos: '',
          linkAnd: '',
        },
      ],
      cdate: '2024-08-05 11:38:05',
      templtCode: 'TU_1814',
      comments: [
        {
          cdate: '2024-08-05 15:20:47',
          name: '검수자',
          id: '3525503',
          userName: '검수자',
          commentContent: '',
          createdAt: '2024-08-05 15:20:47',
          status: 'APR',
        },
      ],
    };

    let template = templt13;

    const alimtalkTemplate = await this.alimtalkTemplateRepository.save({
      senderKey: template.senderKey,
      templtCode: template.templtCode,
      templtName: template.templtName,
      templtContent: template.templtContent,
      templateType: template.templateType,
      templateEmType: template.templateEmType,
      templateExtra: template.templateExtra,
      templateAdvert: template.templateAdvert,
      templtTitle: template.templtTitle,
      templtSubtitle: template.templtSubtitle,
      templtImageName: template.templtImageName,
      templtImageUrl: template.templtImageUrl,
      block: template.block,
      dormant: template.dormant,
      securityFlag: template.securityFlag,
      status: template.status,
      inspStatus: template.inspStatus,
      cdate: template.cdate,
      comments: JSON.stringify(template.comments),
    });

    const templateId = alimtalkTemplate.id;
    for (
      let buttonIndex = 0;
      buttonIndex < template.buttons.length;
      buttonIndex++
    ) {
      const buttonElement = template.buttons[buttonIndex];
      await this.alimtalkTemplateButtonRepository.save({
        templtId: templateId,
        ordering: buttonElement.ordering,
        name: buttonElement.name,
        linkType: buttonElement.linkType,
        linkTypeName: buttonElement.linkTypeName,
        linkMo: buttonElement.linkMo,
        linkPc: buttonElement.linkPc,
        linkIos: buttonElement.linkIos,
        linkAnd: buttonElement.linkAnd,
      });
    }

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  async sendSmsCode(data: SendSmsCodeReqDto) {
    let statusCode = 201000;
    let returnMsg = 'ok';
    let result = {
      sms: {},
    };

    const { receivers, sender } = data;

    const authCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6자리 인증 코드 생성
    let message = `인증 번호는 ${authCode}입니다.`;

    const send = await this.commonService.funSendSms({
      sender,
      receivers,
      message,
      reservedYn: 'N',
    });
    if (send.responseYn == 'N') {
      statusCode = 201001;
      returnMsg = '전송실패';
    } else {
      result.sms = {
        message: message,
        receivers: receivers,
        sender: sender,
        authCode: authCode,
        result: send,
      };
    }

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  async sendSmsTest(data: any) {
    let statusCode = 201000;
    let returnMsg = 'ok';
    let result = {
      sms: {},
    };

    // const {
    //   receivers,
    //   message,
    //   reservedYn,
    //   reservedDate,
    //   reservedTime,
    //   sender,
    //   insJoinUid,
    //   messageType,
    // } = data;

    const send = await this.funKakaoChannelList();
    const send2 = await this.funKakaoTemplateList(
      '32a37be3e4df1d4a88396451b531657ffbd2adc1',
    );
    if (send.responseYn == 'N') {
      statusCode = 201001;
      returnMsg = '실패';
    }
    result.sms = { send, send2 };

    let responseResult = {
      code: statusCode,
      message: returnMsg,
      result,
    };

    return responseResult;
  }

  async funKakaoChannelAuth({ phone }: any) {
    const apiKey = process.env.ALIGO_API_KEY;
    const userId = process.env.ALIGO_USER_ID;
    const plusId = process.env.ALIGO_KAKAO_CHANNEL_ID;
    const postUrl = process.env.ALIGO_KAKAO_HOST + '/profile/auth/';

    const params = {
      apikey: apiKey,
      userid: userId,
      plusid: plusId,
      phonenumber: phone,
    };

    let responseData;
    await axios
      .post(postUrl, null, {
        params: params,
      })
      .then(async (response) => {
        console.log('response', response.data);
        const responseDt = dayjs().toDate();
        if (response.data.code == 0) {
          /*
           * {
           *   "code": 0
           *   "message": "정상적으로 호출하였습니다."
           * }
           */
          responseData = {
            responseYn: 'Y',
            responseCode: response.status,
            responseDt: responseDt,
            ...response.data,
          };
        } else {
          /*
           * {
           *   "code": 509
           *   "message": "요청한 번호가 카카오채널 관리자 알림 설정 되어있는지 확인해주세요."
           * }
           */
          responseData = {
            responseYn: 'N',
            responseCode: response.status,
            responseDt: responseDt,
            ...response.data,
          };
        }

        // await this.commonService.saveSendSmsLogs({
        //   insJoinUid,
        //   sender: params.sender,
        //   receivers: params.receiver,
        //   msgData: params.msg,
        //   msgRdate: params.rdate,
        //   msgRtime: params.rtime,
        //   resultCode: response.data.result_code,
        //   message: response.data.message,
        //   msgId: response.data.msg_id,
        //   successCnt: response.data.success_cnt,
        //   errorCnt: response.data.error_cnt,
        //   msgType: response.data.msg_type,
        //   sendDt:
        //     reservedYn == 'Y' ? dayjs(reservedDt).toDate() : dayjs().toDate(),
        // });
      })
      .catch((error) => {
        console.log('err', error);
        const responseDt = dayjs().toDate();
        responseData = {
          responseYn: 'N',
          responseCode: error.response.status,
          responseDt: responseDt,
          message: error.response.data.resultMsg,
          ...error.response.data,
        };
      });

    return responseData;
  }

  async funKakaoChannelList() {
    const apiKey = process.env.ALIGO_API_KEY;
    const userId = process.env.ALIGO_USER_ID;
    const plusId = process.env.ALIGO_KAKAO_CHANNEL_ID;
    const postUrl = process.env.ALIGO_KAKAO_HOST + '/profile/list/';

    const params = {
      apikey: apiKey,
      userid: userId,
      plusid: plusId,
    };
    const reqEncoding = qs.stringify(params);

    let responseData;
    await axios
      .post(postUrl, reqEncoding, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      })
      .then(async (response) => {
        console.log('response', response.data);
        const responseDt = dayjs().toDate();
        if (response.data.code == 0) {
          /*
           * {
           *   "code": 0
           *   "message": "정상적으로 호출하였습니다."
           *   "list": [{
           *       "senderKey": "000000000000000000000000000000000000",
           *       "license": "http://mud-kage.kakao.com/dn/0000/0000/00000000000000000/img.png",
           *       "catCode": "00000000000",
           *       "alimUseYn": false,
           *       "cdate": "2024-06-03 09:43:16",
           *       "name": "테스트",
           *       "profileStat": "A",
           *       "licenseNum": "테스트",
           *       "udate": "2024-06-03 09:43:16",
           *       "uuid": "@test",
           *       "status": "A"
           *   }]
           * }
           */
          responseData = {
            responseYn: 'Y',
            responseCode: response.status,
            responseDt: responseDt,
            ...response.data,
          };
        } else {
          /*
           * {
           *   "code": -99
           *   "message": "등록되지 않은 인증키 입니다."
           * }
           */
          responseData = {
            responseYn: 'N',
            responseCode: response.status,
            responseDt: responseDt,
            ...response.data,
          };
        }
      })
      .catch((error) => {
        console.log('err', error);
        const responseDt = dayjs().toDate();
        responseData = {
          responseYn: 'N',
          responseCode: error.response.status,
          responseDt: responseDt,
          message: error.response.data.resultMsg,
          ...error.response.data,
        };
      });

    return responseData;
  }

  async funKakaoTemplateList({ senderKey }: any) {
    const apiKey = process.env.ALIGO_API_KEY;
    const userId = process.env.ALIGO_USER_ID;
    const kakaoSenderKey = process.env.ALIGO_KAKAO_SENDER_KEY;
    const postUrl = process.env.ALIGO_KAKAO_HOST + '/template/list/';

    const params = {
      apikey: apiKey,
      userid: userId,
      senderkey: senderKey || kakaoSenderKey,
    };
    const reqEncoding = qs.stringify(params);

    let responseData;
    await axios
      .post(postUrl, reqEncoding, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      })
      .then(async (response) => {
        console.log('response', response.data);
        const responseDt = dayjs().toDate();
        if (response.data.code == 0) {
          /*
           * {
           *   "code": 0
           *   "message": "정상적으로 호출하였습니다."
           *   "list": [{
           *       "templtContent": "#{고객명}님께서 주문하신 물품이\r\n배송완료 되었습니다.\r\n구매확정 부탁드립니다.",
           *       "templtName": "배송완료 안내",
           *       "status": "R",
           *       "inspStatus": "APR",
           *       "senderKey": "000000000000000000000000000000000000",
           *       "buttons": [
           *           {
           *               "ordering": "1",
           *               "name": "구매확정바로가기",
           *               "linkType": "WL",
           *               "linkTypeName": "웹링크",
           *               "linkMo": "http://#{구매확정바로가기}",
           *               "linkPc": "http://#{구매확정바로가기}",
           *               "linkIos": "",
           *               "linkAnd": ""
           *           }
           *       ],
           *       "cdate": "2018-12-28 17:21:40",
           *       "templtCode": "P000004",
           *       "comments": []
           *   }],
           *   "info": {
           *       "REG": 0,
           *       "REQ": 0,
           *       "APR": 1,
           *       "REJ": 0
           *   }
           * }
           */
          responseData = {
            responseYn: 'Y',
            responseCode: response.status,
            responseDt: responseDt,
            ...response.data,
          };
        } else {
          responseData = {
            responseYn: 'N',
            responseCode: response.status,
            responseDt: responseDt,
            ...response.data,
          };
        }
      })
      .catch((error) => {
        console.log('err', error);
        const responseDt = dayjs().toDate();
        responseData = {
          responseYn: 'N',
          responseCode: error.response.status,
          responseDt: responseDt,
          message: error.response.data.resultMsg,
          ...error.response.data,
        };
      });

    return responseData;
  }

  async funKakaoSendFriendtalk({ senderKey, templateCode, sender }: any) {
    const apiKey = process.env.ALIGO_API_KEY;
    const userId = process.env.ALIGO_USER_ID;
    const postUrl = process.env.ALIGO_KAKAO_HOST + '/friend/send/';

    /*
     * curl -X POST "https://kakaoapi.aligo.in/akv10/alimtalk/send/" \
     * --data-urlencode "apikey=xxxxx" \
     * --data-urlencode "userid=xxxxx" \
     * --data-urlencode "senderkey=xxxxxxxxxx" \
     * --data-urlencode "tpl_code=TXXXXXXXX" \
     * --data-urlencode "sender=xxxxxxxxx" \
     * --data-urlencode "senddate=20240603095300" \
     * --data-urlencode "receiver_1=010xxxxxxxx" \
     * --data-urlencode "recvname_1=홍길동1" \
     * --data-urlencode "subject_1=제목1" \
     * --data-urlencode "message_1=내용1" \
     * --data-urlencode "button_1: {
     *                               button: [{
     *                                 "name" : 버튼명
     *                                 "linkType" : AC, DS, WL, AL, BK, MD 중에서 1개
     *                                 "linkTypeName" : 채널 추가, 배송조회, 웹링크, 앱링크, 봇키워드, 메시지전달 중에서 1개
     *                                 "linkMo" : 설정한 모바일 링크
     *                                 "linkPc" : 설정한 PC 링크
     *                                 "linkIos" : 설정한 IOS Scheme
     *                                 "linkAnd" : 설정한 Android Scheme
     *                               }]
     *                  }" \
     * --data-urlencode "failover=Y" \
     * --data-urlencode "fsubject_1=문자제목1" \
     * --data-urlencode "fmessage_1=문자내용1"
     */

    const params = {
      apikey: apiKey, // 인증용 API Key(필수)
      userid: userId, // 사용자id(필수)
      senderKey: senderKey, // 발신프로파일 키(필수)
      sender: sender, // 발신자 연락처(필수)
      // tpl_code: templateCode, // 템플릿 코드(필수)
      senddate: dayjs().toDate(), // 예약일
      advert: 'Y', // 광고분류 (Y/N)(기본값: Y)
      image: '', // 첨부이미지 (JPEG,PNG)
      image_url: '', // 첨부이미지 링크
      wideyn: '', // 와이드 이미지 전송(Y/N)
      receiver_1: '', // 수신자 연락처(1~500)(필수)
      recvname_1: '', // 수신자 이름(1~500)
      subject_1: '', // 친구톡 제목(1~500)(필수)
      message_1: '', // 친구톡 내용(1~500)(필수)
      button_1: '', // 버튼 정보(1~500) (JSON 타입)
      failover: '', // 실패시 대체문자 전송기능(Y/N)
      fsubject_1: '', // 실패시 대체문자 제목(1~500)
      fmessage_1: '', // 실패시 대체문자 내용(1~500)
      testMode: 'N', // 테스트 모드 적용여부 (Y/N)(기본값: N)
    };
    const reqEncoding = qs.stringify(params);

    let responseData;
    await axios
      .post(postUrl, reqEncoding, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      })
      .then(async (response) => {
        console.log('response', response.data);
        const responseDt = dayjs().toDate();
        if (response.data.code == 0) {
          /*
           * {
           *   "code": 0
           *   "message": "성공적으로 전송요청 하였습니다."
           *   "info" : {
           *           "type": "AT",
           *           "mid": "XXXXXXXX",
           *           "current": 0,
           *           "unit": 0,
           *           "total": 0,
           *           "scnt": 0,
           *           "fcnt": 0
           *           }
           * }
           */
          responseData = {
            responseYn: 'Y',
            responseCode: response.status,
            responseDt: responseDt,
            ...response.data,
          };
        } else {
          /*
           * {
           *   "code": -99
           *   "message": "포인트가 부족합니다."
           * }
           */
          responseData = {
            responseYn: 'N',
            responseCode: response.status,
            responseDt: responseDt,
            ...response.data,
          };
        }
      })
      .catch((error) => {
        console.log('err', error);
        const responseDt = dayjs().toDate();
        responseData = {
          responseYn: 'N',
          responseCode: error.response.status,
          responseDt: responseDt,
          message: error.response.data.resultMsg,
          ...error.response.data,
        };
      });

    return responseData;
  }
}
