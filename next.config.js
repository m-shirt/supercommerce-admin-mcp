/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        './tools/backups/**',
        './tools/backups/*',
      ],
    },
  },

  // Headers to allow embedding in ChatGPT and other platforms
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
        ],
      },
      {
        // Allow widgets to be embedded in iframes
        source: '/widgets/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors *",
          },
        ],
      },
    ];
  },

  // Exclude backup files from webpack compilation
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.backup\.js$/,
      use: 'ignore-loader',
    });

    // Ignore backup directory entirely
    config.resolve.alias['./tools/backups'] = false;

    return config;
  },

  // Production optimizations
  swcMinify: true,
  compress: true,

  // Environment variables for build
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;