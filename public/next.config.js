/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['ui-shared'],
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
