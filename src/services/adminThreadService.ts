import { AxiosResponse } from 'axios';
import type {
    AdminThreadAddMessageRequestDto,
    AdminThreadAddMessageResponseDto,
    AdminThreadCreateRequestDto,
    AdminThreadCreateResponseDto,
    AdminThreadCreateWithMessageRequestDto,
    AdminThreadCreateWithMessageResponseDto,
    AdminThreadDeleteRequestDto,
    AdminThreadDeleteResponseDto,
    AdminThreadListByCategoryRequestDto,
    AdminThreadListByCategoryResponseDto,
    AdminThreadListMessagesRequestDto,
    AdminThreadListMessagesResponseDto,
    AdminThreadListResponseDto,
} from '../types';
import httpClient from './httpClient';

export async function listAdminThreads(): Promise<AdminThreadListResponseDto> {
  const res: AxiosResponse<AdminThreadListResponseDto> = await httpClient.post('/admin/threads/list');
  return res.data;
}

export async function listAdminThreadsByCategory(payload: AdminThreadListByCategoryRequestDto): Promise<AdminThreadListByCategoryResponseDto> {
  const res: AxiosResponse<AdminThreadListByCategoryResponseDto> = await httpClient.post('/admin/threads/list-by-category', payload);
  return res.data;
}

export async function createAdminThread(payload: AdminThreadCreateRequestDto): Promise<AdminThreadCreateResponseDto> {
  const res: AxiosResponse<AdminThreadCreateResponseDto> = await httpClient.post('/admin/threads', payload);
  return res.data;
}

export async function createAdminThreadWithMessage(payload: AdminThreadCreateWithMessageRequestDto): Promise<AdminThreadCreateWithMessageResponseDto> {
  const res: AxiosResponse<AdminThreadCreateWithMessageResponseDto> = await httpClient.post('/admin/threads/with-message', payload);
  return res.data;
}

export async function addMessageToAdminThread(payload: AdminThreadAddMessageRequestDto): Promise<AdminThreadAddMessageResponseDto> {
  const res: AxiosResponse<AdminThreadAddMessageResponseDto> = await httpClient.post('/admin/threads/add-message', payload);
  return res.data;
}

export async function listAdminThreadMessages(payload: AdminThreadListMessagesRequestDto): Promise<AdminThreadListMessagesResponseDto> {
  const res: AxiosResponse<AdminThreadListMessagesResponseDto> = await httpClient.post('/admin/threads/list-messages', payload);
  return res.data;
}

export async function deleteAdminThread(payload: AdminThreadDeleteRequestDto): Promise<AdminThreadDeleteResponseDto> {
  const res: AxiosResponse<AdminThreadDeleteResponseDto> = await httpClient.post('/admin/threads/delete', payload);
  return res.data;
}
