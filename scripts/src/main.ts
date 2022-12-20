import { buildFile } from "./builders/buildFile.js";
import { generateNextApp } from "./generators/generateNextApp.js";
import { generatePackage } from "./generators/generatePackage.js";
import { Package } from "./types/index.js";

export const main = async () => {
  const DEPTH = 10;
  const WIDTH = 10;
  const FILE_COUNT = 10;
  const MODULE_COUNT = 10;
  const PAGE_COUNT = 1;

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
          getModuleName: (type, l) => `${type.toUpperCase()}${i}${j}${k}${l}`,
        })
      );

      const functionPackage: Package = {
        type: "function",
        name: `function-${i}-${j}`,
        files: functionFiles,
        bundled: false,
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
          getModuleName: (type, l) => `${type.toUpperCase()}${i}${j}${k}${l}`,
        })
      );

      const componentPackage: Package = {
        type: "component",
        name: `component-${i}-${j}`,
        files: componentFiles,
        bundled: false,
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
      getModuleName: (type, j) => `${type.toUpperCase()}${i}${j}`,
    });
  });

  await generateNextApp({
    name: "people",
    files: pages,
  });
};

main();
