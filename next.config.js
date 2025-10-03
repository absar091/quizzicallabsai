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