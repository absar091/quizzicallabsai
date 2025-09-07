// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
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
  webpack: (config, { isServer }) => {
    // Handle Node.js modules that should not be bundled for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // Core Node.js modules
        fs: false,
        path: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        util: false,
        url: false,
        querystring: false,
        events: false,
        http: false,
        https: false,
        http2: false,           // ✅ gRPC http2 dependency
        dns: false,             // ✅ gRPC dns dependency
        async_hooks: false,     // ✅ OpenTelemetry async hooks
        dgram: false,           // ✅ Jaeger UDP datagram
        buffer: false,
        zlib: false,
        os: false,
        child_process: false,
        worker_threads: false,
        // Modern Node.js URL scheme aliases
        'node:fs': false,
        'node:http': false,
        'node:https': false,
        'node:buffer': false,
        'node:async_hooks': false,
        // Third-party modules that depend on Node.js
        'require-in-the-middle': false,
        handlebars: false,
      };

      // Handle node: URL scheme for Genkit packages
      config.externals = config.externals || [];
      config.externals.push({
        '@genkit-ai/googleai': 'commonjs @genkit-ai/googleai',
        '@genkit-ai/core': 'commonjs @genkit-ai/core',
        'genkit': 'commonjs genkit',
        'node-fetch': 'commonjs node-fetch',
      });
    }

    return config;
  },
};

export default nextConfig;
