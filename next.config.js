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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "sameorigin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=()",
          },
          {
            key: "Content-Security-Policy",
            value: "script-src 'self' 'unsafe-inline' www.googletagmanager.com",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
