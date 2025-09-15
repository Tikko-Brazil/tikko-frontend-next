/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'tikko-events-images.s3.us-east-1.amazonaws.com',
      },
    ],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  experimental: {
    serverActions: {
      enabled: true
    },
    optimizePackageImports: [], //"lodash", "date-fns"
    optimizeServerReact: false,
  },
  webpack: (config) => {
    return config
  }
};

export default nextConfig;
