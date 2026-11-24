import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class PasswordService {
  async hash(password: string): Promise<string> {
    if (password.length < 12 || Buffer.byteLength(password) > 1024) throw new Error('Invalid password length');
    return argon2.hash(password, { type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 1 });
  }
  async verify(hash: string, password: string): Promise<boolean> {
    if (!hash.startsWith('$argon2id$') || Buffer.byteLength(password) > 1024) return false;
    try { return await argon2.verify(hash, password); } catch { return false; }
  }
}
