// Secure Logger - Prevents sensitive data from being logged
export const secureLog = {
  info: (message: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(message);
    }
  },
  
  error: (message: string, error?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(message, error);
    }
  },
  
  warn: (message: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(message);
    }
  }
};