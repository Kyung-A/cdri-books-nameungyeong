// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["search1.kakaocdn.net"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://dapi.kakao.com/v3/search/:path*",
      },
    ];
  },
};

export default nextConfig;
