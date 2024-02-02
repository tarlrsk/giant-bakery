/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["storage.googleapis.com"],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      aws4: false,
    };

    return config;
  },
};

module.exports = nextConfig;
