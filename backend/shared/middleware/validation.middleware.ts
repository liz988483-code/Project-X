import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Common validation rules
export const validateObjectId = (field: string) => {
  return param(field)
    .isMongoId()
    .withMessage(`${field} must be a valid ObjectId`);
};

export const validateEmail = (field: string = 'email') => {
  return body(field)
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address');
};

export const validatePassword = (field: string = 'password') => {
  return body(field)
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number');
};

export const validateRequired = (field: string, message?: string) => {
  return body(field)
    .notEmpty()
    .withMessage(message || `${field} is required`);
};

export const validateNumeric = (field: string, min?: number, max?: number) => {
  let validator = body(field).isNumeric().withMessage(`${field} must be a number`);

  if (min !== undefined) {
    validator = validator.isFloat({ min }).withMessage(`${field} must be at least ${min}`);
  }

  if (max !== undefined) {
    validator = validator.isFloat({ max }).withMessage(`${field} must be at most ${max}`);
  }

  return validator;
};

export const validateStringLength = (field: string, min?: number, max?: number) => {
  let validator = body(field).isString().withMessage(`${field} must be a string`);

  if (min !== undefined) {
    validator = validator.isLength({ min }).withMessage(`${field} must be at least ${min} characters long`);
  }

  if (max !== undefined) {
    validator = validator.isLength({ max }).withMessage(`${field} must be at most ${max} characters long`);
  }

  return validator;
};

// Validation result handler
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};