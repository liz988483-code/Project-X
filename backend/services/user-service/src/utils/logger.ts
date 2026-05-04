// Simple logger for user-service
export const logger = {
  info: (message: string, meta?: any) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [USER-SERVICE] [INFO] ${message}`, meta || '');
  },
  
  error: (message: string, meta?: any) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [USER-SERVICE] [ERROR] ${message}`, meta || '');
  },
  
  warn: (message: string, meta?: any) => {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] [USER-SERVICE] [WARN] ${message}`, meta || '');
  },
  
  debug: (message: string, meta?: any) => {
    const timestamp = new Date().toISOString();
    console.debug(`[${timestamp}] [USER-SERVICE] [DEBUG] ${message}`, meta || '');
  }
};
