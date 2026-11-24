import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { decodeKey } from '../../config/environment';

@Injectable()
export class EncryptionService {
  private readonly key: Buffer;
  constructor(config: ConfigService) {
    const key = decodeKey(config.get<string>('ENCRYPTION_KEY'));
    if (!key) throw new Error('Invalid ENCRYPTION_KEY');
    this.key = key;
  }

  // Context must bind the ciphertext to its owner, resource and field, e.g.
  // `binance:<userId>:<connectionId>:apiSecret`. Never accept context from a caller's HTTP body.
  encrypt(plaintext: string, context: string): string {
    if (!context || context.length > 512 || !plaintext || Buffer.byteLength(plaintext) > 16384) throw new Error('Invalid encryption input');
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.key, iv);
    cipher.setAAD(Buffer.from(context, 'utf8'));
    const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    return ['v1', iv.toString('base64url'), cipher.getAuthTag().toString('base64url'), ciphertext.toString('base64url')].join('.');
  }

  decrypt(envelope: string, context: string): string {
    try {
      if (!context || context.length > 512 || envelope.length > 24000) throw new Error();
      const parts = envelope.split('.');
      if (parts.length !== 4 || parts[0] !== 'v1') throw new Error();
      const values = parts.slice(1).map(part => {
        if (!/^[A-Za-z0-9_-]+$/.test(part)) throw new Error();
        const buffer = Buffer.from(part, 'base64url');
        if (buffer.toString('base64url') !== part) throw new Error();
        return buffer;
      });
      const [iv, tag, ciphertext] = values;
      if (!iv || iv.length !== 12 || !tag || tag.length !== 16 || !ciphertext) throw new Error();
      const decipher = createDecipheriv('aes-256-gcm', this.key, iv);
      decipher.setAAD(Buffer.from(context, 'utf8'));
      decipher.setAuthTag(tag);
      return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
    } catch { throw new Error('Unable to decrypt credential'); }
  }
}
