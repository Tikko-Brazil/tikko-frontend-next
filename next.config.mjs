/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  experimental: {
    serverActions: {
      enabled: true
    },
    experimental: {
      optimizePackageImports: [] //"lodash", "date-fns"
    },
    optimizeServerReact: false,
  },
  webpack: (config) => {
    return config
  }
};

export default nextConfig;
