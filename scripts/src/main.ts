import { $ } from "zx";
import { buildFile } from "./builders/buildFile.js";
import { APP_ROOT, COMPONENT_ROOT, FUNCTION_ROOT } from "./constants/paths.js";
import { generateNextApp } from "./generators/generateNextApp.js";
import { generatePackage } from "./generators/generatePackage.js";
import { Package } from "./types/index.js";

export const main = async () => {
  const DEPTH = 1;
  const WIDTH = 100;
  const FILE_COUNT = 30;
  const MODULE_COUNT = 2;
  const PAGE_COUNT = 1;
  const IMPORT_RATIO = 0.5;

  console.log("Depth:", DEPTH);
  console.log("Width:", WIDTH);
  console.log("File Count:", FILE_COUNT);
  console.log("Module Count:", MODULE_COUNT);
  console.log("Page Count:", PAGE_COUNT);

  let functionPackages: Package[] = [];
  let functionSubPackages: Package[] = [];

  for (let i = 0; i < DEPTH; i++) {
    for (let j = 0; j < WIDTH; j++) {
      const functionFiles = Array.from({ length: FILE_COUNT }).map((_, k) =>
        buildFile({
          path: `function-${k}.ts`,
          imports: functionPackages.map(({ name, ...rest }) => ({
            name: `@flexteam/${name}`,
            ...rest,
          })),
          includeModuleCount: MODULE_COUNT,
          moduleType: "function",
          getModuleName: (type, l) =>
            `${type.toUpperCase()}I${i}J${j}K${k}L${l}`,
        })
      );

      const functionPackage: Package = {
        type: "function",
        name: `function-${i}-${j}`,
        files: functionFiles,
        bundled: false,
        importRatio: IMPORT_RATIO,
      };

      functionSubPackages.push(functionPackage);
      await generatePackage(functionPackage);
    }
    functionPackages = functionSubPackages;
    functionSubPackages = [];
  }

  let componentPackages: Package[] = functionPackages;
  let componentSubPackages: Package[] = [];

  for (let i = 0; i < DEPTH; i++) {
    for (let j = 0; j < WIDTH; j++) {
      const componentFiles = Array.from({ length: FILE_COUNT }).map((_, k) =>
        buildFile({
          path: `component-${k}.tsx`,
          imports: componentPackages.map(({ name, type, ...rest }) => ({
            name:
              type === "component"
                ? `@flex-components/${name}`
                : `@flexteam/${name}`,
            type,
            ...rest,
          })),
          includeModuleCount: MODULE_COUNT,
          moduleType: "component",
          getModuleName: (type, l) =>
            `${type.toUpperCase()}I${i}J${j}K${k}L${l}`,
        })
      );

      const componentPackage: Package = {
        type: "component",
        name: `component-${i}-${j}`,
        files: componentFiles,
        bundled: false,
        importRatio: IMPORT_RATIO,
      };

      componentSubPackages.push(componentPackage);
      await generatePackage(componentPackage);
    }
    componentPackages = componentSubPackages;
    componentSubPackages = [];
  }

  const pages = Array.from({ length: 1 }).map((_, i) => {
    return buildFile({
      path: `page-${i}.tsx`,
      imports: componentPackages.map(({ name, ...rest }) => ({
        name: `@flex-components/${name}`,
        ...rest,
      })),
      moduleType: "page",
      includeModuleCount: PAGE_COUNT,
      getModuleName: (type, j) => `${type.toUpperCase()}I${i}J${j}`,
    });
  });

  await generateNextApp({
    name: "people",
    files: pages,
    importRatio: IMPORT_RATIO,
  });
};

const packageRoots = [COMPONENT_ROOT, APP_ROOT, FUNCTION_ROOT];
await $`yarn install`;
await $`yarn dlx rimraf ${packageRoots}`;
await main();
await $`yarn install`;
