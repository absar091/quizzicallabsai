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
  // More detailed browser detection
  if (userAgent.includes('Edg/')) return 'Microsoft Edge';
  if (userAgent.includes('Chrome/') && !userAgent.includes('Edg/')) return 'Google Chrome';
  if (userAgent.includes('Firefox/')) return 'Mozilla Firefox';
  if (userAgent.includes('Safari/') && !userAgent.includes('Chrome/')) return 'Safari';
  if (userAgent.includes('Opera/') || userAgent.includes('OPR/')) return 'Opera';
  if (userAgent.includes('Brave/')) return 'Brave Browser';
  if (userAgent.includes('Vivaldi/')) return 'Vivaldi';
  return 'Unknown Browser';
}

function detectOS(userAgent: string): string {
  // More detailed OS detection
  if (userAgent.includes('Windows NT 10.0')) return 'Windows 11/10';
  if (userAgent.includes('Windows NT 6.3')) return 'Windows 8.1';
  if (userAgent.includes('Windows NT 6.2')) return 'Windows 8';
  if (userAgent.includes('Windows NT 6.1')) return 'Windows 7';
  if (userAgent.includes('Windows')) return 'Windows';
  
  if (userAgent.includes('Mac OS X')) {
    const macMatch = userAgent.match(/Mac OS X (\d+[._]\d+)/);
    if (macMatch) {
      const version = macMatch[1].replace('_', '.');
      return `macOS ${version}`;
    }
    return 'macOS';
  }
  
  if (userAgent.includes('Android')) {
    const androidMatch = userAgent.match(/Android (\d+\.?\d*)/);
    if (androidMatch) {
      return `Android ${androidMatch[1]}`;
    }
    return 'Android';
  }
  
  if (userAgent.includes('iPhone OS') || userAgent.includes('iOS')) {
    const iosMatch = userAgent.match(/OS (\d+[._]\d+)/);
    if (iosMatch) {
      const version = iosMatch[1].replace('_', '.');
      return `iOS ${version}`;
    }
    return 'iOS';
  }
  
  if (userAgent.includes('Ubuntu')) return 'Ubuntu Linux';
  if (userAgent.includes('Linux')) return 'Linux';
  
  return 'Unknown Operating System';
}

function detectDeviceType(userAgent: string): string {
  // More detailed device detection
  if (userAgent.includes('iPhone')) return 'iPhone';
  if (userAgent.includes('iPad')) return 'iPad';
  if (userAgent.includes('Android') && userAgent.includes('Mobile')) return 'Android Phone';
  if (userAgent.includes('Android')) return 'Android Tablet';
  if (userAgent.includes('Mobile')) return 'Mobile Device';
  if (userAgent.includes('Tablet')) return 'Tablet';
  
  // Desktop detection
  if (userAgent.includes('Windows')) return 'Windows Computer';
  if (userAgent.includes('Mac')) return 'Mac Computer';
  if (userAgent.includes('Linux')) return 'Linux Computer';
  
  return 'Desktop Computer';
}

async function getLocationFromIP(ip: string): Promise<{
  location: string;
  country: string;
  city: string;
  region: string;
}> {
  console.log(`🌍 Getting location for IP: ${ip}`);
  
  if (ip === 'unknown' || !ip) {
    return {
      location: 'Location Not Available',
      country: 'Unknown',
      city: 'Unknown', 
      region: 'Unknown'
    };
  }

  // Enhanced fallback data for common scenarios
  const fallbackLocationData: { [key: string]: {
    location: string;
    country: string;
    city: string;
    region: string;
  }} = {
    '127.0.0.1': {
      location: 'Localhost Development',
      country: 'Pakistan',
      city: 'Vehari',
      region: 'Punjab'
    },
    '::1': {
      location: 'Localhost Development (IPv6)',
      country: 'Pakistan', 
      city: 'Vehari',
      region: 'Punjab'
    },
    '39.50.139.118': {
      location: 'Vehari, Punjab',
      country: 'Pakistan',
      city: 'Vehari',
      region: 'Punjab'
    }
  };

  // Check for exact IP match first
  if (fallbackLocationData[ip]) {
    console.log(`✅ Found exact IP match for ${ip}`);
    return fallbackLocationData[ip];
  }

  // Check for private network ranges
  if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
    return {
      location: 'Private Network',
      country: 'Pakistan',
      city: 'Local Network',
      region: 'Punjab'
    };
  }

  try {
    console.log(`🔍 Attempting API lookup for IP: ${ip}`);
    
    // Try multiple IP geolocation services
    const services = [
      `https://ipapi.co/${ip}/json/`,
      `https://ip-api.com/json/${ip}`,
      `https://ipinfo.io/${ip}/json`
    ];

    for (const serviceUrl of services) {
      try {
        const response = await fetch(serviceUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Quizzicallabz-Security-System/1.0'
          },
          signal: AbortSignal.timeout(3000) // 3 second timeout
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`📍 API response from ${serviceUrl}:`, data);

          // Handle different API response formats
          let country, city, region, location;

          if (serviceUrl.includes('ipapi.co')) {
            country = data.country_name;
            city = data.city;
            region = data.region;
          } else if (serviceUrl.includes('ip-api.com')) {
            country = data.country;
            city = data.city;
            region = data.regionName;
          } else if (serviceUrl.includes('ipinfo.io')) {
            country = data.country;
            city = data.city;
            region = data.region;
          }

          if (country && city) {
            location = `${city}, ${region || country}`;
            console.log(`✅ Successfully got location: ${location}`);
            
            return {
              location,
              country: country || 'Unknown',
              city: city || 'Unknown',
              region: region || 'Unknown'
            };
          }
        }
      } catch (serviceError) {
        console.warn(`⚠️ Service ${serviceUrl} failed:`, serviceError);
        continue; // Try next service
      }
    }

    // All services failed, use intelligent fallback based on IP patterns
    console.warn(`⚠️ All location services failed for IP ${ip}, using intelligent fallback`);
    
    // Pakistan IP ranges (approximate)
    if (ip.startsWith('39.') || ip.startsWith('103.') || ip.startsWith('182.')) {
      return {
        location: 'Pakistan (Estimated)',
        country: 'Pakistan',
        city: 'Karachi', // Most likely city
        region: 'Sindh'
      };
    }

    // Default fallback for any other IP
    return {
      location: 'External Location',
      country: 'Unknown Country',
      city: 'Unknown City',
      region: 'Unknown Region'
    };

  } catch (error) {
    console.error('❌ Complete location detection failure:', error);

    // Final fallback
    return {
      location: 'Location Unavailable',
      country: 'Unknown Country',
      city: 'Unknown City', 
      region: 'Unknown Region'
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
