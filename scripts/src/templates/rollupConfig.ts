type Params = {
  preserveModule?: boolean;
  externals?: string[];
  packageJson: string;
};

export const getRollupConfig = ({
  preserveModule = false,
  externals = [],
  packageJson,
}: Params) => {
  const { dependencies, peerDependencies } = JSON.parse(packageJson);

  externals.push(
    ...Object.keys(dependencies ?? []),
    ...Object.keys(peerDependencies ?? [])
  );

  return `
  import { esm, rollup } from "@flexteam/bundler";
  const config = esm({
    input: "src/index.ts",
    output: {
      ${
        preserveModule
          ? `dir: 'dist', preserveModules: true, preserveModulesRoot: 'src'`
          : `file: 'dist/index.js'`
      }
    },
    external: [${externals.map((name) => `"${name}"`).join(",")}],
  });
  export default rollup(config);
  `;
};
