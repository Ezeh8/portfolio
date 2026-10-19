import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // lets a phone on the same Wi-Fi use the dev server at http://192.168.100.90:3000
  allowedDevOrigins: ["192.168.100.90"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
