import type { NextConfig } from "next";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'upload.wikimedia.org'
      }
    ]
  }
};

export default nextConfig;
