import { buildFile } from "./builders/buildFile.js";
import { generateNextApp } from "./generators/generateNextApp.js";
import { generatePackage } from "./generators/generatePackage.js";
import { Package } from "./types/index.js";

export const main = () => {
  let functionPackages: Package[] = [];

  for (let i = 0; i < 10; i++) {
    const functionFiles = Array.from({ length: 10 }).map((_, j) =>
      buildFile({
        path: `function-${j}.ts`,
        imports: [],
        includeModuleCount: 10,
        moduleType: "function",
        getModuleName: (type, k) => `${type.toUpperCase()}${i}${j}${k}`,
      })
    );

    const functionPackage: Package = {
      type: "function",
      name: `function-${i}`,
      files: functionFiles,
      bundled: false,
    };

    functionPackages.push(functionPackage);
    generatePackage(functionPackage);
  }

  let componentPackages: Package[] = [];

  for (let i = 0; i < 10; i++) {
    const componentFiles = Array.from({ length: 10 }).map((_, j) =>
      buildFile({
        path: `component-${j}.tsx`,
        imports: functionPackages.map(({ name, ...rest }) => ({
          name: `@flexteam/${name}`,
          ...rest,
        })),
        includeModuleCount: 10,
        moduleType: "component",
        getModuleName: (type, k) => `${type.toUpperCase()}${i}${j}${k}`,
      })
    );

    const componentPackage: Package = {
      type: "component",
      name: `component-${i}`,
      files: componentFiles,
      bundled: false,
    };

    componentPackages.push(componentPackage);
    generatePackage(componentPackage);
  }

  const pages = Array.from({ length: 10 }).map((_, i) => {
    return buildFile({
      path: `page-${i}.tsx`,
      imports: componentPackages.map(({ name, ...rest }) => ({
        name: `@flex-components/${name}`,
        ...rest,
      })),
      moduleType: "page",
      includeModuleCount: 1,
      getModuleName: (type, j) => `${type.toUpperCase()}${i}${j}`,
    });
  });

  generateNextApp({
    name: "people",
    files: pages,
  });
};

main();
