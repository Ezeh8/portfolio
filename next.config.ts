import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // lets a phone on the same Wi-Fi use the dev server (the Mac's address on each
  // network it uses, e.g. http://192.168.0.159:3000); dev only
  allowedDevOrigins: ["192.168.100.90", "192.168.0.159"],
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
