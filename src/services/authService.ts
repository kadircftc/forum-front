import { AxiosResponse } from 'axios';
import { JwtTokenManager } from '../infrastructure/token/JwtTokenManager';
import type {
  LoginRequestDto,
  LoginResponseDto,
  RefreshRequestDto,
  RefreshResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
  TestEmailRequestDto,
  TestEmailResponseDto,
  VerifyEmailRequestDto,
  VerifyEmailResponseDto,
} from '../types';
import httpClient from './httpClient';

// types are imported from ../types

const tokenManager = new JwtTokenManager();

export async function login(request: LoginRequestDto): Promise<LoginResponseDto> {
  const response: AxiosResponse<LoginResponseDto> = await httpClient.post('/auth/login', request);
  if (response.data?.accessToken) {
    tokenManager.saveToken(response.data.accessToken);
  }
  if (response.data?.refreshToken) {
    tokenManager.saveRefreshToken(response.data.refreshToken);
  }
  return response.data;
}

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenManager.getRefreshToken();
  if (!refreshToken) return null;
  const payload: RefreshRequestDto = { refreshToken };
  const response: AxiosResponse<RefreshResponseDto> = await httpClient.post('/auth/refresh', payload);
  const newAccessToken = response.data?.accessToken;
  const newRefreshToken = response.data?.refreshToken;
  if (newAccessToken) tokenManager.saveToken(newAccessToken);
  if (newRefreshToken) tokenManager.saveRefreshToken(newRefreshToken);
  return newAccessToken ?? null;
}

export async function verifyEmail(payload: VerifyEmailRequestDto): Promise<VerifyEmailResponseDto> {
  const res: AxiosResponse<VerifyEmailResponseDto> = await httpClient.post('/auth/verify', payload);
  return res.data;
}

export async function testEmail(payload: TestEmailRequestDto): Promise<TestEmailResponseDto> {
  const res: AxiosResponse<TestEmailResponseDto> = await httpClient.post('/auth/test-email', payload);
  return res.data;
}

export async function register(payload: RegisterRequestDto): Promise<RegisterResponseDto> {
  const res: AxiosResponse<RegisterResponseDto> = await httpClient.post('/auth/register', payload);
  return res.data;
}


