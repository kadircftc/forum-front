import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { JwtTokenManager } from '../infrastructure/token/JwtTokenManager';
import { addAuthInterceptor } from '../interceptors/authInterceptor';
import { addRequestEncryptionInterceptor } from '../interceptors/RequestEncryptionInterceptor';
import { addResponseDecryptionInterceptor } from '../interceptors/ResponseDecryptionInterceptor';
import { refreshAccessToken } from './authService';

const baseURL = import.meta.env.VITE_API_BASE_URL as string;

if (!baseURL) {
  console.warn('VITE_API_BASE_URL tanımlı değil. httpClient baseURL boş kalacak.');
}

export const httpClient: AxiosInstance = axios.create({
  baseURL: baseURL || undefined,
});

// Request: önce body şifreleme, sonra Authorization header ekle
addRequestEncryptionInterceptor(httpClient);
addAuthInterceptor(httpClient);

// Response: decrypt
addResponseDecryptionInterceptor(httpClient);

// 401 için refresh flow
const tokenManager = new JwtTokenManager();
let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    const requestUrl = (originalRequest?.url || '').toString();
    const isRefreshCall = requestUrl.includes('/auth/refresh');
    const isLoginCall = requestUrl.includes('/auth/login');

    if (status === 401 && originalRequest && !originalRequest._retry && !isRefreshCall && !isLoginCall) {
      originalRequest._retry = true;

      if (isRefreshing) {
        await new Promise<void>((resolve) => pendingQueue.push(resolve));
      } else {
        isRefreshing = true;
        try {
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            tokenManager.saveToken(newAccessToken);
            // Varsayılan header'ı güncelle
            httpClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          } else {
            tokenManager.destroyToken();
            tokenManager.destroyRefreshToken();
          }
        } finally {
          isRefreshing = false;
          pendingQueue.forEach((resolve) => resolve());
          pendingQueue = [];
        }
      }

      const token = tokenManager.getToken();
      if (token && originalRequest.headers) {
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return httpClient(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;


