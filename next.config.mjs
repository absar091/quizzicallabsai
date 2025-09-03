/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
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
        http2: false,
        dns: false,
        'node:async_hooks': false,
        'node:buffer': false,
        'node:fs': false,
        'node:https': false,
        'node:http': false,
        'node:stream': false,
        'node:util': false,
        'node:url': false,
        'node:path': false,
        'node:os': false,
        'node:crypto': false,
        'node:zlib': false,
        'node:events': false,
        'node:querystring': false,
        'node:perf_hooks': false,
      };
    }
    
    // Exclude problematic packages from client bundle
    config.externals = config.externals || [];
    if (!isServer) {
      config.externals.push({
        '@grpc/grpc-js': 'commonjs @grpc/grpc-js',
        '@opentelemetry/sdk-node': 'commonjs @opentelemetry/sdk-node',
        '@genkit-ai/core': 'commonjs @genkit-ai/core',
        'genkit': 'commonjs genkit',
        'node-fetch': 'commonjs node-fetch',
      });
    }
    
    // Suppress specific warnings
    config.ignoreWarnings = [
      /require.extensions is not supported by webpack/,
      /Critical dependency: require function is used in a way/,
      /node-domexception/,
      /@types\/handlebars/,
      /deprecated/,
      /node:/,
      /UnhandledSchemeError/,
      /Reading from "node:/,
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
