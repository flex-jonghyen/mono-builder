type Params = { bundled: boolean };

export const getNextAppConfig = ({ bundled }: Params) => {
  return `/** @type {import('next').NextConfig} */
    const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
      externalDir: ${bundled ? "false" : "true"},
    },
    }

    module.exports = nextConfig;
    `;
};
