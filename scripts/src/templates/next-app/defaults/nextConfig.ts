export const getNextAppConfig = () => {
  return `/** @type {import('next').NextConfig} */
    const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
      externalDir: true,
    },
    }

    module.exports = nextConfig;
    `;
};
