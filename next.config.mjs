/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
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
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        handlebars: false,
        'require-in-the-middle': false,
      };
    }
    
    // Suppress specific warnings
    config.ignoreWarnings = [
      /require.extensions is not supported by webpack/,
      /Critical dependency: require function is used in a way/,
      /node-domexception/,
      /@types\/handlebars/,
      /deprecated/,
    ];
    
    // Suppress npm warnings during build
    config.stats = {
      ...config.stats,
      warnings: false,
    };
    
    return config;
  },
};

export default nextConfig;
