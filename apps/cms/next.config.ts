import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Exclude system files from watchpack to prevent errors
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/.next/**',
          '**/C:/DumpStack.log.tmp',
          '**/C:/hiberfil.sys',
          '**/C:/pagefile.sys',
          '**/C:/swapfile.sys',
          '**/C:/**/*.tmp',
          '**/C:/**/*.sys',
        ],
      };
    }
    return config;
  },
};

export default nextConfig;
