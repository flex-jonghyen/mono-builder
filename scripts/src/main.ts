import { config } from "dotenv";
import { z } from "zod";
import { $, path } from "zx";
import { buildFile } from "./builders/buildFile.js";
import {
  APP_ROOT,
  COMPONENT_ROOT,
  FUNCTION_ROOT,
  WORKSPACE_ROOT,
} from "./constants/paths.js";
import { generateNextApp } from "./generators/generateNextApp.js";
import { generatePackage } from "./generators/generatePackage.js";
import { validateEnv } from "./helper/validateEnv.js";
import { Package } from "./types/index.js";

const envPath = path.join(WORKSPACE_ROOT, ".env");
const { parsed: value } = config({ path: envPath });

const env = await validateEnv({
  exampleFile: path.join(WORKSPACE_ROOT, ".env.example"),
  values: value ?? {},
  validateValue: z.object({
    DEPTH: z.coerce.number(),
    WIDTH: z.coerce.number(),
    FILE_COUNT: z.coerce.number(),
    MODULE_COUNT: z.coerce.number(),
    PAGE_COUNT: z.coerce.number(),
    IMPORT_RATIO: z.coerce.number(),
    MODULE_TYPE: z.string().optional().default("all"),
    BUNDLED: z.string().transform((value) => value === "true"),
    PRESERVE_MODULE: z.string().transform((value) => value === "true"),
    SOURCE_MAP: z.string().transform((value) => value === "true"),
  }).parse,
});

const {
  DEPTH,
  FILE_COUNT,
  IMPORT_RATIO,
  MODULE_COUNT,
  PAGE_COUNT,
  WIDTH,
  MODULE_TYPE,
  BUNDLED,
  PRESERVE_MODULE,
  SOURCE_MAP,
} = env;

export const main = async () => {
  Object.entries(env).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });

  const isIncludeComponent =
    MODULE_TYPE === "all" || MODULE_TYPE === "component";
  const isIncludeFunction = MODULE_TYPE === "all" || MODULE_TYPE === "function";

  let functionPackages: Package[] = [];
  let functionSubPackages: Package[] = [];

  if (isIncludeFunction) {
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
          bundled: BUNDLED,
          importRatio: IMPORT_RATIO,
          sourceMap: SOURCE_MAP,
          preserveModule: PRESERVE_MODULE,
        };

        functionSubPackages.push(functionPackage);
        await generatePackage(functionPackage);
      }
      functionPackages = functionSubPackages;
      functionSubPackages = [];
    }
  }

  let componentPackages: Package[] = functionPackages;
  let componentSubPackages: Package[] = [];

  if (isIncludeComponent) {
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
          bundled: BUNDLED,
          importRatio: IMPORT_RATIO,
          sourceMap: SOURCE_MAP,
          preserveModule: PRESERVE_MODULE,
        };

        componentSubPackages.push(componentPackage);
        await generatePackage(componentPackage);
      }
      componentPackages = componentSubPackages;
      componentSubPackages = [];
    }
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
    bundled: BUNDLED,
    sourceMap: SOURCE_MAP,
  });
};

const packageRoots = [COMPONENT_ROOT, APP_ROOT, FUNCTION_ROOT];
await $`yarn install`;
await $`yarn dlx rimraf ${packageRoots}`;
await main();
await $`yarn install`;
