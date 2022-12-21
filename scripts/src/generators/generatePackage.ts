import { fs, path } from "zx";
import { COMPONENT_ROOT, FUNCTION_ROOT } from "../constants/paths.js";
import { chunkPromiseAll } from "../helper/chunkPromiseAll.js";
import { getDependenciesFromFiles } from "../helper/getDependenciesFromFile.js";
import { makeFile } from "../helper/makeFile.js";
import { getComponent } from "../templates/component-package/components.js";
import {
  getBundledComponentPackageJson,
  getNonBundledComponentPackageJson,
} from "../templates/component-package/packageJson.js";
import { getComponentTsConfig } from "../templates/component-package/tsconfig.js";
import { getFunction } from "../templates/function-package/functions.js";
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
  importRatio,
}: Params) => {
  const dependencies = getDependenciesFromFiles(files);

  let packageJson = "";
  let tsconfig = "";

  if (type === "component") {
    const packageJsonParams = {
      packageName: `@flex-components/${name}`,
      dependencies,
    };

    packageJson = bundled
      ? getBundledComponentPackageJson(packageJsonParams)
      : getNonBundledComponentPackageJson(packageJsonParams);

    tsconfig = getComponentTsConfig();
  } else {
    const packageJsonParams = {
      packageName: `@flexteam/${name}`,
      dependencies,
    };

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
    makeFile(path.join(packageDir, "./package.json"), packageJson),
    makeFile(path.join(packageDir, "./tsconfig.json"), tsconfig),
  ]);

  const sourceDir = path.join(packageDir, "./src");
  const getFileTemplate = type === "component" ? getComponent : getFunction;

  await fs.ensureDir(sourceDir);
  await chunkPromiseAll({
    promises: files
      .map(({ path: _path, ...rest }) => ({
        path: path.join(sourceDir, `./${_path}`),
        ...rest,
      }))
      .map((file) => generateFile({ ...file, importRatio, getFileTemplate })),
    chunk: 10,
  });

  const indexFilePath = path.join(sourceDir, "./index.ts");
  const indexFile = files
    .map(({ path }) => path.replace(/\.tsx?$/, ""))
    .map((path) => `export * from "./${path}";`)
    .join("\n");
  await makeFile(indexFilePath, indexFile);
};
