import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@features/editor", "@ui/shadcn"],
  serverExternalPackages: ["stripe"],
};

export default nextConfig;
