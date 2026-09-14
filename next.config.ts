import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "ltjtkzbyqgwavzhzcytd.supabase.co",
      },
      {
        protocol: "https",
        hostname: "nexis-02is.onrender.com",
      },
    ],
  },
};

export default nextConfig;
