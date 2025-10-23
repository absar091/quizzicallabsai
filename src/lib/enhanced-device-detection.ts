// Enhanced Device Detection - Client-side APIs for detailed hardware info
// Uses browser APIs to get more detailed device information when available

export interface EnhancedDeviceInfo {
  // Basic info
  userAgent: string;
  platform: string;
  language: string;
  
  // Screen info
  screenWidth: number;
  screenHeight: number;
  colorDepth: number;
  pixelRatio: number;
  
  // Hardware info (when available)
  hardwareConcurrency: number;
  deviceMemory?: number;
  
  // Network info (when available)
  connectionType?: string;
  connectionSpeed?: string;
  
  // Browser capabilities
  cookieEnabled: boolean;
  javaEnabled: boolean;
  
  // Timezone and locale
  timezone: string;
  timezoneOffset: number;
  
  // Touch support
  touchSupport: boolean;
  maxTouchPoints: number;
  
  // Battery info (when available)
  batteryLevel?: number;
  batteryCharging?: boolean;
  
  // Vendor info
  vendor: string;
  vendorSub: string;
  
  // Enhanced device fingerprint
  fingerprint: string;
}

export async function getEnhancedDeviceInfo(): Promise<EnhancedDeviceInfo> {
  const nav = navigator;
  const screen = window.screen;
  
  // Basic info
  const userAgent = nav.userAgent;
  const platform = nav.platform;
  const language = nav.language;
  
  // Screen info
  const screenWidth = screen.width;
  const screenHeight = screen.height;
  const colorDepth = screen.colorDepth;
  const pixelRatio = window.devicePixelRatio || 1;
  
  // Hardware info
  const hardwareConcurrency = nav.hardwareConcurrency || 1;
  const deviceMemory = (nav as any).deviceMemory; // GB
  
  // Network info
  const connection = (nav as any).connection || (nav as any).mozConnection || (nav as any).webkitConnection;
  const connectionType = connection?.effectiveType;
  const connectionSpeed = connection?.downlink ? `${connection.downlink} Mbps` : undefined;
  
  // Browser capabilities
  const cookieEnabled = nav.cookieEnabled;
  const javaEnabled = typeof (nav as any).javaEnabled === 'function' ? (nav as any).javaEnabled() : false;
  
  // Timezone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timezoneOffset = new Date().getTimezoneOffset();
  
  // Touch support
  const touchSupport = 'ontouchstart' in window || nav.maxTouchPoints > 0;
  const maxTouchPoints = nav.maxTouchPoints || 0;
  
  // Battery info (deprecated but still available in some browsers)
  let batteryLevel: number | undefined;
  let batteryCharging: boolean | undefined;
  
  try {
    const battery = await (nav as any).getBattery?.();
    if (battery) {
      batteryLevel = Math.round(battery.level * 100);
      batteryCharging = battery.charging;
    }
  } catch (e) {
    // Battery API not available
  }
  
  // Vendor info
  const vendor = nav.vendor || '';
  const vendorSub = nav.vendorSub || '';
  
  // Create enhanced fingerprint
  const fingerprintData = [
    userAgent,
    platform,
    screenWidth,
    screenHeight,
    colorDepth,
    pixelRatio,
    hardwareConcurrency,
    deviceMemory,
    timezone,
    language,
    touchSupport,
    maxTouchPoints,
    vendor
  ].join('|');
  
  const fingerprint = await generateFingerprint(fingerprintData);
  
  return {
    userAgent,
    platform,
    language,
    screenWidth,
    screenHeight,
    colorDepth,
    pixelRatio,
    hardwareConcurrency,
    deviceMemory,
    connectionType,
    connectionSpeed,
    cookieEnabled,
    javaEnabled,
    timezone,
    timezoneOffset,
    touchSupport,
    maxTouchPoints,
    batteryLevel,
    batteryCharging,
    vendor,
    vendorSub,
    fingerprint
  };
}

async function generateFingerprint(data: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
  } catch (e) {
    // Fallback to simple hash
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).substring(0, 16);
  }
}

export function getDeviceModel(userAgent: string, enhancedInfo?: EnhancedDeviceInfo): string {
  // Enhanced device model detection using multiple sources
  
  // iPhone model detection
  if (userAgent.includes('iPhone')) {
    // Try to get model from screen dimensions
    if (enhancedInfo) {
      const { screenWidth, screenHeight, pixelRatio } = enhancedInfo;
      const physicalWidth = screenWidth * pixelRatio;
      const physicalHeight = screenHeight * pixelRatio;
      
      // iPhone model detection by screen resolution
      if (physicalWidth === 1170 && physicalHeight === 2532) return 'iPhone 12 Pro';
      if (physicalWidth === 1125 && physicalHeight === 2436) return 'iPhone X/XS';
      if (physicalWidth === 828 && physicalHeight === 1792) return 'iPhone XR';
      if (physicalWidth === 750 && physicalHeight === 1334) return 'iPhone 6/7/8';
      if (physicalWidth === 640 && physicalHeight === 1136) return 'iPhone 5/5S/SE';
    }
    
    // Fallback to user agent parsing
    const modelMatch = userAgent.match(/iPhone OS (\d+_\d+)/);
    if (modelMatch) {
      const version = modelMatch[1].replace('_', '.');
      return `iPhone (iOS ${version})`;
    }
    return 'iPhone';
  }
  
  // Android model detection
  if (userAgent.includes('Android')) {
    const modelMatch = userAgent.match(/;\s*([^;)]+)\s*Build/);
    if (modelMatch && modelMatch[1]) {
      let model = modelMatch[1].trim();
      
      // Clean up manufacturer prefixes
      model = model.replace(/^(SM-|GT-|LG-|HTC\s+|SAMSUNG\s+|HUAWEI\s+|XIAOMI\s+|OPPO\s+|VIVO\s+|ONEPLUS\s+)/i, '');
      
      // Add manufacturer info if available
      if (userAgent.includes('Samsung')) model = `Samsung ${model}`;
      else if (userAgent.includes('Huawei')) model = `Huawei ${model}`;
      else if (userAgent.includes('Xiaomi')) model = `Xiaomi ${model}`;
      else if (userAgent.includes('OnePlus')) model = `OnePlus ${model}`;
      
      return model;
    }
  }
  
  // Desktop detection with enhanced info
  if (enhancedInfo && !userAgent.includes('Mobile')) {
    const { platform, hardwareConcurrency, deviceMemory } = enhancedInfo;
    
    let deviceInfo = platform;
    if (hardwareConcurrency > 1) {
      deviceInfo += ` (${hardwareConcurrency} cores)`;
    }
    if (deviceMemory) {
      deviceInfo += ` (${deviceMemory}GB RAM)`;
    }
    
    return deviceInfo;
  }
  
  return 'Unknown Device';
}

export function getBrowserDetails(userAgent: string, enhancedInfo?: EnhancedDeviceInfo): string {
  let browser = 'Unknown Browser';
  
  // Enhanced browser detection
  if (userAgent.includes('Edg/')) {
    const versionMatch = userAgent.match(/Edg\/(\d+\.\d+\.\d+)/);
    browser = versionMatch ? `Microsoft Edge ${versionMatch[1]}` : 'Microsoft Edge';
  } else if (userAgent.includes('Chrome/')) {
    const versionMatch = userAgent.match(/Chrome\/(\d+\.\d+\.\d+)/);
    browser = versionMatch ? `Google Chrome ${versionMatch[1]}` : 'Google Chrome';
  } else if (userAgent.includes('Firefox/')) {
    const versionMatch = userAgent.match(/Firefox\/(\d+\.\d+)/);
    browser = versionMatch ? `Mozilla Firefox ${versionMatch[1]}` : 'Mozilla Firefox';
  } else if (userAgent.includes('Safari/') && !userAgent.includes('Chrome/')) {
    const versionMatch = userAgent.match(/Version\/(\d+\.\d+)/);
    browser = versionMatch ? `Safari ${versionMatch[1]}` : 'Safari';
  }
  
  // Add engine info if available
  if (enhancedInfo?.vendor) {
    if (enhancedInfo.vendor.includes('Google')) browser += ' (Blink)';
    else if (enhancedInfo.vendor.includes('Apple')) browser += ' (WebKit)';
    else if (userAgent.includes('Gecko/')) browser += ' (Gecko)';
  }
  
  return browser;
}