import { AxiosInstance } from 'axios';
import { AES256EncryptionService } from '../infrastructure/encryption/AES256EncryptionService';
import { BaseEncryptedDto } from '../infrastructure/encryption/BaseEncryptedDto';

export const addRequestEncryptionInterceptor = (axios: AxiosInstance): void => {
  axios.interceptors.request.use(
    (config) => {
      if ((config as unknown as { _alreadyEncrypted: boolean })._alreadyEncrypted || !config.data) {
        return config;
      }

      const stringifiedData = JSON.stringify(config.data);
      const encryptedDto: BaseEncryptedDto = AES256EncryptionService.encrypt(stringifiedData);

      config.data = encryptedDto;
      (config as unknown as { _alreadyEncrypted: boolean })._alreadyEncrypted = true; 

      return config;
    },
    (error) => Promise.reject(error)
  );
}; 