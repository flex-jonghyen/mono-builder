type Params = {
  bundled?: boolean;
  externals?: string[];
  packageJson: string;
};

export const getRollupConfig = ({
  bundled = true,
  externals = [],
  packageJson,
}: Params) => {
  const { dependencies, peerDependencies } = JSON.parse(packageJson);

  externals.push(
    ...Object.keys(dependencies),
    ...Object.keys(peerDependencies)
  );

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
    external: [${externals.map((name) => `"${name}"`).join(",")}],
  });
  export default rollup(config);
  `;
};
