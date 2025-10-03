// Device and browser detection utilities for security notifications

export interface DeviceInfo {
  device: string;
  browser: string;
  os: string;
  ip: string;
  location: string;
  userAgent: string;
  timestamp: string;
  timezone: string;
  country: string;
  city: string;
  region: string;
}

export interface UserLoginCredentials {
  id: string;
  userId: string;
  device: string;
  browser: string;
  os: string;
  ip: string;
  location: string;
  country: string;
  city: string;
  region: string;
  timezone: string;
  firstLoginTime: string;
  lastLoginTime: string;
  loginCount: number;
  isTrusted: boolean;
  createdAt: string;
  updatedAt: string;
}

export const detectDeviceInfo = async (userAgent: string, ip?: string): Promise<DeviceInfo> => {
  const now = new Date();
  const timestamp = now.toISOString();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Detect browser
  const browser = detectBrowser(userAgent);

  // Detect OS
  const os = detectOS(userAgent);

  // Detect device type
  const device = detectDeviceType(userAgent);

  // Get location from IP
  const locationData = await getLocationFromIP(ip || 'unknown');

  return {
    device,
    browser,
    os,
    ip: ip || 'unknown',
    location: locationData.location,
    userAgent,
    timestamp,
    timezone,
    country: locationData.country,
    city: locationData.city,
    region: locationData.region
  };
};

function detectBrowser(userAgent: string): string {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Unknown Browser';
}

function detectOS(userAgent: string): string {
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS')) return 'iOS';
  return 'Unknown OS';
}

function detectDeviceType(userAgent: string): string {
  if (userAgent.includes('Mobile')) return 'Mobile';
  if (userAgent.includes('Tablet')) return 'Tablet';
  return 'Desktop';
}

async function getLocationFromIP(ip: string): Promise<{
  location: string;
  country: string;
  city: string;
  region: string;
}> {
  if (ip === 'unknown') {
    return {
      location: 'Unknown Location',
      country: 'Unknown',
      city: 'Unknown',
      region: 'Unknown'
    };
  }

  try {
    // Use ipapi.co for real location detection (free tier: 1000 requests/day)
    const response = await fetch(`http://ipapi.co/${ip}/json/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Timeout after 5 seconds
      signal: AbortSignal.timeout(5000)
    });

    if (response.ok) {
      const data = await response.json();

      // Check if the API returned valid data
      if (data.country_name && data.city) {
        return {
          location: `${data.city}, ${data.region || data.country_name}`,
          country: data.country_name || 'Unknown',
          city: data.city || 'Unknown',
          region: data.region || 'Unknown'
        };
      }
    }

    // Fallback to mock data if API fails
    console.warn(`Location API failed for IP ${ip}, using fallback data`);

    const mockLocationData: { [key: string]: {
      location: string;
      country: string;
      city: string;
      region: string;
    }} = {
      '192.168.1.1': {
        location: 'Local Network, Pakistan',
        country: 'Pakistan',
        city: 'Vehari',
        region: 'Punjab'
      },
      '127.0.0.1': {
        location: 'Localhost, Pakistan',
        country: 'Pakistan',
        city: 'Vehari',
        region: 'Punjab'
      }
    };

    // Return mock data if available, otherwise generic location
    if (mockLocationData[ip]) {
      return mockLocationData[ip];
    }

    // For external IPs, return a generic location
    if (ip.includes('192.168.') || ip.includes('10.') || ip.includes('172.')) {
      return {
        location: 'Private Network',
        country: 'Unknown',
        city: 'Unknown',
        region: 'Unknown'
      };
    }

    return {
      location: 'External Network',
      country: 'Unknown',
      city: 'Unknown',
      region: 'Unknown'
    };
  } catch (error) {
    console.error('Error getting location from IP:', error);

    // Return fallback data on error
    return {
      location: 'Location Detection Failed',
      country: 'Unknown',
      city: 'Unknown',
      region: 'Unknown'
    };
  }
}

export const compareLoginCredentials = (
  currentCredentials: DeviceInfo,
  storedCredentials: UserLoginCredentials
): boolean => {
  // Check if device matches
  if (currentCredentials.device !== storedCredentials.device) {
    console.log('Device mismatch:', currentCredentials.device, 'vs', storedCredentials.device);
    return false;
  }

  // Check if browser matches
  if (currentCredentials.browser !== storedCredentials.browser) {
    console.log('Browser mismatch:', currentCredentials.browser, 'vs', storedCredentials.browser);
    return false;
  }

  // Check if OS matches
  if (currentCredentials.os !== storedCredentials.os) {
    console.log('OS mismatch:', currentCredentials.os, 'vs', storedCredentials.os);
    return false;
  }

  // ENHANCED: Always flag IP changes (VPN detection)
  if (currentCredentials.ip !== storedCredentials.ip) {
    console.log('IP change detected:', currentCredentials.ip, 'vs', storedCredentials.ip);
    return false; // Always send notification for IP changes
  }

  // ENHANCED: Flag location changes (country or city level)
  if (currentCredentials.country !== storedCredentials.country) {
    console.log('Country change detected:', currentCredentials.country, 'vs', storedCredentials.country);
    return false;
  }

  // ENHANCED: Also check city-level changes for VPN detection
  if (currentCredentials.city !== storedCredentials.city) {
    console.log('City change detected:', currentCredentials.city, 'vs', storedCredentials.city);
    return false;
  }

  // Check if timezone matches (can indicate VPN usage)
  if (currentCredentials.timezone !== storedCredentials.timezone) {
    console.log('Timezone change detected:', currentCredentials.timezone, 'vs', storedCredentials.timezone);
    return false;
  }

  return true;
};

export const shouldSendLoginNotification = (
  currentCredentials: DeviceInfo,
  storedCredentials: UserLoginCredentials[]
): boolean => {
  console.log('🔍 Checking login notification requirements...');
  console.log('Current credentials:', {
    device: currentCredentials.device,
    browser: currentCredentials.browser,
    os: currentCredentials.os,
    ip: currentCredentials.ip,
    country: currentCredentials.country,
    city: currentCredentials.city
  });
  console.log('Stored credentials count:', storedCredentials.length);

  // ENHANCED: Always send notification for first login
  if (storedCredentials.length === 0) {
    console.log('✅ First login detected - sending welcome notification');
    return true; // Changed: Send notification for first login too
  }

  // Check if current login matches any stored trusted credentials
  for (const stored of storedCredentials) {
    console.log('Comparing with stored credential:', {
      device: stored.device,
      browser: stored.browser,
      os: stored.os,
      ip: stored.ip,
      country: stored.country,
      city: stored.city,
      isTrusted: stored.isTrusted
    });

    if (stored.isTrusted && compareLoginCredentials(currentCredentials, stored)) {
      console.log('✅ Match found with trusted device - no notification needed');
      return false; // Match found, no notification needed
    }
  }

  // No match found with trusted credentials, send notification
  console.log('🚨 No match found - sending security notification');
  return true;
};

export const createLoginCredentials = (
  userId: string,
  deviceInfo: DeviceInfo
): UserLoginCredentials => {
  const now = new Date().toISOString();

  return {
    id: `${userId}_${deviceInfo.ip}_${Date.now()}`,
    userId,
    device: deviceInfo.device,
    browser: deviceInfo.browser,
    os: deviceInfo.os,
    ip: deviceInfo.ip,
    location: deviceInfo.location,
    country: deviceInfo.country,
    city: deviceInfo.city,
    region: deviceInfo.region,
    timezone: deviceInfo.timezone,
    firstLoginTime: now,
    lastLoginTime: now,
    loginCount: 1,
    isTrusted: true, // First login is always trusted
    createdAt: now,
    updatedAt: now
  };
};

export const updateLoginCredentials = (
  existingCredentials: UserLoginCredentials,
  deviceInfo: DeviceInfo
): UserLoginCredentials => {
  const now = new Date().toISOString();

  return {
    ...existingCredentials,
    lastLoginTime: now,
    loginCount: existingCredentials.loginCount + 1,
    updatedAt: now
  };
};
