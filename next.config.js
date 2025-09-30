/** @type {import('next').NextConfig} */
const nextConfig = {

  serverExternalPackages: ['firebase-admin'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
    dirs: [],
  },
  experimental: {
    typedRoutes: false,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    // Suppress critical dependency warnings from genkit/express
    config.module.exprContextCritical = false;
    config.module.unknownContextCritical = false;
    
    return config;
  }
};

module.exports = nextConfig;
