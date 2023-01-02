import { merge } from "lodash-es";
import type { InputOption, OutputOptions, RollupOptions } from "rollup";
import { commonjs, esbuild, resolve } from "../plugins/index.js";

type Options = {
  input: InputOption;
  output: OutputOptions;
  external?: RollupOptions["external"];
};

export const esm = (options: Options): RollupOptions => {
  const { input, output, external } = options;

  return {
    input,
    output: merge(
      {
        format: "esm",
      } satisfies OutputOptions,
      output
    ),
    plugins: [resolve(), commonjs(), esbuild()],
    external,
  };
};
