import { AxiosResponse } from 'axios';
import type {
    MessageCreateRequestDto,
    MessageCreateResponseDto,
    MessageListByThreadRequestDto,
    MessageListByThreadResponseDto,
} from '../types';
import httpClient from './httpClient';

export async function createMessage(payload: MessageCreateRequestDto): Promise<MessageCreateResponseDto> {
  const res: AxiosResponse<MessageCreateResponseDto> = await httpClient.post('/messages', payload);
  return res.data;
}

export async function listMessagesByThread(payload: MessageListByThreadRequestDto): Promise<MessageListByThreadResponseDto> {
  const res: AxiosResponse<MessageListByThreadResponseDto> = await httpClient.post('/messages/list-by-thread', payload);
  return res.data;
}


