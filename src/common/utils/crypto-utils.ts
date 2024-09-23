import * as crypto from 'crypto';

export function hashSHA256(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function hashAes256Cbc(text: string, key: string, iv: string): string {
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  return Buffer.concat([encrypted, cipher.final()]).toString('hex');
}
