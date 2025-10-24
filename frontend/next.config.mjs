/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,  // VULNERABILITY: Strict mode disabled
  swcMinify: true,

  // VULNERABILITY: Allow all image domains
  images: {
    domains: ['*'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },

  // VULNERABILITY: Expose source maps in production
  productionBrowserSourceMaps: true,

  // VULNERABILITY: Disable security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',  // VULNERABILITY: Clickjacking possible
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '0',  // VULNERABILITY: XSS protection disabled
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',  // VULNERABILITY: CORS too permissive
          },
        ],
      },
    ];
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
    NEXT_PUBLIC_APP_NAME: 'DVTC Trust Center',
    NEXT_PUBLIC_DEBUG: 'true',  // VULNERABILITY: Debug enabled
  },
};

export default nextConfig;