/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        port: '',
        pathname: '/npm/emoji-datasource-apple/img/apple/64/**',
      },
    ],
  },
};

export default nextConfig;
