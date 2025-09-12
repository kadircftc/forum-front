import { AxiosResponse } from 'axios';
import type {
    ThreadCreateRequestDto,
    ThreadCreateResponseDto,
    ThreadCreateWithMessageRequestDto,
    ThreadCreateWithMessageResponseDto,
    ThreadDeleteRequestDto,
    ThreadDeleteResponseDto,
    ThreadListByCategoryRequestDto,
    ThreadListByCategoryResponseDto,
    ThreadSearchRequestDto,
    ThreadSearchResponseDto,
    ThreadShowRequestDto,
    ThreadShowResponseDto,
} from '../types';
import httpClient from './httpClient';

export async function createThread(payload: ThreadCreateRequestDto): Promise<ThreadCreateResponseDto> {
  const res: AxiosResponse<ThreadCreateResponseDto> = await httpClient.post('/threads', payload);
  return res.data;
}

export async function createThreadWithMessage(payload: ThreadCreateWithMessageRequestDto): Promise<ThreadCreateWithMessageResponseDto> {
  const res: AxiosResponse<ThreadCreateWithMessageResponseDto> = await httpClient.post('/threads/with-message', payload);
  return res.data;
}

export async function listThreadsByCategory(payload: ThreadListByCategoryRequestDto): Promise<ThreadListByCategoryResponseDto> {
  const res: AxiosResponse<ThreadListByCategoryResponseDto> = await httpClient.post('/threads/list-by-category', payload);
  return res.data;
}

export async function searchThreads(payload: ThreadSearchRequestDto): Promise<ThreadSearchResponseDto> {
  const res: AxiosResponse<ThreadSearchResponseDto> = await httpClient.post('/threads/search', payload);
  return res.data;
}

export async function showThread(payload: ThreadShowRequestDto): Promise<ThreadShowResponseDto> {
  const res: AxiosResponse<ThreadShowResponseDto> = await httpClient.post('/threads/show', payload);
  return res.data;
}

export async function deleteThread(payload: ThreadDeleteRequestDto): Promise<ThreadDeleteResponseDto> {
  const res: AxiosResponse<ThreadDeleteResponseDto> = await httpClient.post('/threads/delete', payload);
  return res.data;
}


