import type { NextConfig } from "next";

// A phone on the same Wi-Fi opens the dev server by the laptop's private address. Next blocks
// dev requests from any hostname it was not started with, so allow the private ranges (one `*` per label).
const privateNetworkOrigins = [
  "192.168.*.*",
  "10.*.*.*",
  ...Array.from({ length: 16 }, (_, i) => `172.${16 + i}.*.*`),
  "*.local",
]

const nextConfig: NextConfig = {
  allowedDevOrigins: privateNetworkOrigins,
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
