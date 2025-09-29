// Secure logging utility to prevent log injection
export const secureLog = {
  info: (message: string, data?: any) => {
    const sanitizedMessage = message.replace(/[\r\n]/g, ' ').substring(0, 200);
    const sanitizedData = data ? JSON.stringify(data).replace(/[\r\n]/g, ' ').substring(0, 100) : '';
    console.log(`[INFO] ${sanitizedMessage}`, sanitizedData);
  },
  
  error: (message: string, error?: any) => {
    const sanitizedMessage = message.replace(/[\r\n]/g, ' ').substring(0, 200);
    const sanitizedError = error?.message?.replace(/[\r\n]/g, ' ').substring(0, 100) || '';
    console.error(`[ERROR] ${sanitizedMessage}`, sanitizedError);
  },
  
  warn: (message: string, data?: any) => {
    const sanitizedMessage = message.replace(/[\r\n]/g, ' ').substring(0, 200);
    console.warn(`[WARN] ${sanitizedMessage}`, data);
  }
};