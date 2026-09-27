import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Une seule version d'URL : slash final partout, l'autre forme redirige.
  // www ou non, et le .ma vers le .com : redirections Cloudflare (DEPLOIEMENT.md).
  trailingSlash: true,
  poweredByHeader: false,
};

export default nextConfig;
