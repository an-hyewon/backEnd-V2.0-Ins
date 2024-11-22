import * as crypto from 'crypto';

export function hashSHA256(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function hashAes256Cbc(text: string, key: string, iv: string): string {
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  return Buffer.concat([encrypted, cipher.final()]).toString('hex');
}

export const getHmacEncode = (
  str: string,
  salt: string,
  algo: string,
  encodeType: any,
) => {
  const algoFormatted = algo.toLowerCase().replace('-', '');
  const hash = crypto.createHmac(algoFormatted, salt);
  hash.update(str);

  const res = hash.digest(encodeType);

  return res;
};

export const getKbAuthData = (data: any, appKey: string) => {
  const hsKey = getHmacEncode(
    JSON.stringify(data),
    appKey,
    'SHA-256',
    'base64',
  );

  return hsKey;
};
