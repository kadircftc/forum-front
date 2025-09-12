import { AxiosResponse } from 'axios';
import type {
    CategoriesListResponseDto,
    CategoryCreateRequestDto,
    CategoryCreateResponseDto,
    CategoryDeleteRequestDto,
    CategoryDeleteResponseDto,
} from '../types';
import httpClient from './httpClient';

export async function listCategories(): Promise<CategoriesListResponseDto> {
  const res: AxiosResponse<CategoriesListResponseDto> = await httpClient.get('/categories');
  return res.data;
}

export async function createCategory(payload: CategoryCreateRequestDto): Promise<CategoryCreateResponseDto> {
  const res: AxiosResponse<CategoryCreateResponseDto> = await httpClient.post('/categories', payload);
  return res.data;
}

export async function deleteCategory(payload: CategoryDeleteRequestDto): Promise<CategoryDeleteResponseDto> {
  const res: AxiosResponse<CategoryDeleteResponseDto> = await httpClient.post('/categories/delete', payload);
  return res.data;
}


