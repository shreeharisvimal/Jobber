export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string | null;
}

export interface PaginatedData<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
  message: string | null;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface ApiError {
  status_code: number;
  message: string;
  detail: string | null;
}
