import { esm, rollup } from "@flexteam/bundler";

const config = esm({
  input: "src/index.ts",
  output: {
    file: "bin/index.mjs",
  },
  external: ["@parcel/watcher", "zx"],
});

export default rollup(config);
