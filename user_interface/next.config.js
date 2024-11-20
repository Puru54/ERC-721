const config = require("./src/config/config.json");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['gateway.ipfs.io'],
  },
  reactStrictMode: true,
  basePath: config.base_path !== "/" ? config.base_path : "",
  trailingSlash: config.site.trailing_slash,
  output: 'standalone',
};

config.module = {
  ...config.module,
  exprContextCritical: false,
};

module.exports = nextConfig;
