export const getNextAppConfig = () => {
  return `/** @type {import('next').NextConfig} */
    const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    }

    module.exports = nextConfig;
    `;
};
