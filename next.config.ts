import type { NextConfig } from "next";

function supabaseStorageImagePatterns(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    return [];
  }
  try {
    const host = new URL(url).hostname;
    return [
      {
        protocol: "https" as const,
        hostname: host,
        pathname: "/storage/v1/object/public/**",
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseStorageImagePatterns(),
  },
};

export default nextConfig;
