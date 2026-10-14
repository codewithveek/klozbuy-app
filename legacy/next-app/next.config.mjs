const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const netlifySiteUrl = process.env.NETLIFY && process.env.URL;
let url =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_SITE_URL ||
      netlifySiteUrl ||
      `https://${vercelProductionUrl}`
    : "http://localhost:3300";
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BETTER_AUTH_URL: url,
    NEXT_PUBLIC_SITE_URL: url,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
