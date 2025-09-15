/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
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
