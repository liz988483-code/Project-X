// backend/shared/utils/api-error.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true,
    public errors?: any[],
    public stack?: string
  ) {
    super(message);
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string = 'Bad Request', errors?: any[]) {
    super(400, message, true, errors);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized', errors?: any[]) {
    super(401, message, true, errors);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Not Found', errors?: any[]) {
    super(404, message, true, errors);
  }
}

export class CartItemNotFoundError extends NotFoundError {
  constructor(productId: string) {
    super(`Cart item with product ID ${productId} not found`);
  }
}