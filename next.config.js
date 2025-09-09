/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.stockx.com',
        pathname: '/**',
      },
      // Add other domains if needed
    ],
  },
};

module.exports = nextConfig; 