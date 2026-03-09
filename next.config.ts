import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    allowedDevOrigins: ["10.45.55.251:3000", "10.45.55.251"],
    poweredByHeader: false,
    compress: true,
    reactStrictMode: true,
};

export default nextConfig;
