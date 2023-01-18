type Params = { bundled: boolean; sourceMap: boolean };

export const getNextAppConfig = ({ bundled, sourceMap }: Params) => {
  return `/** @type {import('next').NextConfig} */
    const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
      externalDir: ${bundled ? "false" : "true"},
    },
    productionBrowserSourceMaps: ${sourceMap ? true : false},
    webpack: (config) => {
      ${
        sourceMap
          ? `config.module.rules.push({
              test: /.js$/,
              exclude: [/node_modules/],
              enforce: "pre",
              use: ["source-map-loader"],
            });`
          : ""
      }
      return config;
    },
    }

    module.exports = nextConfig;
    `;
};
