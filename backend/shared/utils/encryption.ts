import crypto from 'crypto';

export class EncryptionUtil {
  private static algorithm = 'aes-256-gcm';
  private static keyLength = 32;
  private static ivLength = 16;
  private static tagLength = 16;

  static generateKey(): string {
    return crypto.randomBytes(this.keyLength).toString('hex');
  }

  static encrypt(text: string, key: string): string {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipher(this.algorithm, key);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
  }

  static decrypt(encryptedText: string, key: string): string {
    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted text format');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];

    const decipher = crypto.createDecipher(this.algorithm, key);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  static hashPassword(password: string, saltRounds: number = 12): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.scrypt(password, crypto.randomBytes(16), 64, { N: 1 << saltRounds }, (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString('hex'));
      });
    });
  }

  static verifyPassword(password: string, hash: string, saltRounds: number = 12): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const salt = Buffer.from(hash, 'hex');
      crypto.scrypt(password, salt.slice(0, 16), 64, { N: 1 << saltRounds }, (err, derivedKey) => {
        if (err) reject(err);
        resolve(crypto.timingSafeEqual(derivedKey, salt));
      });
    });
  }

  static generateRandomToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  static hashData(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}