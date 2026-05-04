// backend/shared/utils/response.ts
export class ApiResponse<T = any> {
  constructor(
    public success: boolean,
    public data?: T,
    public message?: string,
    public meta?: any
  ) {}
}

export const successResponse = <T>(data: T, message = 'Success', meta?: any) => {
  return new ApiResponse(true, data, message, meta);
};

export const errorResponse = (message = 'Error', data?: any) => {
  return new ApiResponse(false, data, message);
};