/**
 * Static export configuration for Hostinger (shared hosting / Apache-LiteSpeed).
 *
 * `next build` emits a fully static site into `/out`:
 *   - Arabic (default) pages live at the root:  /, /about/, /services/ ...
 *   - English pages live under /en:              /en/, /en/about/ ...
 * Upload the *contents* of `/out` to `public_html` and you're done.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',
  // Emits `about/index.html` instead of `about.html` so Apache serves clean URLs without rewrites.
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // The site uses two root layouts (Arabic RTL + English LTR); this enables a single 404 page for both.
    globalNotFound: true,
  },
};

export default nextConfig;
