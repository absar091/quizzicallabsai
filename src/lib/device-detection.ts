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
  deviceFingerprint: string;
  timestamp: string;
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
  console.log('🔍 Comparing login credentials:');
  console.log('Current:', {
    device: currentCredentials.device,
    browser: currentCredentials.browser,
    os: currentCredentials.os,
    ip: currentCredentials.ip,
    country: currentCredentials.country,
    city: currentCredentials.city
  });
  console.log('Stored:', {
    device: storedCredentials.device,
    browser: storedCredentials.browser,
    os: storedCredentials.os,
    ip: storedCredentials.ip,
    country: storedCredentials.country,
    city: storedCredentials.city,
    isTrusted: storedCredentials.isTrusted
  });

  // Primary device fingerprint (must match exactly)
  const deviceMatches = currentCredentials.device === storedCredentials.device;
  const browserMatches = currentCredentials.browser === storedCredentials.browser;
  const osMatches = currentCredentials.os === storedCredentials.os;

  if (!deviceMatches) {
    console.log('❌ Device mismatch:', currentCredentials.device, 'vs', storedCredentials.device);
    return false;
  }

  if (!browserMatches) {
    console.log('❌ Browser mismatch:', currentCredentials.browser, 'vs', storedCredentials.browser);
    return false;
  }

  if (!osMatches) {
    console.log('❌ OS mismatch:', currentCredentials.os, 'vs', storedCredentials.os);
    return false;
  }

  // Secondary checks for suspicious activity (IP/Location changes)
  const ipMatches = currentCredentials.ip === storedCredentials.ip;
  const countryMatches = currentCredentials.country === storedCredentials.country;
  const cityMatches = currentCredentials.city === storedCredentials.city;

  // For same device/browser/OS, allow some flexibility but flag suspicious changes
  if (!ipMatches) {
    console.log('⚠️ IP change detected:', currentCredentials.ip, 'vs', storedCredentials.ip);
    
    // If country also changed, it's very suspicious (VPN/travel)
    if (!countryMatches) {
      console.log('🚨 Country change detected - likely VPN or travel');
      return false;
    }
    
    // If only IP changed within same country, allow but log
    console.log('ℹ️ IP changed within same country - allowing but monitoring');
  }

  if (!countryMatches) {
    console.log('🚨 Country change detected:', currentCredentials.country, 'vs', storedCredentials.country);
    return false;
  }

  // City changes are less critical but worth noting
  if (!cityMatches) {
    console.log('ℹ️ City change detected:', currentCredentials.city, 'vs', storedCredentials.city);
    // Allow city changes within same country (user might be traveling locally)
  }

  console.log('✅ Device credentials match - trusted device');
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

  // First login - send welcome notification
  if (storedCredentials.length === 0) {
    console.log('🎉 First login detected - sending welcome security notification');
    return true;
  }

  // Check if current login matches any stored trusted credentials
  let hasExactMatch = false;
  let hasSimilarDevice = false;

  for (const stored of storedCredentials) {
    console.log(`Checking stored credential ${stored.id}:`, {
      device: stored.device,
      browser: stored.browser,
      os: stored.os,
      ip: stored.ip,
      country: stored.country,
      city: stored.city,
      isTrusted: stored.isTrusted,
      loginCount: stored.loginCount
    });

    // Only check trusted devices
    if (!stored.isTrusted) {
      console.log('⏭️ Skipping untrusted device');
      continue;
    }

    // Check for exact match
    if (compareLoginCredentials(currentCredentials, stored)) {
      console.log('✅ Exact match found with trusted device - no notification needed');
      hasExactMatch = true;
      break;
    }

    // Check for similar device (same device/browser/OS but different location)
    if (currentCredentials.device === stored.device &&
        currentCredentials.browser === stored.browser &&
        currentCredentials.os === stored.os) {
      hasSimilarDevice = true;
      console.log('⚠️ Similar device found but location/IP differs');
    }
  }

  if (hasExactMatch) {
    return false; // Trusted device, no notification
  }

  if (hasSimilarDevice) {
    console.log('🚨 Same device but suspicious location change - sending notification');
    return true; // Same device but suspicious activity
  }

  // Completely new device
  console.log('🚨 New device detected - sending security notification');
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
    deviceFingerprint: `${deviceInfo.device}_${deviceInfo.browser}_${deviceInfo.os}`,
    timestamp: now,
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
    timestamp: now,
    lastLoginTime: now,
    loginCount: existingCredentials.loginCount + 1,
    updatedAt: now
  };
};
