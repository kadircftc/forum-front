import { AxiosResponse } from 'axios';
import type { UserMeResponseDto } from '../types';
import httpClient from './httpClient';

export async function getCurrentUser(): Promise<UserMeResponseDto> {
  const res: AxiosResponse<UserMeResponseDto> = await httpClient.post('/user/me');
  return res.data;
}
