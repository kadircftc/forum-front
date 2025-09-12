// This file will handle authentication-related interception logic. 

import { AxiosInstance } from 'axios';
import { JwtTokenManager } from '../infrastructure/token/JwtTokenManager';

const jwtTokenManager = new JwtTokenManager();

export const addAuthInterceptor = (axios: AxiosInstance): void => {
  axios.interceptors.request.use(
    (config) => {
      const ignoredPaths = ['/test-path'];

      if (ignoredPaths.some((path) => config.url?.includes(path))) {
        return config;
      }

      const token = jwtTokenManager.getToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

export const setHeader = (client: AxiosInstance): void => {
  const jwtTokenManager = new JwtTokenManager();
  const token = jwtTokenManager.getToken();

  if (token) {
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}; 