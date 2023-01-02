import { merge } from "lodash-es";
import { defineConfig, RollupOptions } from "rollup";

export const rollup = (config: RollupOptions) =>
  defineConfig(merge(defaultConfig, config));

const defaultConfig: RollupOptions = {};

export type { RollupOptions };
