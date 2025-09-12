// Auth
export interface AuthUserDto {
  id: number;
  email: string;
  username: string;
  role: string;
  is_verified: boolean;
}

// User Me Response
export interface UserMeDto {
  id: number;
  username: string;
  email: string;
  role: string;
  is_verified: boolean;
  created_at: string;
  last_login: string;
}

export interface UserMeResponseDto {
  user: UserMeDto;
}

export interface VerifyEmailRequestDto { email: string; code: string; }
export interface VerifyEmailResponseDto { message: string; verified: boolean; attempts_left: number; }

export interface LoginRequestDto { email: string; password: string; }
export interface LoginResponseDto { accessToken: string; refreshToken: string; user: AuthUserDto; }

export interface RefreshRequestDto { refreshToken: string; }
export interface RefreshResponseDto { accessToken: string; refreshToken: string; }

export interface TestEmailRequestDto { email: string; }
export interface TestEmailResponseDto { message: string; }

export interface RegisterRequestDto { username: string; email: string; password: string; }
export interface RegisterResponseDto { message: string; user?: AuthUserDto }

// Categories
export interface CategoryDto { id: number; name: string; description?: string; created_at: string; }
export interface CategoriesListResponseDto { categories: CategoryDto[]; }
export interface CategoryCreateRequestDto { name: string; description?: string; }
export interface CategoryCreateResponseDto { category: CategoryDto; }
export interface CategoryDeleteRequestDto { id: number; }
export interface CategoryDeleteResponseDto { success: boolean; }

// Threads
export interface ThreadDto { id: number; category_id: number; user_id: number; title: string; created_at: string; message_count?: number; }
export interface ThreadCreateRequestDto { category_id: number; title: string; }
export interface ThreadCreateResponseDto { thread: ThreadDto; }

export interface ThreadCreateWithMessageRequestDto { category_id: number; title: string; content: string; }
export interface ThreadCreateWithMessageResponseDto { thread: ThreadDto; message: MessageDto & { is_mine: boolean; align: 'right' }; }
export interface ThreadListByCategoryRequestDto { category_id: number; }
export interface ThreadListByCategoryResponseDto { threads: ThreadDto[]; }
export interface ThreadSearchRequestDto { q?: string; category_id?: number; page?: number; limit?: number; }
export interface ThreadSearchResponseDto { items: ThreadDto[]; page: number; limit: number; total: number; has_more: boolean; }
export interface ThreadShowRequestDto { id: number; }
export interface ThreadShowResponseDto { thread: ThreadDto; }
export interface ThreadDeleteRequestDto { id: number; }
export interface ThreadDeleteResponseDto { success: boolean; }

// Messages
export type MessageAlign = 'left' | 'right';
export interface MessageDto { id: number; thread_id: number; user_id: number; content: string; ip_address: string; created_at: string; align?: MessageAlign; username?: string; }
export interface MessageCreateRequestDto { thread_id: number; content: string; }
export interface MessageCreateResponseDto { message: MessageDto; }
export interface MessageListByThreadRequestDto { thread_id: number; page?: number; }
export interface MessageListByThreadResponseDto { messages: MessageDto[]; }

// Reports
export interface ReportCreateRequestDto { message_id: number; reason?: string; }
export interface ReportDto { id: number; message_id: number; reporter_id: number; reason?: string; created_at: string; }
export interface ReportCreateResponseDto { report: ReportDto; }

// Admin Categories
export interface AdminCategoryDto { id: number; name: string; description?: string; created_at: string; }
export interface AdminCategoriesListRequestDto { page: number; limit: number; }
export interface AdminCategoriesListResponseDto { 
  items: AdminCategoryDto[]; 
  page: number; 
  limit: number; 
  total: number; 
  has_more: boolean; 
}
export interface AdminCategoryCreateRequestDto { name: string; description?: string; }
export interface AdminCategoryCreateResponseDto { category: AdminCategoryDto; }
export interface AdminCategoryDeleteRequestDto { id: number; }
export interface AdminCategoryDeleteResponseDto { success: boolean; }

// Admin Threads
export interface AdminThreadDto {
  id: number;
  admin_category_id: number;
  user_id: number;
  title: string;
  created_at: string;
  message_count?: number;
}

// Admin Threads List Response
export interface AdminThreadListResponseDto {
  threads: AdminThreadDto[];
}
export interface AdminThreadListByCategoryRequestDto { admin_category_id: number; }
export interface AdminThreadListByCategoryResponseDto { threads: AdminThreadDto[]; }
export interface AdminThreadCreateRequestDto { admin_category_id: number; title: string; }
export interface AdminThreadCreateResponseDto { thread: AdminThreadDto; }
export interface AdminThreadCreateWithMessageRequestDto { admin_category_id: number; title: string; content: string; }
export interface AdminThreadCreateWithMessageResponseDto { 
  thread: AdminThreadDto; 
  message: AdminMessageDto & { is_mine: boolean; align: 'right' }; 
}
export interface AdminThreadAddMessageRequestDto { admin_thread_id: number; content: string; }
export interface AdminThreadAddMessageResponseDto { message: AdminMessageDto; }
export interface AdminThreadListMessagesRequestDto { admin_thread_id: number; page: number; }
export interface AdminThreadListMessagesResponseDto { 
  messages: AdminMessageDto[]; 
  page: number; 
  limit: number; 
  total: number; 
  has_more: boolean; 
}
export interface AdminThreadDeleteRequestDto { id: number; }
export interface AdminThreadDeleteResponseDto { success: boolean; }

// Admin Messages
export interface AdminMessageDto { 
  id: number; 
  admin_thread_id: number; 
  user_id: number; 
  content: string; 
  ip_address: string; 
  created_at: string; 
  username?: string; 
  is_mine?: boolean; 
  align?: 'left' | 'right'; 
}


