import { AxiosResponse } from 'axios';
import type {
    AdminCategoriesListRequestDto,
    AdminCategoriesListResponseDto,
    AdminCategoryCreateRequestDto,
    AdminCategoryCreateResponseDto,
    AdminCategoryDeleteRequestDto,
    AdminCategoryDeleteResponseDto,
} from '../types';
import httpClient from './httpClient';

export async function listAdminCategories(payload: AdminCategoriesListRequestDto): Promise<AdminCategoriesListResponseDto> {
  const res: AxiosResponse<AdminCategoriesListResponseDto> = await httpClient.post('/admin/categories/list', payload);
  return res.data;
}

export async function createAdminCategory(payload: AdminCategoryCreateRequestDto): Promise<AdminCategoryCreateResponseDto> {
  const res: AxiosResponse<AdminCategoryCreateResponseDto> = await httpClient.post('/admin/categories', payload);
  return res.data;
}

export async function deleteAdminCategory(payload: AdminCategoryDeleteRequestDto): Promise<AdminCategoryDeleteResponseDto> {
  const res: AxiosResponse<AdminCategoryDeleteResponseDto> = await httpClient.post('/admin/categories/delete', payload);
  return res.data;
}
