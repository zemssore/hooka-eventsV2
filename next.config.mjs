/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  cacheHandler: undefined,
  cacheMaxMemorySize: 0,
  // Увеличиваем таймауты для стабильности
  staticPageGenerationTimeout: 120,
  // Standalone build для деплоя на сервер
  output: 'standalone',
}

export default nextConfig
