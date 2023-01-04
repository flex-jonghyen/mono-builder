type Params = {
  bundled?: boolean;
  externals?: string[];
};

export const getRollupConfig = ({ bundled = true, externals = [] }: Params) => {
  return `
  import { esm, rollup } from "@flexteam/bundler";
  const config = esm({
    input: "src/index.ts",
    output: {
      ${
        bundled
          ? `file: 'dist/index.js'`
          : `dir: 'dist', preserveModules: true, preserveModulesRoot: 'src'`
      }
    },
    external: [${externals.join(",")}],
  });
  export default rollup(config);
  `;
};
