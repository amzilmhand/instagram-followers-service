/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.fbcdn.net", // Instagram CDN
      },
      {
        protocol: "https",
        hostname: "**.cdninstagram.com", // Instagram CDN
      },
    ],
  },
}

export default nextConfig
