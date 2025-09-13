import { AxiosInstance } from 'axios';
import { AES256EncryptionService } from '../infrastructure/encryption/AES256EncryptionService';
import { BaseEncryptedDto } from '../infrastructure/encryption/BaseEncryptedDto';

export const addResponseDecryptionInterceptor = (
  axios: AxiosInstance,
): void => {
  axios.interceptors.response.use(
    (response) => {
      if (
        response instanceof Object &&
        response.data.payload &&
        response.data.tag
      ) {
        const encryptedData: BaseEncryptedDto = new BaseEncryptedDto(
          response.data.payload,
          response.data.tag,
        );

        response.data = JSON.parse(
          AES256EncryptionService.decrypt(encryptedData),
        );
      }
      console.log('response', response);
      return response;
    },
    (error) => {
      Promise.reject(error);
      const errorResponseData = JSON.parse(
        AES256EncryptionService.decrypt(
          new BaseEncryptedDto(
            error.response.data.payload,
            error.response.data.tag,
          ),
        ),
      );
    },
  );
}; 