import { esm } from "@flexteam/bundler";

const source = esm({
  input: "src/subscribe.ts",
  output: {
    file: "dist/index.mjs",
  },
  external: ["@parcel/watcher", "rxjs"],
});

const bin = esm({
  input: "src/bin/index.ts",
  output: {
    file: "bin/index.mjs",
  },
  external: ["@parcel/watcher", "rxjs", "minimist", "zod"],
});

export default [source, bin];
