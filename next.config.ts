import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // @ts-ignore - This is required for HMR to work through ngrok tunnels
  allowedDevOrigins: ['*.ngrok-free.app'],
};

export default nextConfig;
