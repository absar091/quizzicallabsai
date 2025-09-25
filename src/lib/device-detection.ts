// Device and browser detection utilities for security notifications

export interface DeviceInfo {
  browser: string;
  device: string;
  os: string;
  userAgent: string;
  ipAddress?: string;
  location?: string;
  timestamp: string;
}

export function detectBrowser(userAgent: string): string {
  const ua = userAgent.toLowerCase();

  if (ua.includes('chrome') && !ua.includes('edg')) {
    return 'Chrome';
  } else if (ua.includes('firefox')) {
    return 'Firefox';
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    return 'Safari';
  } else if (ua.includes('edg')) {
    return 'Edge';
  } else if (ua.includes('opera') || ua.includes('opr')) {
    return 'Opera';
  } else if (ua.includes('brave')) {
    return 'Brave';
  } else {
    return 'Unknown Browser';
  }
}

export function detectDevice(userAgent: string): string {
  const ua = userAgent.toLowerCase();

  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    if (ua.includes('android')) {
      return 'Android Mobile';
    } else if (ua.includes('iphone')) {
      return 'iPhone';
    } else {
      return 'Mobile Device';
    }
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    if (ua.includes('ipad')) {
      return 'iPad';
    } else {
      return 'Tablet';
    }
  } else {
    return 'Desktop Computer';
  }
}

export function detectOS(userAgent: string): string {
  const ua = userAgent.toLowerCase();

  if (ua.includes('windows')) {
    return 'Windows';
  } else if (ua.includes('mac os') || ua.includes('macos')) {
    return 'macOS';
  } else if (ua.includes('linux')) {
    return 'Linux';
  } else if (ua.includes('android')) {
    return 'Android';
  } else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) {
    return 'iOS';
  } else {
    return 'Unknown OS';
  }
}

export async function getLocationFromIP(ipAddress?: string): Promise<string> {
  try {
    // For security, we'll use a simple approach that doesn't require external APIs
    // In production, you might want to use a geolocation service
    if (!ipAddress || ipAddress === '127.0.0.1' || ipAddress === '::1') {
      return 'Local Network';
    }

    // Simple IP-based location detection (very basic)
    if (ipAddress.startsWith('192.168.') || ipAddress.startsWith('10.') || ipAddress.startsWith('172.')) {
      return 'Private Network';
    }

    // For demo purposes, return a generic location
    // In production, you could use services like ipapi.co, ipinfo.io, etc.
    return 'Location Detection Service Required';
  } catch (error) {
    console.error('Error detecting location:', error);
    return 'Location Unknown';
  }
}

export async function getClientIP(): Promise<string> {
  try {
    // In a real application, you would get this from the server-side request
    // For now, we'll return a placeholder
    return 'IP Detection Service Required';
  } catch (error) {
    console.error('Error getting client IP:', error);
    return 'Unknown';
  }
}

export async function getDeviceInfo(userAgent: string, ipAddress?: string): Promise<DeviceInfo> {
  const browser = detectBrowser(userAgent);
  const device = detectDevice(userAgent);
  const os = detectOS(userAgent);
  const location = await getLocationFromIP(ipAddress);

  return {
    browser,
    device,
    os,
    userAgent,
    ipAddress: ipAddress || 'Unknown',
    location,
    timestamp: new Date().toISOString()
  };
}

// Helper function to get user agent from browser
export function getUserAgent(): string {
  if (typeof window !== 'undefined') {
    return window.navigator.userAgent;
  }
  return 'Server-side Request';
}

// Helper function to format device info for display
export function formatDeviceInfo(info: DeviceInfo): string {
  return `${info.device} • ${info.browser} • ${info.os}`;
}

// Helper function to check if this is a new device/browser combination
export function isNewDevice(currentInfo: DeviceInfo, previousDevices: DeviceInfo[]): boolean {
  return !previousDevices.some(device =>
    device.browser === currentInfo.browser &&
    device.device === currentInfo.device &&
    device.os === currentInfo.os
  );
}
