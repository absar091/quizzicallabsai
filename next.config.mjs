/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@genkit-ai/core', 'genkit']
  },
  env: {
    ADMIN_SECRET_CODE: process.env.ADMIN_SECRET_CODE,
  },
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
      {
        protocol: 'https',
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
  webpack: (config, { isServer, webpack }) => {
    // Add Node.js polyfills
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("util/"),
      "path": require.resolve("path-browserify"),
      "buffer": require.resolve("buffer/"),
      "fs": false,
      "net": false,
      "tls": false,
      "handlebars": false,
      'require-in-the-middle': false,
      "http2": false,
      "dns": false,
    };

    // Handle node: scheme
    config.resolve.alias = {
      ...config.resolve.alias,
      'node:perf_hooks': 'perf_hooks',
      'node:buffer': 'buffer',
      'node:stream': 'stream-browserify',
      'node:util': 'util',
      'node:path': 'path-browserify',
      'node:crypto': 'crypto-browserify',
    };

    // Transpile problematic packages
    if (!isServer) {
      config.module.rules.push({
        test: /\.js$/,
        include: /node_modules\/handlebars/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }]
      });
    }

    return config;
  },
};

export default nextConfig;
