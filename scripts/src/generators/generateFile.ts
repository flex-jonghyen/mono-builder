import { fs } from "zx";
import { getComponent } from "../templates/component-package/components.js";
import { getFunction } from "../templates/function-package/functions.js";
import type { File } from "../types/index.js";

type Params = File;

export const generateFile = ({
  exports,
  imports,
  path,
}: Params): Promise<void> => {
  const flattenImports = imports.map(({ name, files }) => {
    const modules = files.flatMap(({ exports }) => exports);
    return { name, modules };
  });

  const importSyntax = flattenImports
    .map(({ modules, name }) => {
      const moduleNames = modules.map(({ name }) => name);
      return `import { ${moduleNames.join(", ")} } from "${name}";`;
    })
    .join("\n");

  const importModulePool = flattenImports.flatMap(({ modules }) => modules);
  const perModule = Math.ceil(importModulePool.length / exports.length);

  const modulesSyntax = exports
    .map(({ name, type }, index) => {
      const start = index * perModule;
      const end = start + perModule;
      const target = importModulePool.slice(start, end);

      const params = { name, modules: target };

      switch (type) {
        case "component":
          return getComponent(params);
        case "function":
          return getFunction(params);
      }
    })
    .join("\n");

  const contents = [importSyntax, modulesSyntax].join("\n\n");
  return fs.writeFile(path, contents);
};
