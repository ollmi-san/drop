import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow GLB models from Ready Player Me CDN
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "models.readyplayer.me" },
    ],
  },
  // Three.js works fine with default config; transpile if any cjs issues
  transpilePackages: ["three"],
};

export default nextConfig;
