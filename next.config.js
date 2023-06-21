/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  trailingSlash: true,
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
    ],
  },
  swcMinify: false,
};

module.exports = nextConfig;
