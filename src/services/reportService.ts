import { AxiosResponse } from 'axios';
import type {
    ReportCreateRequestDto,
    ReportCreateResponseDto,
} from '../types';
import httpClient from './httpClient';

export async function createReport(payload: ReportCreateRequestDto): Promise<ReportCreateResponseDto> {
  const res: AxiosResponse<ReportCreateResponseDto> = await httpClient.post('/reports', payload);
  return res.data;
}
