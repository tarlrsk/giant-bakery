/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      aws4: false,
    };

    return config;
  },
};

module.exports = nextConfig;
