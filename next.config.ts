
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
