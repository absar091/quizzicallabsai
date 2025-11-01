
require('dotenv').config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // TypeScript errors will now fail the build - ensuring type safety
    ignoreBuildErrors: false,
  },
  eslint: {
    // ESLint errors will now fail the build - ensuring code quality
    ignoreDuringBuilds: false,
  },
  // Enhanced security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          }
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0'
          }
        ],
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https' ,
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
       },
       {
        protocol: 'https',
        hostname: 'www.simplesmiles.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
   webpack: (config, { isServer }) => {
    // This is to suppress the 'require.extensions' warning from handlebars
    // which is a dependency of genkit.
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/handlebars/,
      use: ['node-loader'],
    });

    return config;
  },
};

export default nextConfig;
