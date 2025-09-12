import * as crypto from 'crypto-browserify';
import { BaseEncryptedDto } from './BaseEncryptedDto';

const algorithm = 'aes-256-gcm';
const key = "TT0f3nXw0pR75WjaH+EPlgO5zNsJQXPfnrNyE22WmU0=" ;
const iv ="8okrJwKt63217HK/B9RGkg==" ;

export class AES256EncryptionService {
  static encrypt(text: string | null): BaseEncryptedDto {
    if (text && key && iv) {
      const cipher = crypto.createCipheriv(
        algorithm,
        Buffer.from(key, 'base64'),
        Buffer.from(iv, 'base64'),
      );

      let encrypted = cipher.update(text, 'utf8');
      encrypted = Buffer.concat([encrypted, cipher.final()]);
      const authTag = cipher.getAuthTag();

      const payload = encrypted.toString('base64');
      const tag = authTag.toString('base64');

      return new BaseEncryptedDto(payload, tag);
    }
    return new BaseEncryptedDto("", "");
  }

  static decrypt(encryptedData: BaseEncryptedDto | null): string {
    if (
      encryptedData &&
      encryptedData.payload &&
      encryptedData.tag &&
      key &&
      iv
    ) {
      try {
        const ciphertext = Buffer.from(encryptedData.payload, 'base64');
        const authTag = Buffer.from(encryptedData.tag, 'base64');

        const decipher = crypto.createDecipheriv(
          algorithm,
          Buffer.from(key, 'base64'),
          Buffer.from(iv, 'base64'),
        );

        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(ciphertext, undefined, 'utf8');
        decrypted += decipher.final('utf8');

        try {
          const parsedData = JSON.parse(decrypted);
          if (typeof parsedData === 'string') {
            return parsedData;
          }
        } catch (error) {
          console.error('Decryption parsing error:', error);
        }

        return decrypted;
      } catch (error) {
        console.error('Decryption error:', error);
        return "";
      }
    }
    return "";
  }
} 