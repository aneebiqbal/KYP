// @ts-check
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    svgr: false,
  },
  images: {
    domains: ['reactkypprofilepics.s3.ap-south-1.amazonaws.com'],
    unoptimized: true, // Ensure image optimization is disabled
  },
  reactStrictMode: false,
};

const plugins = [withNx];

module.exports = composePlugins(...plugins)(nextConfig);
