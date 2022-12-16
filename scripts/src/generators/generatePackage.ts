import { fs, path } from "zx";
import { COMPONENT_ROOT, FUNCTION_ROOT } from "../constants/paths.js";
import { chunkPromiseAll } from "../helper/chunkPromiseAll.js";
import {
  getBundledComponentPackageJson,
  getNonBundledComponentPackageJson,
} from "../templates/component-package/packageJson.js";
import { getComponentTsConfig } from "../templates/component-package/tsconfig.js";
import {
  getBundledFunctionPackageJson,
  getNonBundledFunctionPackageJson,
} from "../templates/function-package/packageJson.js";
import { getFunctionTsConfig } from "../templates/function-package/tsconfig.js";

import type { Package } from "../types/index.js";
import { generateFile } from "./generateFile.js";

type Params = Package;

export const generatePackage = async ({
  bundled,
  files,
  name,
  type,
}: Params) => {
  const dependencies = files
    .flatMap(({ imports }) => imports)
    .map(({ name }) => ({ name, version: "workspace:^" }));

  const packageJsonParams = {
    packageName: `@flexteam/${name}`,
    dependencies,
  };

  let packageJson = "";
  let tsconfig = "";

  if (type === "component") {
    packageJson = bundled
      ? getBundledComponentPackageJson(packageJsonParams)
      : getNonBundledComponentPackageJson(packageJsonParams);

    tsconfig = getComponentTsConfig();
  } else {
    packageJson = bundled
      ? getBundledFunctionPackageJson(packageJsonParams)
      : getNonBundledFunctionPackageJson(packageJsonParams);

    tsconfig = getFunctionTsConfig();
  }

  const packageDir = path.join(
    type === "component" ? COMPONENT_ROOT : FUNCTION_ROOT,
    `./${name}`
  );

  await fs.ensureDir(packageDir);
  await Promise.all([
    fs.writeFile(path.join(packageDir, "./package.json"), packageJson),
    fs.writeFile(path.join(packageDir, "./tsconfig.json"), tsconfig),
  ]);

  const sourceDir = path.join(packageDir, "./src");
  await fs.ensureDir(sourceDir);
  await chunkPromiseAll({
    promises: files
      .map(({ path: _path, ...rest }) => ({
        path: path.join(sourceDir, `./${_path}`),
        ...rest,
      }))
      .map(generateFile),
    chunk: 10,
  });

  const indexFilePath = path.join(sourceDir, "./index.ts");
  const indexFile = files
    .map(({ path }) => path.replace(/\.tsx?$/, ""))
    .map((path) => `export * from "./${path}";`)
    .join("\n");
  await fs.writeFile(indexFilePath, indexFile);
};
