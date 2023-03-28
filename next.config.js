/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: "http://localhost:3002/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
