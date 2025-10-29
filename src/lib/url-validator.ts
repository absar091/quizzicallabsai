// URL validation to prevent SSRF attacks
const ALLOWED_HOSTS = [
  'localhost',
  '127.0.0.1',
  'quizzicallabs.firebaseio.com',
  'firestore.googleapis.com',
  'identitytoolkit.googleapis.com'
];

export function validateUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    
    // Block private IP ranges
    const hostname = parsedUrl.hostname;
    if (hostname.match(/^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/)) {
      return false;
    }
    
    // Only allow specific hosts
    return ALLOWED_HOSTS.some(host => hostname.includes(host));
  } catch {
    return false;
  }
}

export function sanitizePath(path: string): string {
  return path.replace(/\.\./g, '').replace(/[<>\"'&]/g, '');
}