import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
        port: "",
        pathname: "/maps/api/place/photo/**",
      },
      // Clerk 圖片域名
      {
        protocol: "https",
        hostname: "img.clerk.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
        port: "",
        pathname: "/**",
      },
      // GitHub 頭像
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      // Google 頭像
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      // 其他常見的頭像服務
      {
        protocol: "https",
        hostname: "gravatar.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.gravatar.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
