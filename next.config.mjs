/** @type {import('next').NextConfig} */

const nextConfig = {
  webpack(config) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    }

    return config
  },
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
