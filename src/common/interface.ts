export interface ApiResponseCommon<T> {
  success: boolean;
  message: string;
  status: string;
  data: T;
}
