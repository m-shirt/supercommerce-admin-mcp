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