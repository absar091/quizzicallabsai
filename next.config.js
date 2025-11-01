/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://www.gstatic.com https://www.google.com https://accounts.google.com https://va.vercel-scripts.com https://vercel.live https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
              "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net https://vercel.live",
              "img-src 'self' data: blob: https: http:",
              "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.firebase.com wss://*.firebaseio.com https://va.vercel-scripts.com https://www.google-analytics.com https://analytics.google.com https://vitals.vercel-insights.com https://vercel.live https://vercel.com https://apis.google.com https://www.gstatic.com https://accounts.google.com https://www.google.com https://www.gstatic.com/recaptcha/ https://www.google.com/recaptcha/ https://www.google.com/recaptcha/api2/ https://www.googletagmanager.com wss://*.pusher.com https://*.pusher.com wss://ws-*.pusher.com wss://ws-us3.pusher.com https://sockjs-us3.pusher.com https://api.getsafepay.com https://sandbox.api.getsafepay.com https://*.getsafepay.com https://cdn.jsdelivr.net",
              "frame-src 'self' https://accounts.google.com https://www.google.com https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/",
              "worker-src 'self' blob:",
              "manifest-src 'self'",
              "media-src 'self' blob: data:",
            ].join('; '),
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Suppress Express warning from Genkit and registry warnings
    config.ignoreWarnings = [
      { module: /node_modules\/@genkit-ai\/core\/node_modules\/express/ },
      /Critical dependency: the request of a dependency is an expression/,
      /WARNING.*already has an entry in the registry/,
    ];
    
    return config;
  },
}

module.exports = nextConfig