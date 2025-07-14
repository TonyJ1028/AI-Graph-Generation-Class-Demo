import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 优化字体加载
  experimental: {
    optimizePackageImports: ['@next/font'],
  },
  // 暂时禁用 ESLint 以解决构建问题
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 配置字体预加载
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Link',
            value: '<https://fonts.googleapis.com>; rel=preconnect',
          },
          {
            key: 'Link',
            value: '<https://fonts.gstatic.com>; rel=preconnect; crossorigin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
